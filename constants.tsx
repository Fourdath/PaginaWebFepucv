
import React from 'react';
import { NewsItem, ExecutiveMember, ServiceItem, DocumentItem, FAQItem } from './types';

export const INITIAL_NEWS: NewsItem[] = [
  {
    id: '1',
    title: 'Nueva Red de Apoyo Psicológico Estudiantil',
    excerpt: 'La FEPUCV lanza un nuevo convenio con especialistas para mejorar el bienestar mental de los alumnos.',
    content: 'En un esfuerzo conjunto con la Vicerrectoría, hemos logrado concretar la ampliación de cupos para atención psicológica...',
    category: 'Bienestar',
    date: '15 Mayo, 2024',
    image: 'https://picsum.photos/seed/news1/800/600',
    author: 'Comunicaciones FEPUCV',
    slug: 'red-apoyo-psicologico'
  },
  {
    id: '2',
    title: 'Inscripciones abiertas para Fondos Concursables 2024',
    excerpt: 'Postula tu proyecto social, deportivo o cultural y obtén financiamiento directo de la federación.',
    content: 'Hasta el 30 de junio estarán abiertas las postulaciones para los fondos de iniciativas estudiantiles...',
    category: 'Proyectos',
    date: '12 Mayo, 2024',
    image: 'https://picsum.photos/seed/news2/800/600',
    author: 'Dirección de Finanzas',
    slug: 'fondos-concursables-2024'
  },
  {
    id: '3',
    title: 'Actualización del Protocolo de Acompañamiento Académico',
    excerpt: 'Conoce los nuevos pasos a seguir ante situaciones de estrés extremo o problemas familiares durante el semestre.',
    content: 'El nuevo protocolo garantiza una mediación directa entre el estudiante y su jefe de carrera...',
    category: 'Académico',
    date: '10 Mayo, 2024',
    image: 'https://picsum.photos/seed/news3/800/600',
    author: 'Vocalía Académica',
    slug: 'protocolo-academico-2024'
  },
  {
    id: '4',
    title: 'Resultados del Plebiscito de Estatutos',
    excerpt: 'Con una participación histórica, la comunidad estudiantil aprobó las modificaciones al reglamento interno.',
    content: 'Tras tres días de votación electrónica, el TRICEL ha validado el quórum necesario para...',
    category: 'Democracia',
    date: '05 Mayo, 2024',
    image: 'https://picsum.photos/seed/news4/800/600',
    author: 'TRICEL',
    slug: 'resultados-plebiscito-estatutos'
  }
];

export const EXECUTIVE_BOARD: ExecutiveMember[] = [
  { id: '1', name: 'Sofía Valenzuela', role: 'Presidenta', major: 'Derecho', image: 'https://picsum.photos/seed/sofia/400/500' },
  { id: '2', name: 'Ignacio Rojas', role: 'Vicepresidente', major: 'Ingeniería Civil', image: 'https://picsum.photos/seed/ignacio/400/500' },
  { id: '3', name: 'Camila Soto', role: 'Secretaria General', major: 'Psicología', image: 'https://picsum.photos/seed/camila/400/500' },
  { id: '4', name: 'Mateo Núñez', role: 'Secretario de Finanzas', major: 'Comercial', image: 'https://picsum.photos/seed/mateo/400/500' },
  { id: '5', name: 'Valentina Paredes', role: 'Vocalía Bienestar', major: 'Trabajo Social', image: 'https://picsum.photos/seed/valentina/400/500' },
  { id: '6', name: 'Diego Silva', role: 'Vocalía Académica', major: 'Pedagogía en Historia', image: 'https://picsum.photos/seed/diego/400/500' },
  { id: '7', name: 'Javiera López', role: 'Vocalía Género', major: 'Periodismo', image: 'https://picsum.photos/seed/javiera/400/500' },
  { id: '8', name: 'Tomás Castro', role: 'Vocalía Cultura', major: 'Arquitectura', image: 'https://picsum.photos/seed/tomas/400/500' },
];

export const SERVICES: ServiceItem[] = [
  { id: '1', title: 'Defensa Estudiantil', description: 'Asesoría legal y académica ante procesos disciplinarios.', icon: '⚖️', link: '#', type: 'link' },
  { id: '2', title: 'Manual de Sanciones', description: 'Guía rápida sobre reglamentos y derechos del alumno.', icon: '📖', link: '#', type: 'download' },
  { id: '3', title: 'Fondos de Iniciativas', description: 'Descarga las bases y formularios de postulación.', icon: '💰', link: '#', type: 'download' },
  { id: '4', title: 'Salas de Estudio', description: 'Reserva de espacios en los diversos campus.', icon: '🏫', link: '#', type: 'link' },
  { id: '5', title: 'Convenios Salud', description: 'Listado de beneficios en clínicas y centros dentales.', icon: '🏥', link: '#', type: 'link' },
  { id: '6', title: 'Certificados', description: 'Solicita documentos oficiales a través de la FEPUCV.', icon: '📄', link: '#', type: 'link' },
];

export const DOCUMENTS: DocumentItem[] = [
  { id: '1', name: 'Estatutos FEPUCV', year: '2024', category: 'Estatutos', url: '#' },
  { id: '2', name: 'Acta Plenaria Ordinaria #12', year: '2024', category: 'Actas', url: '#' },
  { id: '3', name: 'Reglamento de Elecciones', year: '2023', category: 'Reglamentos', url: '#' },
  { id: '4', name: 'Informe Trimestral de Gastos', year: '2024', category: 'Transparencia', url: '#' },
  { id: '5', name: 'Protocolo VBG', year: '2022', category: 'Protocolos', url: '#' },
];

export const FAQS: FAQItem[] = [
  { id: '1', question: '¿Cómo puedo postular a un fondo concursable?', answer: 'Debes descargar las bases en la sección de Servicios, completar el formulario y enviarlo a finanzas@fepucv.cl antes de la fecha límite.' },
  { id: '2', question: '¿Qué hacer si tengo un problema con un profesor?', answer: 'Te recomendamos contactar a la Vocalía Académica o a la Defensa Estudiantil a través del formulario de contacto para recibir orientación personalizada.' },
  { id: '3', question: '¿Cómo me entero de las asambleas?', answer: 'Todas las convocatorias se publican en nuestro Instagram oficial @fepucv y en la sección de Noticias de esta web.' },
];
