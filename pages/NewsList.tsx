import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { NewsItem } from '../types';
import { CATEGORIES, cover, isPublished } from '../lib/newsStore';

interface NewsListProps {
  news: NewsItem[];
}

export const NewsList: React.FC<NewsListProps> = ({ news }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');

  const published = useMemo(() => news.filter(isPublished), [news]);

  const categories = useMemo(
    () => ['Todas', ...CATEGORIES.filter(c => published.some(n => n.category === c))],
    [published],
  );

  const matches = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return published.filter(item => {
      const okCategory = selectedCategory === 'Todas' || item.category === selectedCategory;
      const okTerm = !term || (item.title + ' ' + item.excerpt).toLowerCase().includes(term);
      return okCategory && okTerm;
    });
  }, [published, searchTerm, selectedCategory]);

  const featured = matches.find(n => n.featured) || matches[0] || null;
  const rest = featured ? matches.filter(n => n.id !== featured.id) : matches;

  return (
    <div className="bg-white min-h-screen">
      <section className="bg-fepucv-surface border-b border-fepucv-border py-16 md:py-20">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-fepucv-secondary mb-3">
            Noticias
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-fepucv-secondary leading-tight mb-4">
            Actualidad FEPUCV
          </h1>
          <p className="text-lg text-fepucv-textSecondary leading-relaxed max-w-2xl">
            Comunicados, resultados y actividades publicadas por la mesa directiva y las consejerias.
          </p>
        </div>
      </section>

      <section className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="bg-white border border-fepucv-border rounded-fepucv p-4 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={
                  'px-4 py-2 rounded-full text-xs font-bold border transition-colors ' +
                  (selectedCategory === cat
                    ? 'bg-fepucv-secondary text-white border-fepucv-secondary'
                    : 'bg-fepucv-surface text-fepucv-textSecondary border-fepucv-border hover:text-fepucv-secondary')
                }
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="relative flex-1 min-w-[220px] max-w-sm">
            <input
              type="search"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Buscar noticias..."
              className="w-full pl-11 pr-4 py-3 bg-fepucv-surface border border-fepucv-border rounded-fepucv text-sm outline-none focus:ring-2 focus:ring-fepucv-primary"
            />
            <svg
              className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-fepucv-textSecondary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </section>

      {featured && (
        <section className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 pt-10">
          <Link
            to={'/noticias/' + featured.slug}
            className="group grid md:grid-cols-2 bg-white border border-fepucv-border rounded-fepucv overflow-hidden hover:shadow-xl transition-shadow"
          >
            <div className="relative aspect-video md:aspect-auto md:min-h-[320px] bg-fepucv-surface">
              <img
                src={cover(featured)}
                alt={featured.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <span className="absolute top-4 left-4 bg-fepucv-secondary text-white text-[10px] font-bold uppercase tracking-[0.16em] px-3 py-1.5 rounded-full">
                Destacada
              </span>
            </div>
            <div className="p-8 md:p-11 flex flex-col justify-center gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="bg-fepucv-light text-fepucv-secondary text-[10px] font-bold uppercase tracking-[0.14em] px-3 py-1.5 rounded-full">
                  {featured.category}
                </span>
                <span className="text-sm text-fepucv-textSecondary">{featured.date}</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-fepucv-text leading-snug group-hover:text-fepucv-secondary transition-colors">
                {featured.title}
              </h2>
              <p className="text-fepucv-textSecondary leading-relaxed">{featured.excerpt}</p>
              <span className="self-start text-sm font-bold text-fepucv-secondary border-b-2 border-fepucv-primary pb-0.5">
                Leer la noticia
              </span>
            </div>
          </Link>
        </section>
      )}

      <section className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {matches.length === 0 ? (
          <div className="border border-dashed border-fepucv-border rounded-fepucv py-20 text-center">
            <p className="text-lg text-fepucv-textSecondary mb-3">No hay noticias con esos criterios.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('Todas');
              }}
              className="text-sm font-bold text-fepucv-secondary underline"
            >
              Limpiar filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {rest.map(item => (
              <Link
                to={'/noticias/' + item.slug}
                key={item.id}
                className="group bg-white border border-fepucv-border rounded-fepucv overflow-hidden flex flex-col hover:shadow-lg transition-shadow"
              >
                <div className="aspect-video bg-fepucv-surface overflow-hidden">
                  <img
                    src={cover(item)}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-6 flex flex-col gap-3 flex-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="bg-fepucv-surface text-fepucv-secondary text-[10px] font-bold uppercase tracking-[0.14em] px-2.5 py-1 rounded-full">
                      {item.category}
                    </span>
                    <span className="text-xs text-fepucv-textSecondary">{item.date}</span>
                  </div>
                  <h3 className="text-lg font-bold text-fepucv-text leading-snug group-hover:text-fepucv-secondary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-fepucv-textSecondary leading-relaxed line-clamp-3">{item.excerpt}</p>
                  <span className="mt-auto pt-2 text-xs font-bold text-fepucv-secondary">Leer mas &rarr;</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
