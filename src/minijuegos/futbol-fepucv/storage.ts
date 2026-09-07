import { campaignPoints, isCampaign } from './campaign.ts';
import type { Campaign } from './campaign.ts';
import { normalizeNickname, validNickname } from './nicknames.ts';
export { normalizeNickname, validNickname } from './nicknames.ts';
export type RecordEntry = { nickname: string; score: number; character_id: number; wins: number; created_at: string };
const SAVE = 'fepucv.copa.campaign.v1', BOARD = 'fepucv.copa.top3.v1';
export function readPreferredNickname(): string {
  try { const name = localStorage.getItem('fepucv.copa.alias.v1') || ''; return validNickname(name) ? name : ''; } catch { return ''; }
}
export function savePreferredNickname(name: string) {
  try { if (validNickname(name)) localStorage.setItem('fepucv.copa.alias.v1', normalizeNickname(name)); } catch { /* Ranking save reports storage failures separately. */ }
}
export function readCampaign(): Campaign | null {
  try { const c = JSON.parse(localStorage.getItem(SAVE) || 'null'); return isCampaign(c) ? c : null; } catch { return null; }
}
export function saveCampaign(campaign: Campaign | null) {
  try { if (campaign) localStorage.setItem(SAVE, JSON.stringify(campaign)); else localStorage.removeItem(SAVE); return true; } catch { return false; }
}
export function isRecord(r: unknown): r is RecordEntry {
  if (!r || typeof r !== 'object') return false;
  const e = r as RecordEntry;
  return typeof e.nickname === 'string' && validNickname(e.nickname) && Number.isInteger(e.score) && e.score > 0 && e.score <= 30750 && Number.isInteger(e.character_id) && e.character_id >= 1 && e.character_id <= 6 && Number.isInteger(e.wins) && e.wins >= 1 && e.wins <= 5 && typeof e.created_at === 'string' && Number.isFinite(Date.parse(e.created_at));
}
export function topThree(entries: RecordEntry[]) {
  const sorted = entries.filter(isRecord).sort((a, b) => b.score - a.score || b.wins - a.wins || a.created_at.localeCompare(b.created_at) || a.nickname.localeCompare(b.nickname));
  const seen = new Set<string>();
  return sorted.filter(e => { const key = e.nickname.toLocaleLowerCase('es'); if (seen.has(key)) return false; seen.add(key); return true; }).slice(0, 3);
}
export function readLocalRecords(): RecordEntry[] {
  try { const data = JSON.parse(localStorage.getItem(BOARD) || '[]'); return Array.isArray(data) ? topThree(data) : []; } catch { return []; }
}
export function saveLocalRecord(entry: RecordEntry) {
  const entries = topThree([...readLocalRecords(), entry]);
  try { localStorage.setItem(BOARD, JSON.stringify(entries)); return { entries, saved: true }; } catch { return { entries, saved: false }; }
}
// Publishable configuration is intentionally versioned: it grants no table access.
// Dedicated overrides avoid the portal's older, unrelated Supabase configuration.
const url = import.meta.env?.VITE_COPA_SUPABASE_URL || 'https://kvelueguheafshtntehu.supabase.co';
const key = import.meta.env?.VITE_COPA_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_f1CIsT5VgLAhj_aEW8OZRQ_NArlcuFv';
async function rpc(name: string, args = {}) {
  if (!url || !key) throw new Error('Ranking compartido sin configurar');
  const response = await fetch(`${url.replace(/\/$/, '')}/rest/v1/rpc/${name}`, { method: 'POST', headers: { apikey: key, 'Content-Type': 'application/json' }, body: JSON.stringify(args), signal: AbortSignal.timeout(8000) });
  if (!response.ok) throw new Error('Ranking compartido no disponible');
  return response.json();
}
export async function readGlobalRecords(): Promise<RecordEntry[]> {
  const result = await rpc('copa_top3');
  if (!Array.isArray(result) || !result.every(isRecord)) throw new Error('Respuesta de ranking inválida');
  return result;
}
export async function publishRecord(campaign: Campaign, nickname: string) {
  if (!isCampaign(campaign) || !validNickname(nickname) || campaignPoints(campaign.results) === 0) throw new Error('Puntaje inválido');
  await rpc('copa_submit', { p_run_id: campaign.id, p_nickname: normalizeNickname(nickname), p_character_id: campaign.characterId, p_results: campaign.results });
  return readGlobalRecords();
}
