import { MoodEntry, User, CopingMechanism } from './types';

const STORAGE_KEYS = {
  USER: 'emotibuild_user',
  MOOD_ENTRIES: 'emotibuild_mood_entries',
  FAVORITES: 'emotibuild_favorites',
} as const;

export class LocalStorage {
  static getUser(): User | null {
    if (typeof window === 'undefined') return null;
    
    try {
      const userData = localStorage.getItem(STORAGE_KEYS.USER);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  }

  static setUser(user: User): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  }

  static getMoodEntries(): MoodEntry[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const entries = localStorage.getItem(STORAGE_KEYS.MOOD_ENTRIES);
      return entries ? JSON.parse(entries).map((entry: any) => ({
        ...entry,
        timestamp: new Date(entry.timestamp)
      })) : [];
    } catch (error) {
      console.error('Error getting mood entries:', error);
      return [];
    }
  }

  static addMoodEntry(entry: MoodEntry): void {
    if (typeof window === 'undefined') return;
    
    try {
      const entries = this.getMoodEntries();
      entries.push(entry);
      localStorage.setItem(STORAGE_KEYS.MOOD_ENTRIES, JSON.stringify(entries));
    } catch (error) {
      console.error('Error saving mood entry:', error);
    }
  }

  static getFavorites(): string[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const favorites = localStorage.getItem(STORAGE_KEYS.FAVORITES);
      return favorites ? JSON.parse(favorites) : [];
    } catch (error) {
      console.error('Error getting favorites:', error);
      return [];
    }
  }

  static toggleFavorite(mechanismId: string): void {
    if (typeof window === 'undefined') return;
    
    try {
      const favorites = this.getFavorites();
      const index = favorites.indexOf(mechanismId);
      
      if (index > -1) {
        favorites.splice(index, 1);
      } else {
        favorites.push(mechanismId);
      }
      
      localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  }
}
