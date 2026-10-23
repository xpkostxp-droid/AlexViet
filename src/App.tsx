import { FamilyGameScreen } from './components/FamilyGameScreen';
import { DialogueGameScreen } from './components/DialogueGameScreen';
import { BackButton } from './components/BackButton';
import { BigNumbersGameScreen } from './components/BigNumbersGameScreen';
import { lazy, Suspense, useState } from 'react';
const ListeningScreen = lazy(() => import('./components/ListeningHub'));
import { PhoneGameScreen } from './components/PhoneGameScreen';
import type { NumberGameRange } from './content/games/ranges';
import { GamesListScreen } from './components/GamesListScreen';
import { CubesGameScreen } from './components/CubesGameScreen';
import { GameDirectionScreen, type NumberGameDirection } from './components/GameDirectionScreen';
import type { CardOrder, Direction } from './types';
import { saveLastActivity } from './domain/lastActivity';
import { HomeScreen } from './components/HomeScreen';
import { TheoryListScreen } from './components/TheoryListScreen';
import { TheoryLessonScreen } from './components/TheoryLessonScreen';
import { CardsLessonListScreen } from './components/CardsLessonListScreen';
import { CardsSetupScreen } from './components/CardsSetupScreen';
import { TrainingScreen } from './components/TrainingScreen';
import { PronunciationScreen } from './components/PronunciationScreen';
import { PhoneticaTestScreen } from './components/PhoneticaTestScreen';
import { PhoneticaTestListScreen } from './components/PhoneticaTestListScreen';
import type { PhoneticsTestId } from './content/phonetics/tests';

type Screen =
  | { name: 'home' }
  | { name: 'listening' }
  | { name: 'games-list' }
  | { name: 'family-game' }
  | { name: 'dialogue-games-list' }
  | { name: 'dialogue-game-setup' }
  | { name: 'dialogue-game'; direction: NumberGameDirection }
  | { name: 'big-numbers-setup' }
  | { name: 'big-numbers-game'; reverse: boolean }
  | { name: 'numbers-game-setup'; range: NumberGameRange }
  | { name: 'numbers-game'; direction: NumberGameDirection; range: NumberGameRange }
  | { name: 'pronunciation' }
  | { name: 'phonetics-test-list' }
  | { name: 'phonetics-test'; testId: PhoneticsTestId }
  | { name: 'theory-list' }
  | { name: 'theory-lesson'; lessonId: string }
  | { name: 'cards-lesson-list' }
  | { name: 'cards-setup'; lessonId: string }
  | { name: 'training'; lessonId: string; direction: Direction; order: CardOrder };

function App() {
  const [screen, setScreen] = useState<Screen>({ name: 'home' });

  switch (screen.name) {
    case 'home':
      // «Продолжить урок» на главном экране пока скрыт (по просьбе автора,
      // чтобы не загораживать фото), но какой урок открывали последним —
      // по-прежнему запоминается через saveLastActivity ниже, на будущее.
      return (
        <HomeScreen
          onOpenListening={() => setScreen({ name: 'listening' })}
          onOpenGames={() => setScreen({ name: 'games-list' })}
          onOpenTheory={() => setScreen({ name: 'theory-list' })}
          onOpenCards={() => setScreen({ name: 'cards-lesson-list' })}
          onOpenPronunciation={() => setScreen({ name: 'pronunciation' })}
          onOpenPhoneticaTest={() => setScreen({ name: 'phonetics-test-list' })}
        />
      );

    case 'listening':
      return <Suspense fallback={<div className="screen"><BackButton onClick={() => setScreen({ name: 'home' })} label="На главную" /><p role="status">Загружаем аудирование…</p></div>}><ListeningScreen onBack={() => setScreen({ name: 'home' })} /></Suspense>;

    case 'games-list':
      return <GamesListScreen onOpenFamily={() => setScreen({ name: 'family-game' })} onOpenDialogues={() => setScreen({ name: 'dialogue-games-list' })} onOpenBigNumbers={() => setScreen({ name: 'big-numbers-setup' })} onBack={() => setScreen({ name: 'home' })} onOpenNumbers={range => setScreen({ name: 'numbers-game-setup', range })} />;

    case 'family-game':
      return <FamilyGameScreen onBack={() => setScreen({ name: 'games-list' })} />;

    case 'dialogue-games-list':
      return <div className="screen"><BackButton onClick={() => setScreen({ name: 'games-list' })} label="К играм" /><span className="badge">Урок 9 · Числа и возраст</span><h1 className="screen-title">Диалоги</h1><button className="lesson-item game-menu-item" onClick={() => setScreen({ name: 'dialogue-game-setup' })}><span className="game-menu-icon" aria-hidden="true">💬</span><span className="lesson-number">Собери фразу</span><span>17 фраз · Знакомство и возраст</span></button></div>;

    case 'dialogue-game-setup':
      return <div className="screen"><BackButton onClick={() => setScreen({ name: 'dialogue-games-list' })} label="К диалогам" /><span className="badge">Урок 9 · Диалоги</span><h1 className="screen-title">Собери фразу</h1><button className="big-button" onClick={() => setScreen({ name: 'dialogue-game', direction: 'vi-ru' })}>Вьетнамский → Русский</button><button className="big-button" onClick={() => setScreen({ name: 'dialogue-game', direction: 'ru-vi' })}>Русский → Вьетнамский</button></div>;
    case 'dialogue-game':
      return <DialogueGameScreen key={screen.direction} direction={screen.direction} onBack={() => setScreen({ name: 'dialogue-game-setup' })} />;

    case 'big-numbers-setup':
      return <div className="screen"><BackButton onClick={() => setScreen({ name: 'games-list' })} label="К играм" /><span className="badge">Урок 9 · Числа и возраст</span><h1 className="screen-title">Большие числа</h1><button className="big-button" onClick={() => setScreen({ name: 'big-numbers-game', reverse: false })}>Цифры → Вьетнамский</button><button className="big-button" onClick={() => setScreen({ name: 'big-numbers-game', reverse: true })}>Вьетнамский → Цифры</button></div>;
    case 'big-numbers-game':
      return <BigNumbersGameScreen key={String(screen.reverse)} reverse={screen.reverse} onBack={() => setScreen({ name: 'big-numbers-setup' })} />;

    case 'numbers-game-setup':
      return <GameDirectionScreen range={screen.range} onBack={() => setScreen({ name: 'games-list' })} onStart={direction => setScreen({ name: 'numbers-game', direction, range: screen.range })} />;

    case 'numbers-game':
      if(screen.range === 'phone') return <PhoneGameScreen key={screen.direction} direction={screen.direction} onBack={() => setScreen({ name: 'numbers-game-setup', range: 'phone' })} />;
      return <CubesGameScreen key={`${screen.range}-${screen.direction}`} range={screen.range} direction={screen.direction} onBack={() => setScreen({ name: 'numbers-game-setup', range: screen.range })} />;

    case 'pronunciation':
      return <PronunciationScreen onBack={() => setScreen({ name: 'home' })} />;

    case 'phonetics-test':
      return <PhoneticaTestScreen key={screen.testId} testId={screen.testId} onBack={() => setScreen({ name: 'phonetics-test-list' })} />;

    case 'phonetics-test-list':
      return <PhoneticaTestListScreen onBack={() => setScreen({ name: 'home' })} onOpenTest={(testId) => setScreen({ name: 'phonetics-test', testId })} />;

    case 'theory-list':
      return (
        <TheoryListScreen
          onBack={() => setScreen({ name: 'home' })}
          onOpenLesson={(lessonId) => {
            saveLastActivity(lessonId, 'theory');
            setScreen({ name: 'theory-lesson', lessonId });
          }}
        />
      );

    case 'theory-lesson':
      return (
        <TheoryLessonScreen
          lessonId={screen.lessonId}
          onBack={() => setScreen({ name: 'theory-list' })}
        />
      );

    case 'cards-lesson-list':
      return (
        <CardsLessonListScreen
          onBack={() => setScreen({ name: 'home' })}
          onOpenLesson={(lessonId) => {
            saveLastActivity(lessonId, 'cards');
            setScreen({ name: 'cards-setup', lessonId });
          }}
        />
      );

    case 'cards-setup':
      return (
        <CardsSetupScreen
          lessonId={screen.lessonId}
          onBack={() => setScreen({ name: 'cards-lesson-list' })}
          onStart={(direction, order) =>
            setScreen({ name: 'training', lessonId: screen.lessonId, direction, order })
          }
        />
      );

    case 'training':
      return (
        <TrainingScreen
          lessonId={screen.lessonId}
          direction={screen.direction}
          order={screen.order}
          onExit={() => setScreen({ name: 'cards-setup', lessonId: screen.lessonId })}
        />
      );

    default:
      return null;
  }
}

export default App;
