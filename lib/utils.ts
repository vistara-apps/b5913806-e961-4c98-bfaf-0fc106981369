import { MoodEntry, ResilienceMetrics, MoodType } from './types';

export function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

export function formatTime(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date);
}

export function calculateResilienceScore(moodEntries: MoodEntry[]): ResilienceMetrics {
  if (moodEntries.length === 0) {
    return {
      overallScore: 0,
      moodStability: 0,
      copingUsage: 0,
      streakDays: 0,
      improvementTrend: 'stable',
    };
  }

  // Calculate mood stability (lower variance = higher stability)
  const intensities = moodEntries.map(entry => entry.intensity);
  const avgIntensity = intensities.reduce((sum, val) => sum + val, 0) / intensities.length;
  const variance = intensities.reduce((sum, val) => sum + Math.pow(val - avgIntensity, 2), 0) / intensities.length;
  const moodStability = Math.max(0, 100 - (variance * 10));

  // Calculate coping mechanism usage
  const entriesWithCoping = moodEntries.filter(entry => entry.copingMechanismsUsed.length > 0);
  const copingUsage = (entriesWithCoping.length / moodEntries.length) * 100;

  // Calculate streak days
  const sortedEntries = [...moodEntries].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  let streakDays = 0;
  let currentDate = new Date();
  
  for (const entry of sortedEntries) {
    const entryDate = new Date(entry.timestamp);
    const daysDiff = Math.floor((currentDate.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === streakDays) {
      streakDays++;
      currentDate = entryDate;
    } else {
      break;
    }
  }

  // Calculate improvement trend
  const recentEntries = moodEntries.slice(-7); // Last 7 entries
  const olderEntries = moodEntries.slice(-14, -7); // Previous 7 entries
  
  let improvementTrend: 'up' | 'down' | 'stable' = 'stable';
  
  if (recentEntries.length > 0 && olderEntries.length > 0) {
    const recentAvg = recentEntries.reduce((sum, entry) => sum + entry.intensity, 0) / recentEntries.length;
    const olderAvg = olderEntries.reduce((sum, entry) => sum + entry.intensity, 0) / olderEntries.length;
    
    if (recentAvg > olderAvg + 0.5) improvementTrend = 'up';
    else if (recentAvg < olderAvg - 0.5) improvementTrend = 'down';
  }

  // Calculate overall score
  const overallScore = Math.round((moodStability + copingUsage + Math.min(streakDays * 5, 50)) / 2);

  return {
    overallScore,
    moodStability: Math.round(moodStability),
    copingUsage: Math.round(copingUsage),
    streakDays,
    improvementTrend,
  };
}

export function getMoodTrend(moodEntries: MoodEntry[]): 'improving' | 'declining' | 'stable' {
  if (moodEntries.length < 2) return 'stable';
  
  const recent = moodEntries.slice(-3);
  const older = moodEntries.slice(-6, -3);
  
  if (recent.length === 0 || older.length === 0) return 'stable';
  
  const recentAvg = recent.reduce((sum, entry) => sum + entry.intensity, 0) / recent.length;
  const olderAvg = older.reduce((sum, entry) => sum + entry.intensity, 0) / older.length;
  
  const diff = recentAvg - olderAvg;
  
  if (diff > 0.5) return 'improving';
  if (diff < -0.5) return 'declining';
  return 'stable';
}

export function getRandomCopingMechanism() {
  const mechanisms = [
    "Take 5 deep breaths, focusing on the exhale",
    "Name 3 things you can see, 2 you can hear, 1 you can touch",
    "Repeat: 'This feeling is temporary and will pass'",
    "Do 10 jumping jacks or stretch your arms",
    "Write down one thing you're grateful for today",
  ];
  
  return mechanisms[Math.floor(Math.random() * mechanisms.length)];
}
