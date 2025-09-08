import { User, MoodEntry, CopingMechanism, MoodType } from './types';

// Local storage keys
const STORAGE_KEYS = {
  USER: 'emotibuild_user',
  MOOD_ENTRIES: 'emotibuild_mood_entries',
  COPING_MECHANISMS: 'emotibuild_coping_mechanisms',
} as const;

// Default coping mechanisms
const DEFAULT_COPING_MECHANISMS: CopingMechanism[] = [
  {
    id: '1',
    name: '4-7-8 Breathing',
    description: 'A calming breathing technique to reduce anxiety',
    type: 'breathing',
    content: 'Inhale for 4 counts, hold for 7 counts, exhale for 8 counts. Repeat 3-4 times.',
    duration: 2,
    difficulty: 'easy',
    tags: ['anxiety', 'stress', 'sleep'],
    isPremium: false,
  },
  {
    id: '2',
    name: '5-4-3-2-1 Grounding',
    description: 'Ground yourself using your five senses',
    type: 'mindfulness',
    content: 'Name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste.',
    duration: 3,
    difficulty: 'easy',
    tags: ['anxiety', 'panic', 'grounding'],
    isPremium: false,
  },
  {
    id: '3',
    name: 'Positive Affirmations',
    description: 'Boost your mood with self-affirming statements',
    type: 'affirmation',
    content: 'Repeat: "I am capable, I am worthy, I am enough. This challenge will help me grow."',
    duration: 2,
    difficulty: 'easy',
    tags: ['confidence', 'self-esteem', 'motivation'],
    isPremium: false,
  },
  {
    id: '4',
    name: 'Progressive Muscle Relaxation',
    description: 'Release physical tension throughout your body',
    type: 'movement',
    content: 'Tense and release each muscle group for 5 seconds, starting from your toes up to your head.',
    duration: 10,
    difficulty: 'medium',
    tags: ['stress', 'tension', 'relaxation'],
    isPremium: true,
  },
  {
    id: '5',
    name: 'Gratitude Journaling',
    description: 'Focus on positive aspects of your life',
    type: 'journaling',
    content: 'Write down 3 specific things you\'re grateful for today and why they matter to you.',
    duration: 5,
    difficulty: 'easy',
    tags: ['gratitude', 'positivity', 'reflection'],
    isPremium: false,
  },
];

export class LocalStorage {
  static getUser(): User | null {
    if (typeof window === 'undefined') return null;
    
    try {
      const userData = localStorage.getItem(STORAGE_KEYS.USER);
      if (!userData) return null;
      
      const user = JSON.parse(userData);
      return {
        ...user,
        createdAt: new Date(user.createdAt),
      };
    } catch (error) {
      console.error('Error getting user from localStorage:', error);
      return null;
    }
  }

  static setUser(user: User): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } catch (error) {
      console.error('Error saving user to localStorage:', error);
    }
  }

  static getMoodEntries(): MoodEntry[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const entriesData = localStorage.getItem(STORAGE_KEYS.MOOD_ENTRIES);
      if (!entriesData) return [];
      
      const entries = JSON.parse(entriesData);
      return entries.map((entry: any) => ({
        ...entry,
        timestamp: new Date(entry.timestamp),
      }));
    } catch (error) {
      console.error('Error getting mood entries from localStorage:', error);
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
      console.error('Error saving mood entry to localStorage:', error);
    }
  }

  static getCopingMechanisms(): CopingMechanism[] {
    if (typeof window === 'undefined') return DEFAULT_COPING_MECHANISMS;
    
    try {
      const mechanismsData = localStorage.getItem(STORAGE_KEYS.COPING_MECHANISMS);
      if (!mechanismsData) {
        // Initialize with default mechanisms
        this.setCopingMechanisms(DEFAULT_COPING_MECHANISMS);
        return DEFAULT_COPING_MECHANISMS;
      }
      
      return JSON.parse(mechanismsData);
    } catch (error) {
      console.error('Error getting coping mechanisms from localStorage:', error);
      return DEFAULT_COPING_MECHANISMS;
    }
  }

  static setCopingMechanisms(mechanisms: CopingMechanism[]): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(STORAGE_KEYS.COPING_MECHANISMS, JSON.stringify(mechanisms));
    } catch (error) {
      console.error('Error saving coping mechanisms to localStorage:', error);
    }
  }

  static addFavoriteCopingMechanism(userId: string, mechanismId: string): void {
    const user = this.getUser();
    if (!user || user.id !== userId) return;
    
    if (!user.favoriteCopingMechanisms.includes(mechanismId)) {
      user.favoriteCopingMechanisms.push(mechanismId);
      this.setUser(user);
    }
  }

  static removeFavoriteCopingMechanism(userId: string, mechanismId: string): void {
    const user = this.getUser();
    if (!user || user.id !== userId) return;
    
    user.favoriteCopingMechanisms = user.favoriteCopingMechanisms.filter(id => id !== mechanismId);
    this.setUser(user);
  }

  static clearAllData(): void {
    if (typeof window === 'undefined') return;
    
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }
}
