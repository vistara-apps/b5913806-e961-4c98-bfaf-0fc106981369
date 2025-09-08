import { createClient } from '@supabase/supabase-js';
import { User, MoodEntry, CopingMechanism } from './types';

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types for Supabase
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          farcaster_id?: string;
          wallet_address?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          farcaster_id?: string;
          wallet_address?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          farcaster_id?: string;
          wallet_address?: string;
          updated_at?: string;
        };
      };
      mood_entries: {
        Row: {
          id: string;
          user_id: string;
          timestamp: string;
          mood: string;
          intensity: number;
          triggers: string[];
          notes: string;
          coping_mechanisms_used: string[];
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          timestamp?: string;
          mood: string;
          intensity: number;
          triggers?: string[];
          notes?: string;
          coping_mechanisms_used?: string[];
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          timestamp?: string;
          mood?: string;
          intensity?: number;
          triggers?: string[];
          notes?: string;
          coping_mechanisms_used?: string[];
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
        };
      };
    };
  };
}

// API functions for user management
export const userAPI = {
  async createUser(userData: Partial<User>) {
    const { data, error } = await supabase
      .from('users')
      .insert({
        farcaster_id: userData.farcasterId,
        wallet_address: userData.walletAddress,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getUser(userId: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  },

  async updateUser(userId: string, updates: Partial<User>) {
    const { data, error } = await supabase
      .from('users')
      .update({
        farcaster_id: updates.farcasterId,
        wallet_address: updates.walletAddress,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};

// API functions for mood entries
export const moodAPI = {
  async createMoodEntry(entry: Omit<MoodEntry, 'id'>) {
    const { data, error } = await supabase
      .from('mood_entries')
      .insert({
        user_id: entry.userId,
        timestamp: entry.timestamp.toISOString(),
        mood: entry.mood,
        intensity: entry.intensity,
        triggers: entry.triggers,
        notes: entry.notes,
        coping_mechanisms_used: entry.copingMechanismsUsed,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getMoodEntries(userId: string, limit = 50) {
    const { data, error } = await supabase
      .from('mood_entries')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  },

  async updateMoodEntry(entryId: string, updates: Partial<MoodEntry>) {
    const { data, error } = await supabase
      .from('mood_entries')
      .update({
        mood: updates.mood,
        intensity: updates.intensity,
        triggers: updates.triggers,
        notes: updates.notes,
        coping_mechanisms_used: updates.copingMechanismsUsed,
      })
      .eq('id', entryId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteMoodEntry(entryId: string) {
    const { error } = await supabase
      .from('mood_entries')
      .delete()
      .eq('id', entryId);

    if (error) throw error;
  },
};

// API functions for user favorites
export const favoritesAPI = {
  async addFavorite(userId: string, copingMechanismId: string) {
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
  },

  async removeFavorite(userId: string, copingMechanismId: string) {
    const { error } = await supabase
      .from('user_favorites')
      .delete()
      .eq('user_id', userId)
      .eq('coping_mechanism_id', copingMechanismId);

    if (error) throw error;
  },

  async getFavorites(userId: string) {
    const { data, error } = await supabase
      .from('user_favorites')
      .select('coping_mechanism_id')
      .eq('user_id', userId);

    if (error) throw error;
    return data.map(item => item.coping_mechanism_id);
  },
};

// Real-time subscriptions
export const subscriptions = {
  subscribeMoodEntries(userId: string, callback: (payload: any) => void) {
    return supabase
      .channel('mood_entries')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'mood_entries',
          filter: `user_id=eq.${userId}`,
        },
        callback
      )
      .subscribe();
  },

  subscribeFavorites(userId: string, callback: (payload: any) => void) {
    return supabase
      .channel('user_favorites')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_favorites',
          filter: `user_id=eq.${userId}`,
        },
        callback
      )
      .subscribe();
  },
};

// Error handling utility
export function handleSupabaseError(error: any): string {
  if (error?.message) {
    return error.message;
  }
  return 'An unexpected error occurred';
}

// Connection status check
export async function checkConnection(): Promise<boolean> {
  try {
    const { data, error } = await supabase.from('users').select('id').limit(1);
    return !error;
  } catch {
    return false;
  }
}
