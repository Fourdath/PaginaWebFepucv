
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { FACULTIES } from '../constants';

export const FacultyDetail: React.FC = () => {
  const { slug } = useParams();
  const faculty = FACULTIES.find(f => f.slug === slug);

  if (!faculty) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-2xl font-bold">Facultad no encontrada</h2>
        <Link to="/facultades" className="text-fepucv-primary hover:underline mt-4 inline-block">Volver a facultades</Link>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen py-16">
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-12 flex items-center gap-2 text-sm font-bold">
          <Link to="/facultades" className="text-fepucv-textSecondary hover:text-fepucv-primary">FACULTADES</Link>
          <span className="text-fepucv-border">/</span>
          <span className="text-fepucv-primary uppercase">{faculty.name}</span>
        </nav>

        {/* Title */}
        <div className="flex items-center gap-6 mb-16">
          <div className="text-6xl">{faculty.icon}</div>
          <h1 className="text-3xl md:text-5xl font-bold text-fepucv-secondary uppercase tracking-tight">
            FACULTAD DE <span className="text-fepucv-secondary/60">{faculty.name}</span>
          </h1>
        </div>

        {/* Representatives Section */}
        <div className="mb-20">
          <h2 className="text-xl font-bold text-fepucv-secondary mb-8 uppercase tracking-widest border-b-2 border-fepucv-primary inline-block pb-2">
            Mesa de Facultad
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {faculty.representatives.map((rep, idx) => (
              <div key={idx} className="bg-fepucv-surface rounded-fepucv p-6 border border-fepucv-border flex items-center gap-6 group hover:shadow-lg transition-all">
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white shadow-md">
                  <img src={rep.image} alt={rep.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="font-bold text-fepucv-secondary uppercase text-sm">{rep.name}</h3>
                  <p className="text-[10px] text-fepucv-primary font-bold uppercase mb-2">{rep.role}</p>
                  <a href={`mailto:${rep.email}`} className="text-xs text-fepucv-textSecondary hover:text-fepucv-primary flex items-center gap-1">
                    <span className="text-lg">✉️</span> {rep.email}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Careers Section */}
        <div className="mb-20">
          <h2 className="text-xl font-bold text-fepucv-secondary mb-8 uppercase tracking-widest border-b-2 border-fepucv-primary inline-block pb-2">
            Carreras
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {faculty.careers.map((career, idx) => (
              <div key={idx} className="flex items-center gap-3 p-4 bg-white border border-fepucv-border rounded-fepucv hover:bg-fepucv-primary/10 transition-colors">
                <div className="w-2 h-2 bg-fepucv-primary rounded-full"></div>
                <span className="text-sm font-medium text-fepucv-secondary">{career}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Banner */}
        <div className="mt-20 pt-12 border-t border-fepucv-border flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-4">
            <span className="text-xl font-bold text-fepucv-secondary uppercase">CONTACTO:</span>
            {faculty.instagram && (
              <a 
                href={`https://instagram.com/${faculty.instagram.replace('@', '')}`} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-2 bg-fepucv-surface px-4 py-2 rounded-full font-bold text-fepucv-secondary hover:bg-fepucv-primary transition-all text-sm"
              >
                📸 {faculty.instagram}
              </a>
            )}
          </div>
          <Link 
            to="/contacto" 
            className="bg-fepucv-secondary text-white px-8 py-4 rounded-fepucv font-bold hover:bg-fepucv-secondary/90 transition-all shadow-xl uppercase text-sm tracking-widest"
          >
            Escríbenos directamente
          </Link>
        </div>
      </div>
    </div>
  );
};
