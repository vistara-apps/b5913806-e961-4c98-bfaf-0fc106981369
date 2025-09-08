/**
 * Supabase Client Configuration
 * Handles database operations for EmotiBuild
 */

import { createClient } from '@supabase/supabase-js';
import { config } from './config';

// Create Supabase client
export const supabase = createClient(
  config.supabase.url,
  config.supabase.anonKey,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  }
);

// Database Types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          farcaster_id: string | null;
          wallet_address: string | null;
          username: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
          is_premium: boolean;
          premium_expires_at: string | null;
        };
        Insert: {
          id?: string;
          farcaster_id?: string | null;
          wallet_address?: string | null;
          username?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
          is_premium?: boolean;
          premium_expires_at?: string | null;
        };
        Update: {
          id?: string;
          farcaster_id?: string | null;
          wallet_address?: string | null;
          username?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
          is_premium?: boolean;
          premium_expires_at?: string | null;
        };
      };
      mood_entries: {
        Row: {
          id: string;
          user_id: string;
          mood: string;
          intensity: number;
          triggers: string[];
          notes: string;
          coping_mechanisms_used: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          mood: string;
          intensity: number;
          triggers?: string[];
          notes?: string;
          coping_mechanisms_used?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          mood?: string;
          intensity?: number;
          triggers?: string[];
          notes?: string;
          coping_mechanisms_used?: string[];
          created_at?: string;
          updated_at?: string;
        };
      };
      coping_mechanisms: {
        Row: {
          id: string;
          name: string;
          description: string;
          type: string;
          content: string;
          duration: number;
          difficulty: string;
          tags: string[];
          is_premium: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          type: string;
          content: string;
          duration: number;
          difficulty: string;
          tags?: string[];
          is_premium?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          type?: string;
          content?: string;
          duration?: number;
          difficulty?: string;
          tags?: string[];
          is_premium?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_favorites: {
        Row: {
          id: string;
          user_id: string;
          coping_mechanism_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          coping_mechanism_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          coping_mechanism_id?: string;
          created_at?: string;
        };
      };
      usage_analytics: {
        Row: {
          id: string;
          user_id: string;
          event_type: string;
          event_data: Record<string, any>;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          event_type: string;
          event_data?: Record<string, any>;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          event_type?: string;
          event_data?: Record<string, any>;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      mood_type: 'happy' | 'sad' | 'anxious' | 'angry' | 'excited' | 'calm' | 'frustrated' | 'grateful' | 'overwhelmed' | 'content';
      coping_type: 'breathing' | 'mindfulness' | 'affirmation' | 'movement' | 'journaling' | 'visualization';
      difficulty_level: 'easy' | 'medium' | 'hard';
    };
  };
}

// Helper functions for database operations
export class SupabaseService {
  // User operations
  static async createUser(userData: Database['public']['Tables']['users']['Insert']) {
    const { data, error } = await supabase
      .from('users')
      .insert(userData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async getUser(userId: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    return data;
  }

  static async updateUser(userId: string, updates: Database['public']['Tables']['users']['Update']) {
    const { data, error } = await supabase
      .from('users')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Mood entry operations
  static async createMoodEntry(entryData: Database['public']['Tables']['mood_entries']['Insert']) {
    const { data, error } = await supabase
      .from('mood_entries')
      .insert(entryData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async getUserMoodEntries(userId: string, limit = 50) {
    const { data, error } = await supabase
      .from('mood_entries')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data;
  }

  // Coping mechanism operations
  static async getCopingMechanisms(includesPremium = false) {
    let query = supabase.from('coping_mechanisms').select('*');
    
    if (!includesPremium) {
      query = query.eq('is_premium', false);
    }
    
    const { data, error } = await query.order('name');
    
    if (error) throw error;
    return data;
  }

  static async getUserFavorites(userId: string) {
    const { data, error } = await supabase
      .from('user_favorites')
      .select(`
        *,
        coping_mechanisms (*)
      `)
      .eq('user_id', userId);
    
    if (error) throw error;
    return data;
  }

  static async addFavorite(userId: string, copingMechanismId: string) {
    const { data, error } = await supabase
      .from('user_favorites')
      .insert({
        user_id: userId,
        coping_mechanism_id: copingMechanismId,
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async removeFavorite(userId: string, copingMechanismId: string) {
    const { error } = await supabase
      .from('user_favorites')
      .delete()
      .eq('user_id', userId)
      .eq('coping_mechanism_id', copingMechanismId);
    
    if (error) throw error;
  }

  // Analytics operations
  static async trackEvent(userId: string, eventType: string, eventData: Record<string, any> = {}) {
    const { error } = await supabase
      .from('usage_analytics')
      .insert({
        user_id: userId,
        event_type: eventType,
        event_data: eventData,
      });
    
    if (error) console.error('Analytics tracking error:', error);
  }

  // Resilience metrics calculation
  static async getResilienceMetrics(userId: string, days = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const { data: entries, error } = await supabase
      .from('mood_entries')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    // Calculate metrics
    if (!entries || entries.length === 0) {
      return {
        overallScore: 0,
        moodStability: 0,
        copingUsage: 0,
        streakDays: 0,
        improvementTrend: 'stable' as const,
      };
    }

    const avgIntensity = entries.reduce((sum, entry) => sum + entry.intensity, 0) / entries.length;
    const copingUsageCount = entries.reduce((sum, entry) => sum + (entry.coping_mechanisms_used?.length || 0), 0);
    
    // Calculate mood stability (lower variance = higher stability)
    const intensityVariance = entries.reduce((sum, entry) => 
      sum + Math.pow(entry.intensity - avgIntensity, 2), 0) / entries.length;
    const moodStability = Math.max(0, 100 - (intensityVariance * 10));
    
    // Calculate streak days
    const streakDays = this.calculateStreakDays(entries);
    
    // Calculate improvement trend
    const recentEntries = entries.slice(0, Math.floor(entries.length / 2));
    const olderEntries = entries.slice(Math.floor(entries.length / 2));
    
    const recentAvg = recentEntries.reduce((sum, entry) => sum + entry.intensity, 0) / recentEntries.length;
    const olderAvg = olderEntries.reduce((sum, entry) => sum + entry.intensity, 0) / olderEntries.length;
    
    let improvementTrend: 'up' | 'down' | 'stable' = 'stable';
    if (recentAvg > olderAvg + 0.5) improvementTrend = 'up';
    else if (recentAvg < olderAvg - 0.5) improvementTrend = 'down';
    
    return {
      overallScore: Math.round((avgIntensity + moodStability + (copingUsageCount * 2)) / 3),
      moodStability: Math.round(moodStability),
      copingUsage: copingUsageCount,
      streakDays,
      improvementTrend,
    };
  }

  private static calculateStreakDays(entries: any[]): number {
    if (entries.length === 0) return 0;
    
    let streak = 0;
    const today = new Date();
    
    for (let i = 0; i < entries.length; i++) {
      const entryDate = new Date(entries[i].created_at);
      const daysDiff = Math.floor((today.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === streak) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  }
}
