import { Store } from "@tauri-apps/plugin-store";
import type { AppProgress, AppSettings } from "./types";

let settingsStore: Store | null = null;
let progressStore: Store | null = null;

async function getSettingsStore(): Promise<Store> {
  if (!settingsStore) {
    settingsStore = await Store.load("settings.json");
  }
  return settingsStore;
}

async function getProgressStore(): Promise<Store> {
  if (!progressStore) {
    progressStore = await Store.load("progress.json");
  }
  return progressStore;
}

export async function loadSettings(): Promise<AppSettings | undefined> {
  const store = await getSettingsStore();
  return store.get<AppSettings>("settings");
}

export async function saveSettings(settings: AppSettings): Promise<void> {
  const store = await getSettingsStore();
  await store.set("settings", settings);
  await store.save();
}

export async function loadProgress(): Promise<AppProgress | undefined> {
  const store = await getProgressStore();
  return store.get<AppProgress>("progress");
}

export async function saveProgress(progress: AppProgress): Promise<void> {
  const store = await getProgressStore();
  await store.set("progress", progress);
  await store.save();
}
