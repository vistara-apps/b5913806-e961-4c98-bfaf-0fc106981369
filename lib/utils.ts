import { MoodEntry, ResilienceMetrics, MoodType } from './types';
import { format, isToday, subDays, differenceInDays } from 'date-fns';

export function calculateResilienceMetrics(entries: MoodEntry[]): ResilienceMetrics {
  if (entries.length === 0) {
    return {
      totalEntries: 0,
      averageMood: 0,
      streakDays: 0,
      copingMechanismsUsed: 0,
      resilienceScore: 0,
    };
  }

  // Calculate average mood (convert mood to numeric scale)
  const moodValues = entries.map(entry => getMoodValue(entry.mood));
  const averageMood = moodValues.reduce((sum, value) => sum + value, 0) / moodValues.length;

  // Calculate streak days
  const sortedEntries = entries.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  let streakDays = 0;
  let currentDate = new Date();
  
  for (const entry of sortedEntries) {
    const daysDiff = differenceInDays(currentDate, entry.timestamp);
    if (daysDiff === streakDays) {
      streakDays++;
      currentDate = subDays(currentDate, 1);
    } else {
      break;
    }
  }

  // Count unique coping mechanisms used
  const copingMechanismsUsed = new Set(
    entries.flatMap(entry => entry.copingMechanismsUsed || [])
  ).size;

  // Calculate resilience score (0-100)
  const consistencyScore = Math.min(streakDays * 5, 30); // Max 30 points for consistency
  const moodScore = (averageMood / 5) * 40; // Max 40 points for mood
  const copingScore = Math.min(copingMechanismsUsed * 3, 30); // Max 30 points for coping variety

  const resilienceScore = Math.round(consistencyScore + moodScore + copingScore);

  return {
    totalEntries: entries.length,
    averageMood: Math.round(averageMood * 10) / 10,
    streakDays,
    copingMechanismsUsed,
    resilienceScore: Math.min(resilienceScore, 100),
  };
}

function getMoodValue(mood: MoodType): number {
  const moodScale = {
    'very-sad': 1,
    'sad': 2,
    'anxious': 2.5,
    'angry': 2.5,
    'neutral': 3,
    'happy': 4,
    'excited': 4.5,
    'very-happy': 5,
  };
  return moodScale[mood] || 3;
}

export function formatDate(date: Date): string {
  if (isToday(date)) {
    return 'Today';
  }
  return format(date, 'MMM d');
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export function getMoodTrend(entries: MoodEntry[]): 'improving' | 'declining' | 'stable' {
  if (entries.length < 2) return 'stable';
  
  const recent = entries.slice(-7); // Last 7 entries
  const older = entries.slice(-14, -7); // Previous 7 entries
  
  if (recent.length === 0 || older.length === 0) return 'stable';
  
  const recentAvg = recent.reduce((sum, entry) => sum + getMoodValue(entry.mood), 0) / recent.length;
  const olderAvg = older.reduce((sum, entry) => sum + getMoodValue(entry.mood), 0) / older.length;
  
  const difference = recentAvg - olderAvg;
  
  if (difference > 0.3) return 'improving';
  if (difference < -0.3) return 'declining';
  return 'stable';
}
