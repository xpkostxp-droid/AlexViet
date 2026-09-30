import { useEffect, useState } from 'react';
import { getLessonById } from '../content/lessons';
import { getCardsForLesson } from '../content/cards';
import type { CardOrder, Direction } from '../types';
import { hasVietnameseVoice, onVoicesChanged } from '../domain/speech';
import { BackButton } from './BackButton';

interface Props {
  lessonId: string;
  onBack: () => void;
  onStart: (direction: Direction, order: CardOrder) => void;
}

export function CardsSetupScreen({ lessonId, onBack, onStart }: Props) {
  const lesson = getLessonById(lessonId);
  const cards = getCardsForLesson(lessonId);
  const [direction, setDirection] = useState<Direction>('ru-vi');
  const [order, setOrder] = useState<CardOrder>('sequential');

  // Аудирование целиком строится на озвучке — на устройстве без
  // вьетнамского голоса этот режим показывать нет смысла, кнопка сама
  // появится, как только (и если) голос найдётся.
  const [voiceAvailable, setVoiceAvailable] = useState(() => hasVietnameseVoice());
  useEffect(() => {
    return onVoicesChanged(() => setVoiceAvailable(hasVietnameseVoice()));
  }, []);

  if (!lesson) {
    return (
      <div className="screen screen-photo screen-cards-setup">
        <BackButton onClick={onBack} label="К урокам" />
        <p>Урок не найден.</p>
      </div>
    );
  }

  return (
    <div className="screen screen-photo screen-cards-setup">
      <BackButton onClick={onBack} label="К урокам" />
      <h1 className="screen-title">
        Урок {lesson.number}. {lesson.title}
      </h1>

      {cards.length === 0 ? (
        <div className="placeholder-box">
          <p>В этом уроке пока нет карточек.</p>
        </div>
      ) : (
        <>
          <section className="setup-section">
            <h2 className="setup-heading">Направление</h2>
            <div className="choice-group">
              <button
                className={direction === 'ru-vi' ? 'choice-button choice-button-active' : 'choice-button'}
                onClick={() => setDirection('ru-vi')}
              >
                Русский → Вьетнамский
              </button>
              <button
                className={direction === 'vi-ru' ? 'choice-button choice-button-active' : 'choice-button'}
                onClick={() => setDirection('vi-ru')}
              >
                Вьетнамский → Русский
              </button>
              {voiceAvailable && (
                <button
                  className={direction === 'listening' ? 'choice-button choice-button-active' : 'choice-button'}
                  onClick={() => setDirection('listening')}
                >
                  Аудирование (на слух)
                </button>
              )}
            </div>
            {direction === 'listening' && (
              <p className="hint-text">
                Слово не показывается текстом — только звучит по нажатию кнопки «Озвучить».
                Переверните карточку, чтобы увидеть ответ на обоих языках.
              </p>
            )}
          </section>

          <section className="setup-section">
            <h2 className="setup-heading">Порядок карточек</h2>
            <div className="choice-group">
              <button
                className={order === 'sequential' ? 'choice-button choice-button-active' : 'choice-button'}
                onClick={() => setOrder('sequential')}
              >
                По порядку
              </button>
              <button
                className={order === 'shuffled' ? 'choice-button choice-button-active' : 'choice-button'}
                onClick={() => setOrder('shuffled')}
              >
                Вперемешку
              </button>
            </div>
          </section>

          <p className="hint-text">
            Прогресс хранится в этом браузере. При очистке данных он может пропасть.
          </p>

          <button className="big-button" onClick={() => onStart(direction, order)}>
            Начать тренировку
          </button>
        </>
      )}
    </div>
  );
}
