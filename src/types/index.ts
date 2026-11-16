export type KanaType = 'hiragana' | 'katakana';
export type KanaCategory = 'gojuon' | 'dakuten' | 'handakuten' | 'yoon' | 'sokuon' | 'chouonpu';

export interface ExampleWord {
  word: string;
  romaji: string;
  meaning: string;
}

export interface KanaEntry {
  id: string;
  kana: string;
  romaji: string[];
  type: KanaType;
  category: KanaCategory;
  group: string;
  mnemonic: string;
  strokes: string[]; // Chemins SVG (KanjiVG style)
  confusables: string[]; // IDs des kana similaires
  examples: ExampleWord[];
}

export interface SRSRecord {
  kanaId: string;
  level: number;
  nextReviewDate: number;
  history: boolean[];
}