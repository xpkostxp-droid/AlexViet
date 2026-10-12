import { BookIcon, CardsIcon, ChevronRightIcon, SpeakerOnIcon, GameIcon } from './icons';

interface Props {
  onOpenGames: () => void;
  onOpenTheory: () => void;
  onOpenCards: () => void;
  onOpenPronunciation: () => void;
  onOpenPhoneticaTest: () => void;
}

export function HomeScreen({ onOpenTheory, onOpenCards, onOpenPronunciation, onOpenPhoneticaTest, onOpenGames }: Props) {
  return (
    <div className="screen screen-home">
      <div className="home-tiles">
        <button className="home-tile home-tile-teal home-tile-game" onClick={onOpenGames}>
          <GameIcon className="home-tile-icon" />
          <span className="home-tile-label">Игра</span>
          <ChevronRightIcon className="home-tile-chevron" />
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
    </div>
  );
}
