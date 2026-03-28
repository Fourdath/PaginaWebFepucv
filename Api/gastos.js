// api/gastos.js — Vercel Serverless Function
// Lee los Excel de la carpeta Drive de rendiciones y retorna datos para los gráficos

import * as XLSX from 'xlsx';

const FOLDER_ID = '19DSc1-Cy8oOdLVWWgGaL-1MPorEEqnVv';
const API_KEY = process.env.GOOGLE_DRIVE_API_KEY;

async function listExcelFiles() {
  const query = encodeURIComponent(
    `'${FOLDER_ID}' in parents and (mimeType='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' or mimeType='application/vnd.ms-excel') and trashed=false`
  );
  const url = `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name,modifiedTime)&orderBy=name&key=${API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Drive API error: ${res.status}`);
  const data = await res.json();
  return data.files || [];
}

async function downloadExcel(fileId) {
  const url = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&key=${API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download error: ${res.status}`);
  const arrayBuffer = await res.arrayBuffer();
  return arrayBuffer;
}

function parseExcel(buffer) {
  const workbook = XLSX.read(buffer, { type: 'array', cellDates: true });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: null });

  // Buscar la fila de encabezados (contiene 'Categoria' o 'Ingreso')
  let headerRow = -1;
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    if (row && row.some(cell => typeof cell === 'string' && cell.toLowerCase().includes('categoria'))) {
      headerRow = i;
      break;
    }
  }
  if (headerRow === -1) return [];

  const headers = rows[headerRow].map(h => (h ? String(h).trim().toLowerCase() : ''));
  const idxCategoria = headers.findIndex(h => h.includes('categoria'));
  const idxTipo = headers.findIndex(h => h.includes('ingreso') || h.includes('egreso'));
  const idxMonto = headers.findIndex(h => h.includes('monto'));
  const idxFecha = headers.findIndex(h => h.includes('fecha'));
  const idxDetalle = headers.findIndex(h => h.includes('detalle'));

  const entries = [];
  for (let i = headerRow + 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.every(c => c === null)) continue;

    const categoria = row[idxCategoria];
    const tipo = row[idxTipo];
    const monto = row[idxMonto];

    if (!categoria || !tipo || monto === null || monto === undefined) continue;
    if (typeof monto !== 'number') continue;

    let fecha = row[idxFecha];
    if (fecha instanceof Date) {
      fecha = fecha.toISOString().split('T')[0];
    } else {
      fecha = null;
    }

    entries.push({
      fecha,
      categoria: String(categoria).trim(),
      tipo: String(tipo).trim(),
      monto: Math.abs(monto),
      detalle: row[idxDetalle] ? String(row[idxDetalle]).trim() : '',
    });
  }
  return entries;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');

  try {
    const files = await listExcelFiles();
    const allData = [];

    for (const file of files) {
      try {
        const buffer = await downloadExcel(file.id);
        const entries = parseExcel(buffer);
        // Extraer mes del nombre del archivo (ej: "Gastos_Enero_FEPUCV_2026.xlsx")
        const monthMatch = file.name.match(/enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre/i);
        const month = monthMatch ? monthMatch[0] : file.name;
        allData.push({ file: file.name, month, entries });
      } catch (e) {
        console.error(`Error parsing ${file.name}:`, e.message);
      }
    }

    // Construir resumen por categoría (solo egresos)
    const categoriaMap = {};
    const mesMap = {};

    for (const { month, entries } of allData) {
      for (const entry of entries) {
        const esEgreso = entry.tipo.toLowerCase().includes('egreso');
        if (!esEgreso) continue;

        // Por categoría
        if (!categoriaMap[entry.categoria]) categoriaMap[entry.categoria] = 0;
        categoriaMap[entry.categoria] += entry.monto;

        // Por mes
        if (!mesMap[month]) mesMap[month] = { ingresos: 0, egresos: 0 };
        mesMap[month].egresos += entry.monto;
      }
      // Ingresos por mes
      for (const entry of entries) {
        const esIngreso = entry.tipo.toLowerCase().includes('ingreso');
        if (!esIngreso) continue;
        if (!mesMap[month]) mesMap[month] = { ingresos: 0, egresos: 0 };
        mesMap[month].ingresos += entry.monto;
      }
    }

    // Ordenar categorías por monto
    const categorias = Object.entries(categoriaMap)
      .sort((a, b) => b[1] - a[1])
      .map(([nombre, monto]) => ({ nombre, monto: Math.round(monto) }));

    // Orden de meses
    const ordenMeses = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
    const meses = Object.entries(mesMap)
      .sort((a, b) => {
        const ai = ordenMeses.indexOf(a[0].toLowerCase());
        const bi = ordenMeses.indexOf(b[0].toLowerCase());
        return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
      })
      .map(([mes, vals]) => ({
        mes: mes.charAt(0).toUpperCase() + mes.slice(1).toLowerCase(),
        ingresos: Math.round(vals.ingresos),
        egresos: Math.round(vals.egresos),
      }));

    res.status(200).json({ categorias, meses, archivos: files.map(f => f.name) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}