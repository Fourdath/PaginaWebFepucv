import React, { useEffect, useRef, useState } from 'react';
import { CHARACTERS } from './characters';
import { Game, Stadium } from './Game';
import { Portrait } from './Portrait';
import { advanceCampaign, campaignPoints, matchPoints, opponentIds, STAGES } from './campaign';
import type { Campaign, MatchResult } from './campaign';
import { normalizeNickname, publishRecord, readCampaign, readGlobalRecords, readLocalRecords, readPreferredNickname, saveCampaign, saveLocalRecord, savePreferredNickname, validNickname } from './storage';
import type { RecordEntry } from './storage';
import { nicknameOptions } from './nicknames';
import './cup.css';
import './head-football.css';

const characterById = (id: number) => CHARACTERS.find(c => c.id === id)!;
const format = (n: number) => n.toLocaleString('es-CL');
export function Trophy({ className = '' }: { className?: string }) {
  return <svg className={className} viewBox="0 0 100 110" fill="none" aria-hidden="true"><path d="M25 15H10v20c0 17 15 23 28 24m37-44h15v20c0 17-15 23-28 24" stroke="currentColor" strokeWidth="7"/><path d="M24 8h52v30c0 20-10 30-26 30S24 58 24 38z" fill="currentColor"/><path d="M50 65v25m-19 12h38M37 92h26" stroke="currentColor" strokeWidth="8" strokeLinecap="round"/><path d="m50 20 4 9 10 1-8 7 2 10-8-5-8 5 2-10-8-7 10-1z" fill="#987440"/></svg>;
}

export const GameMenu: React.FC = () => {
  const [campaign, setCampaign] = useState<Campaign | null>(readCampaign);
  const [selected, setSelected] = useState(() => readCampaign()?.characterId || 1);
  const [screen, setScreen] = useState<'lobby' | 'match' | 'result'>('lobby');
  const [last, setLast] = useState<{ result: MatchResult; stage: number } | null>(null);
  const [records, setRecords] = useState<RecordEntry[]>(readLocalRecords);
  const [boardMode, setBoardMode] = useState<'loading' | 'global' | 'local'>('loading');
  const [aliases, setAliases] = useState(() => { const preferred = readPreferredNickname(); return preferred ? [preferred, ...nicknameOptions().filter(n => n !== preferred)].slice(0, 3) : nicknameOptions(); });
  const [nickname, setNickname] = useState(readPreferredNickname);
  const [lockedNickname, setLockedNickname] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');
  const [saving, setSaving] = useState(false);
  const [published, setPublished] = useState(false);
  const [newConfirm, setNewConfirm] = useState(false);
  const [storageWarning, setStorageWarning] = useState(false);
  const resultRef = useRef<HTMLElement>(null);
  const busy = useRef(false);
  const completed = !!campaign && (campaign.stage === 5 || campaign.lives === 0);
  const active = !!campaign && !completed;
  const player = characterById(campaign?.characterId || selected);
  const route = opponentIds(campaign?.characterId || selected);
  const points = campaignPoints(campaign?.results || []);

  useEffect(() => {
    let ignore = false;
    readGlobalRecords().then(data => { if (!ignore) { setRecords(data); setBoardMode('global'); } }).catch(() => { if (!ignore) setBoardMode('local'); });
    return () => { ignore = true; };
  }, []);
  useEffect(() => { if (screen === 'result') { resultRef.current?.focus({ preventScroll: true }); resultRef.current?.scrollIntoView({ block: 'center', behavior: 'smooth' }); } }, [screen]);

  const persist = (next: Campaign | null) => { setCampaign(next); setStorageWarning(!saveCampaign(next)); };
  const start = () => {
    if (active) { setScreen('match'); return; }
    const next: Campaign = { id: crypto.randomUUID(), characterId: selected, stage: 0, lives: 3, results: [] };
    persist(next); setLast(null); setPublished(false); setLockedNickname(false); setSaveStatus(''); setScreen('match');
  };
  const finishMatch = (p: number, c: number) => {
    if (!campaign) return;
    const result = { player: p, cpu: c };
    setLast({ result, stage: campaign.stage }); persist(advanceCampaign(campaign, result)); setScreen('result');
  };
  const reset = () => { persist(null); setLast(null); setNewConfirm(false); setSaveStatus(''); setPublished(false); setLockedNickname(false); setScreen('lobby'); };
  const restart = () => {
    persist({ id: crypto.randomUUID(), characterId: campaign?.characterId || selected, stage: 0, lives: 3, results: [] });
    setLast(null); setNewConfirm(false); setSaveStatus(''); setPublished(false); setLockedNickname(false); setScreen('lobby');
  };
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!campaign || busy.current || published || !validNickname(nickname) || points <= 0) return;
    busy.current = true; setSaving(true); setSaveStatus('Guardando tu marca…');
    const name = normalizeNickname(nickname);
    savePreferredNickname(name);
    const local = saveLocalRecord({ nickname: name, score: points, character_id: campaign.characterId, wins: campaign.stage, created_at: new Date().toISOString() });
    if (local.saved) setLockedNickname(true);
    try {
      const data = await publishRecord(campaign, name);
      setRecords(data); setBoardMode('global'); setPublished(true); setSaveStatus('Marca guardada en el ranking de la comunidad. El top 3 muestra la mejor marca de cada apodo.');
    } catch {
      setRecords(local.entries); setBoardMode('local');
      setSaveStatus(local.saved ? 'Marca guardada en este dispositivo. No pudimos conectar con el ranking de la comunidad; puedes volver a intentar.' : 'No pudimos guardar la marca. Habilita el almacenamiento del navegador o vuelve a intentar la conexión.');
    } finally { busy.current = false; setSaving(false); }
  };

  if (screen === 'match' && campaign && !completed) return <div className="cup"><Game key={`${campaign.id}-${campaign.results.length}`} playerChar={player} cpuChar={characterById(route[campaign.stage])} stage={campaign.stage} points={points} onGameOver={finishMatch} onExit={() => setScreen('lobby')} onRestart={restart}/></div>;

  const resultView = (screen === 'result' || completed) && campaign;
  const won = last ? last.result.player > last.result.cpu : false;
  const breakdown = last ? matchPoints(last.result, last.stage) : null;
  return <div className="cup">
    <div className="cup-topline"><span>FEPUCV <b>/</b> ARCADE CLUB</span><span className="cup-season"><i/> COPA UNIVERSITARIA</span></div>
    {storageWarning && <p className="cup-notice" role="status">El navegador no permite guardar tu avance. Puedes jugar, pero la campaña se perderá al cerrar esta página.</p>}
    {resultView ? <section className="cup-result" ref={resultRef} tabIndex={-1}>
      <div className="cup-result-art"><Trophy/><span>{campaign.stage === 5 ? 'CAMPEÓN' : completed ? 'FIN DE CAMPAÑA' : won ? 'VICTORIA' : 'REVANCHA'}</span></div>
      <div><p className="cup-eyebrow">{campaign.stage === 5 ? 'EL PUERTO TIENE CAMPEÓN' : completed ? 'GRACIAS POR DEJARLO TODO' : `DUELO ${(last?.stage || 0) + 1} COMPLETADO`}</p><h1>{campaign.stage === 5 ? 'La copa es tuya.' : completed ? 'Una buena pichanga.' : won ? 'Un paso más hacia la copa.' : last?.result.player === last?.result.cpu ? 'El empate pide revancha.' : 'Todavía queda partido.'}</h1>
        {last && <div className="cup-final-score"><span>{player.name}</span><strong>{last.result.player} <i>:</i> {last.result.cpu}</strong><span>{characterById(route[last.stage]).name}</span></div>}
        <p className="cup-result-description">{campaign.stage === 5 ? 'Venciste a toda la mesa. Tu nombre ya es parte de esta cancha.' : completed ? `Superaste ${campaign.stage} de 5 duelos. La próxima copa puede ser tuya.` : won ? `Siguiente parada: ${STAGES[campaign.stage].venue}.` : `Pierdes una vida. Te quedan ${campaign.lives}; vuelve a desafiar a tu rival.`}</p>
        <div className="cup-points-breakdown"><span>GOLES <b>+{breakdown?.goals || 0}</b></span><span>VICTORIA <b>+{breakdown?.win || 0}</b></span><span>ARCO INVICTO <b>+{breakdown?.clean || 0}</b></span>{campaign.stage === 5 && <span>COPA <b>+2.000</b></span>}<span className="total">TOTAL <b>{format(points)}</b></span></div>
        {completed && points > 0 && <form className="cup-save-form" onSubmit={submit}><fieldset disabled={published || saving || lockedNickname}><legend>Elige tu nombre de cancha <small>Solo apodos del club, para mantener el respeto en el ranking.</small></legend><div className="cup-aliases">{aliases.map(alias => <label key={alias} className={nickname === alias ? 'chosen' : ''}><input type="radio" name="cup-nickname" value={alias} checked={nickname === alias} onChange={() => setNickname(alias)} required/><span>{alias}</span></label>)}</div><button className="cup-alias-refresh" type="button" onClick={() => { setAliases(nicknameOptions()); setNickname(''); }}>↻ Ver otros apodos</button></fieldset><button className="cup-button" disabled={saving || published || !validNickname(nickname)}>{published ? '✓ Guardado' : saving ? 'Guardando…' : 'Guardar puntaje'}</button><p id="cup-save-status" role="status">{saveStatus || 'Tu apodo y puntaje serán públicos. Se guarda tu mejor marca con ese apodo.'}</p></form>}
        <div className="cup-actions">{!completed && <button className="cup-button" onClick={() => setScreen('match')}>{won ? 'Siguiente rival →' : 'Reintentar duelo →'}</button>}<button className="cup-button secondary" onClick={completed ? reset : () => setScreen('lobby')}>{completed ? 'Volver a jugar' : 'Ver mi camino'}</button></div>
      </div>
    </section> : <section className="cup-hero">
      <div className="cup-hero-copy"><p className="cup-eyebrow">CABEZA GRANDE. PASIÓN ENORME.</p><h1>La mesa entra<br/>a la <em>cancha.</em></h1><p>Cinco rivales. Una copa. Elige a tu representante y lleva el fútbol del puerto hasta lo más alto.</p><a href="#cup-lineup" className="cup-button">{active ? 'Continuar mi campaña' : 'Vamos a jugar'} <span>↗</span></a><div className="cup-hero-stats"><span><b>06</b> PERSONAJES</span><span><b>05</b> DUELOS</span><span><b>01</b> CAMPEÓN</span></div></div>
      <div className="cup-hero-art"><Stadium/><span className="cup-art-orbit"/><div className="cup-hero-player back"><Portrait character={characterById(3)}/></div><div className="cup-hero-player front"><Portrait character={characterById(5)}/></div><div className="cup-hero-trophy"><Trophy/><span>COPA<br/><b>FEPUCV</b></span></div><span className="cup-art-caption">VALPARAÍSO, CHILE <b>33° S · 71° O</b></span></div>
    </section>}

    <div className="cup-content-grid"><div className="cup-main-column">
      {!resultView && <section className="cup-panel" id="cup-lineup"><div className="cup-section-title"><div><p className="cup-eyebrow">01 / EL PLANTEL</p><h2>{active ? 'Tu representante' : 'Elige a tu protagonista'}</h2></div><span className="cup-tag">{active ? 'CAMPAÑA EN CURSO' : '6 DISPONIBLES'}</span></div>
        <div className="cup-lineup">{CHARACTERS.map(c => <button key={c.id} className={`cup-character ${(campaign?.characterId || selected) === c.id ? 'selected' : ''}`} onClick={() => setSelected(c.id)} disabled={active} aria-pressed={(campaign?.characterId || selected) === c.id} aria-label={`Elegir a ${c.name}`}><div className="cup-character-image"><Portrait character={c}/><span className="cup-shirt-number">0{c.id}</span>{(campaign?.characterId || selected) === c.id && <span className="cup-selected-check">✓</span>}</div><strong>{c.name}</strong><small>{c.role}</small></button>)}</div>
        <div className="cup-lineup-footer"><p><b>{player.name}</b><span>{active ? 'Tu avance se guarda después de cada duelo.' : 'Mismas habilidades. Tu estilo hace la diferencia.'}</span></p><button className="cup-button" onClick={start}>{active ? 'Continuar campaña' : 'Comenzar campaña'} <span>→</span></button></div>
        {active && <div className="cup-new-campaign">{newConfirm ? <><span>Vuelves al primer rival con 3 vidas y 0 puntos. Los récords se conservan.</span><button className="cup-button secondary small" onClick={restart}>Sí, reiniciar campaña</button><button className="cup-button secondary small" onClick={reset}>Reiniciar y cambiar personaje</button><button onClick={() => setNewConfirm(false)}>Cancelar</button></> : <button className="cup-button secondary small" onClick={() => setNewConfirm(true)}>↻ Reiniciar campaña</button>}</div>}
      </section>}
      <section className="cup-panel cup-route-panel"><div className="cup-section-title"><div><p className="cup-eyebrow">02 / MODO HISTORIA</p><h2>El camino a la copa</h2></div><span className="cup-lives" aria-label={`${campaign?.lives ?? 3} vidas`}>{'♥'.repeat(campaign?.lives ?? 3)}<span>{'♡'.repeat(3 - (campaign?.lives ?? 3))}</span></span></div><p className="cup-muted">Vence al resto de la mesa. Cada victoria abre un duelo más difícil.</p>
        <ol className="cup-route">{route.map((id, index) => <li key={id} className={`${index < (campaign?.stage || 0) ? 'cleared' : ''} ${index === (campaign?.stage || 0) && !completed ? 'current' : ''}`}><span className="cup-route-number">{index < (campaign?.stage || 0) ? '✓' : `0${index + 1}`}</span><Portrait character={characterById(id)}/><div><small>{STAGES[index].venue}</small><strong>{characterById(id).name}</strong><p>{STAGES[index].title}</p></div><span className="cup-difficulty"><span aria-hidden="true">{'▰'.repeat(index + 1)}<i>{'▱'.repeat(4 - index)}</i></span><small>{index < (campaign?.stage || 0) ? 'SUPERADO' : STAGES[index].level}</small></span></li>)}</ol>
      </section>
    </div><aside className="cup-sidebar"><section className="cup-panel cup-ranking"><div className="cup-section-title"><div><p className="cup-eyebrow">EL PODIO</p><h2>Los tres mejores</h2></div><Trophy/></div><p className="cup-board-scope"><i/>{boardMode === 'global' ? 'Ranking de la comunidad' : boardMode === 'loading' ? 'Conectando con la comunidad…' : 'Ranking de este dispositivo'}</p><div className="cup-podium">{[0, 1, 2].map(index => { const r = records[index]; return <div className={`cup-record rank-${index + 1}`} key={index}><span className="cup-rank-number">0{index + 1}</span>{r ? <><Portrait character={characterById(r.character_id)}/><div><b>{r.nickname}</b><small>{r.wins === 5 ? 'Campeón de la copa' : `${r.wins}/5 duelos superados`}</small></div><strong>{format(r.score)}<small>PTS</small></strong></> : <div><b>Este lugar puede ser tuyo</b><small>{index === 0 ? 'La primera leyenda está por llegar.' : 'Juega y firma tu mejor marca.'}</small></div>}</div>; })}</div><p className="cup-muted">{boardMode === 'global' ? 'Una marca por apodo. Solo las tres mejores llegan al podio.' : 'Las marcas locales se guardan en este navegador. El ranking compartido aparecerá cuando se conecte.'}</p></section>
      <section className="cup-panel cup-rulebook"><p className="cup-eyebrow">CADA JUGADA CUENTA</p><h2>Juega por la gloria.</h2><dl><div><dt>Por cada gol en una victoria</dt><dd>+100</dd></div><div><dt>Victoria × nivel del duelo</dt><dd>+500</dd></div><div><dt>Victoria con arco invicto</dt><dd>+250</dd></div><div><dt>Completar la copa</dt><dd>+2.000</dd></div></dl><p>60 segundos de juego por duelo. Una derrota o empate cuesta una vida. Los reintentos no suman puntos.</p></section>
      <section className="cup-controls-guide"><p className="cup-eyebrow">ANTES DEL PITAZO</p><div><kbd>←</kbd><kbd>→</kbd><span>Moverse · también A / D</span></div><div><kbd>↑</kbd><span>Saltar · también W</span></div><div><kbd>ESPACIO</kbd><span>Patear · también Enter</span></div><div><kbd>P</kbd><span>Pausa · también Esc</span></div><p>Disponible en computadores. Usa el teclado para moverte, saltar y patear.</p></section>
    </aside></div><div className="cup-bottomline"><span>HECHO PARA LA COMUNIDAD. JUGADO CON EL CORAZÓN.</span><span>FEPUCV / ARCADE CLUB</span></div>
  </div>;
};
