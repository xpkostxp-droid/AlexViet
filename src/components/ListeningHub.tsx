import { lazy, Suspense, useState } from 'react';
import { BackButton } from './BackButton';
import './listening.css';
import { phrasebook2PublishedLessons } from '../content/listening/release';

const Book1 = lazy(() => import('./ListeningScreen'));
const Book2 = lazy(() => import('./Phrasebook2Screen'));
const Course = lazy(() => import('./CourseListeningScreen'));
export default function ListeningHub({ onBack }: { onBack: () => void }) {
  const [section, setSection] = useState<'course' | 'book1' | 'book2'>();
  const back = () => { setSection(undefined); window.scrollTo(0, 0); };
  const loading = <div className="screen"><BackButton onClick={back} label="К разделам аудирования" /><p role="status">Загружаем уроки…</p></div>;
  if (section) return <Suspense fallback={loading}>{section === 'course' ? <Course onBack={back} /> : section === 'book2' ? <Book2 onBack={back} /> : <Book1 onBack={back} title="Разговорник 1" backLabel="К разделам аудирования" />}</Suspense>;
  return <div className="screen screen-listening">
    <BackButton onClick={onBack} label="На главную" />
    <span className="badge">Слушаем и понимаем</span><h1 className="screen-title">Аудирование</h1>
    <p className="hint-text">Выберите раздел. Перед каждым уроком — слова с переводом, затем игра на понимание речи.</p>
    <div className="listening-lessons">
      <button className="lesson-item" onClick={() => setSection('course')}><span className="lesson-number">Наш курс</span><span className="lesson-title">Аудирование по нашим урокам</span><span className="lesson-meta">Материалы появятся позже</span></button>
      <button className="lesson-item" onClick={() => setSection('book1')}><span className="lesson-number">17 уроков</span><span className="lesson-title">Разговорник 1</span><span className="lesson-meta">Знакомые диалоги и сохранённый прогресс</span></button>
      <button className="lesson-item" onClick={() => setSection('book2')}><span className="lesson-number">{phrasebook2PublishedLessons} уроков</span><span className="lesson-title">Разговорник 2</span><span className="lesson-meta">Произношение и новые разговорные ситуации</span></button>
    </div>
  </div>;
}
