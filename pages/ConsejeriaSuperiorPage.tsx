import React, { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { consejeriaDocs } from "./lib/sheetsDocs";

type Consejero = {
  id: string;
  nombre: string;
  cargo?: string;
  carrera?: string;
  bio?: string;
  photo: string;
  links?: {
    instagram?: string;
    link?: string;
  };
};

export const ConsejeriaSuperiorPage: React.FC = () => {
  const consejeros: Consejero[] = useMemo(
    () => [
      {
        id: "vittore",
        nombre: "Vittore Tapia Larrañaga",
        cargo: "Consejería Superior Estudiantil 2025–2026",
        carrera: "Derecho (generación 2023)",
        bio:
          "Comprometido con una comunidad estudiantil justa, inclusiva y respetuosa, fortaleciendo la cercanía, transparencia y el bienestar integral del estudiantado.",
        photo: "/img/consejeria/Vitore.jpg",
        links: {
          instagram: "https://www.instagram.com/humitascnazucar?igsh=NHVxNjR3Znhyb2kw",
          link: "https://www.instagram.com/consejeriasuperior.pucv?igsh=MWJkMTdzbXc5MWR4bw==",
        },
      },
      {
        id: "matias-cataldo",
        nombre: "Matías Cataldo Urbina",
        cargo: "Consejería Superior",
        carrera: "Pedagogía en Historia",
        bio:
          "Representación estudiantil con enfoque en participación, gestión y articulación con las distintas unidades académicas.",
        photo: "/img/consejeria/matias-cataldo.webp",
        links: {
          link: "https://www.instagram.com/consejeriasuperior.pucv?igsh=MWJkMTdzbXc5MWR4bw==",
        },
      },
    ],
    []
  );

  const actasDoc = consejeriaDocs.find(
    (doc) => doc.key === "actas-consejeria-superior"
  );

  const reunionesUrl = "#";

  const accesosRapidos = [
    {
      key: "reuniones",
      etiqueta: "Reuniones",
      titulo: "Meet de la asamblea periódica",
      descripcion: "Enlace de acceso e indicaciones.",
      href: reunionesUrl,
      disabled: reunionesUrl === "#",
    },
    {
      key: "actas",
      etiqueta: "Documentos",
      titulo: "Actas",
      descripcion: "Repositorio y registro de sesiones en Drive.",
      href: actasDoc?.embedUrl || actasDoc?.downloadUrl || "#",
      disabled: !(actasDoc?.embedUrl || actasDoc?.downloadUrl),
    },
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index > consejeros.length - 1) setIndex(0);
  }, [index, consejeros.length]);

  if (!consejeros || consejeros.length === 0) {
    return (
      <div className="bg-fepucv-surface min-h-screen py-20">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-fepucv-secondary">
            Consejería Superior Estudiantil
          </h1>
          <p className="text-fepucv-textSecondary mt-4">
            Aún no hay integrantes cargados.
          </p>
        </div>
      </div>
    );
  }

  const safeIndex = Math.max(0, Math.min(index, consejeros.length - 1));
  const current = consejeros[safeIndex];

  const prev = () =>
    setIndex((i) => (i - 1 + consejeros.length) % consejeros.length);
  const next = () => setIndex((i) => (i + 1) % consejeros.length);

  return (
    <div className="bg-fepucv-surface min-h-screen py-20">
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h1 className="text-4xl font-bold text-fepucv-primary mb-5">
            Consejería Superior Estudiantil
          </h1>
          <p className="text-fepucv-textSecondary max-w-3xl mx-auto text-lg leading-relaxed">
            Espacio de representación y trabajo colegiado. Aquí podrás encontrar
            información general, composición actual y accesos rápidos a actas y
            reuniones.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-14">
          {accesosRapidos.map((item) => (
            <a
              key={item.key}
              href={item.href}
              target={item.disabled ? undefined : "_blank"}
              rel={item.disabled ? undefined : "noreferrer"}
              onClick={(e) => {
                if (item.disabled) e.preventDefault();
              }}
              className={`bg-white border border-fepucv-border rounded-fepucv p-6 shadow-sm transition-all flex items-center justify-between ${
                item.disabled
                  ? "opacity-60 cursor-not-allowed"
                  : "hover:shadow-md hover:border-fepucv-primary"
              }`}
            >
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-fepucv-textSecondary">
                  {item.etiqueta}
                </p>
                <h2 className="text-2xl font-bold text-fepucv-secondary mt-2">
                  {item.titulo}
                </h2>
                <p className="text-fepucv-textSecondary mt-2">
                  {item.descripcion}
                </p>
              </div>
              <span className="text-fepucv-primary text-2xl">↗</span>
            </a>
          ))}
        </div>

        <div className="mb-10">
          <div className="flex items-center justify-between gap-6 mb-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-fepucv-textSecondary">
                Composición actual
              </p>
              <h2 className="text-3xl font-bold text-fepucv-secondary mt-2">
                Consejeros Superiores Estudiantiles 2025–2026
              </h2>
            </div>

            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={prev}
                className="px-4 py-2 rounded-fepucv bg-white border border-fepucv-border hover:bg-fepucv-surface transition-colors font-bold"
                aria-label="Anterior"
              >
                ←
              </button>
              <button
                onClick={next}
                className="px-4 py-2 rounded-fepucv bg-white border border-fepucv-border hover:bg-fepucv-surface transition-colors font-bold"
                aria-label="Siguiente"
              >
                →
              </button>
            </div>
          </div>

          <div className="bg-white border border-fepucv-border rounded-fepucv shadow-sm overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="h-[360px] lg:h-[520px] bg-fepucv-surface">
                <img
                  src={current.photo}
                  alt={current.nombre}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>

              <div className="p-8 lg:p-12">
                <h3 className="text-3xl font-bold text-fepucv-secondary">
                  {current.nombre}
                </h3>

                {(current.cargo || current.carrera) && (
                  <p className="text-fepucv-primary font-bold mt-3">
                    {current.cargo ? current.cargo : ""}
                    {current.cargo && current.carrera ? " — " : ""}
                    {current.carrera ? current.carrera : ""}
                  </p>
                )}

                {current.bio && (
                  <p className="text-fepucv-textSecondary mt-6 leading-relaxed text-lg">
                    {current.bio}
                  </p>
                )}

                <div className="flex items-center gap-3 mt-8 flex-wrap">
                  {current.links?.instagram && (
                    <a
                      href={current.links.instagram}
                      className="px-4 h-10 rounded-fepucv bg-fepucv-surface border border-fepucv-border hover:bg-white transition-colors font-bold flex items-center justify-center"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Instagram
                    </a>
                  )}

                  {current.links?.link && (
                    <a
                      href={current.links.link}
                      className="px-4 h-10 rounded-fepucv bg-fepucv-surface border border-fepucv-border hover:bg-white transition-colors font-bold flex items-center justify-center"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Perfil consejería
                    </a>
                  )}
                </div>

                <div className="flex gap-2 mt-10">
                  {consejeros.map((c, i) => (
                    <button
                      key={c.id}
                      onClick={() => setIndex(i)}
                      className={`w-2.5 h-2.5 rounded-full transition-all ${
                        i === safeIndex ? "bg-fepucv-primary" : "bg-fepucv-border"
                      }`}
                      aria-label={`Ver ${c.nombre}`}
                    />
                  ))}
                </div>

                <div className="flex md:hidden items-center gap-3 mt-8">
                  <button
                    onClick={prev}
                    className="w-full py-3 rounded-fepucv bg-white border border-fepucv-border hover:bg-fepucv-surface transition-colors font-bold"
                  >
                    ← Anterior
                  </button>
                  <button
                    onClick={next}
                    className="w-full py-3 rounded-fepucv bg-white border border-fepucv-border hover:bg-fepucv-surface transition-colors font-bold"
                  >
                    Siguiente →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 bg-fepucv-secondary rounded-fepucv p-12 text-white flex flex-col md:flex-row items-center gap-8 justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-4">¿Necesitas contactarnos?</h2>
            <p className="text-gray-300">
              Escríbenos y te ayudamos a canalizar tu solicitud o consulta.
            </p>
          </div>
          <Link
            to="/contacto"
            className="whitespace-nowrap bg-fepucv-primary px-10 py-5 rounded-fepucv font-bold text-lg hover:bg-fepucv-light transition-all"
          >
            Ir a Contacto
          </Link>
        </div>
      </div>
    </div>
  );
};