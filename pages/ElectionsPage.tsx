import React, { useState } from 'react';
import './elections.css';

type Stage = 'registration' | 'campaign' | 'silence' | 'voting';
type ElectionEvent = {
  id: string;
  title: string;
  round: 1 | 2;
  stage: Stage;
  dates: string[];
  dateLabel: string;
};

const range = (month: number, start: number, end: number) =>
  Array.from({ length: end - start + 1 }, (_, index) =>
    `2026-${String(month).padStart(2, '0')}-${String(start + index).padStart(2, '0')}`,
  );

// Fechas transcritas del afiche. El 6 de noviembre de segunda vuelta
// se conserva expresamente, según la confirmación del responsable del sitio.
const events: ElectionEvent[] = [
  { id: 'inscripcion', title: 'Inscripción de listas', round: 1, stage: 'registration', dates: ['2026-11-05', '2026-11-06', '2026-11-09'], dateLabel: '5, 6 y 9 de noviembre' },
  { id: 'campana-primera', title: 'Campaña de primera vuelta', round: 1, stage: 'campaign', dates: range(11, 12, 21), dateLabel: '12 al 21 de noviembre' },
  { id: 'silencio-primera', title: 'Silencio electoral', round: 1, stage: 'silence', dates: ['2026-11-22'], dateLabel: '22 de noviembre' },
  { id: 'votacion-primera', title: 'Votaciones de primera vuelta', round: 1, stage: 'voting', dates: range(11, 23, 24), dateLabel: '23 y 24 de noviembre' },
  { id: 'campana-segunda', title: 'Campaña de segunda vuelta', round: 2, stage: 'campaign', dates: [...range(11, 30, 30), ...range(12, 1, 5)], dateLabel: '30 de noviembre al 5 de diciembre' },
  { id: 'silencio-segunda', title: 'Silencio electoral', round: 2, stage: 'silence', dates: ['2026-11-06'], dateLabel: '6 de noviembre' },
  { id: 'votacion-segunda', title: 'Votaciones de segunda vuelta', round: 2, stage: 'voting', dates: range(12, 7, 8), dateLabel: '7 y 8 de diciembre' },
];

const stages: { key: Stage; label: string; shortLabel: string }[] = [
  { key: 'registration', label: 'Inscripción', shortLabel: 'Inscripción' },
  { key: 'campaign', label: 'Campaña', shortLabel: 'Campaña' },
  { key: 'silence', label: 'Silencio electoral', shortLabel: 'Silencio' },
  { key: 'voting', label: 'Votaciones', shortLabel: 'Votaciones' },
];

const results = [
  { name: 'Confía', votes: 1825, color: '#25634c' },
  { name: 'Nuevo Horizonte', votes: 1620, color: '#7371a5' },
  { name: 'Blancos', votes: 78, color: '#d2c6e6' },
  { name: 'Nulos', votes: 50, color: '#9baabd' },
];
const totalVotes = results.reduce((total, result) => total + result.votes, 0);
const number = (value: number) => value.toLocaleString('es-CL');
const percentage = (votes: number) => `${(votes / totalVotes * 100).toLocaleString('es-CL', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} %`;
const fullDate = (date: string) => new Date(`${date}T12:00:00`).toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' });

const CalendarIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
    <rect x="3" y="5" width="18" height="16" rx="3" />
    <path d="M7 3v4M17 3v4M3 11h18M7 15h3M14 15h3" />
  </svg>
);

const SourceLink: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => (
  <a className="elections-source" href={href} target="_blank" rel="noreferrer">{children} <span aria-hidden="true">↗</span><span className="sr-only"> (abre en otra pestaña)</span></a>
);

const ElectionCalendar: React.FC = () => {
  const [month, setMonth] = useState(11);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const monthName = month === 11 ? 'Noviembre' : 'Diciembre';
  const daysInMonth = new Date(2026, month, 0).getDate();
  const firstWeekday = (new Date(2026, month - 1, 1).getDay() + 6) % 7;
  const today = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Santiago' });
  const visibleEvents = selectedDate ? events.filter(event => event.dates.includes(selectedDate)) : events;

  const changeMonth = (nextMonth: number) => {
    setMonth(nextMonth);
    setSelectedDate(null);
  };

  return (
    <div className="elections-calendar-layout">
      <section className="elections-calendar" aria-labelledby="calendar-heading">
        <div className="elections-calendar-toolbar">
          <div>
            <p className="elections-eyebrow">Calendario electoral</p>
            <h3 id="calendar-heading" aria-live="polite">{monthName} <span>2026</span></h3>
          </div>
          <div className="elections-month-controls">
            <button type="button" onClick={() => changeMonth(11)} disabled={month === 11} aria-label="Ver noviembre de 2026">‹</button>
            <button type="button" onClick={() => changeMonth(12)} disabled={month === 12} aria-label="Ver diciembre de 2026">›</button>
          </div>
        </div>
        <p className="elections-calendar-hint">Selecciona un día para consultar sus actividades.</p>
        <div className="elections-weekdays" aria-hidden="true">
          {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(day => <span key={day}>{day}</span>)}
        </div>
        <div className="elections-days" role="group" aria-label={`${monthName} de 2026`}>
          {Array.from({ length: firstWeekday }, (_, index) => <span className="elections-empty-day" key={`empty-${index}`} aria-hidden="true" />)}
          {Array.from({ length: daysInMonth }, (_, index) => {
            const day = index + 1;
            const date = `2026-${month}-${String(day).padStart(2, '0')}`;
            const dayEvents = events.filter(event => event.dates.includes(date));
            return (
              <button
                type="button"
                key={date}
                className={`elections-day ${dayEvents.length ? 'has-events' : ''} ${selectedDate === date ? 'is-selected' : ''}`}
                onClick={() => setSelectedDate(selectedDate === date ? null : date)}
                aria-pressed={selectedDate === date}
                aria-current={today === date ? 'date' : undefined}
                aria-label={`${fullDate(date)}: ${dayEvents.length ? dayEvents.map(event => `${event.title}, ${event.round === 1 ? 'primera' : 'segunda'} vuelta`).join('; ') : 'sin actividades programadas'}`}
              >
                <span className="elections-day-number">{day}</span>
                <span className="elections-day-events" aria-hidden="true">
                  {dayEvents.map(event => <span key={event.id} className={`elections-day-chip stage-${event.stage}`}><span className="elections-chip-dot" /><span>{stages.find(stage => stage.key === event.stage)?.shortLabel}</span></span>)}
                </span>
              </button>
            );
          })}
        </div>
        <ul className="elections-legend" aria-label="Tipos de actividad">
          {stages.map(stage => <li key={stage.key}><span className={`elections-dot stage-${stage.key}`} />{stage.label}</li>)}
        </ul>
      </section>

      <section className="elections-agenda" aria-labelledby="agenda-heading">
        <div className="elections-agenda-heading">
          <div>
            <p className="elections-eyebrow">Fechas importantes</p>
            <h3 id="agenda-heading">{selectedDate ? fullDate(selectedDate) : 'Agenda del proceso'}</h3>
          </div>
          {selectedDate && <button className="elections-clear-date" type="button" onClick={() => setSelectedDate(null)}>Ver todas las fechas</button>}
        </div>
        <div aria-live="polite" aria-atomic="true">
          {[1, 2].map(round => {
            const roundEvents = visibleEvents.filter(event => event.round === round);
            if (!roundEvents.length) return null;
            return (
              <div className="elections-round" key={round}>
                <h4><span>{String(round).padStart(2, '0')}</span>{round === 1 ? 'Primera vuelta' : 'Segunda vuelta'}</h4>
                <ol>
                  {roundEvents.map(event => (
                    <li key={event.id} className={`elections-agenda-event stage-${event.stage}`}>
                      <span className="elections-event-line" aria-hidden="true" />
                      <div><p className="elections-event-date">{event.dateLabel}</p><p className="elections-event-title">{event.title}</p></div>
                    </li>
                  ))}
                </ol>
              </div>
            );
          })}
          {!visibleEvents.length && <p className="elections-no-events">No hay actividades programadas para este día. Puedes seleccionar otra fecha o ver la agenda completa.</p>}
        </div>
      </section>
    </div>
  );
};

const ElectionResults: React.FC = () => {
  let position = 0;
  const gradient = results.map(result => {
    const start = position;
    position += result.votes / totalVotes * 100;
    return `${result.color} ${start}% ${position}%`;
  }).join(', ');

  return (
    <section className="elections-results" aria-labelledby="results-heading">
      <div className="elections-section-heading">
        <div><p className="elections-eyebrow">Archivo electoral · 2025</p><h2 id="results-heading">Resultados de la Mesa Ejecutiva</h2></div>
        <span className="elections-status">Proceso finalizado</span>
      </div>
      <div className="elections-winner">
        <div><p className="elections-eyebrow">Lista ganadora</p><h3>Confía</h3><p>Confía gana a Nuevo Horizonte con una diferencia de <strong>205 votos</strong>.</p></div>
        <div className="elections-winner-stat"><strong>{number(1825)}</strong><span>votos · {percentage(1825)} del total</span></div>
      </div>
      <div className="elections-results-layout">
        <div className="elections-chart-panel">
          <h3>Distribución de votos</h3>
          <div className="elections-donut" style={{ background: `conic-gradient(${gradient})` }} role="img" aria-label={`Resultados 2025 sobre ${number(totalVotes)} votos: ${results.map(result => `${result.name}, ${number(result.votes)} votos, ${percentage(result.votes)}`).join('; ')}.`}>
            <div><strong>{number(totalVotes)}</strong><span>votos totales</span></div>
          </div>
          <p>Porcentajes calculados sobre el total de votos emitidos.</p>
        </div>
        <div className="elections-table-panel">
          <table>
            <caption>Escrutinio de las elecciones 2025</caption>
            <thead><tr><th scope="col">Lista / opción</th><th scope="col">Votos</th><th scope="col">Porcentaje</th></tr></thead>
            <tbody>{results.map(result => <tr key={result.name}><th scope="row"><span className="elections-result-name"><span className="elections-result-dot" style={{ background: result.color }} aria-hidden="true" />{result.name}</span></th><td>{number(result.votes)}</td><td>{percentage(result.votes)}</td></tr>)}</tbody>
            <tfoot><tr><th scope="row">Total</th><td>{number(totalVotes)}</td><td>100 %</td></tr></tfoot>
          </table>
          <SourceLink href="/img/elecciones/resultados-2025.png">Ver publicación de resultados 2025</SourceLink>
        </div>
      </div>
    </section>
  );
};

export const ElectionsPage: React.FC = () => {
  const [year, setYear] = useState<2026 | 2025>(2026);

  return (
    <div className="elections-page">
      <header className="elections-hero">
        <div className="elections-container">
          <p className="elections-eyebrow">Participación estudiantil · FEPUCV</p>
          <h1>Elecciones</h1>
          <p className="elections-hero-description">Tu participación construye nuestra federación. Revisa las fechas del proceso electoral y los resultados de años anteriores.</p>
          <div className="elections-year-switch" role="group" aria-label="Seleccionar proceso electoral">
            <button type="button" aria-pressed={year === 2026} onClick={() => setYear(2026)}>Elecciones 2026 <span>Calendario</span></button>
            <button type="button" aria-pressed={year === 2025} onClick={() => setYear(2025)}>Elecciones 2025 <span>Resultados</span></button>
          </div>
        </div>
      </header>

      <div className="elections-container elections-content">
        {year === 2026 ? (
          <section aria-labelledby="elections-2026-heading">
            <div className="elections-section-heading">
              <div><p className="elections-eyebrow">Noviembre — diciembre</p><h2 id="elections-2026-heading">Elecciones 2026</h2><p>Revisa las fechas importantes de primera y segunda vuelta.</p></div>
              <span className="elections-period"><CalendarIcon /> Calendario 2026</span>
            </div>
            <ElectionCalendar />
            <div className="elections-calendar-source"><p>Fechas según el calendario electoral compartido.</p><SourceLink href="/img/elecciones/calendario-2026.png">Ver calendario original</SourceLink></div>
          </section>
        ) : <ElectionResults />}

        <aside className="elections-contact" aria-labelledby="elections-contact-heading">
          <div className="elections-contact-intro"><p className="elections-eyebrow">Estamos para orientarte</p><h2 id="elections-contact-heading">¿Tienes dudas sobre las elecciones?</h2><p>Escribe a los organismos electorales para consultar sobre el proceso.</p></div>
          <div className="elections-contact-links">
            <a href="mailto:fepucvtricel@gmail.com"><span className="elections-contact-label">TRICEL FEPUCV <span aria-hidden="true">↗</span></span><span className="elections-email">fepucvtricel@gmail.com</span></a>
            <a href="mailto:comisionelectoralfederacion@gmail.com"><span className="elections-contact-label">Comisión Electoral FEPUCV <span aria-hidden="true">↗</span></span><span className="elections-email">comisionelectoralfederacion@gmail.com</span></a>
          </div>
        </aside>
      </div>
    </div>
  );
};
