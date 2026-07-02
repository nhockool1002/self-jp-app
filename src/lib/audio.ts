import { invoke } from "@tauri-apps/api/core";

export type AudioSource =
  | { type: "file"; path: string }
  | { type: "tts"; text: string };

export async function playAudio(source: AudioSource): Promise<void> {
  if (source.type === "file") {
    const audio = new Audio(source.path);
    await audio.play();
    return;
  }
  await invoke("tts_speak", { text: source.text });
}
