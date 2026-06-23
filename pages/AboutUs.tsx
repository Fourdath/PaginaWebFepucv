import React from 'react';

export const AboutUs: React.FC = () => {
  return (
    <div className="bg-fepucv-surface min-h-screen">
      <section className="py-24">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mx-auto max-w-3xl bg-white border border-fepucv-border rounded-fepucv px-8 py-16 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-widest text-fepucv-primary mb-4">
              Nosotros
            </p>
            <h1 className="text-3xl md:text-5xl font-bold text-fepucv-secondary mb-6">
              Estamos trabajando en actualizaciones
            </h1>
            <p className="text-lg text-fepucv-textSecondary leading-relaxed">
              Pronto publicaremos nueva informacion en esta seccion.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
