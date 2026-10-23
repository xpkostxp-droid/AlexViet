import { BackButton } from './BackButton';
import { numberGameRanges, type NumberGameRange } from '../content/games/ranges';
export function GamesListScreen({ onBack, onOpenProfessions, onOpenFamily, onOpenNumbers, onOpenBigNumbers, onOpenDialogues }: { onOpenProfessions: () => void; onOpenFamily: () => void; onBack: () => void; onOpenDialogues: () => void; onOpenBigNumbers: () => void; onOpenNumbers: (range: NumberGameRange) => void }) {
  return <div className="screen">
    <BackButton onClick={onBack} label="На главную" />
    <h1 className="screen-title">Игра</h1>
    <details className="game-lesson-group"><summary className="lesson-item game-menu-item"><span className="lesson-number">Игра · Урок 5 · Профессии и место работы</span></summary>
    <button className="lesson-item game-menu-item" onClick={onOpenProfessions}><span className="game-menu-icon" aria-hidden="true">👷</span><span className="lesson-number">Профессии и место работы</span><span>Обучение и блиц · 29 слов и выражений</span></button></details>
    <details className="game-lesson-group"><summary className="lesson-item game-menu-item"><span className="lesson-number">Игра · Урок 9 · Числительные</span></summary>
    <h3 className="game-section-heading">Числа</h3>
    {(['1-10', '11-99', '100-999', 'banknotes', 'phone'] as NumberGameRange[]).map(range => <button key={range} className="lesson-item game-menu-item" onClick={() => onOpenNumbers(range)}>
      <span className="game-menu-icon" aria-hidden="true">{({'1-10': '🎲', '11-99': '🔢', '100-999': '🚪', banknotes: '💵', phone: '☎️'})[range]}</span>
      <span className="lesson-number">{numberGameRanges[range].title}</span>
    </button>)}
    <button className="lesson-item game-menu-item" onClick={onOpenBigNumbers}><span className="game-menu-icon" aria-hidden="true">🧩</span><span className="lesson-number">Большие числа</span></button>
    <section className="game-dialogues-section" aria-labelledby="dialogues-heading">
      <h3 id="dialogues-heading" className="game-section-heading">Диалоги</h3>
      <button className="lesson-item game-menu-item" onClick={onOpenDialogues}><span className="game-menu-icon" aria-hidden="true">💬</span><span className="lesson-number">Диалоги · Урок 9</span></button>
    </section>
    </details>
    <details className="game-lesson-group"><summary className="lesson-item game-menu-item"><span className="lesson-number">Игра · Урок 10 · Семья</span></summary>
    <button className="lesson-item game-menu-item" onClick={onOpenFamily}><span className="game-menu-icon" aria-hidden="true">👨‍👩‍👧‍👦</span><span className="lesson-number">Семья</span><span>Обучение и блиц · 19 слов и выражений</span></button>
    </details>
  </div>;
}
