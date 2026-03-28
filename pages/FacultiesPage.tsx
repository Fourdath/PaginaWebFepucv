import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FACULTIES } from '../constants';

// Fotos por facultad (rotan cada 5 segundos)
const FACULTY_COVERS: Record<string, string[]> = {
  'fil-ed':       ['/img/facultades/Camila_Ojeda_Crisosto.jpeg', '/img/facultades/felipe_armijo.jpg'],
  'arquitectura': ['/img/facultades/Juan_Tuells_Araya.jpeg', '/img/facultades/Sofia_Alvarez_Bronfman.jpeg'],
  'derecho':      ['/img/facultades/benjamin_padilla.jpg', '/img/facultades/Sofia_Aguilera_Varas.jpeg'],
  'facea':        ['/img/facultades/ainhoa_mancilla.jpg'],
  'ingenieria':   ['/img/facultades/matias_prado.jpg', '/img/facultades/Scarlet_Contreras.jpeg', '/img/facultades/Jose.jpeg'],
  'ciencias':     ['/img/facultades/Ethan_Palma_Martinez.jpeg', '/img/facultades/Gesenia_Bravo_Guerrero.jpeg'],
};

// Posición de encuadre por foto — ajusta aquí si alguna cara no se ve bien
const COVER_POSITION: Record<string, string> = {
  '/img/facultades/Camila_Ojeda_Crisosto.jpeg':  'object-[20%]',
  '/img/facultades/felipe_armijo.jpg':            'object-[30%]',
  '/img/facultades/Juan_Tuells_Araya.jpeg':       'object-center',
  '/img/facultades/Sofia_Alvarez_Bronfman.jpeg':  'object-center',
  '/img/facultades/benjamin_padilla.jpg':         'object-center ',
  '/img/facultades/Sofia_Aguilera_Varas.jpeg':    'object-center ',
  '/img/facultades/ainhoa_mancilla.jpg':          'object-[30%]',
  '/img/facultades/matias_prado.jpg':             'object-center',
  '/img/facultades/Scarlet_Contreras.jpeg':       'object-cover',
  '/img/facultades/Jose.jpeg':                    'object-center',
  '/img/facultades/Ethan_Palma_Martinez.jpeg':    'object-top',
  '/img/facultades/Gesenia_Bravo_Guerrero.jpeg':  'object-center',
};

// Tarjeta individual con rotación de imágenes
const FacultyCard: React.FC<{ faculty: typeof FACULTIES[0] }> = ({ faculty }) => {
  const covers = FACULTY_COVERS[faculty.slug] ?? [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (covers.length <= 1) return;

    const interval = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setCurrentIndex(prev => (prev + 1) % covers.length);
        setFading(false);
      }, 400);
    }, 5000); // ← 5 segundos

    return () => clearInterval(interval);
  }, [covers.length]);

  const currentCover = covers[currentIndex];
  const position = COVER_POSITION[currentCover] ?? 'object-center';

  return (
    <Link
      to={`/facultades/${faculty.slug}`}
      className="group relative w-full block overflow-hidden rounded-fepucv border border-fepucv-border shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
    >
      {/* Imagen de portada */}
      <div className="relative h-56 overflow-hidden bg-fepucv-surface">
        {currentCover ? (
          <img
            key={currentCover}
            src={currentCover}
            alt={faculty.name}
            className={`w-full h-full object-cover group-hover:scale-110 ${position}`}
            style={{ opacity: fading ? 0 : 1, transition: 'opacity 0.4s ease, transform 0.5s ease' }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl bg-fepucv-surface">
            {faculty.icon}
          </div>
        )}

        {/* Overlay al hacer hover */}
        <div className="absolute inset-0 bg-fepucv-secondary/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <span className="text-white font-bold text-lg tracking-widest uppercase border-2 border-fepucv-primary px-6 py-2 rounded-full">
            Ver facultad →
          </span>
        </div>

        {/* Badge ícono */}
        <div className="absolute top-4 left-4 w-10 h-10 bg-white rounded-xl flex items-center justify-center text-xl shadow-md">
          {faculty.icon}
        </div>

        {/* Dots indicadores */}
        {covers.length > 1 && (
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
            {covers.map((_, i) => (
              <span
                key={i}
                className="w-1.5 h-1.5 rounded-full transition-all duration-300"
                style={{ background: i === currentIndex ? 'white' : 'rgba(255,255,255,0.4)' }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Contenido inferior */}
      <div className="bg-white p-6">
        <h3 className="font-bold text-fepucv-secondary text-lg uppercase tracking-wider mb-1">
          {faculty.shortName}
        </h3>
        <p className="text-fepucv-textSecondary text-sm mb-4 line-clamp-1">
          {faculty.name}
        </p>

        {/* Miniaturas representantes */}
        {faculty.representatives && faculty.representatives.length > 0 && (
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {faculty.representatives.slice(0, 3).map((rep, i) => (
                <img
                  key={i}
                  src={rep.image}
                  alt={rep.name}
                  className="w-8 h-8 rounded-full border-2 border-white object-cover object-top shadow-sm"
                />
              ))}
            </div>
            <span className="text-xs text-fepucv-textSecondary">
              {faculty.representatives.length === 1
                ? '1 representante'
                : `${faculty.representatives.length} representantes`}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
};

export const FacultiesPage: React.FC = () => {
  return (
    <div className="bg-white min-h-screen py-20">
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">

        {/* Encabezado */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-fepucv-secondary mb-4 tracking-tight">
            FACULTADES
          </h1>
          <div className="w-24 h-2 bg-fepucv-primary mx-auto rounded-full" />
          <p className="mt-8 text-fepucv-textSecondary text-lg max-w-2xl mx-auto">
            Nuestra federación se organiza territorialmente a través de sus facultades.
            Conoce a tus representantes y carreras.
          </p>
        </div>

        {/* Grid 3 columnas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {FACULTIES.map((faculty) => (
            <FacultyCard key={faculty.id} faculty={faculty} />
          ))}
        </div>

      </div>
    </div>
  );
};