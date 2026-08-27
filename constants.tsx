import React from 'react';
import { NewsItem, ExecutiveMember, ServiceItem, DocumentItem, FAQItem, Faculty } from './types';

export const CHARACTERS = [
  { id: 1, name: 'Francesca', role: 'Secretaria General', img: '/img/mesa/francesca_crisostomo.jpeg' },
  { id: 2, name: 'Krishna', role: 'Secretaria de Comunicaciones', img: '/img/mesa/krishna_marambio.jpeg' },
  { id: 3, name: 'Mirko Peña Perez', role: 'Vicepresidente', img: '/img/mesa/mirko_pena.jpeg' },
  { id: 4, name: 'Romina', role: 'Secretaria de Bienestar y Extensión', img: '/img/mesa/romina_farias.jpeg' },
  { id: 5, name: 'Sofia', role: 'Presidente', img: '/img/facultades/Sofia_venegas.jpeg' },
  { id: 6, name: 'Vincent', role: 'Secretaria de Finanzas', img: '/img/mesa/vincent_munos.jpeg' },
];


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
    name: 'Sofia Venegas',
    role: 'Presidente',
    major: 'presidencia.fepucv@gmail.com',
    image: '/img/mesa/sofia_venegas.jpeg',
    type: 'mesa'
  },
  {
    id: 'm2',
    name: 'Mirko Peña Perez',
    role: 'Vicepresidente',
    major: 'vicepresidencia.fepucv@gmail.com',
    image: '/img/mesa/mirko_pena.jpeg',
    type: 'mesa'
  },
  {
    id: 'm3',
    name: 'Francesca Crisóstomo',
    role: 'Secretaria General',
    major: 'secretariageneral.fepucv@gmail.com',
    image: '/img/mesa/francesca_crisostomo.jpeg',
    type: 'mesa'
  },
  {
    id: 'm4',
    name: 'Vincent Muñoz',
    role: 'Secretaria de Finanzas',
    major: 'fepucvfinanzas@gmail.com',
    image: '/img/mesa/vincent_munos.jpeg',
    type: 'mesa'
  },
  {
    id: 'm5',
    name: 'Romina Farías',
    role: 'Secretaria de Bienestar y Extensión',
    major: 'secretaria.bienestar.fepucv@gmail.com',
    image: '/img/mesa/romina_farias.jpeg',
    type: 'mesa'
  },
  {
    id: 'm6',
    name: 'Krishna Marambio',
    role: 'Secretaria de Comunicaciones',
    major: 'comunicaciones.fepucv@gmail.com',
    image: '/img/mesa/krishna_marambio.jpeg',
    type: 'mesa'
  },

  // CONSEJERÍA SUPERIOR
  {
    id: 's1',
    name: 'Vittore Tapia Larrañaga',
    role: 'Consejero Superior',
    major: 'Derecho',
    image: '/img/consejeria/Vitore.jpg',
    type: 'superior'
  },
  {
    id: 's2',
    name: 'Matías Cataldo Urbina',
    role: 'Consejero Superior',
    major: 'Pedagogía en Historia',
    image: '/img/consejeria/Matias_Cataldo_Urbina.jpeg',
    type: 'superior'
  },

  // CONSEJERÍAS DE FACULTAD
  {
    id: 'f1',
    name: 'Sofía Álvarez Brofman',
    role: 'Consejera Facultad de Arquitectura y Urbanismo',
    major: 'Licenciatura en Arte',
    image: '/img/facultades/Sofia_Alvarez_Bronfman.jpeg',
    type: 'facultad'
  },
  {
    id: 'f4',
    name: 'Ethan Palma Martines',
    role: 'Consejero Facultad de Ciencias',
    major: 'Licenciatura en Matemática',
    image: '/img/facultades/Ethan_Palma_Martinez.jpeg',
    type: 'facultad'
  },
  {
    id: 'f7',
    name: 'Ainhoa Mancilla',
    role: 'Consejera Facultad FACEA',
    major: 'Trabajo Social',
    image: '/img/facultades/ainhoa_mancilla.jpg',
    type: 'facultad'
  },
  {
    id: 'f8',
    name: 'Antonia Andrade',
    role: 'Consejera Facultad FACEA',
    major: 'Trabajo Social',
    image: '',
    type: 'facultad'
  },

  {
    id: 'f10',
    name: 'Benjamin Padilla Estadella',
    role: 'Consejero Facultad de Derecho',
    major: 'Derecho',
    image: '/img/facultades/benjamin_padilla.jpg',
    type: 'facultad'
  },
  {
    id: 'f11',
    name: 'Sofía Aguilera Varas',
    role: 'Consejera Facultad de Derecho',
    major: 'Derecho',
    image: '/img/facultades/Sofia_Aguilera_Varas.jpeg',
    type: 'facultad'
  },
  {
    id: 'f12',
    name: 'Camila Ojeda Crisisto',
    role: 'Consejera Facultad de Filosofía y Educación',
    major: 'Pedagogía en Historia, Geografía y Ciencias Sociales',
    image: '/img/facultades/Camila_Ojeda_Crisosto.jpeg',
    type: 'facultad'
  },
  {
    id: 'f13',
    name: 'Felipe Armijo',
    role: 'Consejero Facultad de Filosofía y Educación',
    major: 'Pedagogía en Educación Física',
    image: '/img/facultades/felipe_armijo.jpg',
    type: 'facultad'
  },
  {
    id: 'f14',
    name: 'José Morales Delgado',
    role: 'Consejero Facultad de Ingeniería',
    major: 'Ingeniería Civil Metalúrgica',
    image: '/img/facultades/Jose.jpeg',
    type: 'facultad'
  },
  {
    id: 'f15',
    name: 'Matías Prado Escobar',
    role: 'Consejero Facultad de Ingeniería',
    major: 'Ingeniería Civil en Ciencia de Datos',
    image: '/img/facultades/matias_prado.jpg',
    type: 'facultad'
  },
  {
    id: 'f16',
    name: 'Scarlet Contreras',
    role: 'Consejera Facultad de Ingeniería',
    major: 'Ingeniería Civil Bioquímica',
    image: '/img/facultades/Scarlet_Contreras.jpeg',
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
    name: 'Facultad de Filosofía y Educación',
    shortName: 'FILED',
    slug: 'filed',
    icon: '📚',
    representatives: [
      {
        name: 'Camila Ojeda Crisisto',
        role: 'Representante',
        email: 'camila.ojeda.c@mail.pucv.cl',
        image: '/img/facultades/Camila_Ojeda_Crisosto.jpeg'
      },
      {
        name: 'Felipe Armijo',
        role: 'Representante',
        email: 'felipeandresarmijotorres@gmail.com',
        image: '/img/facultades/felipe_armijo.jpg'
      },
    ],
    careers: [
      'Educación Parvularia (EPA)',
      'Educación Básica (EBA)',
      'Educación Especial (EDE)',
      'Educación Física',
      'Psicología',
      'Pedagogía en Filosofía',
      'Licenciatura en Filosofía',
      'Pedagogía en Historia, Geografía y Ciencias Sociales',
      'Licenciatura en Historia',
      'Pedagogía en Inglés',
      'Interpretación Inglés-Español',
      'Pedagogía en Castellano y Comunicación',
      'Licenciatura en Lingüísticas y Literatura',
      'Pedagogía en Música',
      'Licenciatura en Cs. y Arte Musicales - Mención y Composición',
      'Interpretación Musical mención en Instrumento Principal'
    ],
    instagram: '@filedpucv'
  },
  {
    id: '3',
    name: 'Facultad de Arquitectura y Urbanismo',
    shortName: 'FAU',
    slug: 'fau',
    icon: '📐',
    representatives: [
      {
        name: 'Sofía Álvarez Brofman',
        role: 'Representante',
        email: 'maria.alvarez.b@mail.pucv.cl',
        image: '/img/facultades/Sofia_Alvarez_Bronfman.jpeg'
      },
    ],
    careers: ['Arquitectura', 'Diseño', 'Licenciatura en Arte'],
    instagram: '@pucvconsejeria.fau'
  },
  {
    id: '4',
    name: 'Facultad de Derecho',
    shortName: 'DERECHO',
    slug: 'derecho',
    icon: '⚖️',
    representatives: [
      {
        name: 'Benjamin Padilla Estadella',
        role: 'Representante',
        email: 'benjamin.padilla.e@mail.pucv.cl',
        image: '/img/facultades/benjamin_padilla.jpg'
      },
      {
        name: 'Sofía Aguilera Varas',
        role: 'Representante',
        email: 'sofia.aguilera.v@mmail.pucv.cl',
        image: '/img/facultades/Sofia_Aguilera_Varas.jpeg'
      },
    ],
    careers: ['Derecho'],
    instagram: '@cfacultadderechopucv'
  },
  {
    id: '5',
    name: 'Facultad de Ciencias Económicas y Administrativas',
    shortName: 'FACEA',
    slug: 'facea',
    icon: '📊',
    representatives: [
      {
        name: 'Ainhoa Mancilla',
        role: 'Representante',
        email: 'Ainhoa.mancilla.d@mail.pucv.cl',
        image: '/img/facultades/ainhoa_mancilla.jpg'
      },
      {
        name: 'Antonia Andrade',
        role: 'Representante',
        email: 'antonia.andrade.r@mail.pucv.cl',
        image: '/img/facultades/'
      },
      

    ],
    careers: [
      'Contador Auditor',
      'Ingeniería Comercial',
      'Ingeniería en Administración de Negocios',
      'Trabajo Social',
      'Periodismo'
    ],
    instagram: '@faceapucv'
  },
  {
    id: '6',
    name: 'Facultad de Ingeniería',
    shortName: 'FIN',
    slug: 'ingenieria',
    icon: '⚙️',
    representatives: [
      {
        name: 'José Morales Delgado',
        role: 'Representante',
        email: 'jose.morales.d@mail.pucv.cl',
        image: '/img/facultades/Jose.jpeg'
      },
      {
        name: 'Matías Prado Escobar',
        role: 'Representante',
        email: 'matias.prado.e@mail.pucv.cl',
        image: '/img/facultades/matias_prado.jpg'
      },
      {
        name: 'Scarlet Contreras',
        role: 'Representante',
        email: 'scarlet.contreras.m@mail.pucv.cl',
        image: '/img/facultades/Scarlet_Contreras.jpeg'
      },
    ],
    careers: [
      'Ingeniería Civil',
      'Ingeniería Civil Bioquímica',
      'Ingeniería en Bioprocesos - Plan Complementario',
      'Ingeniería Civil Eléctrica',
      'Ingeniería Civil Electrónica',
      'Ingeniería Eléctrica',
      'Ingeniería Electrónica',
      'Ingeniería Civil en Telecomunicaciones',
      'Ingeniería Civil Informática',
      'Ingeniería en Informática',
      'Ingeniería Civil en Ciencias de Datos',
      'Ingeniería en Construcción',
      'Ingeniería Civil en Construcción',
      'Ingeniería Civil en Transporte',
      'Ingeniería Civil Industrial',
      'Ingeniería Civil Mecánica',
      'Ingeniería Mecánica',
      'Ingeniería Civil Mecánica VESPERTINA',
      'Ingeniería Civil Química',
      'Ingeniería Civil Metalúrgica',
      'Ingeniería Civil de Minas',
      'Bachillerato en Ingeniería'
    ],
    instagram: '@consejeriafin_pucv'
  },
  {
    id: '8',
    name: 'Facultad de Ciencias',
    shortName: 'CIENCIAS',
    slug: 'ciencias',
    icon: '🧪',
    representatives: [
      {
        name: 'Ethan Palma Martines',
        role: 'Representante',
        email: 'ethan.palma.m@mail.pucv.cl',
        image: '/img/facultades/Ethan_Palma_Martinez.jpeg'
      },
    ],
    careers: [
      'Kinesiología',
      'Bachillerato en Ciencias',
      'Tecnología Médica',
      'Pedagogía en Biología y Ciencias Naturales',
      'Licenciatura en Biología',
      'Licenciatura en estadística',
      'Ingeniería Estadística',
      'Licenciatura en Física / mención astronomía',
      'Pedagogía en Física y Ciencias Naturales',
      'Pedagogía en Matemática',
      'Licenciatura en Matemáticas',
      'Bioquímica',
      'Pedagogía en Química y Ciencias Naturales',
      'Química Industrial',
      'Química y Farmacia'
    ],
    instagram: '@consejeria_ciencias_pucv'
  },
];
