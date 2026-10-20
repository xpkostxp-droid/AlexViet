import ListeningScreen from './ListeningScreen';
import { courseListeningLessons } from '../content/listening/course';
export default function CourseListeningScreen({ onBack }: { onBack: () => void }) {
  return <ListeningScreen onBack={onBack} lessons={courseListeningLessons} title="Аудирование по нашим урокам" backLabel="К разделам аудирования" description="Слова и предложения из нашего курса. Для озвучивания используется вьетнамский голос устройства." />;
}
