import { STAGES } from './campaign.ts';
export const WIDTH = 960, HEIGHT = 540, FLOOR = 464, GOAL_TOP = 300;
const GRAVITY = 0.56, SPEED = 5, JUMP = -12.6, RADIUS = 18;
export type Body = { x: number; y: number; vx: number; vy: number; kick: number; swing: number; strike: boolean; facing: number };
export type Ball = { x: number; y: number; vx: number; vy: number; rotation: number };
export type Arena = { player: Body; cpu: Body; ball: Ball; playerScore: number; cpuScore: number; remaining: number; ready: number; goal: number; scorer: 'player' | 'cpu' | null; ended: boolean };
export type Input = { left?: boolean; right?: boolean; jump?: boolean; kick?: boolean };
const clamp = (n: number, a: number, b: number) => Math.min(b, Math.max(a, n));
const body = (x: number, facing: number): Body => ({ x, y: FLOOR - 116, vx: 0, vy: 0, kick: 0, swing: 0, strike: false, facing });
export function createArena(): Arena {
  return { player: body(210, 1), cpu: body(680, -1), ball: { x: WIDTH / 2, y: 220, vx: 0, vy: 0, rotation: 0 }, playerScore: 0, cpuScore: 0, remaining: 60, ready: 3, goal: 0, scorer: null, ended: false };
}
function move(p: Body, direction: number, jump: boolean, kick: boolean, speed: number, jumpPower: number, cooldown = 24) {
  p.vx = direction * speed;
  p.x = clamp(p.x + p.vx, 25, WIDTH - 95);
  if (direction) p.facing = direction;
  if (jump && p.y >= FLOOR - 116) p.vy = JUMP * jumpPower;
  p.vy += GRAVITY;
  p.y = Math.min(FLOOR - 116, p.y + p.vy);
  if (p.y >= FLOOR - 116) p.vy = 0;
  p.kick = Math.max(0, p.kick - 1);
  p.swing = Math.max(0, p.swing - 1);
  p.strike = kick && p.kick === 0;
  if (p.strike) { p.kick = cooldown; p.swing = 8; }
}
function collide(p: Body, b: Ball, attack: number, strength: number) {
  const dx = b.x - (p.x + 35), dy = b.y - (p.y + 37);
  const distance = Math.hypot(dx, dy);
  if (distance < 53) {
    const nx = distance > 0 ? dx / distance : attack, ny = distance > 0 ? dy / distance : 0;
    b.x = p.x + 35 + nx * 53;
    b.y = p.y + 37 + ny * 53;
    const relative = (b.vx - p.vx) * nx + (b.vy - p.vy) * ny;
    if (relative < 0) { b.vx -= 1.5 * relative * nx; b.vy -= 1.5 * relative * ny; }
    b.vx += p.vx * 0.22;
  }
  if (p.strike && (b.x - p.x - 35) * attack >= -10 && Math.hypot(b.x - (p.x + 35 + attack * 26), b.y - (p.y + 92)) < 86) {
    b.vx = attack * 8.6 * strength;
    b.vy = -7.4 * strength;
  }
}
// One deterministic 1/60-second step. Rendering frequency never changes physics.
export function stepArena(previous: Arena, input: Input, stage = 0): Arena {
  if (previous.ended) return previous;
  const s: Arena = { ...previous, player: { ...previous.player }, cpu: { ...previous.cpu }, ball: { ...previous.ball } };
  if (s.ready > 0) { s.ready = Math.max(0, s.ready - 1 / 60); return s; }
  s.remaining = Math.max(0, s.remaining - 1 / 60);
  if (s.remaining < 0.0001) { s.remaining = 0; s.ended = true; return s; }
  if (s.goal > 0) {
    s.goal = Math.max(0, s.goal - 1 / 60);
    if (!s.goal) { const fresh = createArena(); s.player = fresh.player; s.cpu = fresh.cpu; s.ball = fresh.ball; s.scorer = null; }
    return s;
  }
  const ai = STAGES[clamp(stage, 0, 4)];
  move(s.player, input.left ? -1 : input.right ? 1 : 0, !!input.jump, !!input.kick, SPEED, 1);
  const target = clamp(s.ball.x + clamp(s.ball.vx * ai.prediction, -45, 45) + 45, 65, WIDTH - 85);
  const delta = target - (s.cpu.x + 35);
  const close = Math.abs(s.ball.x - s.cpu.x - 35) < 100;
  const kickable = s.ball.x <= s.cpu.x + 45 && Math.hypot(s.ball.x - (s.cpu.x + 9), s.ball.y - (s.cpu.y + 92)) < 82;
  const defendHigh = close && s.ball.y < s.cpu.y + 20 && s.ball.vx > 1 && stage >= 2;
  move(s.cpu, Math.abs(delta) > 14 ? Math.sign(delta) : 0, defendHigh, kickable, SPEED * ai.speed, ai.jump, 65 - stage * 10);
  if (Math.abs(s.player.y - s.cpu.y) < 73 && Math.abs(s.player.x - s.cpu.x) < 64) {
    const direction = s.player.x <= s.cpu.x ? -1 : 1;
    const overlap = (64 - Math.abs(s.player.x - s.cpu.x)) / 2;
    s.player.x = clamp(s.player.x + direction * overlap, 25, WIDTH - 95);
    s.cpu.x = clamp(s.cpu.x - direction * overlap, 25, WIDTH - 95);
  }
  const b = s.ball;
  b.vy += GRAVITY * 0.78;
  b.vx *= 0.995;
  b.x += b.vx; b.y += b.vy; b.rotation += b.vx * 2;
  collide(s.player, b, 1, 1);
  collide(s.cpu, b, -1, ai.kick);
  b.vx = clamp(b.vx, -11, 11); b.vy = clamp(b.vy, -13, 13);
  if (b.y + RADIUS >= FLOOR) { b.y = FLOOR - RADIUS; b.vy = -Math.abs(b.vy) * 0.62; b.vx *= 0.98; }
  if (b.y < RADIUS) { b.y = RADIUS; b.vy = Math.abs(b.vy); }
  if (b.x < RADIUS || b.x > WIDTH - RADIUS) {
    if (b.y - RADIUS >= GOAL_TOP) {
      s.scorer = b.x < RADIUS ? 'cpu' : 'player';
      if (s.scorer === 'player') s.playerScore++; else s.cpuScore++;
      s.goal = 1.2;
    } else { b.x = clamp(b.x, RADIUS, WIDTH - RADIUS); b.vx *= -0.8; }
  }
  return s;
}
