import { BackButton } from './BackButton';
export type NumberGameDirection = 'vi-ru' | 'ru-vi';
export function GameDirectionScreen({ onBack, onStart }: { onBack: () => void; onStart: (direction: NumberGameDirection) => void }) {
  return <div className="screen">
    <BackButton onClick={onBack} label="К играм" />
    <span className="badge">Урок 9 · Цифры 1–10</span>
    <h1 className="screen-title">Кубики на слух</h1>
    <p className="theory-note">Выбери направление игры.</p>
    <button className="lesson-item" onClick={() => onStart('vi-ru')}>
      <span className="lesson-number">Вьетнамский → Русский</span>
      <span className="lesson-title">Слушай по-вьетнамски, выбирай цифру</span>
      <span className="lesson-meta">На кубиках: 1, 2, 3…</span>
    </button>
    <button className="lesson-item" onClick={() => onStart('ru-vi')}>
      <span className="lesson-number">Русский → Вьетнамский</span>
      <span className="lesson-title">Слушай по-русски, выбирай вьетнамское слово</span>
      <span className="lesson-meta" lang="vi">На кубиках: một, hai, ba…</span>
    </button>
  </div>;
}
