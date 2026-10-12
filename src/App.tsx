import { useState } from 'react';
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
  | { name: 'games-list' }
  | { name: 'numbers-game-setup' }
  | { name: 'numbers-game'; direction: NumberGameDirection }
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
          onOpenGames={() => setScreen({ name: 'games-list' })}
          onOpenTheory={() => setScreen({ name: 'theory-list' })}
          onOpenCards={() => setScreen({ name: 'cards-lesson-list' })}
          onOpenPronunciation={() => setScreen({ name: 'pronunciation' })}
          onOpenPhoneticaTest={() => setScreen({ name: 'phonetics-test-list' })}
        />
      );

    case 'games-list':
      return <GamesListScreen onBack={() => setScreen({ name: 'home' })} onOpenNumbers={() => setScreen({ name: 'numbers-game-setup' })} />;

    case 'numbers-game-setup':
      return <GameDirectionScreen onBack={() => setScreen({ name: 'games-list' })} onStart={direction => setScreen({ name: 'numbers-game', direction })} />;

    case 'numbers-game':
      return <CubesGameScreen key={screen.direction} direction={screen.direction} onBack={() => setScreen({ name: 'numbers-game-setup' })} />;

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
