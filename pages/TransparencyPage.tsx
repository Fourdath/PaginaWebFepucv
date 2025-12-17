
import React from 'react';

export const TransparencyPage: React.FC = () => {
  const sections = [
    { title: 'Actas Plenarias', count: 42, icon: '🏛️' },
    { title: 'Rendiciones Financieras', count: 18, icon: '📈' },
    { title: 'Estatutos Históricos', count: 5, icon: '📜' },
    { title: 'Convenios Vigentes', count: 12, icon: '🤝' },
  ];

  return (
    <div className="bg-white min-h-screen py-20">
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-16">
          <h1 className="text-4xl font-bold text-fepucv-primary mb-6">Portal de Transparencia</h1>
          <p className="text-fepucv-textSecondary text-lg leading-relaxed">
            Como federación democrática, creemos firmemente en la rendición de cuentas. 
            Aquí puedes encontrar toda la información sobre el uso de recursos y las decisiones tomadas en nuestras asambleas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {sections.map(sec => (
            <div key={sec.title} className="bg-fepucv-surface p-10 rounded-fepucv border border-fepucv-border hover:border-fepucv-primary transition-all group cursor-pointer">
              <div className="flex justify-between items-start mb-6">
                <span className="text-5xl group-hover:scale-110 transition-transform">{sec.icon}</span>
                <span className="bg-white px-4 py-1 rounded-full text-xs font-bold text-fepucv-primary border border-fepucv-border">
                  {sec.count} Documentos
                </span>
              </div>
              <h3 className="text-2xl font-bold text-fepucv-secondary mb-4">{sec.title}</h3>
              <p className="text-fepucv-textSecondary mb-8 text-sm">
                Accede al historial completo de {sec.title.toLowerCase()} registrados oficialmente.
              </p>
              <button className="text-fepucv-primary font-bold flex items-center gap-2 group-hover:underline">
                Explorar sección →
              </button>
            </div>
          ))}
        </div>

        <div className="bg-fepucv-secondary p-12 rounded-fepucv text-white">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-bold mb-6">Política de Probidad</h2>
              <p className="text-gray-300 mb-6 italic leading-relaxed">
                "Todo gasto superior a 5 UTM debe ser visado por la plenaria de presidentes y contar con tres cotizaciones previas, 
                asegurando siempre el mejor uso de la cuota de federación."
              </p>
              <div className="flex gap-4">
                <span className="px-4 py-2 bg-white/10 rounded-full text-xs">Aprobado en 2024</span>
                <span className="px-4 py-2 bg-white/10 rounded-full text-xs">Vigente</span>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="w-32 h-32 border-4 border-fepucv-light rounded-full flex items-center justify-center text-3xl font-bold">100%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
