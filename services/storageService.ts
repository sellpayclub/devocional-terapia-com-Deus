import { STORAGE_KEYS } from "../constants";
import { DevotionalContent, StoredDevotional, Note } from "../types";

export const getDailyDevotional = (): DevotionalContent | null => {
  const json = localStorage.getItem(STORAGE_KEYS.DAILY_DEVOTIONAL);
  if (!json) return null;

  try {
    const stored: StoredDevotional = JSON.parse(json);
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    
    if (stored.date === today) {
      return stored.content;
    }
    return null; // Old devotional
  } catch (e) {
    return null;
  }
};

export const saveDailyDevotional = (content: DevotionalContent) => {
  const today = new Date().toISOString().split('T')[0];
  const stored: StoredDevotional = { date: today, content };
  localStorage.setItem(STORAGE_KEYS.DAILY_DEVOTIONAL, JSON.stringify(stored));
};

export const getNotes = (): Note[] => {
  const json = localStorage.getItem(STORAGE_KEYS.NOTES);
  if (!json) return [];
  try {
    return JSON.parse(json);
  } catch (e) {
    return [];
  }
};

export const saveNote = (text: string) => {
  const notes = getNotes();
  const newNote: Note = {
    id: Date.now().toString(),
    date: new Date().toLocaleDateString('pt-BR'),
    text
  };
  // Add to beginning
  const updated = [newNote, ...notes];
  localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(updated));
  return updated;
};

export const deleteNote = (id: string) => {
  const notes = getNotes();
  const updated = notes.filter(n => n.id !== id);
  localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(updated));
  return updated;
};