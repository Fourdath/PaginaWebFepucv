
import React from 'react';
import { Link } from 'react-router-dom';
import { NewsItem } from '../types';
import { EXECUTIVE_BOARD, SERVICES } from '../constants';

interface HomeProps {
  news: NewsItem[];
}

export const Home: React.FC<HomeProps> = ({ news }) => {
  const latestNews = news.slice(0, 4);

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center bg-fepucv-secondary overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://picsum.photos/seed/hero/1920/1080?grayscale" 
            className="w-full h-full object-cover opacity-20"
            alt="PUCV Background"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-fepucv-secondary via-transparent to-transparent"></div>
        </div>
        
        <div className="relative z-10 max-w-content mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Federación de Estudiantes <span className="text-fepucv-primary">PUCV</span>
            </h1>
            <p className="text-xl text-gray-200 mb-10 leading-relaxed">
              Trabajamos por una universidad más democrática, inclusiva y al servicio de sus estudiantes. Tu voz, nuestra fuerza.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/noticias" className="bg-fepucv-primary text-fepucv-secondary px-8 py-4 rounded-fepucv font-bold text-lg hover:bg-fepucv-light transition-all shadow-lg hover:-translate-y-1">
                Ver Noticias
              </Link>
              <Link to="/contacto" className="bg-white text-fepucv-secondary px-8 py-4 rounded-fepucv font-bold text-lg hover:bg-gray-100 transition-all shadow-lg hover:-translate-y-1">
                Escríbenos
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Mesa Ejecutiva (FEUC Style) */}
      <section className="py-20 bg-white">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-fepucv-secondary mb-4 border-b-4 border-fepucv-primary inline-block pb-2">Mesa Ejecutiva 2024</h2>
          <p className="text-fepucv-textSecondary max-w-2xl mx-auto mt-4">
            Conoce a tus representantes electos que trabajan día a día en las distintas áreas de la federación.
          </p>
        </div>
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {EXECUTIVE_BOARD.map((member) => (
              <div key={member.id} className="group bg-fepucv-surface rounded-fepucv overflow-hidden border border-fepucv-border transition-all hover:shadow-xl">
                <div className="aspect-[4/5] overflow-hidden">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-fepucv-text mb-1">{member.name}</h3>
                  <p className="text-fepucv-secondary font-bold text-sm mb-2 uppercase tracking-wide bg-fepucv-primary/30 px-2 py-1 rounded inline-block">{member.role}</p>
                  <p className="text-fepucv-textSecondary text-xs">{member.major}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link to="/quienes-somos" className="inline-flex items-center gap-2 text-fepucv-secondary font-bold hover:text-fepucv-primary transition-colors">
              Ver equipo completo 
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Noticias Destacadas (PUCV Style) */}
      <section className="py-20 bg-fepucv-surface">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold text-fepucv-secondary mb-2">Noticias Destacadas</h2>
            <div className="w-20 h-1.5 bg-fepucv-primary rounded-full"></div>
          </div>
          <Link to="/noticias" className="hidden sm:block text-fepucv-secondary font-bold hover:text-fepucv-primary transition-colors">
            Ver todas las noticias →
          </Link>
        </div>

        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {latestNews.map((item) => (
              <div key={item.id} className="bg-white rounded-fepucv border border-fepucv-border overflow-hidden flex flex-col hover:shadow-lg transition-shadow">
                <div className="relative aspect-video overflow-hidden">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  <span className="absolute top-3 left-3 bg-fepucv-primary text-fepucv-secondary text-[10px] font-bold px-3 py-1 rounded-full uppercase shadow-sm">
                    {item.category}
                  </span>
                </div>
                <div className="p-5 flex-grow flex flex-col">
                  <p className="text-xs text-fepucv-textSecondary mb-2 font-medium">{item.date}</p>
                  <h3 className="font-bold text-fepucv-text mb-3 line-clamp-2 leading-snug">{item.title}</h3>
                  <p className="text-sm text-fepucv-textSecondary mb-6 line-clamp-3 leading-relaxed">{item.excerpt}</p>
                  <div className="mt-auto">
                    <Link 
                      to={`/noticias/${item.slug}`} 
                      className="inline-block text-fepucv-secondary font-bold text-sm border-b-2 border-fepucv-primary hover:bg-fepucv-primary/10 transition-all px-1"
                    >
                      VER MÁS
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Accesos Rápidos */}
      <section className="py-20 bg-white">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
          <h2 className="text-3xl font-bold text-fepucv-secondary border-b-4 border-fepucv-primary inline-block pb-2">¿Qué necesitas hoy?</h2>
        </div>
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {SERVICES.map((s) => (
              <Link 
                key={s.id} 
                to="/servicios" 
                className="bg-fepucv-surface p-6 rounded-fepucv border border-fepucv-border flex flex-col items-center text-center hover:bg-white hover:border-fepucv-primary hover:shadow-xl transition-all group"
              >
                <span className="text-4xl mb-4 group-hover:scale-125 transition-transform">{s.icon}</span>
                <span className="font-bold text-fepucv-secondary text-sm">{s.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Banner */}
      <section className="py-20 bg-fepucv-primary text-fepucv-secondary overflow-hidden relative">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-white opacity-20 rounded-full blur-3xl"></div>
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">¿Tienes dudas o necesitas ayuda?</h2>
          <p className="text-xl text-fepucv-secondary/80 mb-10 max-w-3xl mx-auto leading-relaxed font-medium">
            Estamos para acompañarte en tu vida universitaria. Contáctanos y resolveremos tus inquietudes.
          </p>
          <Link to="/contacto" className="inline-block bg-fepucv-secondary text-white px-10 py-4 rounded-fepucv font-bold text-lg hover:bg-fepucv-secondary/90 transition-all shadow-xl">
            Contactar ahora
          </Link>
        </div>
      </section>
    </div>
  );
};
