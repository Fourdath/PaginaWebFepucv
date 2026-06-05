import React from 'react';
import { Link } from 'react-router-dom';

const resignationLetter = [
  'Federación de Estudiantes PUCV Rawson #47 Pontificia Universidad Católica de Valparaíso',
  'Estimada comunidad estudiantil:',
  'Por medio de la presente, me dirijo a ustedes para formalizar mi renuncia al cargo de Presidente de la Federación de Estudiantes.',
  'Ha sido un período profundamente significativo en mi vida personal, estudiantil y política. Asumí este desafío con la convicción de que la representación estudiantil debe construirse desde el compromiso, la escucha y el trabajo colectivo, intentando siempre desempeñar este rol con responsabilidad, empatía y honestidad.',
  'Durante este tiempo habité experiencias que me marcarán profundamente, tanto por los desafíos enfrentados como por las personas que encontré en el camino. Agradezco sinceramente a toda la comunidad estudiantil por la confianza depositada en mí, por el apoyo, las críticas, las conversaciones compartidas y también por exigir constantemente una federación más presente y consciente de las distintas realidades que atraviesan a nuestro estudiantado.',
  'Quiero también agradecer a la institución, y a quienes la componen, por abrir espacios de diálogo incluso en momentos complejos, permitiendo que muchas discusiones necesarias pudieran darse desde el respeto y la disposición a construir en conjunto.',
  'Esta decisión nace a partir de una reflexión íntima y honesta respecto a cómo he vivido este espacio durante los últimos meses. Sostener responsabilidades de representación también implica atravesar tensiones, silencios y desgastes que muchas veces permanecen fuera de lo visible, y hoy considero que dar un paso al costado es la decisión más coherente conmigo misma y con el proceso colectivo.',
  'Aun así, me retiro con un profundo aprendizaje y con la convicción intacta de que la organización estudiantil sigue siendo una herramienta fundamental para transformar nuestras realidades. Espero sinceramente que más estudiantes se atrevan a participar, a incomodarse, a construir comunidad y a imaginar nuevas formas de habitar la universidad, porque son precisamente estos espacios los que permiten levantar una educación más justa, más consciente y más comprometida con el bienestar estudiantil.',
  'No siento esta decisión como un cierre definitivo, sino más bien como un cambio de lugar desde donde seguir construyendo. Hay convicciones, afectos y experiencias que no se abandonan al dejar un cargo; permanecen habitando la forma en que una mira y se relaciona con su comunidad. Seguiré presente, quizás desde otra vereda, pero siempre creyendo profundamente en la organización estudiantil y en la importancia de cuidar estos espacios colectivos.',
  'La política estudiantil necesita de personas con sensibilidad, convicción y ganas de construir colectivamente, incluso en tiempos difíciles. Confío en que seguirán existiendo estudiantes dispuestos a sostener y defender estos espacios con responsabilidad, empatía y cariño por su comunidad.',
  'Gracias nuevamente por la confianza, el acompañamiento y el cariño entregado durante este proceso.',
];

export const ResignationLetterPage: React.FC = () => {
  return (
    <div className="bg-white min-h-screen py-20">
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="inline-flex items-center text-sm font-bold text-fepucv-textSecondary hover:text-fepucv-secondary transition-colors mb-10"
        >
          Volver al inicio
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-10 lg:gap-16 items-start">
          <aside className="w-full max-w-[260px] mx-auto lg:mx-0">
            <div className="aspect-[4/5] overflow-hidden rounded-fepucv border border-fepucv-border shadow-sm bg-fepucv-surface">
              <img
                src="/img/mesa/valeria_aguilera.jpeg"
                alt="Valeria Aguilera"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="mt-5 text-center lg:text-left">
              <p className="text-[10px] font-bold uppercase tracking-widest text-fepucv-primary">
                Expresidenta
              </p>
              <h2 className="mt-1 text-xl font-bold text-fepucv-secondary">
                Valeria Aguilera
              </h2>
            </div>
          </aside>

          <section>
            <p className="text-xs font-bold uppercase tracking-widest text-fepucv-primary mb-3">
              Documento institucional
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-fepucv-secondary mb-6">
              Carta de renuncia
            </h1>

            <div className="border-y border-fepucv-border py-6 mb-8">
              <p className="text-xs font-bold uppercase tracking-widest text-fepucv-textSecondary mb-2">
                Fecha de renuncia
              </p>
              <p className="text-lg font-semibold text-fepucv-secondary">
                15 de mayo
              </p>
            </div>

            <article className="bg-fepucv-surface border border-fepucv-border rounded-fepucv p-8 md:p-10">
              <p className="text-xs font-bold uppercase tracking-widest text-fepucv-textSecondary mb-5">
                Carta
              </p>
              <div className="space-y-5 text-lg text-fepucv-textSecondary leading-relaxed">
                {resignationLetter.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
                <div className="pt-4 text-fepucv-secondary font-semibold">
                  <p>Con respeto y afecto,</p>
                  <p className="mt-4">Valeria Aguilera</p>
                  <p>Presidente FEPUCV 2025 - 2026</p>
                </div>
              </div>
            </article>
          </section>
        </div>
      </div>
    </div>
  );
};
