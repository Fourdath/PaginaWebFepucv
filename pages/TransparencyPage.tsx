// src/pages/TransparencyPage.tsx — con sección de análisis de gastos integrada

import React from 'react';
import { transparenciaDocs } from './lib/sheetsDocs';
import { GastosCharts } from '../components/GastosCharts';

export const TransparencyPage: React.FC = () => {
  const getDescription = (title: string) => {
    if (title.toLowerCase().includes('actas')) {
      return 'Accede al historial completo de actas plenarias registradas oficialmente.';
    }
    if (title.toLowerCase().includes('rendiciones')) {
      return 'Accede al historial completo de rendiciones financieras registradas oficialmente.';
    }
    return 'Accede al repositorio oficial de documentos de transparencia.';
  };

  const getIcon = (title: string) => {
    if (title.toLowerCase().includes('actas')) return '🏛️';
    if (title.toLowerCase().includes('rendiciones')) return '📈';
    return '📁';
  };

  return (
    <div className="bg-white min-h-screen py-20">
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Encabezado ── */}
        <div className="max-w-3xl mb-16">
          <h1 className="text-4xl font-bold text-fepucv-primary mb-6">
            Portal de Transparencia
          </h1>
          <p className="text-fepucv-textSecondary text-lg leading-relaxed">
            Como federación democrática, creemos firmemente en la rendición de cuentas.
            Aquí puedes encontrar toda la información sobre el uso de recursos y las decisiones
            tomadas en nuestras asambleas.
          </p>
        </div>

        {/* ── Tarjetas de carpetas Drive ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {transparenciaDocs.map((sec) => {
            const href = sec.embedUrl || sec.downloadUrl || '#';
            const disabled = href === '#';
            return (
              <a
                key={sec.key}
                href={href}
                target={disabled ? undefined : '_blank'}
                rel={disabled ? undefined : 'noreferrer'}
                onClick={(e) => { if (disabled) e.preventDefault(); }}
                className={`bg-fepucv-surface p-10 rounded-fepucv border border-fepucv-border transition-all group block ${
                  disabled
                    ? 'opacity-60 cursor-not-allowed'
                    : 'hover:border-fepucv-primary hover:shadow-md cursor-pointer'
                }`}
              >
                <div className="flex justify-between items-start mb-6">
                  <span className="text-5xl group-hover:scale-110 transition-transform">
                    {getIcon(sec.title)}
                  </span>
                  <span className="bg-white px-4 py-1 rounded-full text-xs font-bold text-fepucv-primary border border-fepucv-border">
                    Actualización mensual
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-fepucv-secondary mb-4">
                  {sec.title}
                </h3>
                <p className="text-fepucv-textSecondary mb-8 text-sm">
                  {getDescription(sec.title)}
                </p>
                <span className="text-fepucv-primary font-bold flex items-center gap-2 group-hover:underline">
                  Explorar carpeta →
                </span>
              </a>
            );
          })}
        </div>

        {/* ── ANÁLISIS DE GASTOS (nuevo) ── */}
        <GastosCharts />

        {/* ── Política de Probidad ── */}
        <div className="bg-fepucv-secondary p-12 rounded-fepucv text-white mt-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-bold mb-6">Política de Probidad</h2>
              <p className="text-gray-300 mb-6 italic leading-relaxed">
                "Todo gasto superior a 5 UTM debe ser visado por la plenaria de presidentes y
                contar con tres cotizaciones previas, asegurando siempre el mejor uso de la
                cuota de federación."
              </p>
              <div className="flex gap-4">
                <span className="px-4 py-2 bg-white/10 rounded-full text-xs">
                  Aprobado en 2024
                </span>
                <span className="px-4 py-2 bg-white/10 rounded-full text-xs">
                  Vigente
                </span>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="w-32 h-32 border-4 border-fepucv-light rounded-full flex items-center justify-center text-3xl font-bold">
                100%
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};