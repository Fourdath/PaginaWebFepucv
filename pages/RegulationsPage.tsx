import React, { useMemo, useState } from "react";
import { documentosDocs } from "./lib/sheetsDocs";

export const RegulationsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredDocs = useMemo(() => {
    return documentosDocs.filter((doc) =>
      doc.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  return (
    <div className="bg-fepucv-primary/10 min-h-screen py-20">
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h1 className="text-3xl md:text-4xl font-bold text-fepucv-secondary mb-4">
            Documentos
          </h1>
          <p className="text-fepucv-textSecondary max-w-2xl mx-auto">
            Revisa estatutos, reglamentos, manuales y otros documentos oficiales
            de la federación.
          </p>
        </div>

        <div className="mb-12 flex justify-center">
          <div className="w-full max-w-2xl">
            <input
              type="text"
              placeholder="Buscar documento por nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-6 py-4 bg-white rounded-fepucv border border-fepucv-border focus:ring-2 focus:ring-fepucv-primary focus:outline-none shadow-sm"
            />
          </div>
        </div>

        {filteredDocs.length === 0 ? (
          <div className="bg-white border border-fepucv-border rounded-fepucv shadow-sm p-10 text-center">
            <p className="text-fepucv-textSecondary">
              No se encontraron documentos con ese nombre.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredDocs.map((doc) => {
              const href = doc.embedUrl || doc.downloadUrl || "#";
              const disabled = href === "#";
              const label = (doc.type || "DOC").toUpperCase();

              return (
                <div
                  key={doc.key}
                  className="bg-white p-8 rounded-fepucv border border-fepucv-border flex flex-col items-center text-center hover:shadow-xl transition-all shadow-sm"
                >
                  <div className="w-16 h-16 bg-fepucv-primary/20 rounded-full flex items-center justify-center text-2xl mb-6">
                    📄
                  </div>

                  <h4 className="font-bold text-fepucv-secondary mb-6 flex-grow text-xl leading-snug">
                    {doc.title}
                  </h4>

                  <a
                    href={href}
                    target={disabled ? undefined : "_blank"}
                    rel={disabled ? undefined : "noreferrer"}
                    onClick={(e) => {
                      if (disabled) e.preventDefault();
                    }}
                    className={`w-full py-3 rounded-full font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                      disabled
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-fepucv-secondary text-white hover:bg-fepucv-secondary/80"
                    }`}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                    Ver / Descargar {label}
                  </a>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};