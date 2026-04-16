import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { Character } from './types';

type Side = 'player' | 'cpu';

type PlayerState = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  facing: 1 | -1;
  kickTimer: number;
};

type BallState = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
};

type MatchState = {
  player: PlayerState;
  cpu: PlayerState;
  ball: BallState;
  score: {
    player: number;
    cpu: number;
  };
  flashGoalFor: Side | null;
};

interface GameProps {
  playerChar: Character;
  cpuChar: Character;
  onGameOver: (playerScore: number, cpuScore: number) => void;
}

type CrowdLook = {
  skin: string;
  shirt: string;
  hair: string;
};

const FIELD_WIDTH = 960;
const FIELD_HEIGHT = 540;
const GRAVITY = 0.58;
const FLOOR_Y = 474;
const PLAYER_WIDTH = 82;
const PLAYER_HEIGHT = 138;
const BALL_RADIUS = 21;
const MOVE_SPEED = 4.9;
const JUMP_SPEED = -12.9;
const KICK_DURATION = 10;
const MATCH_DURATION = 60;
const GOAL_TOP = 294;
const GOAL_BOTTOM = FLOOR_Y;
const MAX_BALL_VX = 8;
const MAX_BALL_VY = 10.5;
const AIR_DRAG = 0.996;
const GROUND_FRICTION = 0.982;
const BALL_RESTITUTION = 0.6;
const WALL_RESTITUTION = 0.74;
const KICK_HORIZONTAL_BOOST = 3.7;
const KICK_VERTICAL_BOOST = 2.1;
const PLAYER_COLLISION_X = 2.4;
const PLAYER_COLLISION_Y = 2.1;
const BLOCKED_KEYS = new Set([
  'ArrowLeft',
  'ArrowRight',
  'ArrowUp',
  'ArrowDown',
  ' ',
  'Spacebar',
  'w',
  'W',
  'a',
  'A',
  's',
  'S',
  'd',
  'D',
  'Enter',
]);
const CROWD_LOOKS: CrowdLook[] = [
  { skin: '#f2c2a5', shirt: '#24435a', hair: '#2e2521' },
  { skin: '#e4b894', shirt: '#4968c7', hair: '#3c3029' },
  { skin: '#f4d0b3', shirt: '#5b9346', hair: '#423126' },
  { skin: '#c89173', shirt: '#813f97', hair: '#1f1a18' },
  { skin: '#a86e55', shirt: '#d97431', hair: '#241915' },
  { skin: '#8d5d45', shirt: '#2d7a6f', hair: '#171311' },
  { skin: '#f0caa7', shirt: '#a64444', hair: '#4a3629' },
  { skin: '#d8a47f', shirt: '#6c56c9', hair: '#2d241f' },
  { skin: '#b77d5d', shirt: '#3c8a41', hair: '#211816' },
  { skin: '#f3c9a0', shirt: '#bc8545', hair: '#52362b' },
  { skin: '#c58a69', shirt: '#286f8a', hair: '#37251d' },
  { skin: '#ead2b1', shirt: '#8e3d5c', hair: '#49403a' },
];

const buildCrowdRow = (offset: number, count: number, step = 1) =>
  Array.from({ length: count }, (_, index) => CROWD_LOOKS[(offset + index * step) % CROWD_LOOKS.length]);

const UPPER_STAND_ROWS = [
  buildCrowdRow(0, 11, 1),
  buildCrowdRow(2, 12, 1),
  buildCrowdRow(5, 11, 2),
];

const LOWER_STAND_ROWS = [
  buildCrowdRow(1, 12, 1),
  buildCrowdRow(4, 11, 1),
  buildCrowdRow(7, 12, 2),
];

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const clampBallVelocity = (ball: BallState): BallState => ({
  ...ball,
  vx: clamp(ball.vx, -MAX_BALL_VX, MAX_BALL_VX),
  vy: clamp(ball.vy, -MAX_BALL_VY, MAX_BALL_VY),
});

const createInitialPlayer = (side: Side): PlayerState => ({
  x: side === 'player' ? 190 : FIELD_WIDTH - 190 - PLAYER_WIDTH,
  y: FLOOR_Y - PLAYER_HEIGHT,
  vx: 0,
  vy: 0,
  width: PLAYER_WIDTH,
  height: PLAYER_HEIGHT,
  facing: side === 'player' ? 1 : -1,
  kickTimer: 0,
});

const createInitialBall = (): BallState =>
  clampBallVelocity({
    x: FIELD_WIDTH / 2,
    y: 186,
    vx: Math.random() > 0.5 ? 1.9 : -1.9,
    vy: -1.2,
    radius: BALL_RADIUS,
  });

const createInitialState = (): MatchState => ({
  player: createInitialPlayer('player'),
  cpu: createInitialPlayer('cpu'),
  ball: createInitialBall(),
  score: { player: 0, cpu: 0 },
  flashGoalFor: null,
});

const resetPositions = (state: MatchState): MatchState => ({
  ...state,
  player: createInitialPlayer('player'),
  cpu: createInitialPlayer('cpu'),
  ball: createInitialBall(),
});

const headClassBySide = (side: Side) =>
  side === 'player'
    ? 'border-fepucv-primary shadow-[0_0_0_6px_rgba(168,217,191,0.3)]'
    : 'border-fepucv-secondary shadow-[0_0_0_6px_rgba(10,54,94,0.18)]';

const bodyClassBySide = (side: Side) =>
  side === 'player'
    ? 'from-fepucv-primary to-emerald-300 text-fepucv-secondary'
    : 'from-fepucv-secondary to-sky-700 text-white';

export const Game: React.FC<GameProps> = ({ playerChar, cpuChar, onGameOver }) => {
  const [state, setState] = useState<MatchState>(() => createInitialState());
  const [timeLeft, setTimeLeft] = useState(MATCH_DURATION);
  const [countdown, setCountdown] = useState(3);

  const keysRef = useRef<Record<string, boolean>>({});
  const stateRef = useRef(state);
  const endedRef = useRef(false);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    endedRef.current = false;
    keysRef.current = {};
    setState(createInitialState());
    setTimeLeft(MATCH_DURATION);
    setCountdown(3);
  }, [playerChar.id, cpuChar.id]);

  useEffect(() => {
    const down = (event: KeyboardEvent) => {
      if (BLOCKED_KEYS.has(event.key) || event.code === 'Space') {
        event.preventDefault();
      }
      keysRef.current[event.key] = true;
    };

    const up = (event: KeyboardEvent) => {
      if (BLOCKED_KEYS.has(event.key) || event.code === 'Space') {
        event.preventDefault();
      }
      keysRef.current[event.key] = false;
    };

    const clearKeys = () => {
      keysRef.current = {};
    };

    window.addEventListener('keydown', down, { passive: false });
    window.addEventListener('keyup', up, { passive: false });
    window.addEventListener('blur', clearKeys);

    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
      window.removeEventListener('blur', clearKeys);
    };
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setCountdown((current) => {
        if (current <= 1) {
          window.clearInterval(interval);
          return 0;
        }
        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [playerChar.id, cpuChar.id]);

  useEffect(() => {
    if (countdown > 0) {
      return undefined;
    }

    const interval = window.setInterval(() => {
      setTimeLeft((current) => {
        if (current <= 1) {
          if (!endedRef.current) {
            endedRef.current = true;
            const latest = stateRef.current.score;
            window.setTimeout(() => onGameOver(latest.player, latest.cpu), 250);
          }
          window.clearInterval(interval);
          return 0;
        }
        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [countdown, onGameOver]);

  useEffect(() => {
    if (countdown > 0) {
      return undefined;
    }

    let rafId = 0;
    let previous = performance.now();

    const tick = (now: number) => {
      const dt = Math.min((now - previous) / 16.6667, 1.75);
      previous = now;

      if (!endedRef.current) {
        setState((current) => updateMatch(current, keysRef.current, dt));
      }

      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(rafId);
  }, [countdown]);

  useEffect(() => {
    if (!state.flashGoalFor) {
      return undefined;
    }

    const timeout = window.setTimeout(() => {
      setState((current) => ({
        ...resetPositions(current),
        flashGoalFor: null,
      }));
    }, 900);

    return () => window.clearTimeout(timeout);
  }, [state.flashGoalFor]);

  const statusText = useMemo(() => {
    if (countdown > 0) {
      return `Comienza en ${countdown}`;
    }
    if (timeLeft === 0) {
      return 'Tiempo cumplido';
    }
    if (state.flashGoalFor === 'player') {
      return '¡Gol FEPUCV!';
    }
    if (state.flashGoalFor === 'cpu') {
      return 'Gol de la CPU';
    }
    return 'A/D o flechas para moverte, W o arriba para saltar, espacio para patear';
  }, [countdown, state.flashGoalFor, timeLeft]);

  return (
    <div className="w-full select-none">
      <div className="overflow-hidden rounded-fepucv border border-fepucv-border bg-white shadow-xl">
        <div className="relative aspect-[16/9] w-full overflow-hidden touch-none bg-[linear-gradient(180deg,#8d8f94_0%,#5a5f66_10%,#23272e_22%,#11141a_40%,#14181f_62%,#1c5124_63%,#2f7a2f_100%)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.16),transparent_32%)]" />
          <div className="absolute inset-x-0 top-0 h-[16%] bg-[linear-gradient(180deg,#babbbc_0%,#72757d_100%)] opacity-45" />
          <div className="absolute left-[-4%] top-0 h-[24%] w-[20%] rotate-[-32deg] border-t-[6px] border-r-[6px] border-red-700/95 bg-transparent" />
          <div className="absolute right-[-4%] top-0 h-[24%] w-[20%] rotate-[32deg] border-t-[6px] border-l-[6px] border-red-700/95 bg-transparent" />
          <div className="absolute inset-x-[12%] top-[4.8%] h-[0.9%] rounded-full bg-red-700/95" />
          <div className="absolute inset-x-[8%] top-[10.8%] flex items-center justify-between">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={`light-${index}`}
                className="h-4 w-4 rounded-full bg-white shadow-[0_0_18px_rgba(255,255,255,0.95)]"
              />
            ))}
          </div>

          <StandSection top="16.5%" height="17%" rows={UPPER_STAND_ROWS} />
          <StandSection top="38%" height="20%" rows={LOWER_STAND_ROWS} />
          <div className="absolute left-[31%] top-[19%] z-[6] h-[31%] w-[2.3%] bg-[linear-gradient(180deg,rgba(255,216,110,0.5),rgba(94,68,28,0.18))] opacity-70" />
          <div className="absolute right-[31%] top-[19%] z-[6] h-[31%] w-[2.3%] bg-[linear-gradient(180deg,rgba(255,216,110,0.5),rgba(94,68,28,0.18))] opacity-70" />

          <div className="absolute inset-x-[2.5%] bottom-[37%] z-[8] flex h-[7.5%] items-center justify-center gap-3 rounded-[18px] border border-white/12 bg-[linear-gradient(180deg,#30273a_0%,#181d29_100%)] px-[2.5%] shadow-[0_10px_22px_rgba(0,0,0,0.28)]">
            <BannerLights />
            <div className="mx-3 rounded-full bg-fepucv-primary/90 px-5 py-2 text-[clamp(10px,1.1vw,15px)] font-black uppercase tracking-[0.2em] text-fepucv-secondary">
              Juega limpio
            </div>
            <BannerLights reverse />
          </div>

          <div className="absolute inset-x-0 bottom-0 h-[35%] bg-[linear-gradient(180deg,#4d9946_0%,#39833b_26%,#2f7a33_100%)]" />
          <div className="absolute inset-0 bottom-0 top-[65%] bg-[linear-gradient(90deg,rgba(255,255,255,0.06)_0%,rgba(255,255,255,0.06)_12%,rgba(255,255,255,0.025)_12%,rgba(255,255,255,0.025)_24%,rgba(255,255,255,0.06)_24%,rgba(255,255,255,0.06)_36%,rgba(255,255,255,0.025)_36%,rgba(255,255,255,0.025)_48%,rgba(255,255,255,0.06)_48%,rgba(255,255,255,0.06)_60%,rgba(255,255,255,0.025)_60%,rgba(255,255,255,0.025)_72%,rgba(255,255,255,0.06)_72%,rgba(255,255,255,0.06)_84%,rgba(255,255,255,0.025)_84%,rgba(255,255,255,0.025)_100%)] opacity-60" />
          <div className="absolute inset-x-0 bottom-0 h-[35%] bg-[radial-gradient(circle_at_center_top,rgba(255,255,255,0.12),transparent_48%)]" />
          <div className="absolute left-1/2 bottom-0 z-[6] h-[35%] w-[0.45%] -translate-x-1/2 bg-white/72" />
          <div className="absolute left-1/2 bottom-[8.2%] z-[6] h-[18%] w-[13.5%] -translate-x-1/2 rounded-full border-[4px] border-white/72" />

          <Goal side="player" />
          <Goal side="cpu" />

          <div className="absolute inset-x-4 top-4 z-30 flex items-start justify-between gap-2">
            <HudPanel side="player" character={playerChar} score={state.score.player} />

            <div className="flex max-w-[32%] flex-col items-center gap-2">
              <div className="rounded-full border-4 border-white/80 bg-fepucv-secondary/92 px-6 py-2 text-3xl font-black tracking-[0.1em] text-white shadow-lg">
                {String(Math.floor(timeLeft / 60)).padStart(2, '0')}:
                {String(timeLeft % 60).padStart(2, '0')}
              </div>
              <div className="rounded-full bg-white/88 px-4 py-2 text-center text-[11px] font-bold uppercase tracking-[0.2em] text-fepucv-secondary shadow-md">
                {statusText}
              </div>
            </div>

            <HudPanel side="cpu" character={cpuChar} score={state.score.cpu} />
          </div>

          {renderCharacter(state.player, playerChar, 'player')}
          {renderCharacter(state.cpu, cpuChar, 'cpu')}

          <div
            className="absolute z-20 rounded-full border-[5px] border-white bg-[radial-gradient(circle_at_30%_30%,#ffffff_0%,#ffffff_34%,#214f74_35%,#214f74_44%,#ffffff_45%,#ffffff_100%)] shadow-[0_8px_16px_rgba(0,0,0,0.18)]"
            style={{
              width: `${(state.ball.radius * 2 / FIELD_WIDTH) * 100}%`,
              height: `${(state.ball.radius * 2 / FIELD_HEIGHT) * 100}%`,
              left: `${((state.ball.x - state.ball.radius) / FIELD_WIDTH) * 100}%`,
              top: `${((state.ball.y - state.ball.radius) / FIELD_HEIGHT) * 100}%`,
            }}
          />

          {countdown > 0 && (
            <div className="absolute inset-0 z-40 flex items-center justify-center bg-fepucv-secondary/40 backdrop-blur-[2px]">
              <div className="rounded-fepucv border border-white/30 bg-white/92 px-10 py-8 text-center shadow-2xl">
                <p className="text-xs font-bold uppercase tracking-[0.35em] text-fepucv-textSecondary">
                  Fútbol FEPUCV
                </p>
                <p className="mt-3 text-7xl font-black text-fepucv-secondary">{countdown}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const StandSection: React.FC<{
  top: string;
  height: string;
  rows: CrowdLook[][];
}> = ({ top, height, rows }) => (
  <div
    className="absolute inset-x-[4%] z-[5] overflow-hidden rounded-[28px] bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(0,0,0,0.26))] px-[3.5%] py-[2.6%] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
    style={{ top, height }}
  >
    <div className="absolute inset-0 bg-[repeating-linear-gradient(150deg,rgba(255,255,255,0.03)_0px,rgba(255,255,255,0.03)_4px,transparent_4px,transparent_22px)] opacity-45" />
    <div className="absolute inset-x-0 top-0 h-[8%] bg-white/6" />
    <div className="relative flex h-full flex-col justify-between">
      {rows.map((people, index) => (
        <CrowdRow
          key={`${top}-row-${index}`}
          people={people}
          sizeClass={index === 2 ? 'h-6 w-6' : 'h-7 w-7'}
        />
      ))}
    </div>
  </div>
);

const CrowdRow: React.FC<{
  people: CrowdLook[];
  sizeClass: string;
}> = ({ people, sizeClass }) => {
  return (
    <div className="flex items-center justify-center gap-[1.2%]">
      {people.map((person, index) => (
        <CrowdMember key={`${person.hair}-${person.shirt}-${index}`} look={person} sizeClass={sizeClass} />
      ))}
    </div>
  );
};

const CrowdMember: React.FC<{
  look: CrowdLook;
  sizeClass: string;
}> = ({ look, sizeClass }) => (
  <div className={`${sizeClass} relative shrink-0`}>
    <div
      className="absolute left-1/2 top-[6%] h-[44%] w-[58%] -translate-x-1/2 rounded-full"
      style={{ backgroundColor: look.skin }}
    />
    <div
      className="absolute left-1/2 top-[2%] h-[23%] w-[62%] -translate-x-1/2 rounded-t-full rounded-b-[35%]"
      style={{ backgroundColor: look.hair }}
    />
    <div
      className="absolute bottom-[6%] left-1/2 h-[42%] w-[88%] -translate-x-1/2 rounded-t-[10px] rounded-b-[7px]"
      style={{ backgroundColor: look.shirt }}
    />
    <div
      className="absolute bottom-[40%] left-1/2 h-[7%] w-[16%] -translate-x-[120%] rounded-full bg-black/45"
      aria-hidden="true"
    />
    <div
      className="absolute bottom-[40%] left-1/2 h-[7%] w-[16%] translate-x-[20%] rounded-full bg-black/45"
      aria-hidden="true"
    />
  </div>
);

const BannerLights: React.FC<{ reverse?: boolean }> = ({ reverse = false }) => {
  const lights = reverse
    ? ['bg-fepucv-secondary/55', 'bg-white/50', 'bg-fepucv-primary/70', 'bg-white/50']
    : ['bg-white/50', 'bg-fepucv-primary/70', 'bg-white/50', 'bg-fepucv-secondary/55'];

  return (
    <div className="flex items-center gap-2">
      {lights.map((color, index) => (
        <span
          key={`${color}-${index}`}
          className={`h-3 w-3 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.18)] ${color}`}
        />
      ))}
    </div>
  );
};

const HudPanel: React.FC<{
  side: Side;
  character: Character;
  score: number;
}> = ({ side, character, score }) => {
  const isPlayer = side === 'player';

  return (
    <div
      className={`min-w-[132px] max-w-[28%] rounded-[24px] border bg-white/88 px-3 py-3 shadow-lg backdrop-blur-sm ${
        isPlayer ? 'border-fepucv-primary/50' : 'border-fepucv-secondary/25'
      }`}
    >
      <div className={`flex items-center gap-3 ${isPlayer ? '' : 'flex-row-reverse'}`}>
        <img
          src={character.img}
          alt={character.name}
          className={`h-12 w-12 rounded-full border-4 object-cover object-top ${
            isPlayer ? 'border-fepucv-primary' : 'border-fepucv-secondary'
          }`}
        />
        <div className={isPlayer ? '' : 'text-right'}>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-fepucv-textSecondary">
            {isPlayer ? 'Jugador' : 'CPU'}
          </p>
          <p className="text-lg font-black text-fepucv-secondary">{character.name}</p>
        </div>
        <div className={`ml-auto text-4xl font-black ${isPlayer ? 'text-fepucv-secondary' : 'text-fepucv-primary'}`}>
          {score}
        </div>
      </div>
    </div>
  );
};

const Goal: React.FC<{ side: Side }> = ({ side }) => (
  <div
    className={`absolute bottom-[11%] z-[7] h-[26%] w-[9.5%] ${side === 'player' ? 'left-[1.8%]' : 'right-[1.8%]'}`}
  >
    <div
      className={`absolute inset-y-0 w-[82%] border-y-4 border-white/90 bg-[linear-gradient(90deg,rgba(255,255,255,0.25)_0%,rgba(255,255,255,0.05)_100%)] ${
        side === 'player'
          ? 'left-0 rounded-r-[20px] border-r-4'
          : 'right-0 rounded-l-[20px] border-l-4'
      }`}
    >
      <div
        className="absolute inset-0 opacity-65"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.65) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.65) 1px, transparent 1px)',
          backgroundSize: '18px 18px',
        }}
      />
    </div>
  </div>
);

const renderCharacter = (player: PlayerState, character: Character, side: Side) => {
  const frontShoeWidth = player.kickTimer > 0 ? '31%' : '23%';
  const frontShoeTransform = player.kickTimer > 0 ? 'translateX(16%)' : 'translateX(0)';

  return (
    <div
      className="absolute z-10"
      style={{
        width: `${(player.width / FIELD_WIDTH) * 100}%`,
        height: `${(player.height / FIELD_HEIGHT) * 100}%`,
        left: `${(player.x / FIELD_WIDTH) * 100}%`,
        top: `${(player.y / FIELD_HEIGHT) * 100}%`,
        transform: `scaleX(${player.facing})`,
        transformOrigin: 'center',
      }}
    >
      <div className="relative h-full w-full">
        <div
          className={`absolute left-1/2 top-0 h-[76%] w-[96%] -translate-x-1/2 overflow-hidden rounded-full border-[6px] bg-white ${headClassBySide(side)}`}
        >
          <img src={character.img} alt={character.name} className="h-full w-full object-cover object-top" />
        </div>

        <div
          className={`absolute bottom-[14%] left-1/2 h-[25%] w-[34%] -translate-x-1/2 rounded-t-[26px] rounded-b-[18px] bg-gradient-to-b ${bodyClassBySide(side)} shadow-lg`}
        >
          <div className="absolute inset-x-[26%] top-[22%] h-[16%] rounded-full bg-white/35" />
        </div>

        <div className="absolute bottom-[8%] left-[34%] h-[12%] w-[7%] rounded-full bg-fepucv-secondary/85" />
        <div className="absolute bottom-[8%] right-[34%] h-[12%] w-[7%] rounded-full bg-fepucv-secondary/85" />

        <div className="absolute bottom-[4%] left-[18%] h-[8%] w-[18%] rounded-full bg-[#2d3755] shadow-[0_3px_6px_rgba(0,0,0,0.22)]" />
        <div
          className="absolute bottom-[2.5%] right-[8%] h-[9%] rounded-full bg-[#1e2640] shadow-[0_4px_8px_rgba(0,0,0,0.28)]"
          style={{ width: frontShoeWidth, transform: frontShoeTransform }}
        />
      </div>
    </div>
  );
};

const updateMatch = (
  current: MatchState,
  keys: Record<string, boolean>,
  dt: number
): MatchState => {
  if (current.flashGoalFor) {
    return current;
  }

  const player = updateHumanPlayer(current.player, keys, dt);
  const cpu = updateCpuPlayer(current.cpu, current.ball, dt);
  let ball = updateBall(current.ball, dt);

  ball = collidePlayerWithBall(player, ball, dt);
  ball = collidePlayerWithBall(cpu, ball, dt);
  ball = applyKickImpulse(player, ball, 'player');
  ball = applyKickImpulse(cpu, ball, 'cpu');

  const goal = detectGoal(ball);
  if (goal) {
    return {
      ...current,
      player,
      cpu,
      ball,
      score: {
        player: current.score.player + (goal === 'player' ? 1 : 0),
        cpu: current.score.cpu + (goal === 'cpu' ? 1 : 0),
      },
      flashGoalFor: goal,
    };
  }

  return {
    ...current,
    player,
    cpu,
    ball,
  };
};

const updateHumanPlayer = (
  player: PlayerState,
  keys: Record<string, boolean>,
  dt: number
): PlayerState => {
  let vx = 0;
  const movingLeft = Boolean(keys.ArrowLeft || keys.a || keys.A);
  const movingRight = Boolean(keys.ArrowRight || keys.d || keys.D);
  const wantsJump = Boolean(keys.ArrowUp || keys.w || keys.W);
  const wantsKick = Boolean(keys[' '] || keys.Enter);

  if (movingLeft) {
    vx = -MOVE_SPEED;
  } else if (movingRight) {
    vx = MOVE_SPEED;
  }

  const next: PlayerState = {
    ...player,
    x: clamp(player.x + vx * dt, 0, FIELD_WIDTH - player.width),
    vx,
    vy: player.vy + GRAVITY * dt,
    kickTimer: Math.max(0, player.kickTimer - dt),
  };

  if (vx !== 0) {
    next.facing = vx > 0 ? 1 : -1;
  }

  if (wantsJump && isOnGround(player)) {
    next.vy = JUMP_SPEED;
  }

  if (wantsKick && player.kickTimer <= 0) {
    next.kickTimer = KICK_DURATION;
  }

  next.y += next.vy * dt;
  if (next.y >= FLOOR_Y - next.height) {
    next.y = FLOOR_Y - next.height;
    next.vy = 0;
  }

  return next;
};

const updateCpuPlayer = (cpu: PlayerState, ball: BallState, dt: number): PlayerState => {
  const cpuCenter = cpu.x + cpu.width / 2;
  const ballAhead = ball.x > cpuCenter + 16;
  const ballBehind = ball.x < cpuCenter - 16;
  let vx = 0;

  if (ballAhead) {
    vx = MOVE_SPEED * 0.86;
  } else if (ballBehind) {
    vx = -MOVE_SPEED * 0.86;
  }

  const next: PlayerState = {
    ...cpu,
    x: clamp(cpu.x + vx * dt, 0, FIELD_WIDTH - cpu.width),
    vx,
    vy: cpu.vy + GRAVITY * dt,
    kickTimer: Math.max(0, cpu.kickTimer - dt),
  };

  if (vx !== 0) {
    next.facing = vx > 0 ? 1 : -1;
  }

  const closeToBall = Math.abs(ball.x - cpuCenter) < 88;
  const ballIsHigh = ball.y < cpu.y + 22;
  if (closeToBall && ballIsHigh && isOnGround(cpu)) {
    next.vy = JUMP_SPEED * 0.95;
  }

  if (closeToBall && cpu.kickTimer <= 0) {
    next.kickTimer = KICK_DURATION * 0.9;
  }

  next.y += next.vy * dt;
  if (next.y >= FLOOR_Y - next.height) {
    next.y = FLOOR_Y - next.height;
    next.vy = 0;
  }

  return next;
};

const updateBall = (ball: BallState, dt: number): BallState => {
  const airDrag = Math.pow(AIR_DRAG, dt * 6);
  let next: BallState = {
    ...ball,
    x: ball.x + ball.vx * dt,
    y: ball.y + ball.vy * dt,
    vx: ball.vx * airDrag,
    vy: ball.vy + GRAVITY * 0.78 * dt,
  };

  if (next.y + next.radius >= FLOOR_Y) {
    next.y = FLOOR_Y - next.radius;
    next.vy = -Math.abs(next.vy) * BALL_RESTITUTION;
    next.vx *= GROUND_FRICTION;

    if (Math.abs(next.vy) < 0.85) {
      next.vy = 0;
    }
    if (Math.abs(next.vx) < 0.08) {
      next.vx = 0;
    }
  }

  const blockedByLeftWall = next.x - next.radius <= 0 && !isInsideGoalWindow(next.y);
  const blockedByRightWall = next.x + next.radius >= FIELD_WIDTH && !isInsideGoalWindow(next.y);

  if (blockedByLeftWall) {
    next.x = next.radius;
    next.vx = Math.abs(next.vx) * WALL_RESTITUTION;
  }
  if (blockedByRightWall) {
    next.x = FIELD_WIDTH - next.radius;
    next.vx = -Math.abs(next.vx) * WALL_RESTITUTION;
  }

  if (next.y - next.radius <= 0) {
    next.y = next.radius;
    next.vy = Math.abs(next.vy) * 0.68;
  }

  return clampBallVelocity(next);
};

const collidePlayerWithBall = (player: PlayerState, ball: BallState, dt: number): BallState => {
  const playerCenterX = player.x + player.width / 2;
  const playerCenterY = player.y + player.height * 0.38;
  const playerRadius = player.width * 0.42;
  const dx = ball.x - playerCenterX;
  const dy = ball.y - playerCenterY;
  const distance = Math.hypot(dx, dy);
  const minDistance = playerRadius + ball.radius;

  if (distance === 0 || distance >= minDistance) {
    return ball;
  }

  const nx = dx / distance;
  const ny = dy / distance;
  const overlap = minDistance - distance;

  return clampBallVelocity({
    ...ball,
    x: ball.x + nx * overlap,
    y: ball.y + ny * overlap,
    vx: ball.vx + (nx * PLAYER_COLLISION_X + player.vx * 0.34) * dt,
    vy: ball.vy + (ny * PLAYER_COLLISION_Y + player.vy * 0.22) * dt,
  });
};

const applyKickImpulse = (player: PlayerState, ball: BallState, side: Side): BallState => {
  if (player.kickTimer <= KICK_DURATION - 1.5) {
    return ball;
  }

  const kickReach = 86;
  const direction = side === 'player' ? 1 : -1;
  const playerFrontX = player.x + player.width / 2 + direction * player.width * 0.46;
  const playerFrontY = player.y + player.height * 0.71;
  const dx = ball.x - playerFrontX;
  const dy = ball.y - playerFrontY;
  const distance = Math.hypot(dx, dy);

  if (distance > kickReach) {
    return ball;
  }

  return clampBallVelocity({
    ...ball,
    vx: ball.vx + direction * KICK_HORIZONTAL_BOOST,
    vy: ball.vy - KICK_VERTICAL_BOOST,
  });
};

const isInsideGoalWindow = (ballY: number) => ballY >= GOAL_TOP && ballY <= GOAL_BOTTOM;

const detectGoal = (ball: BallState): Side | null => {
  if (ball.x - ball.radius <= 0 && isInsideGoalWindow(ball.y)) {
    return 'cpu';
  }
  if (ball.x + ball.radius >= FIELD_WIDTH && isInsideGoalWindow(ball.y)) {
    return 'player';
  }
  return null;
};

const isOnGround = (player: PlayerState) => player.y >= FLOOR_Y - player.height - 0.5;
