import { afterEach, describe, expect, it, vi } from 'vitest';
import { hasVietnameseVoice, isSpeechSupported, speakVietnamese } from './speech';

class FakeVoice {
  constructor(public lang: string, public name: string) {}
}

class FakeUtterance {
  text: string;
  lang = '';
  voice: FakeVoice | null = null;
  constructor(text: string) {
    this.text = text;
  }
}

function installFakeSpeechApi(voices: FakeVoice[]) {
  const cancel = vi.fn();
  const speak = vi.fn();
  const getVoices = vi.fn(() => voices);
  // @ts-expect-error — тестовый мок Web Speech API
  window.SpeechSynthesisUtterance = FakeUtterance;
  // @ts-expect-error
  window.speechSynthesis = { cancel, speak, getVoices, addEventListener: vi.fn() };
  return { cancel, speak, getVoices };
}

afterEach(() => {
  // @ts-expect-error — убираем тестовый мок между тестами
  delete window.speechSynthesis;
  // @ts-expect-error
  delete window.SpeechSynthesisUtterance;
});

describe('isSpeechSupported', () => {
  it('возвращает булево значение и не падает без Web Speech API', () => {
    expect(typeof isSpeechSupported()).toBe('boolean');
  });
});

describe('hasVietnameseVoice / speakVietnamese', () => {
  it('ничего не делает и не падает, если синтез речи недоступен вовсе', () => {
    expect(() => speakVietnamese('xin chào')).not.toThrow();
  });

  it('молчит (не вызывает speak), если среди голосов нет вьетнамского', () => {
    const { speak } = installFakeSpeechApi([
      new FakeVoice('ru-RU', 'Milena'),
      new FakeVoice('en-US', 'Samantha'),
    ]);

    expect(hasVietnameseVoice()).toBe(false);
    speakVietnamese('uống cà phê');
    expect(speak).not.toHaveBeenCalled();
  });

  it('находит голос по префиксу языка "vi" и озвучивает именно им', () => {
    const vietnameseVoice = new FakeVoice('vi-VN', 'Linh');
    const { cancel, speak } = installFakeSpeechApi([
      new FakeVoice('ru-RU', 'Milena'),
      vietnameseVoice,
    ]);

    expect(hasVietnameseVoice()).toBe(true);
    speakVietnamese('uống cà phê');

    expect(cancel).toHaveBeenCalledTimes(1);
    expect(speak).toHaveBeenCalledTimes(1);
    const spokenUtterance = speak.mock.calls[0][0] as FakeUtterance;
    expect(spokenUtterance.text).toBe('uống cà phê');
    expect(spokenUtterance.voice).toBe(vietnameseVoice);
    expect(spokenUtterance.lang).toBe('vi-VN');
  });
});
