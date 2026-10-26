import { BackButton } from './BackButton';
export function GamesListScreen({ onBack, onOpenRestaurant, onOpenPeople, onOpenTravel, onOpenProfessions, onOpenFamily, onOpenHouse, onOpenLesson9 }: { onOpenRestaurant: () => void; onOpenPeople: () => void; onBack: () => void; onOpenTravel: () => void; onOpenProfessions: () => void; onOpenFamily: () => void; onOpenHouse: () => void; onOpenLesson9: () => void }) {
 return <div className="screen games-menu-screen">
  <BackButton onClick={onBack} label="На главную"/><h1 className="screen-title">Игра</h1>
  {[
   ['Урок 5 · Профессии и место работы', onOpenProfessions],
   ['Урок 7 · Страны, города и путешествия', onOpenTravel],
   ['Урок 8 · Мы, они и все', onOpenPeople],
   ['Урок 9 · Числительные', onOpenLesson9],
   ['Урок 10 · Семья', onOpenFamily],
   ['Урок 11 · Дом и прилагательные', onOpenHouse],
   ['Ресторан', onOpenRestaurant],
  ].map(([title, open]) => <button key={title as string} className="lesson-item game-menu-item game-lesson-group" onClick={open as () => void}><span className="lesson-number">Игра · {title as string}</span></button>)}
 </div>;
}
