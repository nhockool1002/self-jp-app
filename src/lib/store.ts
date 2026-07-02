import { create } from "zustand";
import { invoke } from "@tauri-apps/api/core";
import { loadProgress, loadSettings, saveProgress, saveSettings } from "./persistence";
import type { AppMode, AppProgress, AppSettings } from "./types";

const DEFAULT_SETTINGS: AppSettings = {
  kana: { cardsPerSession: 20, intervalMs: 3000 },
  kanji: { wordsPerDay: 5, currentLevel: "N5" },
};

const DEFAULT_PROGRESS: AppProgress = {
  kanji: [],
};

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

interface AppState {
  hydrated: boolean;
  mode: AppMode;
  isCompact: boolean;
  settings: AppSettings;
  progress: AppProgress;
  hydrate: () => Promise<void>;
  setMode: (mode: AppMode) => void;
  setCompact: (compact: boolean) => Promise<void>;
  updateKanaSettings: (partial: Partial<AppSettings["kana"]>) => void;
  updateKanjiSettings: (partial: Partial<AppSettings["kanji"]>) => void;
  markKanjiStudied: (kanjiId: string) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  hydrated: false,
  mode: "kana",
  isCompact: false,
  settings: DEFAULT_SETTINGS,
  progress: DEFAULT_PROGRESS,

  hydrate: async () => {
    const [settings, progress] = await Promise.all([loadSettings(), loadProgress()]);
    set({
      settings: settings ?? DEFAULT_SETTINGS,
      progress: progress ?? DEFAULT_PROGRESS,
      hydrated: true,
    });
  },

  setMode: (mode) => set({ mode }),

  setCompact: async (compact) => {
    await invoke("toggle_compact_window", { compact });
    set({ isCompact: compact });
  },

  updateKanaSettings: (partial) => {
    const settings = { ...get().settings, kana: { ...get().settings.kana, ...partial } };
    set({ settings });
    void saveSettings(settings);
  },

  updateKanjiSettings: (partial) => {
    const settings = { ...get().settings, kanji: { ...get().settings.kanji, ...partial } };
    set({ settings });
    void saveSettings(settings);
  },

  markKanjiStudied: (kanjiId) => {
    const date = today();
    const existing = get().progress.kanji.find((r) => r.itemId === kanjiId);
    const kanji = existing
      ? get().progress.kanji.map((r) =>
          r.itemId === kanjiId
            ? { ...r, lastStudiedDate: date, timesStudied: r.timesStudied + 1 }
            : r
        )
      : [...get().progress.kanji, { itemId: kanjiId, lastStudiedDate: date, timesStudied: 1 }];
    const progress = { ...get().progress, kanji };
    set({ progress });
    void saveProgress(progress);
  },
}));

export function todayDateString(): string {
  return today();
}
