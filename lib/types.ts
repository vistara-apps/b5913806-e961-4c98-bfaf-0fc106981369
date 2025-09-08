export interface User {
  id: string;
  farcasterId?: string;
  walletAddress?: string;
  moodEntries: MoodEntry[];
  favoriteCopingMechanisms: string[];
  createdAt: Date;
}

export interface MoodEntry {
  id: string;
  userId: string;
  timestamp: Date;
  mood: MoodType;
  intensity: number; // 1-10 scale
  triggers: string[];
  notes: string;
  copingMechanismsUsed: string[];
}

export type MoodType = 
  | 'happy' 
  | 'sad' 
  | 'anxious' 
  | 'angry' 
  | 'excited' 
  | 'calm' 
  | 'frustrated' 
  | 'grateful' 
  | 'overwhelmed' 
  | 'content';

export interface CopingMechanism {
  id: string;
  name: string;
  description: string;
  type: CopingType;
  content: string;
  duration: number; // in minutes
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  isPremium: boolean;
}

export type CopingType = 
  | 'breathing' 
  | 'mindfulness' 
  | 'affirmation' 
  | 'movement' 
  | 'journaling' 
  | 'visualization';

export interface ResilienceMetrics {
  overallScore: number;
  moodStability: number;
  copingUsage: number;
  streakDays: number;
  improvementTrend: 'up' | 'down' | 'stable';
}

export const MOOD_EMOJIS: Record<MoodType, string> = {
  happy: '😊',
  sad: '😢',
  anxious: '😰',
  angry: '😠',
  excited: '🤩',
  calm: '😌',
  frustrated: '😤',
  grateful: '🙏',
  overwhelmed: '😵',
  content: '😊',
};

export const MOOD_COLORS: Record<MoodType, string> = {
  happy: 'from-yellow-400 to-orange-400',
  sad: 'from-blue-400 to-blue-600',
  anxious: 'from-red-400 to-pink-400',
  angry: 'from-red-500 to-red-700',
  excited: 'from-purple-400 to-pink-400',
  calm: 'from-green-400 to-blue-400',
  frustrated: 'from-orange-400 to-red-400',
  grateful: 'from-purple-400 to-indigo-400',
  overwhelmed: 'from-gray-400 to-gray-600',
  content: 'from-green-300 to-green-500',
};
