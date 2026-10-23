import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { describe, expect, it, vi } from 'vitest';
import CourseListeningScreen from './CourseListeningScreen';
import { courseListeningLessons } from '../content/listening/course';

vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true);

describe('course dialogue listening', () => {
  it('opens family lesson and highlights the line matching audio time', async () => {
    const host = document.createElement('div');
    document.body.append(host);
    const root = createRoot(host);
    const onBack = vi.fn();
    Element.prototype.scrollIntoView = vi.fn();
    await act(async () => root.render(<CourseListeningScreen onBack={onBack} />));
    const lessonButton = Array.from(host.querySelectorAll('button')).find(button => button.textContent?.includes('Урок 10'))!;
    await act(async () => lessonButton.click());
    const audio = host.querySelector('audio')!;
    expect(audio.src).toContain('family-10.mp3');
    const line = courseListeningLessons[0].phrases[1];
    await act(async () => {
      audio.currentTime = line.start + .1;
      audio.dispatchEvent(new Event('timeupdate', { bubbles: true }));
    });
    const active = host.querySelector('[aria-current="true"]')!;
    expect(active.textContent).toContain(line.vi);
    expect(active.textContent).toContain(line.ru);
    expect(host.querySelector('.is-speaking')?.textContent).toBe('Tôi');
    await act(async () => {
      audio.currentTime = 4.3;
      audio.dispatchEvent(new Event('timeupdate', { bubbles: true }));
    });
    expect(host.querySelectorAll('.is-speaking')).toHaveLength(1);
    expect(host.querySelector('.is-speaking')?.textContent).toBe('tên');
    await act(async () => {
      audio.currentTime = 6.5;
      audio.dispatchEvent(new Event('seeked', { bubbles: true }));
    });
    expect(host.querySelector('.is-speaking')).toBeNull();
    await act(async () => root.unmount());
    host.remove();
  });
  it('opens lesson 11, follows its words, and toggles translation without seeking or losing lesson 10', async () => {
    const host = document.createElement('div'); document.body.append(host);
    const root = createRoot(host);
    const button = (text: string) => [...host.querySelectorAll('button')].find(item => item.textContent?.includes(text))!;
    await act(async () => root.render(<CourseListeningScreen onBack={vi.fn()} />));
    expect(button('Урок 10')).toBeDefined();
    await act(async () => button('Урок 11').click());
    expect(host.querySelector('h1')?.textContent).toContain('Урок 11');
    const audio = host.querySelector('audio')!;
    expect(audio.src).toContain('lesson-11.mp3');
    await act(async () => {
      audio.currentTime = 3.8;
      audio.dispatchEvent(new Event('timeupdate', { bubbles: true }));
    });
    expect(host.querySelector('.is-speaking')?.textContent).toBe('Hùng');
    expect(host.querySelectorAll('.course-dialogue-ru')).toHaveLength(12);
    await act(async () => button('Без перевода').click());
    expect(host.querySelector('.course-dialogue-ru')).toBeNull();
    expect(host.querySelectorAll('.course-dialogue-vi')).toHaveLength(12);
    expect(audio.currentTime).toBe(3.8);
    await act(async () => button('С переводом').click());
    expect(host.querySelectorAll('.course-dialogue-ru')).toHaveLength(12);
    await act(async () => button('К нашим урокам').click());
    await act(async () => button('Урок 10').click());
    expect(host.querySelector('h1')?.textContent).toContain('Урок 10 — Семья');
    expect(host.querySelector('audio')?.src).toContain('family-10.mp3');
    await act(async () => root.unmount()); host.remove();
  });

});
