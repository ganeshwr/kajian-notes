export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  ustadz: string;
  date: string;
  createdAt: string;
  updatedAt: string;
  isFavorite: boolean;
}

export interface QuranVerse {
  number: number;
  text: string;
  translation: string;
  surah: {
    number: number;
    name: string;
    englishName: string;
  };
  numberInSurah: number;
}

export interface Hadith {
  id: string;
  text: string;
  translation: string;
  book: string;
  chapter: string;
  narrator: string;
  grade: string;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
  count: number;
}

export interface SearchResult {
  type: 'quran' | 'hadith';
  data: QuranVerse | Hadith;
}

export interface AppSettings {
  theme: 'light' | 'dark';
  language: 'en' | 'ar';
  autoSave: boolean;
  fontSize: 'sm' | 'md' | 'lg';
}