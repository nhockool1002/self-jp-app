# Self JP App — v0.1.0 Release Notes

**Date:** 2026-07-03
**Platform:** macOS (Apple Silicon, built & verified) · Windows & Linux (build pipeline ready via CI, not yet verified on physical hardware — see [README.md](README.md#development))

First release. A Tauri v2 + React desktop app for daily Japanese study, built for Vietnamese speakers — all learning content and UI text is in Vietnamese.

## Highlights

- **4 learning modes**: Kana, Kanji (N5–N1), Từ vựng (Minna no Nihongo), Ngữ pháp (grammar)
- **Fully Vietnamese**: Hán-Việt kanji readings, hand-translated vocabulary, original grammar explanations
- **Animated stroke order** for every kana and kanji in the app
- **Compact floating window** for studying alongside other work

## Modes

### Kana
Random Hiragana/Katakana flashcards covering the full 208-entry table: seion, dakuten, handakuten, and yōon (combination sounds like きゃ/しゃ/ちゃ). Configurable session length and playback speed, click-to-play audio (no more auto-play — see Fixes below), and an animated stroke-order popover next to the audio button. A "📖 Bảng chữ cái" toggle swaps the flashcard view for the full gojuon reference chart in place.

### Kanji (N5–N1)
Daily kanji list sized by a configurable words-per-day setting, browsable by JLPT level. Each kanji shows its Hán-Việt reading and meaning, on'yomi/kun'yomi, stroke count, example words drawn from the Minna no Nihongo vocabulary (with Vietnamese meanings), an animated stroke-order popover, and daily study-progress tracking. Two-column layout to use the full window width.

### Từ vựng (Vocabulary)
The complete Minna no Nihongo Shokyū I & II vocabulary — 2,692 words across 50 lessons — browsable lesson by lesson, every entry translated to Vietnamese by hand.

### Ngữ pháp (Grammar)
101 grammar points across all 50 MNN lessons, each with its structure pattern, a Vietnamese explanation, 5 example sentences with audio, and a usage note for points with a common pitfall or exception.

### About
App name, version, author, and tech stack, via the ⓘ icon.

## Data & content

- **Kanji + JLPT levels**: [davidluzgouveia/kanji-data](https://github.com/davidluzgouveia/kanji-data)
- **Hán-Việt readings/meanings**: [KanjiDictVN](https://github.com/trungnt2910/KanjiDictVN) (derived from hvdic.thivien.net), covering all 2,211 kanji used by the app
- **Minna no Nihongo vocabulary structure**: [MinnaNoDS](https://github.com/vitto4/MinnaNoDS) — Vietnamese translations of all 2,692 entries are original, hand-authored work (an automated extraction attempt was too unreliable for common words)
- **Grammar content**: an original curated summary following the well-known MNN lesson progression, not a textbook transcription
- **Stroke-order data**: [KanjiVG](https://kanjivg.tagaini.net) (CC BY-SA 3.0), covering all 2,359 characters used by the app
- **Audio**: OS-native text-to-speech (`say` on macOS, PowerShell SAPI on Windows) — no bundled audio files yet, pending a clearly-licensed kana audio dataset

Full attribution and licensing details are in [README.md](README.md#data-sources).

## Fixes since initial implementation

- **Mobile**: fixed the layout overlapping the notch/Dynamic Island (iOS) and status-bar cutout (Android) — the app now insets itself using `env(safe-area-inset-*)` on all four sides
- **Mobile**: added a branded splash/intro screen shown while the app loads on startup, instead of a plain "Đang tải..." text flash
- Kana mode no longer auto-plays audio on every card change — audio now only plays on click, matching Kanji/Vocab/Grammar behavior
- Fixed a crash (infinite render loop) when opening Kanji mode, caused by a zustand selector that allocated a new object on every render
- Fixed the Kanji card visually overlapping the controls bar on smaller windows, by redesigning it as two columns (also uses ~87% of window width instead of ~62%)
- Switched to permanent light mode for contrast/readability (previously followed OS dark mode, which was hard to read)
- Stroke-order diagrams moved from always-visible inline to an icon + popover, so they don't crowd the card layout

## Known gaps

- Bundled kana audio (currently TTS-only; no clearly-licensed CC0/MIT/public-domain dataset found)
- Full example sentences for kanji (currently isolated example words, not full sentences)
- Grammar covers 1–2 core points per lesson, not exhaustive textbook coverage
- Windows and Linux builds are set up (`npm run tauri build` on that platform, or the `build` GitHub Actions workflow) but not yet run/verified on real hardware

## Build

- **macOS**: `npm run tauri build` → `.app` + `.dmg` (see [README.md](README.md#macos))
- **Windows**: `npm run tauri build` on a Windows machine → `.msi`/`.exe` (see [README.md](README.md#windows))
- **Linux**: `npm run tauri build` on a Linux machine → `.deb`/`.AppImage` (see [README.md](README.md#linux))
- **CI**: [.github/workflows/build.yml](.github/workflows/build.yml) builds macOS, Windows, and Linux on every push to `main`, on manual trigger, or on a `v*` tag (see [README.md](README.md#building-via-ci-no-macoswindowslinux-machine-needed))
