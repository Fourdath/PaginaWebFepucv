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
  {
    id: 'm1',
    name: 'Valeria Aguilera',
    role: 'Presidente',
    major: 'presidencia.fepucv@gmail.com',
    image: '/img/mesa/valeria_aguilera.jpg',
    type: 'mesa'
  },
  {
    id: 'm2',
    name: 'Mirko Peña',
    role: 'Vicepresidente',
    major: 'vicepresidencia.fepucv@gmail.com',
    image: '/img/mesa/mirko_pena.jpg',
    type: 'mesa'
  },
  {
    id: 'm3',
    name: 'Francesca Crisóstomo',
    role: 'Secretaria General',
    major: 'secretariageneral.fepucv@gmail.com',
    image: '/img/mesa/francesca_crisostomo.jpg',
    type: 'mesa'
  },
  {
    id: 'm4',
    name: 'Vincent Muñoz',
    role: 'Secretaria de Finanzas',
    major: 'fepucvfinanzas@gmail.com',
    image: '/img/mesa/vincent_munos.JPG',
    type: 'mesa'
  },
  {
    id: 'm5',
    name: 'Romina Farías',
    role: 'Secretaria de Bienestar y Extensión',
    major: 'secretaria.bienestar.fepucv@gmail.com',
    image: '/img/mesa/romina_farias.jpg',
    type: 'mesa'
  },
  {
    id: 'm6',
    name: 'Krishna Marambio',
    role: 'Secretaria de Comunicaciones',
    major: 'comunicaciones.fepucv@gmail.com',
    image: '/img/mesa/krishna_marambio.jpg',
    type: 'mesa'
  },

  // CONSEJERÍA SUPERIOR
  {
    id: 's1',
    name: 'Vittore Tapia Larrañaga',
    role: 'Consejera Superior',
    major: 'Derecho',
    image: 'https://picsum.photos/seed/cs1/400/500',
    type: 'superior'
  },
  {
    id: 's2',
    name: 'Matías Cataldo Urbina',
    role: 'Consejero Superior',
    major: 'Pedagogía en Historia',
    image: 'https://picsum.photos/seed/cs2/400/500',
    type: 'superior'
  },

  // CONSEJERÍAS DE FACULTAD
// CONSEJERÍAS DE FACULTAD
{
  id: 'f1',
  name: 'Matías Prado',
  role: 'Consejero Facultad Ingeniería',
  major: 'Ingeniería Civil en Ciencias de Datos',
  image: '/img/facultades/matias_prado.jpg',
  type: 'facultad'
},
{
  id: 'f2',
  name: 'Benjamín Padilla',
  role: 'Consejero Facultad Derecho',
  major: 'Derecho',
  image: '/img/facultades/benjamin_padilla.jpg',
  type: 'facultad'
},
{
  id: 'f3',
  name: 'Ainhoa Mancilla',
  role: 'Consejera Facultad FACEA',
  major: 'Trabajo Social',
  image: '/img/facultades/ainhoa_mancilla.jpg',
  type: 'facultad'
},
{
  id: 'f4',
  name: 'Camila Ojeda Crisosto',
  role: 'Consejera Facultad Filosofía y Educación',
  major: 'Pedagogía en Historia, Geografía y Ciencias Sociales',
  image: 'https://picsum.photos/seed/cf5/400/500',
  type: 'facultad'
},
{
  id: 'f5',
  name: 'Scarlet Contreras',
  role: 'Consejera Facultad Ingeniería',
  major: 'Ingeniería Civil Bioquímica',
  image: 'https://picsum.photos/seed/cf6/400/500',
  type: 'facultad'
},
{
  id: 'f6',
  name: 'Felipe Armijo',
  role: 'Consejero Facultad Filosofía y Educación',
  major: 'Pedagogía en Educación Física',
  image: 'https://picsum.photos/seed/cf7/400/500',
  type: 'facultad'
},
{
  id: 'f7',
  name: 'Juan Luis Tuells Araya',
  role: 'Consejero Facultad Arquitectura y Diseño',
  major: 'Arquitectura y Diseño',
  image: 'https://picsum.photos/seed/juan-luis-tuells/400/500',
  type: 'facultad'
},
{
  id: 'f8',
  name: 'Sofía Álvarez Bronfman',
  role: 'Consejera Facultad Arquitectura y Diseño',
  major: 'Arquitectura y Diseño',
  image: 'https://picsum.photos/seed/sofia-alvarez-bronfman/400/500',
  type: 'facultad'
},
{
  id: 'f9',
  name: 'Ethan Palma Martinez',
  role: 'Consejero Facultad Ciencias',
  major: 'Ciencias',
  image: 'https://picsum.photos/seed/ethan-palma-martinez/400/500',
  type: 'facultad'
},
{
  id: 'f10',
  name: 'Gesenia Bravo Guerrero',
  role: 'Consejera Facultad Ciencias',
  major: 'Ciencias',
  image: 'https://picsum.photos/seed/gesenia-bravo-guerrero/400/500',
  type: 'facultad'
},
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
      {
        name: 'Camila Ojeda Crisosto',
        role: 'Representante',
        email: 'pendiente@pucv.cl',
        image: '\img\facultades\Camila_Ojeda_Crisosto.jpeg'
      },
      {
        name: 'Felipe Armijo',
        role: 'Representante',
        email: 'pendiente@pucv.cl',
        image: 'https://picsum.photos/seed/felipe-armijo/200/200'
      },
    ],
    careers: [
      'Pedagogía en Historia, Geografía y Ciencias Sociales',
      'Pedagogía en Educación Física'
    ],
    instagram: '@fepucv_filed'
  },
  {
    id: '3',
    name: 'Arquitectura y Diseño',
    shortName: 'ARQUITECTURA',
    slug: 'arquitectura',
    icon: '📐',
    representatives: [
      {
        name: 'Juan Luis Tuells Araya',
        role: 'Representante',
        email: 'pendiente@pucv.cl',
        image: 'https://picsum.photos/seed/juan-luis-tuells/200/200'
      },
      {
        name: 'Sofía Álvarez Bronfman',
        role: 'Representante',
        email: 'pendiente@pucv.cl',
        image: 'https://picsum.photos/seed/sofia-alvarez-bronfman/200/200'
      },
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
      {
        name: 'Sofía Aguilera Varas',
        role: 'Representante',
        email: 'pendiente@pucv.cl',
        image: 'https://picsum.photos/seed/sofia-aguilera-varas/200/200'
      },
      {
      name: 'Benjamín Padilla',
      role: 'Representante',
      email: 'pendiente@pucv.cl',
      image: '/img/facultades/benjamin_padilla.jpg'
    },
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
      {
        name: 'Ainhoa Mancilla',
        role: 'Representante',
        email: 'pendiente@pucv.cl',
        image: '/img/facultades/ainhoa_mancilla.jpg'
      },

    ],
    careers: [
      'Trabajo Social',
      'Periodismo',
      'Ingeniería Comercial',
      'Contador Auditor',
      'Ingeniería de Ejecución en Administración de Negocios'
    ],
    instagram: '@faceapucv'
  },
  {
    id: '6',
    name: 'Ingeniería',
    shortName: 'INGENIERÍA',
    slug: 'ingenieria',
    icon: '⚙️',
    representatives: [
      {
        name: 'Matías Prado',
        role: 'Presidente',
        email: 'matias.prado@pucv.cl',
        image: '/img/facultades/matias_prado.jpg'
      },
      {
        name: 'Scarlet Contreras',
        role: 'Vicepresidenta',
        email: 'scarlet.c@pucv.cl',
        image: 'https://picsum.photos/seed/scarlet/200/200'
      },
      {
        name: 'José Antonio Morales',
        role: 'Secretario',
        email: 'jose.morales@pucv.cl',
        image: 'https://picsum.photos/seed/jose/200/200'
      },
    ],
    careers: [
      'Ingeniería Civil en Ciencias de Datos',
      'Ingeniería Civil Metalúrgica',
      'Ingeniería Civil Bioquímica',
      'Ing. Civil Informática',
      'Ing. Civil Industrial',
      'Ing. Civil Química',
      'Ing. Civil Eléctrica',
      'Ing. Civil Mecánica'
    ],
    instagram: '@fingpucv'
  },
  {
    id: '8',
    name: 'Ciencias',
    shortName: 'CIENCIAS',
    slug: 'ciencias',
    icon: '🧪',
    representatives: [
      {
        name: 'Ethan Palma Martinez',
        role: 'Representante',
        email: 'pendiente@pucv.cl',
        image: 'https://picsum.photos/seed/ethan-palma-martinez/200/200'
      },
      {
        name: 'Gesenia Bravo Guerrero',
        role: 'Representante',
        email: 'pendiente@pucv.cl',
        image: 'https://picsum.photos/seed/gesenia-bravo-guerrero/200/200'
      },
    ],
    careers: ['Química Industrial', 'Biología', 'Química', 'Física', 'Matemáticas'],
  },
];