import { BackButton } from './BackButton';
export type GamesCategory = 'lessons' | 'extra' | null;
export function GamesListScreen({ category, onCategoryChange, onBack, onOpenRestaurant, onOpenQuestionTower, onOpenSuperBlitz, onOpenPeople, onOpenTravel, onOpenProfessions, onOpenFamily, onOpenHouse, onOpenLesson9 }: { category: GamesCategory; onCategoryChange: (category: GamesCategory) => void; onOpenRestaurant: () => void; onOpenQuestionTower: () => void; onOpenSuperBlitz: () => void; onOpenPeople: () => void; onBack: () => void; onOpenTravel: () => void; onOpenProfessions: () => void; onOpenFamily: () => void; onOpenHouse: () => void; onOpenLesson9: () => void }) {
 return <div className="screen games-menu-screen">
  <BackButton onClick={category ? () => onCategoryChange(null) : onBack} label={category ? 'К разделам игр' : 'На главную'}/>
  <h1 className="screen-title">{category === 'lessons' ? 'Игры по урокам' : category === 'extra' ? 'Дополнительные' : 'Игры'}</h1>
  {!category && <>
   <button className="lesson-item game-menu-item game-lesson-group" onClick={() => onCategoryChange('lessons')}><span className="lesson-number">Игры по урокам</span></button>
   <button className="lesson-item game-menu-item game-lesson-group" onClick={() => onCategoryChange('extra')}><span className="lesson-number">Дополнительные</span></button>
  </>}
  {category === 'extra' && <button className="lesson-item game-menu-item game-lesson-group" onClick={onOpenQuestionTower}><span className="lesson-number">🏗️ Башня вопросов · 15 слов</span></button>}
  {category === 'extra' && <button className="lesson-item game-menu-item game-lesson-group" onClick={onOpenSuperBlitz}><span className="lesson-number">🏗️ Вопросы · Суперблиц · 24 слова</span></button>}
  {category === 'extra' && <button className="lesson-item game-menu-item game-lesson-group" onClick={onOpenRestaurant}><span className="lesson-number">Игра · Ресторан</span></button>}
  {category === 'lessons' && [
   ['Урок 5 · Профессии и место работы', onOpenProfessions],
   ['Урок 7 · Страны, города и путешествия', onOpenTravel],
   ['Урок 8 · Мы, они и все', onOpenPeople],
   ['Урок 9 · Числительные', onOpenLesson9],
   ['Урок 10 · Семья', onOpenFamily],
   ['Урок 11 · Дом и прилагательные', onOpenHouse],
  ].map(([title, open]) => <button key={title as string} className="lesson-item game-menu-item game-lesson-group" onClick={open as () => void}><span className="lesson-number">Игра · {title as string}</span></button>)}
 </div>;
}
