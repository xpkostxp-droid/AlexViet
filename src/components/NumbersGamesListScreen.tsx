import { BackButton } from './BackButton';
import { numberGameRanges, type NumberGameRange } from '../content/games/ranges';
export function NumbersGamesListScreen({onBack,onOpenNumbers,onOpenBigNumbers,onOpenDialogues}:{onBack:()=>void;onOpenNumbers:(range:NumberGameRange)=>void;onOpenBigNumbers:()=>void;onOpenDialogues:()=>void}) {
 return <div className="screen games-menu-screen"><BackButton onClick={onBack} label="К урокам"/><h1 className="screen-title">Урок 9 · Числительные</h1>
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
 </div>;
}
