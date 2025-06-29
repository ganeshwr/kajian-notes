import localforage from 'localforage';
import { Note, AppSettings } from '../types';

export class StorageService {
  private static notesStore = localforage.createInstance({
    name: 'kajian-notes',
    storeName: 'notes'
  });

  private static settingsStore = localforage.createInstance({
    name: 'kajian-notes',
    storeName: 'settings'
  });

  static async saveNote(note: Note): Promise<void> {
    await this.notesStore.setItem(note.id, note);
  }

  static async getNote(id: string): Promise<Note | null> {
    return await this.notesStore.getItem(id);
  }

  static async getAllNotes(): Promise<Note[]> {
    const notes: Note[] = [];
    await this.notesStore.iterate((note: Note) => {
      notes.push(note);
    });
    return notes.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  static async deleteNote(id: string): Promise<void> {
    await this.notesStore.removeItem(id);
  }

  static async saveSettings(settings: AppSettings): Promise<void> {
    await this.settingsStore.setItem('app-settings', settings);
  }

  static async getSettings(): Promise<AppSettings> {
    const settings = await this.settingsStore.getItem<AppSettings>('app-settings');
    return settings || {
      theme: 'light',
      language: 'en',
      autoSave: true,
      fontSize: 'md'
    };
  }
}