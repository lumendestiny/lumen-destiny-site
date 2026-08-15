export type SajuInput = {
  name: string;
  birthDate: string;
  birthTime: string;
  calendar: 'solar' | 'lunar';
  gender: 'male' | 'female' | 'unspecified';
};

let current: SajuInput | null = null;

export function setSajuSession(input: SajuInput) {
  current = { ...input };
}

export function getSajuSession() {
  return current ? { ...current } : null;
}

export function clearSajuSession() {
  current = null;
}
