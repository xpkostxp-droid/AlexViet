import { BackButton } from './BackButton';
import { numberGameRanges, type NumberGameRange } from '../content/games/ranges';
export type NumberGameDirection = 'vi-ru' | 'ru-vi';
export function GameDirectionScreen({ onBack, onStart, range }: { range: NumberGameRange; onBack: () => void; onStart: (direction: NumberGameDirection) => void }) {
  return <div className="screen">
    <BackButton onClick={onBack} label="К играм" />
    <span className="badge">Урок 9 · {numberGameRanges[range].title}</span>
    <h1 className="screen-title">{numberGameRanges[range].title}</h1>
    <button className="lesson-item" onClick={() => onStart('vi-ru')}>
      <span className="lesson-number">По-вьетнамски</span>
    </button>
    <button className="lesson-item" onClick={() => onStart('ru-vi')}>
      <span className="lesson-number">По-русски</span>
    </button>
  </div>;
}
