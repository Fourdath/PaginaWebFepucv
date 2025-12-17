
import React from 'react';

export const ContactPage: React.FC = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Mensaje enviado. Te contactaremos pronto.');
  };

  return (
    <div className="bg-white min-h-screen py-20">
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* Info */}
          <div>
            <h1 className="text-4xl font-bold text-fepucv-primary mb-8">Canales de Contacto</h1>
            <p className="text-lg text-fepucv-textSecondary mb-12">
              Estamos ubicados en el corazón de Valparaíso. Visítanos en nuestra oficina o envíanos un mensaje electrónico.
            </p>

            <div className="space-y-10">
              <div className="flex gap-6">
                <div className="w-14 h-14 bg-fepucv-surface rounded-2xl flex items-center justify-center text-3xl shrink-0">📍</div>
                <div>
                  <h3 className="font-bold text-fepucv-secondary text-lg mb-2">Oficina Central</h3>
                  <p className="text-fepucv-textSecondary">Av. Brasil 2950, Valparaíso, Chile</p>
                  <p className="text-fepucv-textSecondary text-sm">Lunes a Viernes: 09:00 - 18:00 hrs</p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="w-14 h-14 bg-fepucv-surface rounded-2xl flex items-center justify-center text-3xl shrink-0">✉️</div>
                <div>
                  <h3 className="font-bold text-fepucv-secondary text-lg mb-2">Correos Electrónicos</h3>
                  <p className="text-fepucv-textSecondary font-medium">General: contacto@fepucv.cl</p>
                  <p className="text-fepucv-textSecondary font-medium">Finanzas: finanzas@fepucv.cl</p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="w-14 h-14 bg-fepucv-surface rounded-2xl flex items-center justify-center text-3xl shrink-0">📱</div>
                <div>
                  <h3 className="font-bold text-fepucv-secondary text-lg mb-2">Redes Sociales</h3>
                  <p className="text-fepucv-textSecondary">Instagram: @fepucv</p>
                  <p className="text-fepucv-textSecondary">TikTok: @fepucv_oficial</p>
                </div>
              </div>
            </div>

            <div className="mt-16 rounded-fepucv overflow-hidden border border-fepucv-border h-64 shadow-inner grayscale hover:grayscale-0 transition-all duration-700">
               <img src="https://picsum.photos/seed/map/800/400" className="w-full h-full object-cover" alt="Mapa mockup" />
            </div>
          </div>

          {/* Form */}
          <div className="bg-fepucv-surface p-10 rounded-fepucv border border-fepucv-border shadow-xl">
            <h2 className="text-2xl font-bold text-fepucv-secondary mb-8">Formulario Estudiantil</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-fepucv-textSecondary mb-2">Nombre Completo</label>
                  <input type="text" required placeholder="Juan Pérez" className="w-full px-4 py-3 bg-white border border-fepucv-border rounded-fepucv focus:ring-2 focus:ring-fepucv-primary outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-fepucv-textSecondary mb-2">Correo Institucional</label>
                  <input type="email" required placeholder="juan.perez@pucv.cl" className="w-full px-4 py-3 bg-white border border-fepucv-border rounded-fepucv focus:ring-2 focus:ring-fepucv-primary outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-fepucv-textSecondary mb-2">Carrera / Facultad</label>
                <input type="text" required placeholder="Derecho / Valparaíso" className="w-full px-4 py-3 bg-white border border-fepucv-border rounded-fepucv focus:ring-2 focus:ring-fepucv-primary outline-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-fepucv-textSecondary mb-2">Motivo de Contacto</label>
                <select className="w-full px-4 py-3 bg-white border border-fepucv-border rounded-fepucv focus:ring-2 focus:ring-fepucv-primary outline-none">
                  <option>Consulta General</option>
                  <option>Defensa Estudiantil</option>
                  <option>Apoyo Bienestar</option>
                  <option>Problema Académico</option>
                  <option>Otro</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-fepucv-textSecondary mb-2">Mensaje</label>
                <textarea required placeholder="Cuéntanos cómo podemos ayudarte..." className="w-full px-4 py-3 bg-white border border-fepucv-border rounded-fepucv h-40 focus:ring-2 focus:ring-fepucv-primary outline-none"></textarea>
              </div>
              <div className="bg-gray-100 p-4 rounded-fepucv mb-4 flex items-center justify-between">
                <span className="text-xs text-fepucv-textSecondary">Recibir copia en mi correo</span>
                <input type="checkbox" className="w-5 h-5 accent-fepucv-primary" />
              </div>
              <button type="submit" className="w-full bg-fepucv-primary text-white font-bold py-5 rounded-fepucv hover:bg-fepucv-light transition-all shadow-lg active:scale-95">
                ENVIAR MENSAJE
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
