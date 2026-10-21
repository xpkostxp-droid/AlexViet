import { BackButton } from './BackButton';

export default function SongsListeningScreen({ onBack }: { onBack: () => void }) {
  return <div className="screen screen-listening">
    <BackButton onClick={onBack} label="К разделам аудирования" />
    <span className="badge">Музыка и вьетнамский</span>
    <h1 className="screen-title">Песни</h1>
    <p className="hint-text">Учимся распознавать знакомые слова на слух. Начнём с песни про семью.</p>
    <div className="listening-lessons">
      <div className="lesson-item">
        <span className="lesson-number">Песня 1 · Семья</span>
        <span className="lesson-title">Cả nhà thương nhau</span>
        <span className="lesson-meta">Вся семья любит друг друга</span>
        <p>Слова перед прослушиванием: <strong>ba</strong> — папа, <strong>mẹ</strong> — мама, <strong>con</strong> — ребёнок, <strong>thương</strong> — любить, <strong>giống</strong> — быть похожим.</p>
        <a className="big-button" href="https://www.youtube.com/results?search_query=Ca+nha+thuong+nhau+karaoke" target="_blank" rel="noopener noreferrer">▶ Найти и послушать песню</a>
        <p className="hint-text">Для караоке с подсветкой строк нужна аудиозапись именно той версии, которую будем разбирать. После добавления записи сможем синхронизировать текст и перевод.</p>
      </div>
    </div>
  </div>;
}
