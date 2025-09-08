export interface User {
  farcasterId?: string;
  walletAddress?: string;
  moodEntries: MoodEntry[];
  favoriteCopingMechanisms: string[];
}

export interface MoodEntry {
  id: string;
  userId?: string;
  timestamp: Date;
  mood: MoodType;
  triggers: string[];
  notes: string;
  copingMechanismsUsed?: string[];
}

export type MoodType = 'very-happy' | 'happy' | 'neutral' | 'sad' | 'very-sad' | 'anxious' | 'angry' | 'excited';

export interface CopingMechanism {
  id: string;
  name: string;
  description: string;
  type: 'breathing' | 'mindfulness' | 'affirmation' | 'exercise' | 'creative';
  content: string;
  duration?: number; // in minutes
  isPremium?: boolean;
}

export interface ResilienceMetrics {
  totalEntries: number;
  averageMood: number;
  streakDays: number;
  copingMechanismsUsed: number;
  resilienceScore: number;
}
