import React from 'react';
import { GameMenu } from '../src/minijuegos/futbol-fepucv/GameMenu';

export const MinijuegosPage: React.FC = () => {
  return (
    <div className="bg-white min-h-screen py-20">
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-2xl font-bold text-fepucv-primary uppercase tracking-widest mb-2">
            Minijuegos
          </h2>
          <h1 className="text-4xl md:text-5xl font-bold text-fepucv-secondary mb-4">
            Fútbol FEPUCV
          </h1>
          <div className="w-24 h-1.5 bg-fepucv-primary mx-auto rounded-full mb-8"></div>
          <p className="mx-auto max-w-3xl text-lg text-fepucv-textSecondary leading-relaxed">
            Un espacio recreativo integrado al sitio para jugar una pichanga rápida con la mesa
            FEPUCV, manteniendo la misma estética general del portal.
          </p>
        </div>

        <GameMenu />
      </div>
    </div>
  );
};
