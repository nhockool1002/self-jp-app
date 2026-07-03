import { useState } from "react";
import grammarData from "../../data/grammar-mnn.json";
import { playAudio } from "../../lib/audio";
import type { GrammarDataset } from "../../lib/types";
import { LessonPicker } from "../Vocab/LessonPicker";
import { GrammarPointCard } from "./GrammarPointCard";

const GRAMMAR: GrammarDataset = grammarData as GrammarDataset;
const LESSON_COUNT = Object.keys(GRAMMAR).length;

function speak(text: string) {
  void playAudio({ type: "tts", text });
}

export function GrammarMode({ compact }: { compact: boolean }) {
  const [lesson, setLesson] = useState(1);
  const [index, setIndex] = useState(0);
  const points = GRAMMAR[String(lesson)] ?? [];

  function changeLesson(newLesson: number) {
    setLesson(newLesson);
    setIndex(0);
  }

  if (compact) {
    const current = points[Math.min(index, points.length - 1)];
    if (!current) {
      return <div className="mode-compact">Không có ngữ pháp cho bài này.</div>;
    }
    return (
      <div className="mode-compact">
        <GrammarPointCard point={current} onPlayAudio={speak} compact />
        <div className="kana-controls">
          <button onClick={() => setIndex((i) => Math.max(i - 1, 0))} disabled={index === 0}>
            ◀
          </button>
          <span className="kana-progress">
            {index + 1} / {points.length} (Bài {lesson})
          </span>
          <button
            onClick={() => setIndex((i) => Math.min(i + 1, points.length - 1))}
            disabled={index === points.length - 1}
          >
            ▶
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mode-page">
      <div className="mode-controls-bar">
        <LessonPicker lesson={lesson} lessonCount={LESSON_COUNT} onChange={changeLesson} />
        <span className="progress-count">{points.length} mục ngữ pháp</span>
      </div>

      <div className="mode-stage mode-stage-scroll">
        <div className="grammar-list">
          {points.map((point) => (
            <GrammarPointCard key={point.title} point={point} onPlayAudio={speak} />
          ))}
        </div>
      </div>
    </div>
  );
}
