export interface VerseData {
  reference: string;
  text: string;
  translation: string;
}

export interface AIContent {
  meaning: string;
  language: string;
  context: string;
  application: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export interface LanguageWord {
  word: string;
  originalLanguage: string;
  transliteration: string;
  meaning: string;
}

export interface HistoricalContext {
  author: string;
  date: string;
  audience: string;
  purpose: string;
  immediateContext: string;
}

export type LoadingState =
  | { type: 'idle' }
  | { type: 'loading'; step: string; progress: number }
  | { type: 'error'; message: string }
  | { type: 'success' };

export interface UserPreferences {
  language: string;
  translation: string;
  selectedBook: string;
  selectedChapter: number;
  selectedVerse: number;
}
