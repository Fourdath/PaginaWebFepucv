import test from 'node:test';
import assert from 'node:assert/strict';
import { advanceCampaign, campaignPoints, isCampaign, matchPoints, opponentIds, STAGES } from '../src/minijuegos/futbol-fepucv/campaign.ts';
import { createArena, stepArena, FLOOR, WIDTH } from '../src/minijuegos/futbol-fepucv/engine.ts';
import { topThree, readCampaign, saveCampaign, readLocalRecords, saveLocalRecord, validNickname } from '../src/minijuegos/futbol-fepucv/storage.ts';
import { nicknameOptions } from '../src/minijuegos/futbol-fepucv/nicknames.ts';

const fresh = () => ({ id: 'fe000000-0000-4000-8000-000000000001', characterId: 1, stage: 0, lives: 3, results: [] });
test('every representative faces all five others once, with progressive difficulty', () => {
  for (let id = 1; id <= 6; id++) { assert.equal(opponentIds(id).length, 5); assert.equal(new Set(opponentIds(id)).size, 5); assert.ok(!opponentIds(id).includes(id)); }
  STAGES.slice(1).forEach((s, i) => { assert.ok(s.speed > STAGES[i].speed); assert.ok(s.prediction > STAGES[i].prediction); assert.ok(s.kick > STAGES[i].kick); });
});
test('five victories finish the campaign and award the cup exactly once', () => {
  let c = fresh();
  for (let i = 0; i < 5; i++) c = advanceCampaign(c, { player: 2, cpu: 0 });
  assert.equal(c.stage, 5); assert.equal(c.lives, 3); assert.equal(campaignPoints(c.results), 11750); assert.ok(isCampaign(c));
  assert.deepEqual(advanceCampaign(c, { player: 99, cpu: 0 }), c);
});
test('draws and losses cost one life, keep the same rival and cannot farm points', () => {
  let c = advanceCampaign(fresh(), { player: 1, cpu: 0 });
  c = advanceCampaign(c, { player: 7, cpu: 7 });
  c = advanceCampaign(c, { player: 5, cpu: 6 });
  c = advanceCampaign(c, { player: 0, cpu: 0 });
  assert.equal(c.stage, 1); assert.equal(c.lives, 0); assert.equal(campaignPoints(c.results), 850); assert.ok(isCampaign(c));
  assert.deepEqual(advanceCampaign(c, { player: 1, cpu: 0 }), c);
  assert.equal(matchPoints({ player: 20, cpu: 20 }, 4).total, 0);
});
test('save validation rejects corrupt and impossible progression', () => {
  assert.equal(isCampaign({ ...fresh(), stage: 4 }), false);
  assert.equal(isCampaign({ ...fresh(), results: [{ player: -1, cpu: 0 }] }), false);
  assert.equal(isCampaign({ ...fresh(), results: [null] }), false);
  assert.equal(isCampaign(null), false);
});
test('podium keeps three distinct nicknames, best score and deterministic ties', () => {
  const e = (nickname, score, date = '2026-09-01') => ({ nickname, score, character_id: 1, wins: 1, created_at: date });
  const result = topThree([e('Cóndor Audaz 101', 900), e('Cóndor Audaz 101', 1000), e('Puma Veloz 202', 1000, '2026-09-02'), e('Zorro Noble 303', 800), e('León Ágil 404', 700), e('X', NaN)]);
  assert.deepEqual(result.map(r => r.nickname), ['Cóndor Audaz 101', 'Puma Veloz 202', 'Zorro Noble 303']);
  assert.ok(validNickname('Cóndor Audaz 482')); assert.ok(!validNickname('<script>')); assert.ok(!validNickname('a'));
});
test('campaign and local top three survive reload; blocked storage is handled', () => {
  const data = new Map();
  globalThis.localStorage = { getItem: k => data.get(k) || null, setItem: (k,v) => data.set(k,v), removeItem: k => data.delete(k) };
  assert.ok(saveCampaign(fresh())); assert.deepEqual(readCampaign(), fresh());
  saveLocalRecord({ nickname: 'Puma Veloz 731', score: 850, character_id: 1, wins: 1, created_at: '2026-09-01' });
  assert.equal(readLocalRecords()[0].score, 850);
  data.set('fepucv.copa.campaign.v1', '{broken'); assert.equal(readCampaign(), null);
  globalThis.localStorage = { getItem: () => { throw new Error(); }, setItem: () => { throw new Error(); } };
  assert.deepEqual(readLocalRecords(), []); assert.equal(saveCampaign(fresh()), false);
});
test('generated aliases use only the safe vocabulary and reject arbitrary text', () => {
  for (let i = 0; i < 50; i++) {
    const options = nicknameOptions();
    assert.equal(new Set(options).size, 3);
    assert.ok(options.every(validNickname));
  }
  for (const name of ['Nombre Libre', 'Insulto Audaz 123', 'Puma Insulto 123', 'Puma Veloz 000', 'Puma Veloz 731 extra', 'Puma Veloz <b>', 'Puma Veloz 731\nInsulto']) assert.equal(validNickname(name), false);
});
test('physics scores each goal once and freezes the ball during celebration', () => {
  let s = createArena(); s.ready = 0; s.ball = { x: WIDTH - 17, y: 350, vx: 3, vy: 0, rotation: 0 };
  s = stepArena(s, {}); assert.equal(s.playerScore, 1); assert.equal(s.scorer, 'player');
  for (let i = 0; i < 60; i++) s = stepArena(s, {});
  assert.equal(s.playerScore, 1);
});
test('above-crossbar shots bounce without scoring; expired matches cannot change', () => {
  let s = createArena(); s.ready = 0; s.ball = { x: 16, y: 250, vx: -5, vy: 0, rotation: 0 };
  s = stepArena(s, {}); assert.equal(s.cpuScore, 0); assert.ok(s.ball.vx > 0);
  s.remaining = 1 / 60; s = stepArena(s, {}); assert.equal(s.ended, true); assert.equal(s.remaining, 0); assert.equal(stepArena(s, { kick: true }), s);
});
test('CPU can kick and a complete simulation stays finite and finishes', () => {
  let s = createArena(); s.ready = 0; s.ball = { x: s.cpu.x - 4, y: FLOOR - 18, vx: 0, vy: 0, rotation: 0 };
  s = stepArena(s, {}, 4); assert.ok(s.ball.vx < -5);
  let count = 0;
  while (!s.ended && count++ < 18000) s = stepArena(s, { right: count % 250 < 120, left: count % 250 >= 120, jump: count % 120 < 30, kick: true }, 4);
  assert.ok(s.ended); assert.ok(Number.isFinite(s.ball.x)); assert.ok(Number.isFinite(s.player.y));
});
