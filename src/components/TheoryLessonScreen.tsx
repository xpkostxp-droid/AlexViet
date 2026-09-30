import { getLessonById, getTheoryForLesson } from '../content/lessons';
import type { TheoryBlock } from '../types';
import { BackButton } from './BackButton';

interface Props {
  lessonId: string;
  onBack: () => void;
}

// Многие строки в материалах записаны как «вьетнамское — русское»
// (например, «Anh tên là gì? — Как тебя зовут?»). Разбиваем по этому
// разделителю, чтобы вьетнамскую часть показать крупнее и жирнее —
// так её проще прочитать и произнести с телефона, не выискивая взглядом
// среди сплошного текста.
function splitViRu(text: string): { vi: string; ru: string | null } {
  const separator = ' — ';
  const index = text.indexOf(separator);
  if (index === -1) return { vi: text, ru: null };
  return { vi: text.slice(0, index), ru: text.slice(index + separator.length) };
}

function TableBlock({ block }: { block: Extract<TheoryBlock, { kind: 'table' }> }) {
  return (
    <section className="theory-section">
      {block.heading && <h2 className="theory-heading">{block.heading}</h2>}
      {block.note && <p className="theory-note">{block.note}</p>}
      <div className="theory-table">
        {block.rows.map((row, rowIndex) => (
          <div className="theory-row-card" key={rowIndex}>
            {row.map((cell, cellIndex) => (
              <div className="theory-row-cell" key={cellIndex}>
                <span className="theory-row-label">{block.columns[cellIndex]}</span>
                <span className="theory-row-value">{cell}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

function VocabBlock({ block }: { block: Extract<TheoryBlock, { kind: 'vocab' }> }) {
  return (
    <section className="theory-section">
      {block.heading && <h2 className="theory-heading">{block.heading}</h2>}
      {block.note && <p className="theory-note">{block.note}</p>}
      <ul className="theory-vocab-list">
        {block.items.map((item, index) => (
          <li className="theory-vocab-item" key={index}>
            <div className="theory-vocab-main">
              <span className="theory-vocab-vi">{item.vi}</span>
              {item.pronunciation && <span className="theory-vocab-pron">[{item.pronunciation}]</span>}
            </div>
            <span className="theory-vocab-ru">{item.ru}</span>
            {item.example && (
              <div className="theory-vocab-example">
                <span className="theory-example-vi">{item.example}</span>
                {item.exampleRu && <span className="theory-example-ru">{item.exampleRu}</span>}
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

function PatternBlock({ block }: { block: Extract<TheoryBlock, { kind: 'pattern' }> }) {
  return (
    <section className="theory-section">
      {block.heading && <h2 className="theory-heading">{block.heading}</h2>}
      <div className="theory-pattern-box">
        <p className="theory-pattern-formula">{block.formula}</p>
        {block.formulaNote && <p className="theory-pattern-note">{block.formulaNote}</p>}
      </div>
      <ul className="theory-example-list">
        {block.examples.map((example, index) => (
          <li className="theory-example-item" key={index}>
            <span className="theory-example-vi">{example.vi}</span>
            <span className="theory-example-ru">{example.ru}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function DialogueBlock({ block }: { block: Extract<TheoryBlock, { kind: 'dialogue' }> }) {
  return (
    <section className="theory-section">
      {block.heading && <h2 className="theory-heading">{block.heading}</h2>}
      <div className="theory-dialogue">
        {block.lines.map((line, index) => (
          <div
            className={
              line.speaker === 'A' || line.speaker === 'B'
                ? `theory-dialogue-line theory-dialogue-${line.speaker.toLowerCase()}`
                : 'theory-dialogue-line'
            }
            key={index}
          >
            <span className="theory-dialogue-speaker">{line.speaker}</span>
            <span className="theory-dialogue-vi">{line.vi}</span>
            <span className="theory-dialogue-ru">{line.ru}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function TipBlock({ block }: { block: Extract<TheoryBlock, { kind: 'tip' }> }) {
  return (
    <section className="theory-section">
      {block.heading && <h2 className="theory-heading">{block.heading}</h2>}
      <ul className="theory-tip-box">
        {block.items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </section>
  );
}

function TextBlock({ block }: { block: Extract<TheoryBlock, { kind: 'text' }> }) {
  return (
    <section className="theory-section">
      {block.heading && <h2 className="theory-heading">{block.heading}</h2>}
      <div className="theory-text-list">
        {block.paragraphs.map((paragraph, index) => {
          const { vi, ru } = splitViRu(paragraph);
          return (
            <p className="theory-text-paragraph" key={index}>
              <span className={ru ? 'theory-text-vi' : undefined}>{vi}</span>
              {ru && <span className="theory-text-ru"> — {ru}</span>}
            </p>
          );
        })}
      </div>
    </section>
  );
}

function TheoryBlockView({ block }: { block: TheoryBlock }) {
  switch (block.kind) {
    case 'table':
      return <TableBlock block={block} />;
    case 'vocab':
      return <VocabBlock block={block} />;
    case 'pattern':
      return <PatternBlock block={block} />;
    case 'dialogue':
      return <DialogueBlock block={block} />;
    case 'tip':
      return <TipBlock block={block} />;
    case 'text':
      return <TextBlock block={block} />;
    default:
      return null;
  }
}

export function TheoryLessonScreen({ lessonId, onBack }: Props) {
  const lesson = getLessonById(lessonId);

  if (!lesson) {
    return (
      <div className="screen">
        <BackButton onClick={onBack} label="К урокам" />
        <p>Урок не найден.</p>
      </div>
    );
  }

  const sections = getTheoryForLesson(lessonId);

  return (
    <div className="screen screen-theory-lesson">
      <BackButton onClick={onBack} label="К урокам" />
      <h1 className="screen-title">
        Урок {lesson.number}. {lesson.title}
      </h1>
      {lesson.isDemo && <span className="badge">Демонстрационный</span>}

      {!sections && (
        <div className="placeholder-box">
          <p>Материалы скоро появятся.</p>
        </div>
      )}

      {sections && (
        <div className="theory-body">
          {sections.map((block, index) => (
            <TheoryBlockView block={block} key={index} />
          ))}
        </div>
      )}
    </div>
  );
}
