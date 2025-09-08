import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, formatDistanceToNow, isToday, isYesterday, parseISO } from 'date-fns';
import { MoodEntry, ResilienceMetrics, MoodType } from './types';

// Utility function for combining Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
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

// Enhanced date formatting
export function formatRelativeTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return formatDistanceToNow(dateObj, { addSuffix: true });
}

export function formatDateEnhanced(date: Date | string): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  
  if (isToday(dateObj)) {
    return `Today, ${format(dateObj, 'h:mm a')}`;
  } else if (isYesterday(dateObj)) {
    return `Yesterday, ${format(dateObj, 'h:mm a')}`;
  } else {
    return format(dateObj, 'MMM d, h:mm a');
  }
}

// Enhanced mood color system
export function getMoodColor(mood: MoodType): string {
  const colors = {
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
  
  return colors[mood] || 'from-gray-400 to-gray-600';
}

export function getMoodTextColor(mood: MoodType): string {
  const colors = {
    happy: 'text-yellow-600',
    sad: 'text-blue-600',
    anxious: 'text-red-500',
    angry: 'text-red-700',
    excited: 'text-purple-600',
    calm: 'text-green-600',
    frustrated: 'text-orange-600',
    grateful: 'text-purple-700',
    overwhelmed: 'text-gray-600',
    content: 'text-green-600',
  };
  
  return colors[mood] || 'text-gray-600';
}

// Utility functions for data processing
export function generateId(): string {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Validation utilities
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidIntensity(intensity: number): boolean {
  return Number.isInteger(intensity) && intensity >= 1 && intensity <= 10;
}

// Data transformation utilities
export function groupEntriesByDate(entries: MoodEntry[]): Record<string, MoodEntry[]> {
  return entries.reduce((groups, entry) => {
    const date = new Date(entry.timestamp).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(entry);
    return groups;
  }, {} as Record<string, MoodEntry[]>);
}

export function getAverageMoodByDay(entries: MoodEntry[], days: number = 7): Array<{date: string, average: number}> {
  const grouped = groupEntriesByDate(entries);
  const result = [];
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateKey = date.toDateString();
    
    const dayEntries = grouped[dateKey] || [];
    const average = dayEntries.length > 0 
      ? dayEntries.reduce((sum, entry) => sum + entry.intensity, 0) / dayEntries.length
      : 0;
    
    result.push({
      date: format(date, 'MMM d'),
      average: Math.round(average * 10) / 10,
    });
  }
  
  return result;
}

// Animation and UI utilities
export function getRandomDelay(max: number = 200): number {
  return Math.random() * max;
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Error handling utilities
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

export function isNetworkError(error: unknown): boolean {
  return error instanceof Error && 
    (error.message.includes('fetch') || 
     error.message.includes('network') ||
     error.message.includes('offline'));
}

// Local storage utilities with error handling
export function safeLocalStorageGet(key: string): string | null {
  try {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(key);
  } catch (error) {
    console.warn(`Failed to get item from localStorage: ${key}`, error);
    return null;
  }
}

export function safeLocalStorageSet(key: string, value: string): boolean {
  try {
    if (typeof window === 'undefined') return false;
    localStorage.setItem(key, value);
    return true;
  } catch (error) {
    console.warn(`Failed to set item in localStorage: ${key}`, error);
    return false;
  }
}

export function safeLocalStorageRemove(key: string): boolean {
  try {
    if (typeof window === 'undefined') return false;
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.warn(`Failed to remove item from localStorage: ${key}`, error);
    return false;
  }
}
