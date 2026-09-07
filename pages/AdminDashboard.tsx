import React, { useEffect, useState } from 'react';
import { NewsItem } from '../types';
import { MESA_MEMBERS, SESSION_KEY, checkPassword } from '../lib/auth';
import {
  CATEGORIES,
  EMPTY_DRAFT,
  NewsDraft,
  cover,
  fileToDataUrl,
  isPublished,
  toDraft,
} from '../lib/newsStore';

interface AdminDashboardProps {
  news: NewsItem[];
  /** Guarda (crea o actualiza) una noticia. status decide si es visible en el sitio. */
  onSaveNews: (draft: NewsDraft, status: 'publicada' | 'borrador', author: string) => void;
  onDeleteNews: (id: string) => void;
  onToggleFeatured: (id: string) => void;
}

const MAX_IMAGES = 8;

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  news,
  onSaveNews,
  onDeleteNews,
  onToggleFeatured,
}) => {
  const [session, setSession] = useState<string | null>(null);
  const [member, setMember] = useState(MESA_MEMBERS[0]);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(false);

  const [draft, setDraft] = useState<NewsDraft>(EMPTY_DRAFT);
  const [toast, setToast] = useState('');
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    const saved = sessionStorage.getItem(SESSION_KEY);
    if (saved) {
      setSession(saved);
      setMember(saved);
    }
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(''), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setChecking(true);
    const ok = await checkPassword(password);
    setChecking(false);
    if (!ok) {
      setError('Clave incorrecta. Solo integrantes de la mesa.');
      return;
    }
    sessionStorage.setItem(SESSION_KEY, member);
    setSession(member);
    setPassword('');
    setError('');
  };

  const logout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setSession(null);
    setDraft(EMPTY_DRAFT);
  };

  const addFiles = async (files: FileList | null) => {
    const list = Array.from(files || []).filter(f => f.type.startsWith('image/'));
    if (!list.length) return;
    const urls = await Promise.all(list.slice(0, MAX_IMAGES).map(fileToDataUrl));
    setDraft(d => ({ ...d, images: [...d.images, ...urls].slice(0, MAX_IMAGES) }));
  };

  const removeImage = (index: number) =>
    setDraft(d => ({ ...d, images: d.images.filter((_, i) => i !== index) }));

  const makeCover = (index: number) =>
    setDraft(d => {
      const images = d.images.slice();
      const [picked] = images.splice(index, 1);
      images.unshift(picked);
      return { ...d, images };
    });

  const commit = (status: 'publicada' | 'borrador') => {
    if (!draft.title.trim() || !draft.excerpt.trim() || !draft.content.trim()) {
      setToast('Falta titulo, bajada o texto de la noticia.');
      return;
    }
    onSaveNews(draft, status, session || member);
    setDraft(EMPTY_DRAFT);
    setToast(status === 'publicada' ? 'Noticia publicada en el sitio.' : 'Borrador guardado. No es visible en el sitio.');
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-fepucv-surface flex items-center justify-center px-4 py-14">
        <div className="w-full max-w-md bg-white border border-fepucv-border rounded-fepucv p-10">
          <div className="w-14 h-14 rounded-full bg-fepucv-primary text-fepucv-secondary flex items-center justify-center text-xl font-bold mx-auto mb-5">
            F
          </div>
          <h1 className="text-xl font-bold text-fepucv-secondary text-center mb-2">Editor de noticias</h1>
          <p className="text-sm text-fepucv-textSecondary text-center mb-7">
            Acceso para integrantes de la mesa directiva.
          </p>
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-fepucv-text mb-2">Quien publica</label>
              <select
                value={member}
                onChange={e => setMember(e.target.value)}
                className="w-full px-4 py-3 border border-fepucv-border rounded-fepucv text-sm outline-none focus:ring-2 focus:ring-fepucv-primary"
              >
                {MESA_MEMBERS.map(m => (
                  <option key={m}>{m}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-fepucv-text mb-2">Clave de la mesa</label>
              <input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={e => {
                  setPassword(e.target.value);
                  setError('');
                }}
                placeholder="Clave entregada por la mesa"
                className="w-full px-4 py-3 border border-fepucv-border rounded-fepucv text-sm outline-none focus:ring-2 focus:ring-fepucv-primary"
              />
            </div>
            {error && <p className="text-xs font-bold text-fepucv-accent text-center">{error}</p>}
            <button
              type="submit"
              disabled={checking}
              className="w-full bg-fepucv-primary text-fepucv-secondary font-bold text-xs uppercase tracking-[0.14em] py-4 rounded-fepucv hover:bg-fepucv-light transition-colors disabled:opacity-60"
            >
              {checking ? 'Verificando...' : 'Entrar al editor'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const publishedCount = news.filter(isPublished).length;
  const draftCount = news.length - publishedCount;
  const counts =
    publishedCount + (publishedCount === 1 ? ' publicada' : ' publicadas') +
    ' / ' + draftCount + (draftCount === 1 ? ' borrador' : ' borradores');

  return (
    <div className="min-h-screen bg-fepucv-surface px-4 sm:px-6 lg:px-8 py-8 pb-20">
      <div className="max-w-content mx-auto flex flex-col gap-6">
        <div className="bg-white border border-fepucv-border rounded-fepucv px-6 py-5 flex flex-wrap gap-4 items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-fepucv-secondary">Editor de noticias</h1>
            <p className="text-sm text-fepucv-textSecondary">
              Sesion de <strong className="text-fepucv-text">{session}</strong> &middot; {counts}
            </p>
          </div>
          <div className="flex gap-2.5">
            <button
              onClick={() => setDraft(EMPTY_DRAFT)}
              className="bg-fepucv-primary text-fepucv-secondary text-[11px] font-bold uppercase tracking-[0.12em] px-4 py-3 rounded-fepucv hover:bg-fepucv-light transition-colors"
            >
              Nueva noticia
            </button>
            <button
              onClick={logout}
              className="border border-fepucv-border text-fepucv-textSecondary text-[11px] font-bold uppercase tracking-[0.12em] px-4 py-3 rounded-fepucv"
            >
              Salir
            </button>
          </div>
        </div>

        {toast && (
          <div className="bg-fepucv-light border border-fepucv-primary rounded-fepucv px-5 py-3.5 text-sm font-semibold text-fepucv-secondary">
            {toast}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] gap-6 items-start">
          <div className="bg-white border border-fepucv-border rounded-fepucv p-6 md:p-8 flex flex-col gap-6">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-fepucv-secondary mb-1">Paso 1</p>
              <h2 className="text-base font-bold text-fepucv-text mb-3.5">Fotos de la noticia</h2>
              <label
                onDragOver={e => {
                  e.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={e => {
                  e.preventDefault();
                  setDragging(false);
                  addFiles(e.dataTransfer.files);
                }}
                className={
                  'flex flex-col items-center justify-center gap-2 text-center cursor-pointer border-2 border-dashed rounded-fepucv px-5 py-8 transition-colors ' +
                  (dragging ? 'border-fepucv-secondary bg-fepucv-light' : 'border-fepucv-primary bg-fepucv-surface')
                }
              >
                <span className="text-sm font-bold text-fepucv-secondary">Arrastra las fotos o haz clic aqui</span>
                <span className="text-xs text-fepucv-textSecondary">
                  JPG o PNG &middot; la primera foto es la portada &middot; hasta {MAX_IMAGES}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={e => {
                    addFiles(e.target.files);
                    e.target.value = '';
                  }}
                />
              </label>

              {draft.images.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-3.5">
                  {draft.images.map((src, i) => (
                    <div
                      key={i}
                      className="relative aspect-[4/3] border border-fepucv-border rounded-lg overflow-hidden bg-fepucv-surface"
                    >
                      <img src={src} alt={'Foto ' + (i + 1)} className="w-full h-full object-cover" />
                      <span className="absolute bottom-0 left-0 right-0 bg-fepucv-secondary/90 text-white text-[9px] font-bold uppercase tracking-[0.1em] text-center py-1">
                        {i === 0 ? 'Portada' : 'Foto ' + (i + 1)}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        aria-label="Quitar foto"
                        className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-fepucv-secondary/85 text-white text-xs leading-none"
                      >
                        &times;
                      </button>
                      {i !== 0 && (
                        <button
                          type="button"
                          onClick={() => makeCover(i)}
                          className="absolute top-1.5 left-1.5 bg-white/90 text-fepucv-secondary text-[9px] font-bold px-2 py-1 rounded-full"
                        >
                          Portada
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="h-px bg-fepucv-border" />

            <div className="flex flex-col gap-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-fepucv-secondary">Paso 2 &middot; Texto</p>
              <div>
                <label className="block text-xs font-bold text-fepucv-text mb-2">Titulo</label>
                <input
                  value={draft.title}
                  onChange={e => setDraft(d => ({ ...d, title: e.target.value }))}
                  placeholder="Ej: Resultados Beca Fotocopia 2026"
                  className="w-full px-4 py-3 border border-fepucv-border rounded-fepucv text-sm outline-none focus:ring-2 focus:ring-fepucv-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-fepucv-text mb-2">Categoria</label>
                <select
                  value={draft.category}
                  onChange={e => setDraft(d => ({ ...d, category: e.target.value }))}
                  className="w-full px-4 py-3 border border-fepucv-border rounded-fepucv text-sm outline-none focus:ring-2 focus:ring-fepucv-primary"
                >
                  {CATEGORIES.map(c => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-fepucv-text mb-2">Bajada</label>
                <textarea
                  value={draft.excerpt}
                  maxLength={200}
                  onChange={e => setDraft(d => ({ ...d, excerpt: e.target.value }))}
                  placeholder="Dos lineas que resumen la noticia en la portada..."
                  className="w-full h-24 px-4 py-3 border border-fepucv-border rounded-fepucv text-sm leading-relaxed outline-none focus:ring-2 focus:ring-fepucv-primary resize-y"
                />
                <p className="text-[11px] text-fepucv-textSecondary text-right mt-1">{draft.excerpt.length}/200</p>
              </div>
              <div>
                <label className="block text-xs font-bold text-fepucv-text mb-2">Texto de la noticia</label>
                <textarea
                  value={draft.content}
                  onChange={e => setDraft(d => ({ ...d, content: e.target.value }))}
                  placeholder="Escribe el cuerpo completo. Separa los parrafos con un salto de linea."
                  className="w-full h-52 px-4 py-3 border border-fepucv-border rounded-fepucv text-sm leading-relaxed outline-none focus:ring-2 focus:ring-fepucv-primary resize-y"
                />
              </div>
              <label className="flex gap-2.5 items-start bg-fepucv-surface border border-fepucv-border rounded-fepucv p-3.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={draft.featured}
                  onChange={e => setDraft(d => ({ ...d, featured: e.target.checked }))}
                  className="mt-0.5 w-4 h-4 accent-fepucv-secondary"
                />
                <span className="text-sm text-fepucv-text leading-snug">
                  Destacar en portada
                  <span className="block text-xs text-fepucv-textSecondary">
                    Reemplaza la noticia destacada actual.
                  </span>
                </span>
              </label>
            </div>

            <div className="flex flex-wrap gap-3 justify-end pt-5 border-t border-fepucv-border">
              <button
                onClick={() => commit('borrador')}
                className="border border-fepucv-border text-fepucv-textSecondary text-[11px] font-bold uppercase tracking-[0.12em] px-5 py-3.5 rounded-fepucv"
              >
                Guardar borrador
              </button>
              <button
                onClick={() => commit('publicada')}
                className="bg-fepucv-primary text-fepucv-secondary text-[11px] font-bold uppercase tracking-[0.12em] px-7 py-3.5 rounded-fepucv hover:bg-fepucv-light transition-colors"
              >
                {draft.id ? 'Guardar cambios' : 'Publicar noticia'}
              </button>
            </div>
          </div>

          <div className="bg-white border border-fepucv-border rounded-fepucv p-6">
            <h2 className="text-base font-bold text-fepucv-text mb-1">Publicaciones</h2>
            <p className="text-xs text-fepucv-textSecondary mb-5">Editar, eliminar o cambiar la destacada.</p>
            <div className="flex flex-col gap-3">
              {news.map(item => {
                const badge = item.featured && isPublished(item)
                  ? { label: 'Destacada', cls: 'bg-fepucv-secondary text-white' }
                  : isPublished(item)
                  ? { label: 'Publicada', cls: 'bg-fepucv-light text-fepucv-secondary' }
                  : { label: 'Borrador', cls: 'bg-fepucv-surface text-fepucv-textSecondary' };
                return (
                  <div key={item.id} className="border border-fepucv-border rounded-fepucv p-3 flex gap-3 items-start">
                    <div className="w-20 shrink-0 aspect-[4/3] rounded-lg overflow-hidden bg-fepucv-surface">
                      <img src={cover(item)} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={'text-[9px] font-bold uppercase tracking-[0.1em] px-2 py-0.5 rounded-full ' + badge.cls}>
                          {badge.label}
                        </span>
                        <span className="text-[11px] text-fepucv-textSecondary">{item.date}</span>
                      </div>
                      <p className="text-sm font-semibold text-fepucv-text leading-snug">{item.title}</p>
                      <p className="text-[11px] text-fepucv-textSecondary">{item.author}</p>
                      <div className="flex flex-wrap gap-2 pt-0.5">
                        <button
                          onClick={() => setDraft(toDraft(item))}
                          className="border border-fepucv-border rounded-full px-3 py-1 text-[10px] font-bold text-fepucv-secondary"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => onToggleFeatured(item.id)}
                          className="border border-fepucv-border rounded-full px-3 py-1 text-[10px] font-bold text-fepucv-secondary"
                        >
                          {item.featured ? 'Quitar destacada' : 'Destacar'}
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm('Eliminar "' + item.title + '"?')) onDeleteNews(item.id);
                          }}
                          className="border border-fepucv-border rounded-full px-3 py-1 text-[10px] font-bold text-fepucv-accent"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
