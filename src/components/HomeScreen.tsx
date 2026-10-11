import { BookIcon, CardsIcon, ChevronRightIcon, SpeakerOnIcon } from './icons';

interface Props {
  onOpenTheory: () => void;
  onOpenCards: () => void;
  onOpenPronunciation: () => void;
}

export function HomeScreen({ onOpenTheory, onOpenCards, onOpenPronunciation }: Props) {
  return (
    <div className="screen screen-home">
      <div className="home-tiles">
        <button className="home-tile home-tile-blue home-tile-pronunciation" onClick={onOpenPronunciation}>
          <SpeakerOnIcon className="home-tile-icon" />
          <span className="home-tile-label">Произношение</span>
          <ChevronRightIcon className="home-tile-chevron" />
        </button>
        <button className="home-tile home-tile-blue" onClick={onOpenTheory}>
          <BookIcon className="home-tile-icon" />
          <span className="home-tile-label">Теория</span>
          <ChevronRightIcon className="home-tile-chevron" />
        </button>
        <button className="home-tile home-tile-teal" onClick={onOpenCards}>
          <CardsIcon className="home-tile-icon" />
          <span className="home-tile-label">Карточки</span>
          <ChevronRightIcon className="home-tile-chevron" />
        </button>
      </div>
    </div>
  );
}
