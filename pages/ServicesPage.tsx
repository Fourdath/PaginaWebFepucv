
import React from 'react';
import { SERVICES } from '../constants';

export const ServicesPage: React.FC = () => {
  return (
    <div className="bg-fepucv-surface min-h-screen py-20">
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h1 className="text-4xl font-bold text-fepucv-primary mb-6">Servicios y Apoyo Estudiantil</h1>
          <p className="text-fepucv-textSecondary max-w-2xl mx-auto text-lg leading-relaxed">
            Explora todas las herramientas, beneficios y asesorías que la federación tiene a tu disposición para facilitar tu paso por la PUCV.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SERVICES.map((s) => (
            <div key={s.id} className="bg-white p-10 rounded-fepucv border border-fepucv-border shadow-sm hover:shadow-2xl transition-all flex flex-col items-start group">
              <div className="text-5xl mb-6 bg-fepucv-surface w-20 h-20 rounded-2xl flex items-center justify-center group-hover:bg-fepucv-primary transition-colors group-hover:scale-110 duration-300">
                {s.icon}
              </div>
              <h3 className="text-2xl font-bold text-fepucv-secondary mb-4">{s.title}</h3>
              <p className="text-fepucv-textSecondary mb-8 flex-grow leading-relaxed">
                {s.description}
              </p>
              <button className="w-full py-4 bg-fepucv-primary text-white rounded-fepucv font-bold hover:bg-fepucv-light transition-all shadow-md active:scale-95 flex items-center justify-center gap-2">
                {s.type === 'download' ? (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    Descargar Guía
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    Más Información
                  </>
                )}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-20 bg-fepucv-secondary rounded-fepucv p-12 text-white flex flex-col md:flex-row items-center gap-8 justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-4">¿No encuentras lo que buscas?</h2>
            <p className="text-gray-300">Contáctanos directamente y te ayudaremos a gestionar tu solicitud.</p>
          </div>
          <button className="whitespace-nowrap bg-fepucv-primary px-10 py-5 rounded-fepucv font-bold text-lg hover:bg-fepucv-light transition-all">
            Solicitar Ayuda Personalizada
          </button>
        </div>
      </div>
    </div>
  );
};
