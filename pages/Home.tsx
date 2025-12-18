
import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { NewsItem, ExecutiveMember } from '../types';
import { EXECUTIVE_BOARD, SERVICES } from '../constants';

interface HomeProps {
  news: NewsItem[];
}

const MesaCard: React.FC<{ member: ExecutiveMember }> = ({ member }) => (
  <div className="group bg-white rounded-fepucv overflow-hidden border border-fepucv-border transition-all hover:shadow-2xl hover:-translate-y-1 mx-auto w-full max-w-[320px]">
    <div className="aspect-[4/5] overflow-hidden">
      <img 
        src={member.image} 
        alt={member.name}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
    </div>
    <div className="p-6 bg-fepucv-surface/30">
      <h3 className="text-xl font-bold text-fepucv-secondary mb-2 truncate">{member.name}</h3>
      <div className="mb-3">
        <span className="text-fepucv-secondary font-bold text-[10px] uppercase tracking-widest bg-fepucv-primary/40 px-3 py-1.5 rounded-full inline-block">
          {member.role}
        </span>
      </div>
      <p className="text-fepucv-textSecondary text-xs italic border-t border-fepucv-border pt-3">{member.major}</p>
    </div>
  </div>
);

const SuperiorCard: React.FC<{ member: ExecutiveMember }> = ({ member }) => (
  <div className="group bg-white rounded-fepucv overflow-hidden border border-fepucv-border transition-all hover:shadow-xl mx-auto w-full max-w-[240px]">
    <div className="aspect-[1/1] overflow-hidden">
      <img 
        src={member.image} 
        alt={member.name}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
    </div>
    <div className="p-4 bg-white">
      <h3 className="text-md font-bold text-fepucv-secondary truncate">{member.name}</h3>
      <p className="text-fepucv-primary font-bold text-[9px] uppercase tracking-tighter mb-1">
        {member.role}
      </p>
      <p className="text-fepucv-textSecondary text-[10px] italic">{member.major}</p>
    </div>
  </div>
);

const FacultadCard: React.FC<{ member: ExecutiveMember }> = ({ member }) => (
  <div className="group relative bg-fepucv-surface rounded-md overflow-hidden border border-fepucv-border transition-all hover:scale-105 hover:z-10 shrink-0 w-36 md:w-44 shadow-sm">
    <div className="aspect-[2/3] overflow-hidden">
      <img 
        src={member.image} 
        alt={member.name}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-fepucv-secondary/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
         <h4 className="text-white font-bold text-[10px] leading-tight mb-1">{member.name}</h4>
         <p className="text-fepucv-primary text-[8px] font-bold uppercase">{member.role}</p>
      </div>
    </div>
    <div className="p-2 md:hidden">
       <h4 className="text-fepucv-secondary font-bold text-[10px] truncate">{member.name}</h4>
    </div>
  </div>
);

export const Home: React.FC<HomeProps> = ({ news }) => {
  const latestNews = news.slice(0, 4);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);

  const mesaMembers = EXECUTIVE_BOARD.filter(m => m.type === 'mesa');
  const superiorMembers = EXECUTIVE_BOARD.filter(m => m.type === 'superior');
  const facultadMembers = EXECUTIVE_BOARD.filter(m => m.type === 'facultad');

  const handleScroll = () => {
    if (sliderRef.current) {
      setShowLeftArrow(sliderRef.current.scrollLeft > 0);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="animate-fade-in bg-white">
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

      {/* Quienes Somos & Mesa Section */}
      <section className="py-24">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
          <h2 className="text-2xl font-bold text-fepucv-primary uppercase tracking-widest mb-2 drop-shadow-sm">¿Quiénes somos?</h2>
          <h1 className="text-4xl md:text-5xl font-bold text-fepucv-secondary mb-4">Mesa Ejecutiva</h1>
          <div className="w-24 h-1.5 bg-fepucv-primary mx-auto rounded-full mb-16"></div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-5xl mx-auto">
            {mesaMembers.map((member) => (
              <MesaCard key={member.id} member={member} />
            ))}
          </div>
        </div>
      </section>

      {/* Consejería Superior - Smaller cards */}
      <section className="py-24 bg-fepucv-surface border-y border-fepucv-border mb-24">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-fepucv-secondary mb-4 uppercase tracking-tight">Consejería Superior</h2>
          <div className="w-16 h-1 bg-fepucv-primary mx-auto rounded-full mb-12"></div>
          <div className="flex flex-wrap justify-center gap-8">
            {superiorMembers.map((member) => (
              <SuperiorCard key={member.id} member={member} />
            ))}
          </div>
        </div>
      </section>

      {/* Consejerías de Facultad Netflix Slider */}
      <section className="py-12 bg-white overflow-hidden">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 mb-24 relative">
          <div className="flex justify-between items-end mb-8 px-2">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-fepucv-secondary uppercase">Consejerías de Facultad</h2>
              <div className="w-16 h-1 bg-fepucv-primary mt-1 rounded-full"></div>
            </div>
            <Link 
              to="/facultades" 
              className="text-fepucv-secondary font-bold text-sm hover:text-fepucv-primary transition-colors hidden sm:block"
            >
              Ver todos los consejeros de facultad >
            </Link>
          </div>

          <div className="relative group">
            {showLeftArrow && (
              <button 
                onClick={() => scroll('left')}
                className="absolute left-0 top-0 bottom-0 z-20 w-12 bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-black/60 rounded-r-md"
              >
                <span className="text-3xl font-bold">‹</span>
              </button>
            )}
            
            <div 
              ref={sliderRef}
              onScroll={handleScroll}
              className="flex gap-4 overflow-x-auto pb-6 scroll-smooth scrollbar-hide no-scrollbar snap-x px-2"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {facultadMembers.map((member) => (
                <div key={member.id} className="snap-start">
                  <FacultadCard member={member} />
                </div>
              ))}
            </div>

            <button 
              onClick={() => scroll('right')}
              className="absolute right-0 top-0 bottom-0 z-20 w-12 bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-black/60 rounded-l-md"
            >
              <span className="text-3xl font-bold">›</span>
            </button>
          </div>
        </div>
      </section>

      {/* Formularios de Fondos Section */}
      <section className="py-24 bg-fepucv-primary/10 border-t border-fepucv-border">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-fepucv-secondary mb-4">Formularios de Fondos Estudiantiles</h2>
            <p className="text-fepucv-textSecondary max-w-2xl mx-auto">
              Descarga las bases y formularios correspondientes a los fondos participativos y descentralizados de la FEPUCV.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Bases Fondos Participativos", format: "PDF", link: "#" },
              { title: "Formulario Fondos Descentralizados 2025", format: "DOCX", link: "#" },
              { title: "Formulario Fondos Participativos 2025", format: "DOCX", link: "#" }
            ].map((doc, idx) => (
              <div key={idx} className="bg-white p-8 rounded-fepucv border border-fepucv-border flex flex-col items-center text-center hover:shadow-xl transition-all shadow-sm">
                <div className="w-16 h-16 bg-fepucv-primary/20 rounded-full flex items-center justify-center text-2xl mb-6">📄</div>
                <h4 className="font-bold text-fepucv-secondary mb-6 flex-grow">{doc.title}</h4>
                <a 
                  href={doc.link} 
                  target="_blank" 
                  rel="noreferrer"
                  className="w-full bg-fepucv-secondary text-white py-3 rounded-full font-bold text-sm hover:bg-fepucv-secondary/80 transition-all flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                  Descargar {doc.format}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Noticias Destacadas */}
      <section className="py-24 bg-fepucv-surface">
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
