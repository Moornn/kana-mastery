// Dictionnaire des équivalences courantes pour la tolérance IME
const IME_TOLERANCE_MAP: Record<string, string[]> = {
  'shi': ['shi', 'si'],
  'tsu': ['tsu', 'tu'],
  'chi': ['chi', 'ti'],
  'fu': ['fu', 'hu'],
  'ji': ['ji', 'zi'],
  'ja': ['ja', 'zya', 'jya'],
  'ju': ['ju', 'zyu', 'jyu'],
  'jo': ['jo', 'zyo', 'jyo'],
  'sha': ['sha', 'sya'],
  'shu': ['shu', 'syu'],
  'sho': ['sho', 'syo'],
  'cha': ['cha', 'tya', 'cya'],
  'chu': ['chu', 'tyu', 'cyu'],
  'cho': ['cho', 'tyo', 'cyo'],
};

export const checkRomajiMatch = (input: string, expectedRomajiList: string[]): boolean => {
  const normalizedInput = input.trim().toLowerCase();
  
  // 1. Vérification directe (ex: l'utilisateur tape exactement un des romajis attendus)
  if (expectedRomajiList.includes(normalizedInput)) return true;

  // 2. Vérification avec tolérance IME
  for (const expected of expectedRomajiList) {
    const toleratedList = IME_TOLERANCE_MAP[expected];
    if (toleratedList && toleratedList.includes(normalizedInput)) {
      return true;
    }
  }

  return false;
};