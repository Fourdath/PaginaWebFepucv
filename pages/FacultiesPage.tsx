
import React from 'react';
import { Link } from 'react-router-dom';
import { FACULTIES } from '../constants';

export const FacultiesPage: React.FC = () => {
  return (
    <div className="bg-white min-h-screen py-20">
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-fepucv-secondary mb-4 tracking-tight">FACULTADES</h1>
          <div className="w-24 h-2 bg-fepucv-primary mx-auto rounded-full"></div>
          <p className="mt-8 text-fepucv-textSecondary text-lg max-w-2xl mx-auto">
            Nuestra federación se organiza territorialmente a través de sus facultades. Conoce a tus representantes y carreras.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {FACULTIES.map((faculty) => (
            <div key={faculty.id} className="group relative flex flex-col items-center bg-fepucv-surface rounded-fepucv border border-fepucv-border p-8 hover:shadow-2xl transition-all hover:-translate-y-2">
              <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center text-4xl mb-6 shadow-sm group-hover:bg-fepucv-primary group-hover:scale-110 transition-all">
                {faculty.icon}
              </div>
              <h3 className="font-bold text-fepucv-secondary text-center mb-2 leading-tight uppercase tracking-wider">
                {faculty.shortName}
              </h3>
              <p className="text-[10px] text-fepucv-textSecondary text-center mb-6 line-clamp-1">
                {faculty.name}
              </p>
              <Link 
                to={`/facultades/${faculty.slug}`}
                className="mt-auto px-6 py-2 bg-white text-fepucv-secondary border-2 border-fepucv-primary rounded-full text-xs font-bold hover:bg-fepucv-primary transition-all uppercase"
              >
                VER
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
