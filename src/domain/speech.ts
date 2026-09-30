// Озвучивание вьетнамского текста через встроенный в браузер синтез речи
// (Web Speech API). Ничего не отправляется на сервер — всё выполняется
// самим устройством.
//
// Важное ограничение, которое нельзя обойти кодом: сайт не может
// установить вьетнамский голос на чужом компьютере или телефоне —
// озвучка работает только если такой голос уже есть в операционной
// системе или браузере пользователя (например, «Линь» на macOS). Если
// голоса нет, код ниже сознательно молчит, а не читает слово случайным
// голосом другого языка — плохое произношение вводит в заблуждение
// сильнее, чем отсутствие звука.

import { readJSON, writeJSON } from './storage';

const SPEECH_ENABLED_KEY = 'vietCards.speechEnabled.v1';

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  // «Прогреваем» список голосов сразу при загрузке модуля: в некоторых
  // браузерах (особенно в Chrome) он подгружается асинхронно, и первый
  // вызов getVoices() может вернуть пустой массив. Ранний вызов запускает
  // эту подгрузку заранее, чтобы к моменту первого переворота карточки
  // список уже был готов.
  window.speechSynthesis.getVoices();
}

export function isSpeechSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

function findVietnameseVoice(): SpeechSynthesisVoice | undefined {
  if (!isSpeechSupported()) return undefined;
  const voices = window.speechSynthesis.getVoices();
  return voices.find((voice) => voice.lang.toLowerCase().startsWith('vi'));
}

// Есть ли на этом устройстве вьетнамский голос прямо сейчас. Используется,
// чтобы показывать кнопку выключения звука только тогда, когда озвучке
// вообще есть что говорить.
export function hasVietnameseVoice(): boolean {
  return Boolean(findVietnameseVoice());
}

// Список голосов в некоторых браузерах подгружается асинхронно уже после
// первой отрисовки экрана — подписка на это событие позволяет интерфейсу
// узнать о появившемся голосе, не перезагружая страницу.
export function onVoicesChanged(callback: () => void): () => void {
  if (!isSpeechSupported()) return () => {};
  window.speechSynthesis.addEventListener('voiceschanged', callback);
  return () => window.speechSynthesis.removeEventListener('voiceschanged', callback);
}

// Хочет ли участник вообще слышать озвучку. Настройка хранится в браузере
// его устройства (у каждого участника — своя, независимо от остальных) и
// по умолчанию включена.
export function isSpeechEnabled(): boolean {
  return readJSON(SPEECH_ENABLED_KEY) !== false;
}

export function setSpeechEnabled(enabled: boolean): void {
  writeJSON(SPEECH_ENABLED_KEY, enabled);
}

export function speakVietnamese(text: string): void {
  if (!isSpeechSupported()) return;
  if (!isSpeechEnabled()) return;
  const voice = findVietnameseVoice();
  if (!voice) return;
  try {
    // Отменяем предыдущую озвучку, чтобы при быстрых переворотах
    // произношения не накладывались друг на друга.
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = voice;
    utterance.lang = voice.lang;
    window.speechSynthesis.speak(utterance);
  } catch {
    // Синтез речи сломался на этом устройстве — тихо ничего не делаем.
  }
}

export function stopSpeaking(): void {
  if (!isSpeechSupported()) return;
  try {
    window.speechSynthesis.cancel();
  } catch {
    // ignore
  }
}
