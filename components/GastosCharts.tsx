// src/components/GastosCharts.tsx
// Componente de análisis financiero — se agrega dentro de TransparencyPage.tsx

import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, CartesianGrid,
} from 'recharts';

// ————————————————————————————————————————————
// Tipos
// ————————————————————————————————————————————
interface CategoriaData {
  nombre: string;
  monto: number;
}
interface MesData {
  mes: string;
  ingresos: number;
  egresos: number;
}
interface GastosResponse {
  categorias: CategoriaData[];
  meses: MesData[];
  archivos: string[];
}

// ————————————————————————————————————————————
// Helpers
// ————————————————————————————————————————————
const formatCLP = (value: number) =>
  new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(value);

const COLORS = [
  '#1a3a5c', '#2d6a9f', '#3d8fcc', '#5ba8d4',
  '#7bbfe0', '#a0d4ee', '#c5e8f7', '#e0f3fb',
];

// Tooltip personalizado para gráfico de barras
const CustomBarTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-sm">
      <p className="font-bold text-gray-800 mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} style={{ color: p.color }}>
          {p.name}: {formatCLP(p.value)}
        </p>
      ))}
    </div>
  );
};

// Tooltip personalizado para pie
const CustomPieTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-sm">
      <p className="font-bold text-gray-800">{d.name}</p>
      <p style={{ color: d.payload.fill }}>{formatCLP(d.value)}</p>
      <p className="text-gray-500">{d.payload.percent}%</p>
    </div>
  );
};

// ————————————————————————————————————————————
// Componente principal
// ————————————————————————————————————————————
export const GastosCharts: React.FC = () => {
  const [data, setData] = useState<GastosResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

useEffect(() => {
  // En desarrollo, usa datos de prueba
  if (import.meta.env.DEV) {
    setData({
      categorias: [
        { nombre: 'Cuota PUCV', monto: 6583334 },
        { nombre: 'Sueldo secretaria', monto: 1171472 },
        { nombre: 'Cuota PreUCV', monto: 1745267 },
        { nombre: 'Gastos Operacionales', monto: 219090 },
        { nombre: 'TTVV', monto: 72585 },
        { nombre: 'CEGESEX', monto: 8183 },
      ],
      meses: [
        { mes: 'Enero', ingresos: 8470934, egresos: 1594215 },
      ],
      archivos: ['Gastos_Enero_FEPUCV_2026.xlsx'],
    });
    setLoading(false);
    return;
  }

  // En producción (Vercel), llama a la API real
  fetch('/api/gastos')
    .then(r => { if (!r.ok) throw new Error(`Error ${r.status}`); return r.json(); })
    .then((d) => { setData(d); setLoading(false); })
    .catch(e => { setError(e.message); setLoading(false); });
}, []);

  // ——— Loading ———
  if (loading) {
    return (
      <div className="mt-16 bg-fepucv-surface rounded-fepucv border border-fepucv-border p-12 flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-4 border-fepucv-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-fepucv-textSecondary text-sm">Cargando datos financieros...</p>
      </div>
    );
  }

  // ——— Error ———
  if (error || !data) {
    return (
      <div className="mt-16 bg-red-50 border border-red-200 rounded-fepucv p-8 text-center">
        <p className="text-red-600 font-semibold mb-1">No se pudieron cargar los datos</p>
        <p className="text-red-400 text-sm">{error}</p>
      </div>
    );
  }

  const { categorias, meses, archivos } = data;

  // Sin datos todavía
  if (!categorias.length && !meses.length) {
    return (
      <div className="mt-16 bg-fepucv-surface rounded-fepucv border border-fepucv-border p-12 text-center">
        <p className="text-5xl mb-4">📂</p>
        <p className="text-fepucv-secondary font-semibold">Aún no hay rendiciones disponibles</p>
        <p className="text-fepucv-textSecondary text-sm mt-2">
          Los gráficos aparecerán automáticamente cuando se suban archivos Excel a la carpeta.
        </p>
      </div>
    );
  }

  // Preparar datos para el pie (top 6 + Otros)
  const TOP = 6;
  const topCategorias = categorias.slice(0, TOP);
  const otros = categorias.slice(TOP).reduce((acc, c) => acc + c.monto, 0);
  const pieData = [
    ...topCategorias.map((c, i) => ({
      name: c.nombre,
      value: c.monto,
      fill: COLORS[i % COLORS.length],
      percent: '',
    })),
    ...(otros > 0 ? [{ name: 'Otros', value: otros, fill: '#d1d5db', percent: '' }] : []),
  ];
  const totalEgresos = categorias.reduce((a, c) => a + c.monto, 0);
  pieData.forEach(d => {
    d.percent = ((d.value / totalEgresos) * 100).toFixed(1);
  });

  return (
    <section className="mt-16">
      {/* Encabezado */}
      <div className="mb-10">
        <h2 className="text-3xl font-bold text-fepucv-primary mb-3">
          Análisis de Gastos
        </h2>
        <p className="text-fepucv-textSecondary text-base leading-relaxed">
          Visualización automática generada a partir de las rendiciones financieras subidas mensualmente.
          {archivos.length > 0 && (
            <span className="ml-2 text-sm text-fepucv-primary font-medium">
              ({archivos.length} {archivos.length === 1 ? 'reporte cargado' : 'reportes cargados'})
            </span>
          )}
        </p>
      </div>

      {/* Tarjetas resumen */}
      {meses.length > 0 && (() => {
        const totalIngresos = meses.reduce((a, m) => a + m.ingresos, 0);
        const totalEgresosAll = meses.reduce((a, m) => a + m.egresos, 0);
        const excedente = totalIngresos - totalEgresosAll;
        return (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            <div className="bg-green-50 border border-green-200 rounded-fepucv p-6">
              <p className="text-xs font-bold text-green-600 uppercase tracking-widest mb-1">Total Ingresos</p>
              <p className="text-2xl font-bold text-green-800">{formatCLP(totalIngresos)}</p>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-fepucv p-6">
              <p className="text-xs font-bold text-red-500 uppercase tracking-widest mb-1">Total Egresos</p>
              <p className="text-2xl font-bold text-red-800">{formatCLP(totalEgresosAll)}</p>
            </div>
            <div className={`border rounded-fepucv p-6 ${excedente >= 0 ? 'bg-blue-50 border-blue-200' : 'bg-orange-50 border-orange-200'}`}>
              <p className={`text-xs font-bold uppercase tracking-widest mb-1 ${excedente >= 0 ? 'text-fepucv-primary' : 'text-orange-500'}`}>
                Excedente
              </p>
              <p className={`text-2xl font-bold ${excedente >= 0 ? 'text-fepucv-secondary' : 'text-orange-800'}`}>
                {formatCLP(excedente)}
              </p>
            </div>
          </div>
        );
      })()}

      {/* Gráficos */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

        {/* ── Gráfico 1: Ingresos vs Egresos por mes ── */}
        {meses.length > 0 && (
          <div className="bg-fepucv-surface border border-fepucv-border rounded-fepucv p-6">
            <h3 className="text-lg font-bold text-fepucv-secondary mb-1">Ingresos vs Egresos</h3>
            <p className="text-xs text-fepucv-textSecondary mb-6">Comparativa mensual en CLP</p>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={meses} margin={{ top: 4, right: 16, left: 0, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="mes" tick={{ fontSize: 12, fill: '#6b7280' }} />
                <YAxis
                  tickFormatter={v => `$${(v / 1_000_000).toFixed(1)}M`}
                  tick={{ fontSize: 11, fill: '#6b7280' }}
                  width={60}
                />
                <Tooltip content={<CustomBarTooltip />} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="ingresos" name="Ingresos" fill="#2d6a9f" radius={[4, 4, 0, 0]} />
                <Bar dataKey="egresos" name="Egresos" fill="#e57373" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* ── Gráfico 2: Distribución de egresos por categoría ── */}
        {categorias.length > 0 && (
          <div className="bg-fepucv-surface border border-fepucv-border rounded-fepucv p-6">
            <h3 className="text-lg font-bold text-fepucv-secondary mb-1">Distribución de Egresos</h3>
            <p className="text-xs text-fepucv-textSecondary mb-6">Por categoría — total acumulado</p>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={105}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
                <Legend
                  formatter={(value) => <span style={{ fontSize: 11, color: '#374151' }}>{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Tabla detalle de categorías */}
      {categorias.length > 0 && (
        <div className="mt-8 bg-fepucv-surface border border-fepucv-border rounded-fepucv overflow-hidden">
          <div className="p-6 border-b border-fepucv-border">
            <h3 className="text-lg font-bold text-fepucv-secondary">Detalle por Categoría</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="px-6 py-3 font-semibold text-fepucv-textSecondary">Categoría</th>
                  <th className="px-6 py-3 font-semibold text-fepucv-textSecondary text-right">Monto Egresado</th>
                  <th className="px-6 py-3 font-semibold text-fepucv-textSecondary text-right">% del Total</th>
                </tr>
              </thead>
              <tbody>
                {categorias.map((cat, i) => (
                  <tr key={cat.nombre} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                    <td className="px-6 py-3 font-medium text-fepucv-secondary">
                      <span
                        className="inline-block w-2.5 h-2.5 rounded-full mr-2"
                        style={{ background: COLORS[i % COLORS.length] }}
                      />
                      {cat.nombre}
                    </td>
                    <td className="px-6 py-3 text-right font-mono text-gray-700">{formatCLP(cat.monto)}</td>
                    <td className="px-6 py-3 text-right text-gray-500">
                      {((cat.monto / totalEgresos) * 100).toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Nota pie */}
      <p className="mt-4 text-xs text-fepucv-textSecondary text-right">
        Los datos se actualizan automáticamente al subir nuevos archivos Excel a la carpeta de Drive.
      </p>
    </section>
  );
};