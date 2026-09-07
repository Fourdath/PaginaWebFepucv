import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { NewsItem } from '../types';
import { cover, gallery, isPublished, paragraphs } from '../lib/newsStore';

interface NewsDetailProps {
  news: NewsItem[];
}

export const NewsDetail: React.FC<NewsDetailProps> = ({ news }) => {
  const { slug } = useParams();
  const article = news.find(n => n.slug === slug);

  if (!article) {
    return (
      <div className="py-24 text-center">
        <p className="text-lg text-fepucv-textSecondary mb-4">Noticia no encontrada.</p>
        <Link to="/noticias" className="text-sm font-bold text-fepucv-secondary underline">
          Volver a noticias
        </Link>
      </div>
    );
  }

  const related = news
    .filter(n => isPublished(n) && n.category === article.category && n.id !== article.id)
    .slice(0, 3);

  return (
    <div className="bg-white min-h-screen">
      <article>
        <header className="bg-fepucv-surface border-b border-fepucv-border pt-10 pb-14">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <Link
              to="/noticias"
              className="inline-block text-xs font-bold tracking-[0.12em] text-fepucv-secondary mb-7 hover:underline"
            >
              &larr; VOLVER A NOTICIAS
            </Link>
            <div className="flex flex-wrap items-center gap-3.5 mb-5">
              <span className="bg-fepucv-secondary text-white text-[10px] font-bold uppercase tracking-[0.16em] px-3 py-1.5 rounded-full">
                {article.category}
              </span>
              <span className="text-sm font-medium text-fepucv-textSecondary">{article.date}</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-fepucv-text leading-tight mb-6">
              {article.title}
            </h1>
            <p className="border-l-4 border-fepucv-primary pl-5 py-1 text-lg md:text-xl text-fepucv-textSecondary leading-relaxed">
              {article.excerpt}
            </p>
          </div>
        </header>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-8 mb-12">
          <div className="aspect-video bg-fepucv-surface border border-fepucv-border rounded-fepucv overflow-hidden">
            <img src={cover(article)} alt={article.title} className="w-full h-full object-cover" />
          </div>
          {gallery(article).length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
              {gallery(article).map((src, i) => (
                <div key={i} className="aspect-[4/3] bg-fepucv-surface border border-fepucv-border rounded-lg overflow-hidden">
                  <img src={src} alt={article.title + ' foto ' + (i + 2)} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-20">
          {paragraphs(article.content).map((text, i) => (
            <p key={i} className="text-[17px] leading-[1.85] text-fepucv-text mb-6">
              {text}
            </p>
          ))}
          <div className="mt-12 pt-6 border-t border-fepucv-border flex flex-wrap gap-4 items-center justify-between">
            <span className="text-sm text-fepucv-textSecondary">
              Publicado por <strong className="text-fepucv-text">{article.author}</strong>
            </span>
            <Link
              to="/noticias"
              className="border border-fepucv-border rounded-fepucv px-5 py-2.5 text-xs font-bold tracking-[0.08em] text-fepucv-secondary"
            >
              VER TODAS
            </Link>
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section className="bg-fepucv-surface border-t border-fepucv-border py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl font-bold text-fepucv-secondary mb-8">Noticias relacionadas</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
              {related.map(item => (
                <Link
                  to={'/noticias/' + item.slug}
                  key={item.id}
                  className="bg-white border border-fepucv-border rounded-fepucv overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="aspect-video bg-fepucv-surface">
                    <img src={cover(item)} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-fepucv-text leading-snug mb-2 line-clamp-2">{item.title}</h3>
                    <p className="text-xs text-fepucv-textSecondary">{item.date}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
