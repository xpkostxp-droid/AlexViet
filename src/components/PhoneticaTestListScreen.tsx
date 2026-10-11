import { BackButton } from './BackButton';
import { phoneticsTests, type PhoneticsTestId } from '../content/phonetics/tests';

export function PhoneticaTestListScreen({ onBack, onOpenTest }: { onBack: () => void; onOpenTest: (testId: PhoneticsTestId) => void }) {
  return <div className="screen">
    <BackButton onClick={onBack} />
    <h1 className="screen-title">Фонетика тест</h1>
    <p className="theory-note">Слушайте, выбирайте ответ и повторяйте ошибки, пока не закрепите все звуки.</p>
    <ul className="lesson-list">
      {phoneticsTests.map(test => <li key={test.id}>
        <button className="lesson-item" onClick={() => onOpenTest(test.id)}>
          <span className="lesson-number">Тест {test.id}</span>
          <span className="lesson-title">{test.title}</span>
          <span className="lesson-meta">{test.questions.length} заданий · Упражнение {test.id}</span>
        </button>
      </li>)}
    </ul>
  </div>;
}
