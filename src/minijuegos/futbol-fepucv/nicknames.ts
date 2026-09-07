// Keep this vocabulary in sync with copa_submit in the Supabase migration.
export const ANIMALS = ['Cóndor', 'Puma', 'Zorro', 'Halcón', 'Lince', 'León', 'Delfín', 'Pingüino', 'Búho', 'Jaguar'] as const;
export const QUALITIES = ['Audaz', 'Veloz', 'Noble', 'Valiente', 'Brillante', 'Ágil', 'Tenaz', 'Invicto', 'Leal', 'Estelar'] as const;
export const normalizeNickname = (name: string) => name.trim().replace(/\s+/g, ' ');
const allowed = new RegExp(`^(${ANIMALS.join('|')}) (${QUALITIES.join('|')}) [1-9][0-9]{2}$`);
export const validNickname = (name: string) => allowed.test(normalizeNickname(name));
export function createNickname(): string {
  const values = crypto.getRandomValues(new Uint32Array(3));
  return `${ANIMALS[values[0] % ANIMALS.length]} ${QUALITIES[values[1] % QUALITIES.length]} ${100 + values[2] % 900}`;
}
export function nicknameOptions(): string[] {
  const names = new Set<string>();
  while (names.size < 3) names.add(createNickname());
  return [...names];
}
