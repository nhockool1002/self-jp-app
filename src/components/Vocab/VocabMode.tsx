import { useState } from "react";
import vocabData from "../../data/vocab-mnn.json";
import { playAudio } from "../../lib/audio";
import type { VocabDataset, VocabEntry } from "../../lib/types";
import { LessonPicker } from "./LessonPicker";
import { VocabWordCard } from "./VocabWordCard";

const VOCAB: VocabDataset = vocabData as VocabDataset;
const LESSON_COUNT = Object.keys(VOCAB).length;

function speak(entry: VocabEntry) {
  void playAudio({ type: "tts", text: entry.kana });
}

export function VocabMode({ compact }: { compact: boolean }) {
  const [lesson, setLesson] = useState(1);
  const [index, setIndex] = useState(0);
  const words = VOCAB[String(lesson)] ?? [];

  function changeLesson(newLesson: number) {
    setLesson(newLesson);
    setIndex(0);
  }

  if (compact) {
    const current = words[Math.min(index, words.length - 1)];
    if (!current) {
      return <div className="mode-compact">No vocab available for this lesson.</div>;
    }
    return (
      <div className="mode-compact">
        <VocabWordCard entry={current} onPlayAudio={() => speak(current)} />
        <div className="kana-controls">
          <button onClick={() => setIndex((i) => Math.max(i - 1, 0))} disabled={index === 0}>
            ◀
          </button>
          <span className="kana-progress">
            {index + 1} / {words.length} (Lesson {lesson})
          </span>
          <button
            onClick={() => setIndex((i) => Math.min(i + 1, words.length - 1))}
            disabled={index === words.length - 1}
          >
            ▶
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mode vocab-mode">
      <h2>Minna no Nihongo Vocabulary</h2>
      <LessonPicker lesson={lesson} lessonCount={LESSON_COUNT} onChange={changeLesson} />
      <div className="vocab-word-list">
        {words.map((entry) => (
          <VocabWordCard key={entry.id} entry={entry} onPlayAudio={() => speak(entry)} />
        ))}
      </div>
    </div>
  );
}
