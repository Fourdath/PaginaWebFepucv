import React, { useEffect, useState } from 'react';
import { GameMenu } from '../src/minijuegos/futbol-fepucv/GameMenu';

const PHONE_QUERY = '(max-width: 767px), (pointer: coarse) and (max-height: 540px)';
export const MinijuegosPage: React.FC = () => {
  const [phone, setPhone] = useState(() => window.matchMedia(PHONE_QUERY).matches);
  useEffect(() => {
    const media = window.matchMedia(PHONE_QUERY);
    const update = () => setPhone(media.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  return <div className="cup-page"><div className="cup-page-inner">{phone ? <section className="cup cup-phone-notice">
    <span className="cup-eyebrow">COPA FEPUCV · ARCADE CLUB</span>
    <svg viewBox="0 0 80 65" aria-hidden="true"><rect x="6" y="4" width="68" height="44" rx="5" fill="none" stroke="currentColor" strokeWidth="3"/><path d="M29 60h22M40 48v12M24 26l10 8 21-19" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
    <h1>Nos vemos en el computador.</h1>
    <p>Este minijuego no es compatible con teléfonos. Ábrelo desde un computador para jugar.</p>
    <span className="cup-phone-detail">Necesitas teclado: flechas para moverte y espacio para patear.</span>
    <a href="/" className="cup-button secondary">Volver al inicio</a>
  </section> : <GameMenu/>}</div></div>;
};
