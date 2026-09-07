// ---------------------------------------------------------------------------
// Acceso al editor de noticias.
//
// La clave NO se guarda en el codigo: se compara su hash SHA-256. El hash vive
// en VITE_ADMIN_PASSWORD_HASH (.env / variables de entorno de Vercel).
//
// AVISO IMPORTANTE PARA EL DEV: cualquier verificacion hecha en el navegador es
// disuasiva, no segura. Sirve para que la seccion no quede abierta a cualquiera
// que entre a /admin, pero alguien con las devtools puede saltarla. La barrera
// real es que la escritura de la tabla noticias en Supabase exija sesion (RLS),
// no que el formulario se muestre o no. Ver README, seccion Seguridad.
// ---------------------------------------------------------------------------

const FALLBACK_HASH = 'd027826b9019ae502f1a31520c8cc5417093f9ab15ad239bfb2c9d139fad2f93';

export const SESSION_KEY = 'fepucv_editor_session';

export async function sha256Hex(value: string): Promise<string> {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function checkPassword(input: string): Promise<boolean> {
  const expected =
    (import.meta.env.VITE_ADMIN_PASSWORD_HASH as string | undefined) || FALLBACK_HASH;
  const got = await sha256Hex(input.trim());
  if (got.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < got.length; i++) diff |= got.charCodeAt(i) ^ expected.charCodeAt(i);
  return diff === 0;
}

export const MESA_MEMBERS = [
  'Presidencia',
  'Vicepresidencia',
  'Secretaria General',
  'Secretaria de Comunicaciones',
  'Secretaria de Finanzas',
];
