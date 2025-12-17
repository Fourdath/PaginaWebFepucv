
import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-fepucv-secondary text-white pt-16 pb-8">
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Logo & Desc */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-fepucv-secondary font-bold text-lg">
                F
              </div>
              <span className="text-xl font-bold tracking-tight">FEPUCV</span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Federación de Estudiantes de la Pontificia Universidad Católica de Valparaíso. Representando y construyendo comunidad desde 19xx.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-bold text-lg mb-6">Explorar</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><Link to="/noticias" className="hover:text-fepucv-light transition-colors">Noticias</Link></li>
              <li><Link to="/servicios" className="hover:text-fepucv-light transition-colors">Servicios</Link></li>
              <li><Link to="/reglamentos" className="hover:text-fepucv-light transition-colors">Reglamentos</Link></li>
              <li><Link to="/transparencia" className="hover:text-fepucv-light transition-colors">Transparencia</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-bold text-lg mb-6">Ayuda</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><Link to="/faq" className="hover:text-fepucv-light transition-colors">FAQ</Link></li>
              <li><Link to="/contacto" className="hover:text-fepucv-light transition-colors">Contacto</Link></li>
              <li><Link to="/admin" className="hover:text-fepucv-light transition-colors">Portal Editores</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-lg mb-6">Contacto</h4>
            <div className="space-y-4 text-sm text-gray-400">
              <p className="flex items-start gap-3">
                <span className="text-fepucv-light text-lg">📍</span>
                Av. Brasil 2950, Valparaíso, Chile
              </p>
              <p className="flex items-start gap-3">
                <span className="text-fepucv-light text-lg">✉️</span>
                contacto@fepucv.cl
              </p>
              <div className="flex gap-4 pt-4">
                <a href="#" className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center hover:bg-fepucv-light transition-all">IG</a>
                <a href="#" className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center hover:bg-fepucv-light transition-all">FB</a>
                <a href="#" className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center hover:bg-fepucv-light transition-all">X</a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Federación de Estudiantes PUCV. Todos los derechos reservados.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white">Privacidad</a>
            <a href="#" className="hover:text-white">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
