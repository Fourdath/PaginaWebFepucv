
export type NewsStatus = 'publicada' | 'borrador';

export interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  date: string;
  image: string;          // portada (compatibilidad con el contenido existente)
  author: string;
  slug: string;
  images?: string[];      // galeria: images[0] es la portada
  status?: NewsStatus;    // sin valor => se trata como 'publicada'
  featured?: boolean;     // destacada en portada
}

export interface ExecutiveMember {
  id: string;
  name: string;
  role: string;
  major: string;
  image: string;
  type: 'mesa' | 'superior' | 'facultad';
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  link: string;
  type: 'download' | 'link';
}

export interface DocumentItem {
  id: string;
  name: string;
  year: string;
  category: string;
  url: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface FacultyRepresentative {
  name: string;
  role: string;
  email: string;
  image: string;
}

export interface Faculty {
  id: string;
  name: string;
  shortName: string;
  slug: string;
  icon: string;
  representatives: FacultyRepresentative[];
  careers: string[];
  instagram?: string;
}
