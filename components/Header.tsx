import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Inicio', path: '/' },
    { name: 'Transparencia', path: '/transparencia' },
    { name: 'Elecciones', path: '/elecciones' },
    { name: 'Documentos', path: '/reglamentos' },
    { name: 'Noticias', path: '/noticias' },
    { name: 'Facultades', path: '/facultades' },
    { name: 'Consejería Superior', path: '/consejeria-superior' },
    { name: 'Minijuegos', path: '/minijuegos' },
  ];

  const isActive = (path: string) => location.pathname === path || (path !== '/' && location.pathname.startsWith(`${path}/`));

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-fepucv-border shadow-sm">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center gap-3 shrink-0 xl:mr-6">
            <div className="w-14 h-14 rounded-full overflow-hidden bg-white shadow-inner flex items-center justify-center text-fepucv-secondary font-bold text-lg">
              <img
                src="/img/logo/logo.jpg"
                alt="Logo FEPUCV"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <span className="block text-xl font-bold text-fepucv-secondary leading-none tracking-tight">FEPUCV</span>
              <span className="text-[10px] text-fepucv-textSecondary uppercase tracking-widest font-semibold whitespace-nowrap">Federación PUCV</span>
            </div>
          </Link>

          <nav aria-label="Navegación principal" className="hidden xl:flex items-center gap-3 2xl:gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                aria-current={isActive(link.path) ? 'page' : undefined}
                className={`text-xs font-bold uppercase tracking-wider transition-colors ${
                  isActive(link.path)
                    ? 'text-fepucv-secondary border-b-2 border-fepucv-primary pb-1'
                    : 'text-fepucv-textSecondary hover:text-fepucv-secondary'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/contacto"
              aria-current={isActive('/contacto') ? 'page' : undefined}
              className="bg-fepucv-primary text-fepucv-secondary px-5 py-2.5 rounded-fepucv text-xs font-bold uppercase tracking-widest hover:bg-fepucv-light transition-all shadow-md active:scale-95"
            >
              Contacto
            </Link>
          </nav>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            type="button"
            aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
            className="xl:hidden p-2 rounded-lg hover:bg-fepucv-surface transition-colors"
          >
            <svg className="w-6 h-6 text-fepucv-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <nav id="mobile-navigation" aria-label="Navegación móvil" className="xl:hidden bg-white border-b border-fepucv-border py-4 px-4 space-y-2 max-h-[calc(100dvh-5rem)] overflow-y-auto">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              aria-current={isActive(link.path) ? 'page' : undefined}
              onClick={() => setIsMenuOpen(false)}
              className={`block px-4 py-3 rounded-fepucv text-sm font-bold uppercase tracking-wider ${
                isActive(link.path) ? 'bg-fepucv-surface text-fepucv-secondary' : 'text-fepucv-textSecondary'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <Link
            to="/contacto"
            aria-current={isActive('/contacto') ? 'page' : undefined}
            onClick={() => setIsMenuOpen(false)}
            className="block w-full text-center bg-fepucv-primary text-fepucv-secondary py-3 rounded-fepucv font-bold uppercase tracking-widest mt-4"
          >
            Contacto
          </Link>
        </nav>
      )}
    </header>
  );
};
