
import React from 'react';
import { NewsItem, ExecutiveMember, ServiceItem, DocumentItem, FAQItem, Faculty } from './types';

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
  // MESA EJECUTIVA
  { id: 'm1', name: 'Sofía Valenzuela', role: 'Presidente', major: 'Derecho', image: 'https://picsum.photos/seed/sofia/400/500', type: 'mesa' },
  { id: 'm2', name: 'Ignacio Rojas', role: 'Vicepresidente', major: 'Ingeniería Civil', image: 'https://picsum.photos/seed/ignacio/400/500', type: 'mesa' },
  { id: 'm3', name: 'Camila Soto', role: 'Secretaria General', major: 'Psicología', image: 'https://picsum.photos/seed/camila/400/500', type: 'mesa' },
  { id: 'm4', name: 'Mateo Núñez', role: 'Secretaria de Finanzas', major: 'Ingeniería Comercial', image: 'https://picsum.photos/seed/mateo/400/500', type: 'mesa' },
  { id: 'm5', name: 'Valentina Paredes', role: 'Secretaria de Bienestar y Extensión', major: 'Trabajo Social', image: 'https://picsum.photos/seed/valentina/400/500', type: 'mesa' },
  { id: 'm6', name: 'Diego Silva', role: 'Secretaria de Comunicaciones', major: 'Periodismo', image: 'https://picsum.photos/seed/diego/400/500', type: 'mesa' },
  
  // CONSEJERÍA SUPERIOR (Solo 2)
  { id: 's1', name: 'Carolina Paz', role: 'Consejera Superior', major: 'Arquitectura', image: 'https://picsum.photos/seed/cs1/400/500', type: 'superior' },
  { id: 's2', name: 'Benjamín Vicuña', role: 'Consejero Superior', major: 'Ingeniería Civil Informática', image: 'https://picsum.photos/seed/cs2/400/500', type: 'superior' },

  // CONSEJERÍAS DE FACULTAD
  { id: 'f1', name: 'Matías Prado', role: 'Consejero Facultad Ingeniería', major: 'Ingeniería Civil', image: 'https://picsum.photos/seed/cf1/400/500', type: 'facultad' },
  { id: 'f2', name: 'Lucía Méndez', role: 'Consejera Facultad Ciencias', major: 'Biología', image: 'https://picsum.photos/seed/cf2/400/500', type: 'facultad' },
  { id: 'f3', name: 'Andrés Bello', role: 'Consejero Facultad Filosofía', major: 'Filosofía', image: 'https://picsum.photos/seed/cf3/400/500', type: 'facultad' },
  { id: 'f4', name: 'Paula Jara', role: 'Consejera Facultad Agronomía', major: 'Agronomía', image: 'https://picsum.photos/seed/cf4/400/500', type: 'facultad' },
  { id: 'f5', name: 'Esteban Quito', role: 'Consejero Facultad Derecho', major: 'Derecho', image: 'https://picsum.photos/seed/cf5/400/500', type: 'facultad' },
  { id: 'f6', name: 'Rosa Espinoza', role: 'Consejera Facultad FACEA', major: 'Ing. Comercial', image: 'https://picsum.photos/seed/cf6/400/500', type: 'facultad' },
  { id: 'f7', name: 'Javiera Paz', role: 'Consejera Facultad Educación', major: 'Pedagogía', image: 'https://picsum.photos/seed/cf7/400/500', type: 'facultad' },
  { id: 'f8', name: 'Tomas Perez', role: 'Consejero Facultad Teología', major: 'Teología', image: 'https://picsum.photos/seed/cf8/400/500', type: 'facultad' },
];

export const SERVICES: ServiceItem[] = [
  { id: '3', title: 'Fondos Participativos y Descentralizados', description: 'Accede a las bases y formularios para el financiamiento de proyectos estudiantiles.', icon: '💰', link: '#/servicios', type: 'link' },
  { id: '1', title: 'Defensa Estudiantil', description: 'Asesoría legal y académica ante procesos disciplinarios.', icon: '⚖️', link: '#', type: 'link' },
  { id: '2', title: 'Manual de Sanciones', description: 'Guía rápida sobre reglamentos y derechos del alumno.', icon: '📖', link: '#', type: 'download' },
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

export const FACULTIES: Faculty[] = [
  {
    id: '1',
    name: 'Filosofía y Educación',
    shortName: 'FIL ED',
    slug: 'fil-ed',
    icon: '📚',
    representatives: [
      { name: 'Ana García', role: 'Presidenta', email: 'ana.garcia@pucv.cl', image: 'https://picsum.photos/seed/ana/200/200' },
      { name: 'Luis Torres', role: 'Secretario', email: 'luis.torres@pucv.cl', image: 'https://picsum.photos/seed/luis/200/200' },
    ],
    careers: ['Pedagogía en Historia', 'Pedagogía en Castellano', 'Filosofía', 'Educación Parvularia'],
    instagram: '@fepucv_filed'
  },
  {
    id: '2',
    name: 'Agronomía',
    shortName: 'AGRONOMÍA',
    slug: 'agronomia',
    icon: '🌱',
    representatives: [
      { name: 'Pedro Montes', role: 'Presidente', email: 'pedro.montes@pucv.cl', image: 'https://picsum.photos/seed/pedro/200/200' },
    ],
    careers: ['Agronomía'],
    instagram: '@agronomia_pucv'
  },
  {
    id: '3',
    name: 'Arquitectura y Diseño',
    shortName: 'ARQUITECTURA',
    slug: 'arquitectura',
    icon: '📐',
    representatives: [
      { name: 'Carla Ruiz', role: 'Presidenta', email: 'carla.ruiz@pucv.cl', image: 'https://picsum.photos/seed/carla/200/200' },
    ],
    careers: ['Arquitectura', 'Diseño Gráfico', 'Diseño Industrial'],
    instagram: '@eadpucv'
  },
  {
    id: '4',
    name: 'Derecho',
    shortName: 'DERECHO',
    slug: 'derecho',
    icon: '⚖️',
    representatives: [
      { name: 'Sofía Valenzuela', role: 'Presidenta', email: 'sofia.v@pucv.cl', image: 'https://picsum.photos/seed/sofia2/200/200' },
    ],
    careers: ['Derecho'],
    instagram: '@derechopucv'
  },
  {
    id: '5',
    name: 'Ciencias Económicas y Administrativas',
    shortName: 'FACEA',
    slug: 'facea',
    icon: '📊',
    representatives: [
      { name: 'Roberto Díaz', role: 'Presidente', email: 'roberto.diaz@pucv.cl', image: 'https://picsum.photos/seed/roberto/200/200' },
    ],
    careers: ['Ingeniería Comercial', 'Contador Auditor', 'Ingeniería de Ejecución en Administración de Negocios'],
    instagram: '@faceapucv'
  },
  {
    id: '6',
    name: 'Ingeniería',
    shortName: 'INGENIERÍA',
    slug: 'ingenieria',
    icon: '⚙️',
    representatives: [
      { name: 'Matías Prado', role: 'Presidente', email: 'matias.prado@pucv.cl', image: 'https://picsum.photos/seed/matias/200/200' },
      { name: 'Scarlet Contreras', role: 'Vicepresidenta', email: 'scarlet.c@pucv.cl', image: 'https://picsum.photos/seed/scarlet/200/200' },
      { name: 'José Morales', role: 'Secretario', email: 'jose.morales@pucv.cl', image: 'https://picsum.photos/seed/jose/200/200' },
    ],
    careers: ['Ing. Civil Informática', 'Ing. Civil Industrial', 'Ing. Civil Química', 'Ing. Civil Eléctrica', 'Ing. Civil Mecánica', 'Ing. Civil Bioquímica'],
    instagram: '@fingpucv'
  },
  {
    id: '7',
    name: 'Religión / Teología',
    shortName: 'RELIGIÓN',
    slug: 'religion',
    icon: '⛪',
    representatives: [
      { name: 'Gabriel Soto', role: 'Presidente', email: 'gabriel.soto@pucv.cl', image: 'https://picsum.photos/seed/gabriel/200/200' },
    ],
    careers: ['Teología', 'Ciencias Religiosas'],
  },
  {
    id: '8',
    name: 'Ciencias',
    shortName: 'CIENCIAS',
    slug: 'ciencias',
    icon: '🧪',
    representatives: [
      { name: 'Elena Paz', role: 'Presidenta', email: 'elena.paz@pucv.cl', image: 'https://picsum.photos/seed/elena/200/200' },
    ],
    careers: ['Biología', 'Química', 'Física', 'Matemáticas'],
  },
  {
    id: '9',
    name: 'Ciencias del Mar y Geografía',
    shortName: 'CS DEL MAR',
    slug: 'ciencias-del-mar',
    icon: '🌊',
    representatives: [
      { name: 'Hugo Marín', role: 'Presidente', email: 'hugo.m@pucv.cl', image: 'https://picsum.photos/seed/hugo/200/200' },
    ],
    careers: ['Oceanografía', 'Geografía', 'Ingeniería Pesquera'],
  },
];
