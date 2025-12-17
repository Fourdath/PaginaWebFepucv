
import React, { useState } from 'react';
import { DOCUMENTS } from '../constants';

export const RegulationsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDocs = DOCUMENTS.filter(doc => 
    doc.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white min-h-screen py-20">
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
          <h1 className="text-4xl font-bold text-fepucv-primary mb-4">Reglamentos y Biblioteca</h1>
          <p className="text-fepucv-textSecondary text-lg">Consulta la normativa vigente de nuestra federación y universidad.</p>
        </div>

        {/* Search Bar */}
        <div className="mb-12">
          <div className="relative max-w-xl">
            <input 
              type="text" 
              placeholder="Buscar documento por nombre..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-6 py-4 bg-fepucv-surface rounded-fepucv border border-fepucv-border focus:ring-2 focus:ring-fepucv-primary focus:outline-none"
            />
          </div>
        </div>

        <div className="overflow-hidden bg-white border border-fepucv-border rounded-fepucv shadow-sm">
          <table className="min-w-full divide-y divide-fepucv-border">
            <thead className="bg-fepucv-surface">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-fepucv-primary uppercase tracking-wider">Documento</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-fepucv-primary uppercase tracking-wider">Categoría</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-fepucv-primary uppercase tracking-wider">Año</th>
                <th scope="col" className="px-6 py-4 text-right text-xs font-bold text-fepucv-primary uppercase tracking-wider">Acción</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-fepucv-border">
              {filteredDocs.map((doc) => (
                <tr key={doc.id} className="hover:bg-fepucv-surface transition-colors group">
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">📄</span>
                      <span className="font-bold text-fepucv-secondary">{doc.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-fepucv-textSecondary">
                      {doc.category}
                    </span>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-sm text-fepucv-textSecondary">
                    {doc.year}
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-right">
                    <a 
                      href={doc.url} 
                      className="inline-flex items-center gap-2 bg-fepucv-primary text-white px-5 py-2 rounded-fepucv text-xs font-bold hover:bg-fepucv-light transition-all"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                      Descargar PDF
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
