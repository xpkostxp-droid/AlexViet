import { useState } from 'react';
import type { CardOrder, Direction } from './types';
import { saveLastActivity } from './domain/lastActivity';
import { HomeScreen } from './components/HomeScreen';
import { TheoryListScreen } from './components/TheoryListScreen';
import { TheoryLessonScreen } from './components/TheoryLessonScreen';
import { CardsLessonListScreen } from './components/CardsLessonListScreen';
import { CardsSetupScreen } from './components/CardsSetupScreen';
import { TrainingScreen } from './components/TrainingScreen';

type Screen =
  | { name: 'home' }
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
          onOpenTheory={() => setScreen({ name: 'theory-list' })}
          onOpenCards={() => setScreen({ name: 'cards-lesson-list' })}
        />
      );

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
