export interface DevotionalContent {
  title: string;
  verse: string;
  reflection: string; // HTML or markdown string
  application: string;
  prayer: string;
  isFallback?: boolean;
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

export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: number;
}

export enum AppView {
  LANDING = 'LANDING',
  SALES = 'SALES',
  DAILY = 'DAILY',
  TOPICS = 'TOPICS',
  NOTES = 'NOTES',
  CHAT = 'CHAT'
}

export const TOPICS_LIST = [
  "Ansiedade",
  "Medo",
  "Esperança",
  "Fé",
  "Descanso",
  "Gratidão",
  "Perdão",
  "Confiança em Deus",
  "Relacionamentos",
  "Autoestima & Identidade",
  "Luto & Consolo",
  "Cansaço Mental",
  "Sabedoria nas Decisões"
];