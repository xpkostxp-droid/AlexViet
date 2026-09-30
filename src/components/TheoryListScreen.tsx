import { lessons } from '../content/lessons';
import { BackButton } from './BackButton';

interface Props {
  onBack: () => void;
  onOpenLesson: (lessonId: string) => void;
}

export function TheoryListScreen({ onBack, onOpenLesson }: Props) {
  return (
    <div className="screen screen-photo screen-theory-list">
      <BackButton onClick={onBack} label="На главную" />
      <h1 className="screen-title">Теория</h1>
      <ul className="lesson-list">
        {lessons.map((lesson) => (
          <li key={lesson.id}>
            <button className="lesson-item" onClick={() => onOpenLesson(lesson.id)}>
              <span className="lesson-number">Урок {lesson.number}</span>
              <span className="lesson-title">{lesson.title}</span>
              {lesson.isDemo && <span className="badge">Демонстрационный</span>}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
