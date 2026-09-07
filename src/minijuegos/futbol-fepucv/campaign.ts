export type MatchResult = { player: number; cpu: number };
export type Campaign = { id: string; characterId: number; stage: number; lives: number; results: MatchResult[] };
export const STAGES = [
  { title: 'El primer pitazo', venue: 'Cancha del campus', level: 'Amateur', speed: 0.52, prediction: 0, jump: 0.75, kick: 0.65 },
  { title: 'Se enciende la barra', venue: 'Encuentro universitario', level: 'Intermedio', speed: 0.64, prediction: 4, jump: 0.83, kick: 0.78 },
  { title: 'Orgullo del puerto', venue: 'Copa de Valparaíso', level: 'Competitivo', speed: 0.76, prediction: 8, jump: 0.90, kick: 0.88 },
  { title: 'A un paso de la gloria', venue: 'Semifinal FEPUCV', level: 'Experto', speed: 0.87, prediction: 12, jump: 0.96, kick: 1 },
  { title: 'La copa se queda en casa', venue: 'Gran final FEPUCV', level: 'Leyenda', speed: 1.03, prediction: 16, jump: 1, kick: 1.12 },
] as const;
export const opponentIds = (characterId: number) => [2, 1, 6, 4, 3, 5].filter(id => id !== characterId);
// Only victories score: retries cannot be farmed for points.
export function matchPoints(result: MatchResult, stage: number) {
  if (result.player <= result.cpu) return { goals: 0, win: 0, clean: 0, total: 0 };
  const goals = result.player * 100;
  const win = 500 * (stage + 1);
  const clean = result.cpu === 0 ? 250 : 0;
  return { goals, win, clean, total: goals + win + clean };
}
export function campaignPoints(results: MatchResult[]) {
  let stage = 0;
  let points = 0;
  for (const result of results) {
    points += matchPoints(result, stage).total;
    if (result.player > result.cpu) stage++;
  }
  return points + (stage === 5 ? 2000 : 0);
}
export function advanceCampaign(campaign: Campaign, result: MatchResult): Campaign {
  if (campaign.stage >= 5 || campaign.lives <= 0) return campaign;
  return { ...campaign, stage: campaign.stage + (result.player > result.cpu ? 1 : 0), lives: campaign.lives - (result.player <= result.cpu ? 1 : 0), results: [...campaign.results, result] };
}
export function isCampaign(value: unknown): value is Campaign {
  if (!value || typeof value !== 'object') return false;
  const c = value as Campaign;
  if (typeof c.id !== 'string' || !/^[\da-f-]{36}$/i.test(c.id) || !Number.isInteger(c.characterId) || c.characterId < 1 || c.characterId > 6 || !Array.isArray(c.results) || c.results.length > 7) return false;
  let stage = 0, lives = 3;
  for (const r of c.results) {
    if (stage === 5 || lives === 0 || !r || ![r.player, r.cpu].every(n => Number.isInteger(n) && n >= 0 && n <= 40)) return false;
    if (r.player > r.cpu) stage++; else lives--;
  }
  return c.stage === stage && c.lives === lives;
}
