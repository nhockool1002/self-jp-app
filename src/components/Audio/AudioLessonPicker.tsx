interface AudioLessonPickerProps {
  lessonCount: number;
  selectedLessons: number[];
  onChange: (lessons: number[]) => void;
}

export function AudioLessonPicker({ lessonCount, selectedLessons, onChange }: AudioLessonPickerProps) {
  const selected = new Set(selectedLessons);
  const allLessons = Array.from({ length: lessonCount }, (_, i) => i + 1);

  function toggleLesson(n: number) {
    const next = new Set(selected);
    if (next.has(n)) {
      next.delete(n);
    } else {
      next.add(n);
    }
    onChange([...next].sort((a, b) => a - b));
  }

  return (
    <div className="audio-lesson-picker">
      <div className="audio-lesson-actions">
        <span className="progress-count">{selectedLessons.length} bài đã chọn</span>
        <button onClick={() => onChange(allLessons)}>Chọn tất cả</button>
        <button onClick={() => onChange([])}>Bỏ chọn</button>
      </div>
      <div className="audio-lesson-grid">
        {allLessons.map((n) => (
          <button
            key={n}
            className={selected.has(n) ? "audio-lesson-btn audio-lesson-btn-active" : "audio-lesson-btn"}
            onClick={() => toggleLesson(n)}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  );
}
