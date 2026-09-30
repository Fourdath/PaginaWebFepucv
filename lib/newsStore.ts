import { NewsItem } from '../types';

export const CATEGORIES = ['Bienestar', 'Academico', 'Cultura', 'Deportes', 'Comunicado'];

export function placeholder(label: string): string {
  const svg = "<svg xmlns='http://www.w3.org/2000/svg' width='960' height='600'>" +
    "<rect width='960' height='600' fill='#EBEEF5'/>" +
    "<text x='480' y='306' text-anchor='middle' font-family='monospace' font-size='24' fill='#475569'>" + label + "</text></svg>";
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

export function cover(item: NewsItem): string {
  return item.images?.[0] || item.image || placeholder('FOTO PENDIENTE');
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
  return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 70);
}

export function today(): string {
  return new Date().toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
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
  id: null, title: '', excerpt: '', content: '', category: CATEGORIES[0], images: [], featured: false,
};

export function toDraft(item: NewsItem): NewsDraft {
  return {
    id: item.id, title: item.title, excerpt: item.excerpt, content: item.content,
    category: item.category, images: (item.images?.length ? item.images : [item.image]).filter(Boolean),
    featured: !!item.featured,
  };
}
