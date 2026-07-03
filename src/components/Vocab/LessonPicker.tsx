interface LessonPickerProps {
  lesson: number;
  lessonCount: number;
  onChange: (lesson: number) => void;
}

export function LessonPicker({ lesson, lessonCount, onChange }: LessonPickerProps) {
  return (
    <label className="field-compact">
      Lesson
      <select value={lesson} onChange={(e) => onChange(Number(e.target.value))}>
        {Array.from({ length: lessonCount }, (_, i) => i + 1).map((n) => (
          <option key={n} value={n}>
            {n}
          </option>
        ))}
      </select>
    </label>
  );
}
