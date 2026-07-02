export type AppMode = "kana" | "kanji" | "vocab";

export type JlptLevel = "N5" | "N4" | "N3" | "N2" | "N1";

export interface KanaEntry {
  type: "hiragana" | "katakana";
  romaji: string;
  char: string;
  audioFile: string | null;
}

export interface KanjiExampleWord {
  word: string;
  reading: string;
}

export interface KanjiEntry {
  kanji: string;
  jlpt: JlptLevel;
  strokes: number | null;
  meanings: string[];
  onyomi: string[];
  kunyomi: string[];
  exampleWords: KanjiExampleWord[];
}

export type KanjiDataset = Record<JlptLevel, KanjiEntry[]>;

export interface VocabEntry {
  id: string;
  editions: number[];
  kanji: string | null;
  kana: string;
  romaji: string;
  meaning: string;
}

export type VocabDataset = Record<string, VocabEntry[]>;

export interface AppSettings {
  kana: {
    cardsPerSession: number;
    intervalMs: number;
  };
  kanji: {
    wordsPerDay: number;
    currentLevel: JlptLevel;
  };
}

export interface ProgressRecord {
  itemId: string;
  lastStudiedDate: string; // YYYY-MM-DD
  timesStudied: number;
}

export interface AppProgress {
  kanji: ProgressRecord[];
}
