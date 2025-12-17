
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Inicio', path: '/' },
    { name: 'Noticias', path: '/noticias' },
    { name: 'Servicios', path: '/servicios' },
    { name: 'Reglamentos', path: '/reglamentos' },
    { name: 'Transparencia', path: '/transparencia' },
    { name: 'Nosotros', path: '/quienes-somos' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-fepucv-border shadow-sm">
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-12 h-12 bg-fepucv-primary rounded-full flex items-center justify-center text-fepucv-secondary font-bold text-xl">
              F
            </div>
            <div>
              <span className="block text-xl font-bold text-fepucv-secondary leading-none">FEPUCV</span>
              <span className="text-[10px] text-fepucv-textSecondary uppercase tracking-widest font-semibold">Federación PUCV</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors ${
                  isActive(link.path) 
                    ? 'text-fepucv-secondary border-b-2 border-fepucv-secondary' 
                    : 'text-fepucv-textSecondary hover:text-fepucv-secondary'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/contacto"
              className="bg-fepucv-primary text-fepucv-secondary px-5 py-2.5 rounded-fepucv text-sm font-semibold hover:bg-fepucv-light transition-all shadow-md active:scale-95"
            >
              Contacto
            </Link>
          </nav>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-fepucv-surface transition-colors"
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

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-fepucv-border py-4 px-4 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsMenuOpen(false)}
              className={`block px-4 py-3 rounded-fepucv text-base font-medium ${
                isActive(link.path) ? 'bg-fepucv-surface text-fepucv-secondary' : 'text-fepucv-textSecondary'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <Link
            to="/contacto"
            onClick={() => setIsMenuOpen(false)}
            className="block w-full text-center bg-fepucv-primary text-fepucv-secondary py-3 rounded-fepucv font-semibold mt-4"
          >
            Contacto
          </Link>
        </div>
      )}
    </header>
  );
};
