import { NewsItem } from '../types';

// ---------------------------------------------------------------------------
// Capa de datos de Noticias.
// HOY: persiste en localStorage (cero backend, funciona en Vercel tal cual).
// DESPUES: reemplazar las funciones marcadas con TODO(supabase) por llamadas
// a Supabase. El resto de la app no cambia.
// ---------------------------------------------------------------------------

const KEY = 'fepucv_noticias_v1';

export const CATEGORIES = ['Bienestar', 'Academico', 'Cultura', 'Deportes', 'Comunicado'];

export function placeholder(label: string): string {
  const svg =
    "<svg xmlns='http://www.w3.org/2000/svg' width='960' height='600'>" +
    "<defs><pattern id='p' width='14' height='14' patternTransform='rotate(45)' patternUnits='userSpaceOnUse'>" +
    "<rect width='14' height='14' fill='#F6F7FB'/><rect width='7' height='14' fill='#EBEEF5'/></pattern></defs>" +
    "<rect width='960' height='600' fill='url(#p)'/>" +
    "<text x='480' y='306' text-anchor='middle' font-family='monospace' font-size='24' fill='#475569'>" + label + "</text></svg>";
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

/** Portada de una noticia, con fallback. */
export function cover(item: NewsItem): string {
  if (item.images && item.images.length) return item.images[0];
  return item.image || placeholder('FOTO PENDIENTE');
}

export function gallery(item: NewsItem): string[] {
  return (item.images || []).slice(1);
}

export function isPublished(item: NewsItem): boolean {
  return (item.status || 'publicada') === 'publicada';
}

export function paragraphs(content: string): string[] {
  return String(content || '').split(/\n+/).map(p => p.trim()).filter(Boolean);
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 70);
}

export function today(): string {
  return new Date().toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' });
}

/** Convierte un File del input en data URL. Sustituir por Supabase Storage. */
export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

// --- Persistencia -----------------------------------------------------------

// TODO(supabase): select * from noticias order by created_at desc
export function loadNews(fallback: NewsItem[]): NewsItem[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length ? parsed : fallback;
  } catch {
    return fallback;
  }
}

// TODO(supabase): upsert / delete segun corresponda
export function saveNews(news: NewsItem[]): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(news));
  } catch {
    // cuota llena: las fotos en base64 pesan. Con Supabase Storage desaparece.
  }
}

export interface NewsDraft {
  id: string | null;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  images: string[];
  featured: boolean;
}

export const EMPTY_DRAFT: NewsDraft = {
  id: null,
  title: '',
  excerpt: '',
  content: '',
  category: CATEGORIES[0],
  images: [],
  featured: false,
};

/** Inserta o actualiza una noticia y resuelve la exclusividad de la destacada. */
export function commitDraft(
  news: NewsItem[],
  draft: NewsDraft,
  status: 'publicada' | 'borrador',
  author: string,
): NewsItem[] {
  const images = draft.images.length ? draft.images : [placeholder('FOTO PENDIENTE')];
  const next = draft.featured ? news.map(n => ({ ...n, featured: false })) : news.slice();

  const base = {
    title: draft.title.trim(),
    excerpt: draft.excerpt.trim(),
    content: draft.content.trim(),
    category: draft.category,
    images,
    image: images[0],
    featured: !!draft.featured,
    status,
    slug: slugify(draft.title),
    author,
  };

  if (draft.id) {
    return next.map(n => (n.id === draft.id ? { ...n, ...base } : n));
  }
  const created: NewsItem = { id: 'n' + Date.now(), date: today(), ...base };
  return [created, ...next];
}

export function toDraft(item: NewsItem): NewsDraft {
  return {
    id: item.id,
    title: item.title,
    excerpt: item.excerpt,
    content: item.content,
    category: item.category,
    images: (item.images && item.images.length ? item.images : [item.image]).filter(Boolean),
    featured: !!item.featured,
  };
}
