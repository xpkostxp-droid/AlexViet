export interface ListeningPhrase {
  id: string;
  vi: string;
  ru: string;
  start: number;
  end: number;
  words?: { text: string; start: number; end: number }[];
}

export interface ListeningLesson {
  id: string;
  number: number;
  title: string;
  audio: string;
  vocabulary: { vi: string; ru: string }[];
  phrases: ListeningPhrase[];
}
