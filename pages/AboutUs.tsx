
import React from 'react';
import { EXECUTIVE_BOARD } from '../constants';

export const AboutUs: React.FC = () => {
  return (
    <div className="bg-white min-h-screen">
      {/* Vision/Mission */}
      <section className="py-20 bg-fepucv-surface">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-fepucv-primary mb-8">Nuestra Historia y Misión</h1>
              <p className="text-lg text-fepucv-textSecondary mb-6 leading-loose">
                La Federación de Estudiantes de la PUCV es el organismo máximo de representación estudiantil en nuestra universidad. 
                Nacida bajo el alero de las movilizaciones históricas, nuestra federación busca ser el puente entre los anhelos de los estudiantes y la institucionalidad.
              </p>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-fepucv-primary/10 rounded-xl flex items-center justify-center text-2xl shrink-0">🎯</div>
                  <div>
                    <h3 className="font-bold text-fepucv-secondary mb-1">Misión</h3>
                    <p className="text-sm text-fepucv-textSecondary">Defender los derechos estudiantiles y fomentar una formación crítica, humana y comprometida socialmente.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-fepucv-primary/10 rounded-xl flex items-center justify-center text-2xl shrink-0">🔭</div>
                  <div>
                    <h3 className="font-bold text-fepucv-secondary mb-1">Visión</h3>
                    <p className="text-sm text-fepucv-textSecondary">Ser un referente nacional de organización estudiantil democrática y vanguardista.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-fepucv overflow-hidden shadow-2xl">
              <img src="https://picsum.photos/seed/pucv-history/800/800" alt="PUCV History" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Organizational Structure */}
      <section className="py-20">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 text-center mb-20">
          <h2 className="text-3xl font-bold text-fepucv-secondary mb-6">Estructura Organizacional</h2>
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-white border border-fepucv-border rounded-fepucv">
              <h3 className="font-bold text-fepucv-primary mb-3">Plenaria</h3>
              <p className="text-xs text-fepucv-textSecondary">Máximo órgano resolutivo, compuesto por los presidentes de cada Centro de Estudiantes.</p>
            </div>
            <div className="p-8 bg-fepucv-primary text-white rounded-fepucv shadow-xl scale-105">
              <h3 className="font-bold mb-3">Mesa Ejecutiva</h3>
              <p className="text-xs text-white/80">Encargada de la gestión política y administrativa diaria de la federación.</p>
            </div>
            <div className="p-8 bg-white border border-fepucv-border rounded-fepucv">
              <h3 className="font-bold text-fepucv-primary mb-3">Consejería Superior</h3>
              <p className="text-xs text-fepucv-textSecondary">Representante estudiantil ante el Consejo Superior de la Universidad.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Board Full Grid */}
      <section className="py-20 bg-fepucv-surface">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center">
          <h2 className="text-3xl font-bold text-fepucv-primary mb-4">Integrantes Mesa Ejecutiva</h2>
        </div>
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {EXECUTIVE_BOARD.map(m => (
              <div key={m.id} className="text-center">
                <div className="w-40 h-40 mx-auto rounded-full overflow-hidden border-4 border-white shadow-lg mb-6">
                  <img src={m.image} alt={m.name} className="w-full h-full object-cover" />
                </div>
                <h3 className="font-bold text-fepucv-secondary">{m.name}</h3>
                <p className="text-xs text-fepucv-primary font-bold uppercase tracking-widest">{m.role}</p>
                <p className="text-[10px] text-fepucv-textSecondary mt-1">{m.major}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
