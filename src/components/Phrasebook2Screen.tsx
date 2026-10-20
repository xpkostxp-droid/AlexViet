import ListeningScreen from './ListeningScreen';
import { phrasebook2Lessons } from '../content/listening/phrasebook2';
export default function Phrasebook2Screen({ onBack }: { onBack: () => void }) {
  return <ListeningScreen onBack={onBack} lessons={phrasebook2Lessons} title="Разговорник 2" backLabel="К разделам аудирования" description="59 уроков: первые 12 — слова для тренировки произношения, остальные 47 — диалоги. Прочитайте слова, затем слушайте и выбирайте перевод." />;
}
