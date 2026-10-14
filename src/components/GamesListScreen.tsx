import { BackButton } from './BackButton';
import { numberGameRanges, type NumberGameRange } from '../content/games/ranges';
export function GamesListScreen({ onBack, onOpenNumbers, onOpenBigNumbers }: { onBack: () => void; onOpenBigNumbers: () => void; onOpenNumbers: (range: NumberGameRange) => void }) {
  return <div className="screen">
    <BackButton onClick={onBack} label="На главную" />
    <h1 className="screen-title">Игра</h1>
    <h2>Урок 9 · Числа и возраст</h2>
    {(['1-10', '11-99', '100-999', 'banknotes', 'phone'] as NumberGameRange[]).map(range => <button key={range} className="lesson-item game-menu-item" onClick={() => onOpenNumbers(range)}>
      <span className="game-menu-icon" aria-hidden="true">{({'1-10': '🎲', '11-99': '🔢', '100-999': '🚪', banknotes: '💵', phone: '☎️'})[range]}</span>
      <span className="lesson-number">{numberGameRanges[range].title}</span>
    </button>)}
    <button className="lesson-item game-menu-item" onClick={onOpenBigNumbers}><span className="game-menu-icon" aria-hidden="true">🧩</span><span className="lesson-number">Большие числа</span></button>
  </div>;
}
