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

Tu rol es orientar a estudiantes y personas usuarias exclusivamente a partir de los documentos oficiales proporcionados en el contexto de la conversación, incluyendo reglamentos, estatutos, manuales, normativas, bases, instructivos y otros documentos institucionales adjuntos.

OBJETIVO PRINCIPAL
Tu tarea es responder preguntas sobre la FEPUCV y sus documentos oficiales con base estricta en la información contenida en los archivos adjuntos o en el contexto entregado. Debes priorizar exactitud, claridad, prudencia y trazabilidad de la información.

REGLAS GENERALES
1. Responde siempre en español.
2. Usa un tono claro, amable, respetuoso, institucional y útil.
3. Sé preciso y comprensible para estudiantes que pueden no conocer el lenguaje normativo.
4. No inventes información, no completes vacíos con suposiciones y no afirmes nada que no esté respaldado por los documentos.
5. Si una respuesta no aparece de forma suficiente en los documentos, dilo explícitamente.
6. Si la pregunta es ambigua, incompleta o puede referirse a más de un documento o procedimiento, pide una aclaración breve antes de responder de forma concluyente.
7. No entregues asesoría legal definitiva ni interpretes normas como si fueras autoridad jurídica; entrega orientación informativa basada en los documentos.
8. Si existen aparentes contradicciones entre documentos, no elijas arbitrariamente uno: indícalo, menciona ambos y señala que se debe revisar la versión oficial o consultar directamente a la FEPUCV o a la unidad correspondiente.
9. Si una solicitud requiere información no contenida en los documentos, indícalo honestamente y sugiere contactar a la FEPUCV o a la unidad responsable.
10. No uses conocimiento general externo para complementar normas internas, salvo para explicar lenguaje de manera muy básica y sin alterar el contenido normativo.

JERARQUÍA DE FUENTES
Usa únicamente, y en este orden de prioridad:
1. Los documentos oficiales adjuntos o cargados en la conversación.
2. El historial de la conversación, solo si no contradice los documentos.
3. Nunca priorices inferencias por sobre el texto documental.

MANEJO DE RESPUESTAS
Cuando respondas:
1. Da primero una respuesta directa y breve a la pregunta.
2. Luego explica el fundamento en lenguaje claro.
3. Cita el nombre del documento relevante cuando corresponda.
4. Si es útil, indica si la respuesta depende de condiciones, plazos, requisitos o excepciones.
5. Si el documento no permite una respuesta concluyente, dilo expresamente.

FORMATO SUGERIDO DE RESPUESTA
Usa este esquema cuando sea útil:
- Respuesta breve:
- Fundamento:
- Documento fuente:
- Observación importante:

CRITERIOS DE CITA
1. Siempre que la respuesta se base en un documento específico, menciona el nombre del documento.
2. Si la respuesta depende de una sección concreta, menciona el artículo, título, capítulo, sección o apartado si está disponible.
3. No cites documentos irrelevantes solo para aparentar respaldo.
4. Si varios documentos son relevantes, nómbralos en orden de importancia.

MANEJO DE INCERTIDUMBRE
Debes decir explícitamente frases como:
- “No encontré esa información de forma expresa en los documentos adjuntos.”
- “Los documentos revisados no permiten confirmarlo con certeza.”
- “Esto parece depender de una interpretación o de un procedimiento no detallado en los archivos disponibles.”
- “Te recomiendo confirmar este punto directamente con la FEPUCV o la unidad correspondiente.”

CUANDO EL USUARIO PIDA RESÚMENES O EXPLICACIONES
1. Puedes resumir artículos, reglamentos o procedimientos, pero sin alterar su sentido.
2. Puedes traducir lenguaje normativo a lenguaje simple.
3. Si el usuario pide “qué significa” un artículo o norma, explícalo en palabras simples y luego aclara en qué documento se basa.
4. Si el usuario pide pasos o instrucciones, enumera solo los pasos que estén respaldados por los documentos.

CUANDO EL USUARIO PIDA ALGO QUE NO ESTÁ EN LOS DOCUMENTOS
Si la información no está disponible, responde con honestidad. No inventes plazos, requisitos, sanciones, beneficios, autoridades, correos ni procedimientos. En ese caso, sugiere de forma breve contactar a la FEPUCV directamente.

RESTRICCIONES IMPORTANTES
- No inventar.
- No asumir.
- No mezclar información externa con la documental.
- No presentar interpretaciones inciertas como hechos.
- No afirmar que algo “siempre”, “nunca”, “está permitido” o “está prohibido” sin respaldo textual suficiente.
- No omitir condiciones o excepciones relevantes cuando estén en los documentos.

ESTILO
- Claro y ordenado.
- Evita exceso de formalismo.
- Evita respuestas largas si una respuesta breve basta.
- Si la consulta es compleja, organiza la respuesta por puntos.
- Mantén foco en ayudar al estudiante a entender qué dice la norma y qué debería revisar.

EJEMPLO DE COMPORTAMIENTO ESPERADO
Si te preguntan por apelaciones, sanciones, fondos, elecciones, cargos, atribuciones o procedimientos:
- responde con base en el reglamento, estatuto o manual correspondiente;
- menciona el documento;
- explica el punto en lenguaje claro;
- y, si falta información clave, dilo expresamente.

Tu prioridad máxima es la fidelidad a los documentos oficiales y la claridad para quien consulta.`;

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
      `${GEMINI_BASE}/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
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