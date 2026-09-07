import React, { useEffect, useRef, useState } from 'react';
import { createArena, stepArena, WIDTH, HEIGHT } from './engine';
import type { Body, Input } from './engine';
import { STAGES } from './campaign';
import type { Character } from './types';
import { Portrait } from './Portrait';

export const Stadium = React.memo(function Stadium({ stage = 0 }: { stage?: number }) {
  return <svg className="cup-stadium" viewBox="0 0 960 540" preserveAspectRatio="none" aria-hidden="true">
    <defs>
      <linearGradient id="cup-sky" x2="0" y2="1"><stop stopColor="#071321"/><stop offset="1" stopColor={stage > 2 ? '#634060' : '#27546b'}/></linearGradient>
      <linearGradient id="cup-grass" x2="0" y2="1"><stop stopColor="#237264"/><stop offset="1" stopColor="#103d39"/></linearGradient>
      <linearGradient id="cup-beam" x2="0" y2="1"><stop stopColor="#d7fff2" stopOpacity=".25"/><stop offset="1" stopColor="#d7fff2" stopOpacity="0"/></linearGradient>
      <pattern id="cup-crowd" width="22" height="24" patternUnits="userSpaceOnUse"><circle cx="6" cy="6" r="3" fill="#adcbc9"/><path d="M1 17v-5q5-5 10 0v5" fill="#53918e"/><circle cx="17" cy="18" r="2" fill="#ffd99e"/></pattern>
      <pattern id="cup-net" width="12" height="12" patternUnits="userSpaceOnUse"><path d="M12 0H0v12" fill="none" stroke="#d8f3ec" strokeOpacity=".35" strokeWidth="1"/></pattern>
    </defs>
    <path fill="url(#cup-sky)" d="M0 0h960v540H0z"/>
    <circle cx="750" cy="70" r="26" fill="#e9ecd5" opacity=".8"/>
    <path d="M0 198l85-47 60 15 65-64 87 45 78-43 92 80 104-55 79 39 75-66 94 66 61-38 80 72v130H0z" fill="#112c3d"/>
    {Array.from({ length: 36 }, (_, i) => <g key={i}><rect x={i * 29 - 20} y={180 - (i * 17 % 58)} width={20} height={90} fill={['#315461','#244251','#3b535d'][i % 3]}/><path d={`M${i * 29 - 15} ${194 - i * 17 % 58}h5m4 0h5m-14 12h5m4 0h5`} stroke="#dfb984" strokeWidth="3" opacity=".6"/></g>)}
    <path d="M0 252Q480 210 960 252v113H0z" fill="#102632"/>
    <path d="M0 254Q480 215 960 254v99H0z" fill="url(#cup-crowd)"/>
    <path d="M0 283Q480 250 960 283M0 319Q480 290 960 319" fill="none" stroke="#091e2b" strokeWidth="10"/>
    <path d="M0 353h960v30H0z" fill="#081d29"/>
    {[80, 390, 700].map(x => <text key={x} x={x} y="374" fill="#a9dac5" fontSize="13" fontFamily="sans-serif" fontWeight="700" letterSpacing="4">FEPUCV · JUEGA LIMPIO</text>)}
    <path d="M0 383h960v157H0z" fill="url(#cup-grass)"/>
    {[0, 2, 4, 6].map(i => <path key={i} d={`M${i * 120} 383h120v157H${i * 120}z`} fill="#a1e9c4" opacity=".045"/>)}
    <path d="M0 465h960M480 383v157" stroke="#c5e9d4" strokeWidth="2" opacity=".5"/>
    <ellipse cx="480" cy="465" rx="85" ry="45" fill="none" stroke="#c5e9d4" strokeWidth="2" opacity=".4"/>
    <path d="M0 418h128v95H0m960-95H832v95h128" fill="none" stroke="#c5e9d4" strokeWidth="2" opacity=".4"/>
    {[0, 890].map(x => <g key={x}><path d={`M${x} 300h70v164h-70z`} fill="url(#cup-net)"/><path d={`M${x} 464V300h70v164`} fill="none" stroke="#e0f2ef" strokeWidth="5"/><path d={`M${x} 300h70`} stroke="#abefcc" strokeWidth="7"/></g>)}
    {[90, 870].map(x => <g key={x}><path d={`M${x} 78l-180 350h360z`} fill="url(#cup-beam)"/><path d={`M${x} 78v171`} stroke="#768f99" strokeWidth="5"/><rect x={x - 42} y="64" width="84" height="19" rx="3" fill="#c3ede2"/>{[0, 1, 2, 3, 4, 5].map(i => <rect key={i} x={x - 37 + i * 13} y="68" width="9" height="10" fill="white"/>)}</g>)}
  </svg>;
});

function Footballer({ player, character, rival = false }: { player: Body; character: Character; rival?: boolean }) {
  return <div className={`cup-footballer ${rival ? 'is-rival' : ''} ${player.swing > 0 ? 'is-kicking' : ''}`} style={{ left: `${player.x / WIDTH * 100}%`, top: `${player.y / HEIGHT * 100}%` }}>
    <div className="cup-player-shadow"/><svg className="cup-single-boot" viewBox="0 0 100 65" aria-hidden="true"><path d="M8 24 24 7l21 8 10 20 34 8q10 3 7 13L8 55Z" fill="currentColor" stroke="#0a1b28" strokeWidth="5" strokeLinejoin="round"/><path d="m18 16 13 8 13-4m2 10-13 5m21 4-14 5" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round"/><path d="M9 54h86M22 56v6m22-6v6m22-6v6m19-6v6" stroke="#102330" strokeWidth="5"/></svg><Portrait character={character} cutout/>
  </div>;
}

export const Game: React.FC<{ playerChar: Character; cpuChar: Character; stage?: number; points?: number; onGameOver: (player: number, cpu: number) => void; onExit: () => void; onRestart: () => void }> = ({ playerChar, cpuChar, stage = 0, points = 0, onGameOver, onExit, onRestart }) => {
  const [arena, setArena] = useState(createArena);
  const [paused, setPaused] = useState(false);
  const [confirmRestart, setConfirmRestart] = useState(false);
  const arenaRef = useRef(arena), keys = useRef<Input>({}), touch = useRef<Input>({}), finished = useRef(false);
  const surface = useRef<HTMLDivElement>(null);
  const onEnd = useRef(onGameOver);
  onEnd.current = onGameOver;
  const pause = () => { keys.current = {}; touch.current = {}; setPaused(true); };
  useEffect(() => { surface.current?.focus({ preventScroll: true }); surface.current?.scrollIntoView({ block: 'center', behavior: 'smooth' }); }, []);
  useEffect(() => {
    const mapping: Record<string, keyof Input> = { ArrowLeft: 'left', KeyA: 'left', ArrowRight: 'right', KeyD: 'right', ArrowUp: 'jump', KeyW: 'jump', Space: 'kick', Enter: 'kick' };
    const down = (e: KeyboardEvent) => {
      if (e.code === 'Escape' || e.code === 'KeyP') { e.preventDefault(); if (e.repeat) return; keys.current = {}; touch.current = {}; setConfirmRestart(false); setPaused(p => !p); return; }
      if (e.target instanceof HTMLButtonElement || e.target instanceof HTMLInputElement) return;
      if (mapping[e.code]) { e.preventDefault(); keys.current[mapping[e.code]] = true; }
    };
    const up = (e: KeyboardEvent) => { if (mapping[e.code]) keys.current[mapping[e.code]] = false; };
    const hidden = () => { if (document.hidden) pause(); };
    window.addEventListener('keydown', down); window.addEventListener('keyup', up); window.addEventListener('blur', pause); document.addEventListener('visibilitychange', hidden);
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up); window.removeEventListener('blur', pause); document.removeEventListener('visibilitychange', hidden); };
  }, []);
  useEffect(() => {
    if (paused) return;
    let frame = 0, previous = performance.now(), accumulator = 0;
    const tick = (now: number) => {
      accumulator += Math.min(now - previous, 100); previous = now;
      while (accumulator >= 1000 / 60 && !arenaRef.current.ended) {
        const input: Input = {};
        for (const key of ['left', 'right', 'jump', 'kick'] as const) input[key] = keys.current[key] || touch.current[key];
        arenaRef.current = stepArena(arenaRef.current, input, stage);
        accumulator -= 1000 / 60;
      }
      setArena(arenaRef.current);
      if (arenaRef.current.ended) {
        if (!finished.current) { finished.current = true; onEnd.current(arenaRef.current.playerScore, arenaRef.current.cpuScore); }
        return;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [paused, stage]);
  const resume = () => { setConfirmRestart(false); setPaused(false); surface.current?.focus({ preventScroll: true }); };
  const control = (key: keyof Input, label: string, symbol: string) => <button type="button" className={`cup-control ${key === 'kick' ? 'kick' : ''}`} aria-label={label} onContextMenu={e => e.preventDefault()} onKeyDown={e => { if (e.code === 'Space' || e.code === 'Enter') { e.preventDefault(); touch.current[key] = true; } }} onKeyUp={e => { if (e.code === 'Space' || e.code === 'Enter') touch.current[key] = false; }} onBlur={() => { touch.current[key] = false; }} onPointerDown={e => { e.preventDefault(); e.currentTarget.setPointerCapture(e.pointerId); touch.current[key] = true; }} onPointerUp={() => { touch.current[key] = false; }} onPointerCancel={() => { touch.current[key] = false; }} onLostPointerCapture={() => { touch.current[key] = false; }}><b>{symbol}</b><span>{label}</span></button>;
  return <div className="cup-match" ref={surface} tabIndex={0} aria-label="Cancha de fútbol. Flechas para moverte y saltar; espacio para patear; P para pausar.">
    <div className="cup-match-heading"><div><span className="cup-eyebrow">DUELO {stage + 1} / 5 · {STAGES[stage].level}</span><h2>{STAGES[stage].venue}</h2></div><button className="cup-button secondary small" onClick={pause}>Ⅱ Pausa</button></div>
    <div className="cup-arena">
      <Stadium stage={stage}/>
      <div className="cup-scoreboard"><div className="cup-team"><Portrait character={playerChar}/><span><small>TÚ</small><b>{playerChar.name}</b></span></div><div className="cup-score"><b>{arena.playerScore}</b><span>:</span><b>{arena.cpuScore}</b><time className={arena.remaining <= 10 ? 'urgent' : ''}>{Math.ceil(arena.remaining)}<small> SEG</small></time></div><div className="cup-team rival"><span><small>RIVAL</small><b>{cpuChar.name}</b></span><Portrait character={cpuChar}/></div></div>
      <div className="cup-live"><i/> EN VIVO <span>•</span> COPA FEPUCV</div>
      <Footballer player={arena.player} character={playerChar}/><Footballer player={arena.cpu} character={cpuChar} rival/>
      <div className="cup-ball" style={{ left: `${(arena.ball.x - 18) / WIDTH * 100}%`, top: `${(arena.ball.y - 18) / HEIGHT * 100}%`, transform: `rotate(${arena.ball.rotation}deg)` }}>⬟</div>
      {arena.goal > 0 && !paused && <div className="cup-goal-toast" role="status"><strong>¡GOOOL!</strong><span>{arena.scorer === 'player' ? playerChar.name : cpuChar.name}</span></div>}
      {arena.ready > 0 && !paused && <div className="cup-countdown"><span>PREPÁRATE</span><strong>{Math.ceil(arena.ready)}</strong></div>}
      {paused && <div className="cup-pause"><span className="cup-eyebrow">{confirmRestart ? 'NUEVA OPORTUNIDAD' : 'TIEMPO FUERA'}</span><h2>{confirmRestart ? '¿Reiniciar la campaña?' : 'La cancha te espera.'}</h2>{confirmRestart ? <><p>Vuelves al primer rival con 3 vidas y 0 puntos.</p><button className="cup-button" onClick={onRestart}>Sí, reiniciar campaña</button><button className="cup-button secondary" onClick={() => setConfirmRestart(false)}>Cancelar</button><small>Los récords guardados se conservan.</small></> : <><button className="cup-button" onClick={resume}>Seguir jugando →</button><div className="cup-pause-actions"><button className="cup-button secondary" onClick={onExit}>Volver al vestuario</button><button className="cup-button secondary" onClick={() => setConfirmRestart(true)}>↻ Reiniciar campaña</button></div><small>Al volver al vestuario conservas los duelos terminados.</small></>}</div>}
    </div>
    <div className="cup-match-bottom"><p><b>{points.toLocaleString('es-CL')} PTS</b><span> Ataca hacia la derecha →</span></p><p><kbd>A</kbd><kbd>D</kbd> mover <kbd>W</kbd> saltar <kbd>ESPACIO</kbd> patear</p></div>
    <div className="cup-touch"><div>{control('left', 'Izquierda', '←')}{control('right', 'Derecha', '→')}</div><div>{control('jump', 'Saltar', '↑')}{control('kick', 'Patear', '●')}</div></div>
  </div>;
};
