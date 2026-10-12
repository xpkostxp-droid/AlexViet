import { BackButton } from './BackButton';
export function GamesListScreen({ onBack, onOpenNumbers }: { onBack: () => void; onOpenNumbers: () => void }) {
  return <div className="screen">
    <BackButton onClick={onBack} label="На главную" />
    <h1 className="screen-title">Игра</h1>
    <p className="theory-note">Учимся понимать вьетнамский на слух.</p>
    <h2>Урок 9 · Числа и возраст</h2>
    <button className="lesson-item" onClick={onOpenNumbers}>
      <span className="lesson-number">Цифры 1–10</span>
      <span className="lesson-title">Кубики на слух — послушай и найди цифру</span>
      <span className="lesson-meta">20 ответов · каждую цифру дважды · повтор ошибок</span>
    </button>
  </div>;
}
