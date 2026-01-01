export interface DevotionalContent {
  title: string;
  verse: string;
  reflection: string; // HTML or markdown string
  application: string;
  prayer: string;
}

export interface StoredDevotional {
  date: string; // ISO Date string YYYY-MM-DD
  content: DevotionalContent;
}

export interface Note {
  id: string;
  date: string;
  text: string;
}

export enum AppView {
  LANDING = 'LANDING',
  DAILY = 'DAILY',
  TOPICS = 'TOPICS',
  NOTES = 'NOTES'
}

export const TOPICS_LIST = [
  "Ansiedade",
  "Medo",
  "Esperança",
  "Fé",
  "Descanso",
  "Gratidão",
  "Perdão",
  "Confiança em Deus"
];