
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
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-fepucv-secondary font-bold text-lg shadow-inner">
                F
              </div>
              <span className="text-xl font-bold tracking-tight">FEPUCV</span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Federación de Estudiantes de la Pontificia Universidad Católica de Valparaíso. Representando y construyendo comunidad estudiantil.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-bold text-lg mb-6 border-b border-fepucv-primary/30 pb-2 inline-block text-white">Explorar</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><Link to="/facultades" className="hover:text-fepucv-primary transition-colors">Facultades</Link></li>
              <li><Link to="/noticias" className="hover:text-fepucv-primary transition-colors">Noticias</Link></li>
              <li><Link to="/servicios" className="hover:text-fepucv-primary transition-colors">Servicios</Link></li>
              <li><Link to="/reglamentos" className="hover:text-fepucv-primary transition-colors">Reglamentos</Link></li>
              <li><Link to="/transparencia" className="hover:text-fepucv-primary transition-colors">Transparencia</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-bold text-lg mb-6 border-b border-fepucv-primary/30 pb-2 inline-block text-white">Ayuda</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><Link to="/faq" className="hover:text-fepucv-primary transition-colors">FAQ</Link></li>
              <li><Link to="/contacto" className="hover:text-fepucv-primary transition-colors">Contacto</Link></li>
              <li><Link to="/admin" className="hover:text-fepucv-primary transition-colors">Portal Editores</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-lg mb-6 border-b border-fepucv-primary/30 pb-2 inline-block text-white">Contacto</h4>
            <div className="space-y-4 text-sm text-gray-400">
              <p className="flex items-start gap-3">
                <span className="text-fepucv-primary text-lg">📍</span>
                Av. Brasil 2950, Valparaíso, Chile
              </p>
              <p className="flex items-start gap-3">
                <span className="text-fepucv-primary text-lg">✉️</span>
                contacto@fepucv.cl
              </p>
              <div className="flex gap-4 pt-4">
                <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-fepucv-primary hover:text-fepucv-secondary transition-all">IG</a>
                <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-fepucv-primary hover:text-fepucv-secondary transition-all">FB</a>
                <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-fepucv-primary hover:text-fepucv-secondary transition-all">X</a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <div className="space-y-2">
            <p>© {new Date().getFullYear()} Federación de Estudiantes PUCV. Todos los derechos reservados.</p>
            <div className="bg-white/5 p-3 rounded-lg border border-white/10 inline-block">
               <p className="text-fepucv-primary text-[11px] font-bold uppercase tracking-widest">
                 Sitio Diseñado y Desarrollado por
               </p>
               <p className="text-white text-sm font-bold mt-1">
                 Matías Prado Escobar
               </p>
               <p className="text-gray-400 text-[10px] italic">
                 Ingeniero Civil en Ciencias de Datos
               </p>
            </div>
          </div>
          <div className="flex gap-6 self-end mb-1">
            <a href="#" className="hover:text-white transition-colors">Privacidad</a>
            <a href="#" className="hover:text-white transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
