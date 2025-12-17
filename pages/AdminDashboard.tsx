
import React, { useState } from 'react';
import { NewsItem } from '../types';

interface AdminDashboardProps {
  onAddNews: (article: NewsItem) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onAddNews }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: 'Bienestar',
    image: 'https://picsum.photos/seed/new/800/600',
  });

  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'fepucv2024') {
      setIsLoggedIn(true);
      setError('');
    } else {
      setError('Contraseña incorrecta. Solo personal autorizado.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newArticle: NewsItem = {
      id: Date.now().toString(),
      ...formData,
      date: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }),
      author: 'Admin FEPUCV',
      slug: formData.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
    };
    onAddNews(newArticle);
    alert('¡Noticia publicada con éxito!');
    setFormData({ title: '', excerpt: '', content: '', category: 'Bienestar', image: 'https://picsum.photos/seed/new/800/600' });
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-fepucv-surface flex items-center justify-center p-4">
        <div className="bg-white p-10 rounded-fepucv shadow-2xl border border-fepucv-border max-w-md w-full">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-fepucv-primary text-white flex items-center justify-center rounded-full mx-auto text-2xl font-bold mb-4">F</div>
            <h1 className="text-2xl font-bold text-fepucv-secondary">Acceso Administrativo</h1>
            <p className="text-fepucv-textSecondary text-sm mt-2">Introduce tu clave de equipo FEPUCV</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-fepucv-text mb-2">Contraseña</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-fepucv-border rounded-fepucv focus:ring-2 focus:ring-fepucv-primary outline-none transition-all"
                placeholder="••••••••"
              />
            </div>
            {error && <p className="text-fepucv-accent text-xs font-bold text-center">{error}</p>}
            <button className="w-full bg-fepucv-primary text-white font-bold py-4 rounded-fepucv hover:bg-fepucv-light transition-all shadow-lg active:scale-95">
              Entrar al Panel
            </button>
          </form>
          <div className="mt-8 text-center">
            <p className="text-xs text-fepucv-textSecondary italic">"Un gran poder conlleva una gran responsabilidad informativa."</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-fepucv-surface min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-fepucv shadow-xl overflow-hidden border border-fepucv-border">
          <div className="bg-fepucv-primary p-8 text-white flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Publicar Nueva Noticia</h1>
              <p className="text-white/70 text-sm">Gestiona el contenido del sitio oficial</p>
            </div>
            <button onClick={() => setIsLoggedIn(false)} className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full text-xs font-bold">Cerrar Sesión</button>
          </div>
          
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-fepucv-secondary mb-2">Título de la Noticia <span className="text-red-500">*</span></label>
                  <input 
                    required
                    type="text" 
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="Ejem: Resultados Beca Fotocopia 2024"
                    className="w-full px-4 py-3 border border-fepucv-border rounded-fepucv focus:ring-2 focus:ring-fepucv-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-fepucv-secondary mb-2">Categoría <span className="text-red-500">*</span></label>
                  <select 
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-4 py-3 border border-fepucv-border rounded-fepucv focus:ring-2 focus:ring-fepucv-primary outline-none"
                  >
                    <option>Bienestar</option>
                    <option>Académico</option>
                    <option>Cultura</option>
                    <option>Deportes</option>
                    <option>Comunicado</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-fepucv-secondary mb-2">Imagen Destacada (URL)</label>
                <div className="mb-4 aspect-video rounded-fepucv overflow-hidden border border-fepucv-border bg-fepucv-surface flex items-center justify-center">
                  <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                </div>
                <input 
                  type="text" 
                  value={formData.image}
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
                  className="w-full px-4 py-2 text-xs border border-fepucv-border rounded-fepucv outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-fepucv-secondary mb-2">Extracto / Bajada (Corto) <span className="text-red-500">*</span></label>
              <textarea 
                required
                maxLength={200}
                value={formData.excerpt}
                onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                placeholder="Un resumen de 2 líneas que aparecerá en la grilla..."
                className="w-full px-4 py-3 border border-fepucv-border rounded-fepucv h-24 focus:ring-2 focus:ring-fepucv-primary outline-none"
              ></textarea>
              <p className="text-[10px] text-right text-gray-400 mt-1">{formData.excerpt.length}/200</p>
            </div>

            <div>
              <label className="block text-sm font-bold text-fepucv-secondary mb-2">Contenido Principal <span className="text-red-500">*</span></label>
              <textarea 
                required
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                placeholder="Escribe aquí el cuerpo completo de la noticia..."
                className="w-full px-4 py-3 border border-fepucv-border rounded-fepucv h-64 focus:ring-2 focus:ring-fepucv-primary outline-none"
              ></textarea>
            </div>

            <div className="pt-8 border-t border-fepucv-border flex justify-end gap-4">
              <button type="button" className="px-8 py-4 text-fepucv-textSecondary font-bold hover:text-fepucv-primary transition-colors">Guardar Borrador</button>
              <button type="submit" className="bg-fepucv-primary text-white font-bold px-12 py-4 rounded-fepucv hover:bg-fepucv-light transition-all shadow-xl active:scale-95">
                PUBLICAR NOTICIA
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
