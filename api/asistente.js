// api/asistente.js — Vercel Serverless Function

const GEMINI_API_KEY = process.env.GEMINI_API_KEY?.trim();
const GEMINI_BASE = 'https://generativelanguage.googleapis.com';

const DOCUMENTOS = [
  { nombre: 'Estatutos Generales 2024',                      driveId: '19XnJXUM4ycHEmAk2wacWscC2QEB92AcF' },
  { nombre: 'Estatutos CEGESEX 2024',                        driveId: '1jQi76rcMEw4QkqZBmWVZ6QlDDXOXbBNT' },
  { nombre: 'Manual de Sanciones Académicas',                driveId: '17s3DfRRBEE1M8s_kIA6Z-2nkQF050cw4' },
  { nombre: 'Guía Ingreso Solicitudes Liberación Sanciones', driveId: '1NkAu-B5xoVChU4ZEH-j2lVezQbmEjCiq' },
  { nombre: 'Reglamento Consejeros Estudiantiles FEPUCV',    driveId: '1-dXxSQoR-9GSgMnX2MCXoNjbWtWvaXHp' },
  { nombre: 'Reglamento Convención de Estudiantes',          driveId: '1vWiKi_FMi2quYir1uEiOE8VXxmlssvmQ' },
  { nombre: 'Reglamento de Elecciones',                      driveId: '1hmZW-sL3hhhgDEDDe0_mIkdZKCYGyFW2' },
  { nombre: 'Reglamento de Sala CGE',                        driveId: '1bynIZMeWOd-gZot-rdjrKUgqjQutzjYw' },
  { nombre: 'Reglamento Estudiantil CAHVDA 2024',            driveId: '18U4_jtH-qwNxxePXj2K7sX7xWTmT5HYb' },
  { nombre: 'Reglamento para CEEs y Bases',                  driveId: '1g5HUgDfI6Eiq1B3Ty4ypzFCBOFuqS8Ew' },
];

let cachedFileUris = null;
let cacheTimestamp = 0;
const CACHE_TTL = 43 * 60 * 60 * 1000;

async function downloadPDF(driveId) {
  const url = `https://drive.google.com/uc?export=download&id=${driveId}`;
  const res = await fetch(url, { redirect: 'follow' });

  if (!res.ok) {
    const errorText = await res.text().catch(() => '');
    throw new Error(`Error descargando ${driveId}: ${res.status} ${errorText.slice(0, 200)}`);
  }

  const contentType = res.headers.get('content-type') || '';
  if (!contentType.includes('pdf') && !contentType.includes('octet-stream')) {
    const text = await res.text().catch(() => '');
    throw new Error(
      `Drive no devolvió PDF para ${driveId}. Content-Type: ${contentType}. Respuesta: ${text.slice(0, 200)}`
    );
  }

  const buffer = await res.arrayBuffer();
  return Buffer.from(buffer);
}

async function uploadToGemini(nombre, pdfBuffer) {
  const initRes = await fetch(
    `${GEMINI_BASE}/upload/v1beta/files?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: {
        'X-Goog-Upload-Protocol': 'resumable',
        'X-Goog-Upload-Command': 'start',
        'X-Goog-Upload-Header-Content-Length': String(pdfBuffer.length),
        'X-Goog-Upload-Header-Content-Type': 'application/pdf',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ file: { display_name: nombre } })
    }
  );

  if (!initRes.ok) {
    const errorText = await initRes.text().catch(() => '');
    throw new Error(`Error iniciando upload para ${nombre}: ${initRes.status} ${errorText.slice(0, 300)}`);
  }

  const uploadUrl = initRes.headers.get('x-goog-upload-url');
  if (!uploadUrl) throw new Error(`No se obtuvo uploadUrl para ${nombre}`);

  const uploadRes = await fetch(uploadUrl, {
    method: 'POST',
    headers: {
      'X-Goog-Upload-Command': 'upload, finalize',
      'X-Goog-Upload-Offset': '0',
      'Content-Type': 'application/pdf',
      'Content-Length': String(pdfBuffer.length),
    },
    body: pdfBuffer
  });

  if (!uploadRes.ok) {
    const errorText = await uploadRes.text().catch(() => '');
    throw new Error(`Error subiendo ${nombre}: ${uploadRes.status} ${errorText.slice(0, 300)}`);
  }

  const fileData = await uploadRes.json();
  const uri = fileData.file?.uri;

  if (!uri) {
    throw new Error(`Gemini no devolvió file uri para ${nombre}`);
  }

  return uri;
}

async function getFileUris() {
  const now = Date.now();
  if (cachedFileUris && (now - cacheTimestamp) < CACHE_TTL) {
    console.log('Usando fileUris cacheados');
    return cachedFileUris;
  }

  console.log('Descargando y subiendo PDFs a Gemini...');
  const uris = [];
  const errores = [];

  for (const doc of DOCUMENTOS) {
    try {
      const buffer = await downloadPDF(doc.driveId);
      const uri = await uploadToGemini(doc.nombre, buffer);
      uris.push({ nombre: doc.nombre, uri });
      console.log(`✅ ${doc.nombre}`);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      errores.push(`${doc.nombre}: ${msg}`);
      console.error(`❌ Error con ${doc.nombre}:`, msg);
    }
  }

  if (uris.length === 0) {
    throw new Error(`No se pudo cargar ningún documento. Detalle: ${errores.slice(0, 3).join(' | ')}`);
  }

  cachedFileUris = uris;
  cacheTimestamp = now;
  return uris;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' });

  if (!GEMINI_API_KEY) {
    return res.status(500).json({ error: 'Falta configurar GEMINI_API_KEY en las variables de entorno' });
  }

  try {
    const { pregunta, historial = [] } = req.body || {};

    if (!pregunta) {
      return res.status(400).json({ error: 'Falta la pregunta' });
    }

    const fileUris = await getFileUris();

    const systemPrompt = `Eres el asistente virtual oficial de la FEPUCV (Federación de Estudiantes de la Pontificia Universidad Católica de Valparaíso).
Tu función es responder preguntas sobre los documentos oficiales adjuntos: reglamentos, estatutos y normativas de la federación.
Responde siempre en español, de forma clara, amable y concisa.
Cita el documento específico cuando sea relevante.
Si la respuesta no está en los documentos, dilo honestamente y sugiere contactar a la FEPUCV directamente.
No inventes información que no esté en los documentos.`;

    const parts = [
      { text: systemPrompt },
      ...fileUris.map(f => ({
        file_data: { mime_type: 'application/pdf', file_uri: f.uri }
      })),
      { text: `\n\nPregunta del estudiante: ${pregunta}` }
    ];

    const contents = historial.length > 0
      ? [
          ...historial.flatMap((h) => [
            { role: 'user', parts: [{ text: h.pregunta }] },
            { role: 'model', parts: [{ text: h.respuesta }] }
          ]),
          { role: 'user', parts }
        ]
      : [{ role: 'user', parts }];

    const geminiRes = await fetch(
      `${GEMINI_BASE}/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 600,
          }
        })
      }
    );

    if (!geminiRes.ok) {
      const errorText = await geminiRes.text().catch(() => '');
      throw new Error(`Gemini generateContent falló: ${geminiRes.status} ${errorText.slice(0, 400)}`);
    }

    const data = await geminiRes.json();
    const respuesta =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      'No pude generar una respuesta.';

    return res.status(200).json({ respuesta });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Error interno del servidor';
    console.error('Error asistente:', err);
    return res.status(500).json({ error: msg });
  }
}