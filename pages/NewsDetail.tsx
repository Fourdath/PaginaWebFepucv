
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { NewsItem } from '../types';

interface NewsDetailProps {
  news: NewsItem[];
}

export const NewsDetail: React.FC<NewsDetailProps> = ({ news }) => {
  const { slug } = useParams();
  const article = news.find(n => n.slug === slug);

  if (!article) {
    return <div className="py-20 text-center">Artículo no encontrado.</div>;
  }

  const relatedNews = news.filter(n => n.category === article.category && n.id !== article.id).slice(0, 3);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('¡Enlace copiado al portapapeles!');
  };

  return (
    <div className="bg-white min-h-screen">
      <article>
        {/* Header Header */}
        <header className="py-12 bg-fepucv-surface">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <Link to="/noticias" className="text-fepucv-primary text-sm font-bold flex items-center gap-2 mb-8 hover:underline">
              ← VOLVER A NOTICIAS
            </Link>
            <div className="flex items-center gap-4 mb-6">
              <span className="bg-fepucv-primary text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase">
                {article.category}
              </span>
              <span className="text-fepucv-textSecondary text-sm font-medium">{article.date}</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-fepucv-text leading-tight mb-8">
              {article.title}
            </h1>
            <p className="text-xl text-fepucv-textSecondary leading-relaxed border-l-4 border-fepucv-primary pl-6 py-2 italic bg-white/50">
              {article.excerpt}
            </p>
          </div>
        </header>

        {/* Featured Image */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-10 mb-16 shadow-2xl rounded-fepucv overflow-hidden">
          <img src={article.image} alt={article.title} className="w-full aspect-video object-cover" />
        </div>

        {/* Content Content Content */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 mb-20">
          <div className="prose prose-lg max-w-none text-fepucv-text leading-loose">
            <p className="mb-6">{article.content}</p>
            <p className="mb-6">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            </p>
            <h2 className="text-2xl font-bold text-fepucv-secondary mt-12 mb-6">Impacto en la Comunidad</h2>
            <p className="mb-6">
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, 
              totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
            </p>
            <blockquote className="bg-fepucv-surface p-8 rounded-fepucv border-l-8 border-fepucv-primary italic text-xl text-fepucv-secondary my-12">
              "Este es un paso fundamental para garantizar que cada estudiante tenga las herramientas necesarias para su éxito profesional y personal."
            </blockquote>
          </div>

          {/* Share & Actions */}
          <div className="mt-16 pt-8 border-t border-fepucv-border flex flex-wrap gap-4 items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-fepucv-textSecondary">COMPARTIR:</span>
              <button onClick={handleShare} className="w-10 h-10 rounded-full bg-fepucv-surface flex items-center justify-center hover:bg-fepucv-primary hover:text-white transition-all">
                🔗
              </button>
              <button className="w-10 h-10 rounded-full bg-fepucv-surface flex items-center justify-center hover:bg-blue-400 hover:text-white transition-all">
                𝕏
              </button>
            </div>
            <div className="text-sm text-fepucv-textSecondary">
              Escrito por: <span className="font-bold text-fepucv-text">{article.author}</span>
            </div>
          </div>
        </div>
      </article>

      {/* Related Section */}
      {relatedNews.length > 0 && (
        <section className="py-20 bg-fepucv-surface">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl font-bold text-fepucv-secondary mb-12">Noticias Relacionadas</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedNews.map(item => (
                <Link to={`/noticias/${item.slug}`} key={item.id} className="bg-white rounded-fepucv overflow-hidden border border-fepucv-border hover:shadow-lg transition-all">
                  <img src={item.image} alt={item.title} className="w-full aspect-video object-cover" />
                  <div className="p-6">
                    <h3 className="font-bold text-fepucv-text mb-2 line-clamp-2 leading-tight">{item.title}</h3>
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
