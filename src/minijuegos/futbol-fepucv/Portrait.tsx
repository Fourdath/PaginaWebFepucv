import React from 'react';
import type { Character } from './types';
export function Portrait({ character, className = '', cutout = true }: { character: Character; className?: string; cutout?: boolean }) {
  const index = character.id - 1;
  return <span role="img" aria-label={`Caricatura de ${character.name}`} className={`cup-portrait ${cutout ? 'cup-head-cutout' : ''} ${className}`} style={{ backgroundImage: `url(/img/minijuego/${cutout ? 'cabezas' : 'plantel'}-${index < 3 ? 'a' : 'b'}.png)`, backgroundPosition: `${(index % 3) * 50}% center` }} />;
}
