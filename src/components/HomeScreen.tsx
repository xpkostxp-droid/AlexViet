import { refreshApp } from '../appUpdates';
import { BookIcon, CardsIcon, ChevronRightIcon, SpeakerOnIcon, GameIcon } from './icons';

interface Props {
  onOpenListening: () => void;
  onOpenGames: () => void;
  onOpenTheory: () => void;
  onOpenCards: () => void;
  onOpenPronunciation: () => void;
  onOpenPhoneticaTest: () => void;
}

export function HomeScreen({ onOpenTheory, onOpenCards, onOpenPronunciation, onOpenPhoneticaTest, onOpenGames, onOpenListening }: Props) {
  return (
    <div className="screen screen-home">
      <div className="home-tiles">
        <button className="home-tile home-tile-teal home-tile-game" onClick={onOpenGames}>
          <GameIcon className="home-tile-icon" />
          <span className="home-tile-label">Игра</span>
          <ChevronRightIcon className="home-tile-chevron" />
        </button>
        <button className="home-tile home-tile-teal home-tile-listening" onClick={onOpenListening}>
          <svg className="home-tile-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M4 14v-3a8 8 0 0 1 16 0v3" /><rect x="3" y="12" width="5" height="8" rx="2" /><rect x="16" y="12" width="5" height="8" rx="2" /></svg>
          <span className="home-tile-label">Аудирование</span>
        </button>
        <button className="home-tile home-tile-blue home-tile-pronunciation" onClick={onOpenPronunciation}>
          <SpeakerOnIcon className="home-tile-icon" />
          <span className="home-tile-label">Фонетика</span>
          <ChevronRightIcon className="home-tile-chevron" />
        </button>
        <button className="home-tile home-tile-teal home-tile-phonetics-test" onClick={onOpenPhoneticaTest}>
          <SpeakerOnIcon className="home-tile-icon" />
          <span className="home-tile-label">Фонетика тест</span>
        </button>
        <button className="home-tile home-tile-blue home-tile-study" onClick={onOpenTheory}>
          <BookIcon className="home-tile-icon" />
          <span className="home-tile-label">Теория</span>
          <ChevronRightIcon className="home-tile-chevron" />
        </button>
        <button className="home-tile home-tile-teal home-tile-study" onClick={onOpenCards}>
          <CardsIcon className="home-tile-icon" />
          <span className="home-tile-label">Карточки</span>
          <ChevronRightIcon className="home-tile-chevron" />
        </button>
      </div>
      <button className="app-refresh" onClick={() => refreshApp()}>↻ Обновить</button>
    </div>
  );
}
