import ListeningScreen from './ListeningScreen';
import { phrasebook2PublishedLessons } from '../content/listening/release';
import { phrasebook2Lessons } from '../content/listening/phrasebook2';
const publishedPhrasebook2Lessons = phrasebook2Lessons.filter(lesson => lesson.number <= phrasebook2PublishedLessons);
export default function Phrasebook2Screen({ onBack }: { onBack: () => void }) {
  return <ListeningScreen onBack={onBack} lessons={publishedPhrasebook2Lessons} title="Разговорник 2" backLabel="К разделам аудирования" description={`${phrasebook2PublishedLessons} уроков: первые 12 — слова для тренировки произношения, остальные — диалоги. Прочитайте слова, затем слушайте и выбирайте перевод.`} />;
}
