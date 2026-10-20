import { BackButton } from './BackButton';
import './listening.css';

export default function CourseListeningScreen({ onBack }: { onBack: () => void }) {
  return <div className="screen screen-listening">
    <BackButton onClick={onBack} label="К разделам аудирования" />
    <h1 className="screen-title">Аудирование по нашим урокам</h1>
    <p className="hint-text">Здесь пока нет материалов. Добавим их позже.</p>
  </div>;
}
