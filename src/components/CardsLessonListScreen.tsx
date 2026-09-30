import { lessons } from '../content/lessons';
import { getCardsForLesson } from '../content/cards';
import { loadProgress, summarizeLessonDirection, type LessonDirectionSummary } from '../domain/progress';
import type { Direction } from '../types';
import { BackButton } from './BackButton';

interface Props {
  onBack: () => void;
  onOpenLesson: (lessonId: string) => void;
}

const DIRECTION_LABELS: Record<Direction, string> = {
  'ru-vi': 'Рус → Вьет',
  'vi-ru': 'Вьет → Рус',
  listening: 'Аудирование',
};

function DirectionProgressRow({ summary }: { summary: LessonDirectionSummary }) {
  const label = DIRECTION_LABELS[summary.direction];

  if (summary.attempted === 0) {
    return (
      <span className="lesson-progress-item">
        {label}: Ещё не занимались
      </span>
    );
  }

  return (
    <span className={summary.needsRepeat > 0 ? 'lesson-progress-item lesson-progress-alert' : 'lesson-progress-item'}>
      {label}: Попробовал {summary.attempted} из {summary.total}
      {summary.needsRepeat > 0 ? ` · Нужно повторить: ${summary.needsRepeat}` : ''}
    </span>
  );
}

export function CardsLessonListScreen({ onBack, onOpenLesson }: Props) {
  // Прогресс читается заново при каждом заходе на этот экран —
  // так после тренировки цифры обновляются без дополнительных действий.
  const progress = loadProgress();

  return (
    <div className="screen screen-photo screen-cards-list">
      <BackButton onClick={onBack} label="На главную" />
      <h1 className="screen-title">Карточки</h1>
      <ul className="lesson-list">
        {lessons.map((lesson) => {
          const cardIds = getCardsForLesson(lesson.id).map((c) => c.id);
          const count = cardIds.length;
          const ruVi = summarizeLessonDirection(progress, cardIds, 'ru-vi');
          const viRu = summarizeLessonDirection(progress, cardIds, 'vi-ru');
          const listening = summarizeLessonDirection(progress, cardIds, 'listening');
          return (
            <li key={lesson.id}>
              <button className="lesson-item" onClick={() => onOpenLesson(lesson.id)}>
                <span className="lesson-number">Урок {lesson.number}</span>
                <span className="lesson-title">{lesson.title}</span>
                {lesson.isDemo && <span className="badge">Демонстрационный</span>}
                <span className="lesson-meta">
                  {count > 0 ? `Карточек: ${count}` : 'Карточек пока нет'}
                </span>
                {count > 0 && (
                  <div className="lesson-progress">
                    <DirectionProgressRow summary={ruVi} />
                    <DirectionProgressRow summary={viRu} />
                    {listening.attempted > 0 && <DirectionProgressRow summary={listening} />}
                  </div>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
