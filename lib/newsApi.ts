import { NewsItem, NewsStatus } from '../types';
import { NewsDraft, slugify } from './newsStore';

const url = (import.meta.env.VITE_SUPABASE_URL || '').replace(/\/$/, '');
const key = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '';
const SESSION_KEY = 'fepucv_supabase_session';

type Session = { access_token: string; refresh_token: string; expires_at: number };
type NewsRow = {
  id: string; title: string; slug: string; excerpt: string; content: string;
  category: string; images: string[]; author: string; status: NewsStatus;
  featured: boolean; published_at: string | null; created_at: string;
};

function config() {
  if (!url || !key) throw new Error('Falta configurar Supabase para las noticias.');
}

function session(): Session | null {
  try { return JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null'); }
  catch { return null; }
}

export function isNewsEditor(): boolean { return !!session(); }

function saveSession(data: { access_token: string; refresh_token: string; expires_in: number }) {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify({
    access_token: data.access_token, refresh_token: data.refresh_token,
    expires_at: Date.now() + data.expires_in * 1000,
  } satisfies Session));
}

export function logoutNewsEditor() { sessionStorage.removeItem(SESSION_KEY); }

async function responseError(response: Response): Promise<Error> {
  const body = await response.json().catch(() => ({}));
  return new Error(body.message || body.msg || body.error_description || body.error || `Error ${response.status}`);
}

export async function loginNewsEditor(email: string, password: string): Promise<void> {
  config();
  const response = await fetch(`${url}/auth/v1/token?grant_type=password`, {
    method: 'POST', headers: { apikey: key, 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) throw await responseError(response);
  saveSession(await response.json());
  try {
    const permission = await request('/rest/v1/rpc/news_editor_status', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}',
    }, true);
    if (await permission.json() !== true) throw new Error('Esta cuenta no tiene permiso para editar noticias.');
  } catch (error) {
    logoutNewsEditor();
    throw error;
  }
}

async function token(): Promise<string | null> {
  const current = session();
  if (!current) return null;
  if (current.expires_at > Date.now() + 60_000) return current.access_token;
  const response = await fetch(`${url}/auth/v1/token?grant_type=refresh_token`, {
    method: 'POST', headers: { apikey: key, 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token: current.refresh_token }),
  });
  if (!response.ok) {
    logoutNewsEditor();
    throw new Error('La sesión venció. Ingresa nuevamente al editor.');
  }
  const data = await response.json();
  saveSession(data);
  return data.access_token;
}

async function request(path: string, init: RequestInit = {}, editor = false): Promise<Response> {
  config();
  let accessToken: string | null;
  try { accessToken = await token(); }
  catch (error) {
    if (editor) throw error;
    accessToken = null;
  }
  if (editor && !accessToken) throw new Error('Ingresa al editor para guardar cambios.');
  const response = await fetch(`${url}${path}`, {
    ...init,
    headers: { apikey: key, ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}), ...init.headers },
    cache: 'no-store',
  });
  if (!response.ok) throw await responseError(response);
  return response;
}

function fromRow(row: NewsRow): NewsItem {
  return {
    id: row.id, title: row.title, slug: row.slug, excerpt: row.excerpt,
    content: row.content, category: row.category, images: row.images,
    image: row.images?.[0] || '', author: row.author, status: row.status,
    featured: row.featured,
    date: new Date(row.published_at || row.created_at).toLocaleDateString('es-CL', {
      day: 'numeric', month: 'long', year: 'numeric',
    }),
  };
}

export async function fetchNews(): Promise<NewsItem[]> {
  const response = await request('/rest/v1/noticias?select=*&order=created_at.desc');
  return (await response.json() as NewsRow[]).map(fromRow);
}

async function uploadImages(images: string[]): Promise<string[]> {
  const uploaded: string[] = [];
  for (const image of images) {
    if (!image.startsWith('data:image/') || image.startsWith('data:image/svg+xml')) {
      uploaded.push(image);
      continue;
    }
    const blob = await (await fetch(image)).blob();
    const extension = blob.type.split('/')[1]?.replace('jpeg', 'jpg') || 'jpg';
    const path = `${crypto.randomUUID()}.${extension}`;
    await request(`/storage/v1/object/noticias/${path}`, {
      method: 'POST', headers: { 'Content-Type': blob.type, 'x-upsert': 'false' }, body: blob,
    }, true);
    uploaded.push(`${url}/storage/v1/object/public/noticias/${path}`);
  }
  return uploaded;
}

export async function saveNews(draft: NewsDraft, status: NewsStatus, author: string): Promise<void> {
  const images = await uploadImages(draft.images);
  if (draft.featured) {
    await request('/rest/v1/noticias?featured=eq.true', {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ featured: false }),
    }, true);
  }
  const data = {
    title: draft.title.trim(), excerpt: draft.excerpt.trim(), content: draft.content.trim(),
    category: draft.category, images, featured: draft.featured, status, author,
    ...(status === 'publicada' ? { published_at: new Date().toISOString() } : {}),
  };
  const path = draft.id ? `/rest/v1/noticias?id=eq.${encodeURIComponent(draft.id)}` : '/rest/v1/noticias';
  const response = await request(path, {
    method: draft.id ? 'PATCH' : 'POST',
    headers: { 'Content-Type': 'application/json', Prefer: 'return=representation' },
    body: JSON.stringify(draft.id ? data : {
      ...data, slug: `${slugify(draft.title) || 'noticia'}-${crypto.randomUUID().slice(0, 8)}`,
    }),
  }, true);
  if (!(await response.json() as NewsRow[]).length) throw new Error('La noticia ya no existe. Actualiza la página.');
}

export async function deleteNews(id: string): Promise<void> {
  const response = await request(`/rest/v1/noticias?id=eq.${encodeURIComponent(id)}`, {
    method: 'DELETE', headers: { Prefer: 'return=representation' },
  }, true);
  if (!(await response.json() as NewsRow[]).length) throw new Error('La noticia ya no existe. Actualiza la página.');
}

export async function toggleFeatured(id: string, featured: boolean): Promise<void> {
  if (featured) {
    await request('/rest/v1/noticias?featured=eq.true', {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ featured: false }),
    }, true);
  }
  const response = await request(`/rest/v1/noticias?id=eq.${encodeURIComponent(id)}`, {
    method: 'PATCH', headers: { 'Content-Type': 'application/json', Prefer: 'return=representation' },
    body: JSON.stringify({ featured }),
  }, true);
  if (!(await response.json() as NewsRow[]).length) throw new Error('La noticia ya no existe. Actualiza la página.');
}
