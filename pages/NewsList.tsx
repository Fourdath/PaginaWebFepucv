
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { NewsItem } from '../types';

interface NewsListProps {
  news: NewsItem[];
}

export const NewsList: React.FC<NewsListProps> = ({ news }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');

  const categories = ['Todas', ...new Set(news.map(item => item.category))];

  const filteredNews = news.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         item.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todas' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-fepucv-surface min-h-screen py-12">
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-fepucv-secondary mb-4">Actualidad FEPUCV</h1>
          <p className="text-fepucv-textSecondary text-lg">Entérate de todo lo que ocurre en nuestra comunidad universitaria.</p>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-fepucv shadow-sm border border-fepucv-border mb-12 flex flex-col lg:flex-row gap-6 justify-between items-center">
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  selectedCategory === cat 
                    ? 'bg-fepucv-primary text-white shadow-md' 
                    : 'bg-fepucv-surface text-fepucv-textSecondary hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="relative w-full lg:w-80">
            <input
              type="text"
              placeholder="Buscar noticias..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-5 py-3 bg-fepucv-surface rounded-fepucv border border-fepucv-border focus:ring-2 focus:ring-fepucv-primary focus:outline-none pl-12"
            />
            <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredNews.length > 0 ? (
            filteredNews.map((item) => (
              <Link to={`/noticias/${item.slug}`} key={item.id} className="group bg-white rounded-fepucv overflow-hidden border border-fepucv-border hover:shadow-2xl transition-all">
                <div className="aspect-[16/9] overflow-hidden">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="bg-fepucv-surface text-fepucv-primary text-[10px] font-bold px-3 py-1 rounded-full uppercase">
                      {item.category}
                    </span>
                    <span className="text-xs text-fepucv-textSecondary">{item.date}</span>
                  </div>
                  <h3 className="text-xl font-bold text-fepucv-text mb-4 leading-snug group-hover:text-fepucv-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-fepucv-textSecondary text-sm line-clamp-3 leading-relaxed">
                    {item.excerpt}
                  </p>
                  <div className="mt-8 flex items-center gap-2 text-fepucv-primary font-bold text-sm">
                    Leer más 
                    <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
              <p className="text-xl text-fepucv-textSecondary">No se encontraron noticias con esos criterios.</p>
              <button onClick={() => { setSearchTerm(''); setSelectedCategory('Todas'); }} className="mt-4 text-fepucv-primary font-bold hover:underline">
                Limpiar filtros
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
