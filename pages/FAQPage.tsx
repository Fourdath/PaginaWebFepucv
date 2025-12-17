
import React, { useState } from 'react';
import { FAQS } from '../constants';

export const FAQPage: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="bg-fepucv-surface min-h-screen py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-fepucv-primary mb-6">Preguntas Frecuentes</h1>
          <p className="text-fepucv-textSecondary">Resolvemos las dudas más comunes de la comunidad estudiantil.</p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq) => (
            <div key={faq.id} className="bg-white rounded-fepucv border border-fepucv-border overflow-hidden shadow-sm transition-all">
              <button 
                onClick={() => toggle(faq.id)}
                className="w-full flex justify-between items-center p-6 text-left hover:bg-fepucv-surface transition-colors"
              >
                <span className="font-bold text-fepucv-secondary">{faq.question}</span>
                <span className={`text-2xl transition-transform duration-300 ${openId === faq.id ? 'rotate-180' : ''}`}>
                  ⌄
                </span>
              </button>
              <div className={`transition-all duration-300 ease-in-out overflow-hidden ${openId === faq.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="p-6 pt-0 text-fepucv-textSecondary leading-relaxed border-t border-fepucv-border bg-fepucv-surface/30">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 p-10 bg-white border-2 border-dashed border-fepucv-primary rounded-fepucv text-center">
          <h3 className="text-xl font-bold text-fepucv-secondary mb-4">¿Tu pregunta no está aquí?</h3>
          <p className="text-fepucv-textSecondary mb-8">Escríbenos directamente y un miembro de la federación te responderá a la brevedad.</p>
          <a href="/#/contacto" className="inline-block bg-fepucv-primary text-white font-bold px-8 py-3 rounded-fepucv hover:bg-fepucv-light transition-all shadow-md">
            Hacer una consulta
          </a>
        </div>
      </div>
    </div>
  );
};
