# Bundled kana audio (placeholder)

No files here yet. Initial research didn't turn up a clearly-licensed (CC0/MIT/public-domain)
kana pronunciation dataset, so the Kana mode currently uses OS-native TTS for all cards
(see `src/lib/audio.ts` and `src-tauri/src/commands.rs::tts_speak`).

To add bundled audio later: drop files here (e.g. `a.mp3`, `ka.mp3`, matching the `romaji`
field in `src/data/kana.json`), then set the corresponding `audioFile` field in that JSON
to the file path. No other code changes are needed — `playAudio()` already branches on
whether `audioFile` is set.
