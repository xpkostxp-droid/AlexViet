import { useEffect, useState } from 'react';
import { getLessonById } from '../content/lessons';
import { getCardsForLesson } from '../content/cards';
import type { CardOrder, Direction } from '../types';
import {
  answer,
  backText,
  currentCard,
  flip,
  frontText,
  isFinished,
  restartWithWrongOnly,
  startSession,
  summarize,
  type SessionState,
} from '../domain/training';
import { recordResult } from '../domain/progress';
import {
  hasVietnameseVoice,
  isSpeechEnabled,
  onVoicesChanged,
  setSpeechEnabled,
  speakVietnamese,
  stopSpeaking,
} from '../domain/speech';
import { BackButton } from './BackButton';
import { SpeakerOffIcon, SpeakerOnIcon } from './icons';

const RESULT_LABELS: Record<'remembered' | 'not-remembered', { listening: string; default: string }> = {
  remembered: { listening: 'Услышал', default: 'Вспомнил' },
  'not-remembered': { listening: 'Не услышал', default: 'Не вспомнил' },
};

interface Props {
  lessonId: string;
  direction: Direction;
  order: CardOrder;
  onExit: () => void;
}

export function TrainingScreen({ lessonId, direction, order, onExit }: Props) {
  const lesson = getLessonById(lessonId);
  const cards = getCardsForLesson(lessonId);

  const [session, setSession] = useState<SessionState>(() => startSession(cards, direction, order));

  // Кнопка звука показывается только тогда, когда на устройстве вообще
  // есть вьетнамский голос — иначе озвучка и так молчит, и кнопка была бы
  // не при чём. Список голосов может появиться чуть позже первой
  // отрисовки — подписываемся на событие, чтобы не пропустить это.
  const [voiceAvailable, setVoiceAvailable] = useState(() => hasVietnameseVoice());
  const [speechOn, setSpeechOn] = useState(() => isSpeechEnabled());

  useEffect(() => {
    const unsubscribe = onVoicesChanged(() => setVoiceAvailable(hasVietnameseVoice()));
    return unsubscribe;
  }, []);

  const toggleSpeech = () => {
    const next = !speechOn;
    setSpeechOn(next);
    setSpeechEnabled(next);
    if (!next) stopSpeaking();
  };

  // Озвучиваем вьетнамское слово именно в момент, когда оно появляется
  // на видимой стороне карточки: в направлении рус → вьет это перевод
  // после переворота, в направлении вьет → рус — сама лицевая сторона
  // (сразу при показе карточки, без переворота). Русский не озвучиваем.
  // В аудировании автопроигрывания нет вовсе — слово звучит только по
  // нажатию кнопки «Озвучить», в этом весь смысл режима.
  useEffect(() => {
    if (session.direction === 'listening') return;
    const visibleCard = currentCard(session);
    if (!visibleCard) return;
    const showingVietnamese = session.direction === 'ru-vi' ? session.flipped : !session.flipped;
    if (!showingVietnamese) return;
    speakVietnamese(visibleCard.vi);
  }, [session.flipped, session.index, session.direction]);

  // Если уходим с экрана тренировки посреди озвучивания — останавливаем.
  useEffect(() => {
    return () => stopSpeaking();
  }, []);

  if (!lesson) {
    return (
      <div className="screen screen-training">
        <BackButton onClick={onExit} label="К урокам" />
        <p>Урок не найден.</p>
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="screen screen-training">
        <BackButton onClick={onExit} label="К урокам" />
        <div className="placeholder-box">
          <p>В этом уроке пока нет карточек.</p>
        </div>
      </div>
    );
  }

  const handleAnswer = (result: 'remembered' | 'not-remembered') => {
    const card = currentCard(session);
    if (!card) return;
    recordResult(card.id, session.direction, result);
    setSession((s) => answer(s, result));
  };

  const isListening = session.direction === 'listening';

  if (isFinished(session)) {
    const summary = summarize(session);
    const hasWrong = summary.wrongCardIds.length > 0;
    return (
      <div className="screen screen-training screen-photo screen-summary">
        <BackButton onClick={onExit} label="К урокам" />
        <h1 className="screen-title">Тренировка завершена</h1>
        <div className="summary-box">
          <p>Всего карточек: {summary.total}</p>
          <p>
            {isListening ? RESULT_LABELS.remembered.listening : RESULT_LABELS.remembered.default}:{' '}
            {summary.remembered}
          </p>
          <p>Нужно повторить: {summary.notRemembered}</p>
        </div>
        <div className="summary-actions">
          {hasWrong && (
            <button
              className="big-button"
              onClick={() => {
                const retry = restartWithWrongOnly(session, order);
                if (retry) setSession(retry);
              }}
            >
              Повторить ошибки
            </button>
          )}
          <button
            className="secondary-button"
            onClick={() => setSession(startSession(cards, direction, order))}
          >
            Пройти урок заново
          </button>
          <button className="secondary-button" onClick={onExit}>
            К урокам
          </button>
        </div>
      </div>
    );
  }

  const card = currentCard(session);
  if (!card) return null;

  const front = frontText(card, session.direction);
  const back = backText(card, session.direction);

  return (
    <div className="screen screen-training screen-photo screen-cards-setup">
      <div className="training-header">
        <BackButton onClick={onExit} label="К урокам" />
        {voiceAvailable && (
          <button
            type="button"
            className="sound-toggle"
            onClick={toggleSpeech}
            aria-pressed={!speechOn}
            aria-label={speechOn ? 'Выключить озвучку' : 'Включить озвучку'}
            title={speechOn ? 'Выключить озвучку' : 'Включить озвучку'}
          >
            {speechOn ? <SpeakerOnIcon /> : <SpeakerOffIcon />}
          </button>
        )}
      </div>
      <p className="counter">
        Карточка {session.index + 1} из {session.queue.length}
      </p>

      <div className={isListening ? 'flashcard-row' : undefined}>
        <div className="flashcard-scene">
          <button
            key={card.id}
            type="button"
            className={session.flipped ? 'flashcard-card is-flipped' : 'flashcard-card'}
            onClick={() => setSession((s) => flip(s))}
            aria-pressed={session.flipped}
            aria-label={session.flipped ? 'Скрыть перевод' : 'Показать перевод'}
          >
            <span className="flashcard-face flashcard-face-front">
              {isListening ? (
                <>
                  <SpeakerOnIcon className="flashcard-placeholder-icon" />
                  <span className="flashcard-hint">
                    Нажмите «Озвучить», затем переверните карточку, чтобы увидеть ответ
                  </span>
                </>
              ) : (
                <>
                  <span className="flashcard-text">{front}</span>
                  <span className="flashcard-hint">Нажмите, чтобы перевернуть</span>
                </>
              )}
            </span>
            <span className="flashcard-face flashcard-face-back">
              {isListening ? (
                <>
                  <span className="flashcard-text">{card.vi}</span>
                  <span className="flashcard-text-secondary">{card.ru}</span>
                </>
              ) : (
                <span className="flashcard-text">{back}</span>
              )}
            </span>
          </button>
        </div>

        {isListening && (
          <button type="button" className="listen-button" onClick={() => speakVietnamese(card.vi)}>
            <SpeakerOnIcon />
            Озвучить
          </button>
        )}
      </div>

      {session.flipped && (
        <div className="answer-actions">
          <button className="answer-button answer-no" onClick={() => handleAnswer('not-remembered')}>
            {isListening ? RESULT_LABELS['not-remembered'].listening : RESULT_LABELS['not-remembered'].default}
          </button>
          <button className="answer-button answer-yes" onClick={() => handleAnswer('remembered')}>
            {isListening ? RESULT_LABELS.remembered.listening : RESULT_LABELS.remembered.default}
          </button>
        </div>
      )}
    </div>
  );
}
