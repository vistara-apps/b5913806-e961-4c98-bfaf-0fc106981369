import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User, MoodEntry, CopingMechanism, ResilienceMetrics } from './types';
import { calculateResilienceScore } from './utils';
import { COPING_MECHANISMS } from './data';

interface AppState {
  // User state
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Mood entries
  moodEntries: MoodEntry[];
  
  // Coping mechanisms
  copingMechanisms: CopingMechanism[];
  favoriteCopingMechanisms: string[];
  
  // UI state
  activeTab: 'journal' | 'coping' | 'dashboard';
  isOnline: boolean;
  lastSync: Date | null;
  
  // Resilience metrics
  resilienceMetrics: ResilienceMetrics;
  
  // Actions
  setUser: (user: User | null) => void;
  setAuthenticated: (authenticated: boolean) => void;
  setLoading: (loading: boolean) => void;
  
  // Mood entry actions
  addMoodEntry: (entry: Omit<MoodEntry, 'id'>) => void;
  updateMoodEntry: (id: string, updates: Partial<MoodEntry>) => void;
  deleteMoodEntry: (id: string) => void;
  setMoodEntries: (entries: MoodEntry[]) => void;
  
  // Coping mechanism actions
  toggleFavoriteCoping: (copingId: string) => void;
  setFavoriteCopingMechanisms: (favorites: string[]) => void;
  
  // UI actions
  setActiveTab: (tab: 'journal' | 'coping' | 'dashboard') => void;
  setOnlineStatus: (online: boolean) => void;
  updateLastSync: () => void;
  
  // Computed values
  getRecentMoodEntries: (days?: number) => MoodEntry[];
  getMoodEntriesByDateRange: (startDate: Date, endDate: Date) => MoodEntry[];
  getFavoriteCopingMechanisms: () => CopingMechanism[];
  updateResilienceMetrics: () => void;
  
  // Reset functions
  resetUserData: () => void;
  clearAllData: () => void;
}

const generateId = () => `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      isLoading: false,
      moodEntries: [],
      copingMechanisms: COPING_MECHANISMS,
      favoriteCopingMechanisms: [],
      activeTab: 'journal',
      isOnline: true,
      lastSync: null,
      resilienceMetrics: {
        overallScore: 0,
        moodStability: 0,
        copingUsage: 0,
        streakDays: 0,
        improvementTrend: 'stable',
      },

      // User actions
      setUser: (user) => {
        set({ user });
        if (user) {
          get().updateResilienceMetrics();
        }
      },
      
      setAuthenticated: (authenticated) => set({ isAuthenticated: authenticated }),
      
      setLoading: (loading) => set({ isLoading: loading }),

      // Mood entry actions
      addMoodEntry: (entryData) => {
        const newEntry: MoodEntry = {
          ...entryData,
          id: generateId(),
        };
        
        set((state) => ({
          moodEntries: [newEntry, ...state.moodEntries],
        }));
        
        // Update user's mood entries if user exists
        const { user } = get();
        if (user) {
          set({
            user: {
              ...user,
              moodEntries: [newEntry, ...user.moodEntries],
            },
          });
        }
        
        get().updateResilienceMetrics();
      },

      updateMoodEntry: (id, updates) => {
        set((state) => ({
          moodEntries: state.moodEntries.map((entry) =>
            entry.id === id ? { ...entry, ...updates } : entry
          ),
        }));
        
        // Update user's mood entries if user exists
        const { user } = get();
        if (user) {
          set({
            user: {
              ...user,
              moodEntries: user.moodEntries.map((entry) =>
                entry.id === id ? { ...entry, ...updates } : entry
              ),
            },
          });
        }
        
        get().updateResilienceMetrics();
      },

      deleteMoodEntry: (id) => {
        set((state) => ({
          moodEntries: state.moodEntries.filter((entry) => entry.id !== id),
        }));
        
        // Update user's mood entries if user exists
        const { user } = get();
        if (user) {
          set({
            user: {
              ...user,
              moodEntries: user.moodEntries.filter((entry) => entry.id !== id),
            },
          });
        }
        
        get().updateResilienceMetrics();
      },

      setMoodEntries: (entries) => {
        set({ moodEntries: entries });
        get().updateResilienceMetrics();
      },

      // Coping mechanism actions
      toggleFavoriteCoping: (copingId) => {
        set((state) => {
          const isFavorite = state.favoriteCopingMechanisms.includes(copingId);
          const newFavorites = isFavorite
            ? state.favoriteCopingMechanisms.filter((id) => id !== copingId)
            : [...state.favoriteCopingMechanisms, copingId];
          
          // Update user's favorites if user exists
          const { user } = state;
          if (user) {
            return {
              favoriteCopingMechanisms: newFavorites,
              user: {
                ...user,
                favoriteCopingMechanisms: newFavorites,
              },
            };
          }
          
          return { favoriteCopingMechanisms: newFavorites };
        });
      },

      setFavoriteCopingMechanisms: (favorites) => {
        set({ favoriteCopingMechanisms: favorites });
        
        // Update user's favorites if user exists
        const { user } = get();
        if (user) {
          set({
            user: {
              ...user,
              favoriteCopingMechanisms: favorites,
            },
          });
        }
      },

      // UI actions
      setActiveTab: (tab) => set({ activeTab: tab }),
      
      setOnlineStatus: (online) => set({ isOnline: online }),
      
      updateLastSync: () => set({ lastSync: new Date() }),

      // Computed values
      getRecentMoodEntries: (days = 7) => {
        const { moodEntries } = get();
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        
        return moodEntries.filter(
          (entry) => new Date(entry.timestamp) >= cutoffDate
        );
      },

      getMoodEntriesByDateRange: (startDate, endDate) => {
        const { moodEntries } = get();
        return moodEntries.filter((entry) => {
          const entryDate = new Date(entry.timestamp);
          return entryDate >= startDate && entryDate <= endDate;
        });
      },

      getFavoriteCopingMechanisms: () => {
        const { copingMechanisms, favoriteCopingMechanisms } = get();
        return copingMechanisms.filter((mechanism) =>
          favoriteCopingMechanisms.includes(mechanism.id)
        );
      },

      updateResilienceMetrics: () => {
        const { moodEntries } = get();
        const metrics = calculateResilienceScore(moodEntries);
        set({ resilienceMetrics: metrics });
      },

      // Reset functions
      resetUserData: () => {
        set({
          user: null,
          isAuthenticated: false,
          moodEntries: [],
          favoriteCopingMechanisms: [],
          resilienceMetrics: {
            overallScore: 0,
            moodStability: 0,
            copingUsage: 0,
            streakDays: 0,
            improvementTrend: 'stable',
          },
        });
      },

      clearAllData: () => {
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          moodEntries: [],
          favoriteCopingMechanisms: [],
          activeTab: 'journal',
          lastSync: null,
          resilienceMetrics: {
            overallScore: 0,
            moodStability: 0,
            copingUsage: 0,
            streakDays: 0,
            improvementTrend: 'stable',
          },
        });
      },
    }),
    {
      name: 'emotibuild-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        moodEntries: state.moodEntries,
        favoriteCopingMechanisms: state.favoriteCopingMechanisms,
        activeTab: state.activeTab,
        lastSync: state.lastSync,
      }),
    }
  )
);

// Selectors for better performance
export const useUser = () => useAppStore((state) => state.user);
export const useIsAuthenticated = () => useAppStore((state) => state.isAuthenticated);
export const useMoodEntries = () => useAppStore((state) => state.moodEntries);
export const useResilienceMetrics = () => useAppStore((state) => state.resilienceMetrics);
export const useActiveTab = () => useAppStore((state) => state.activeTab);
export const useFavoriteCopingMechanisms = () => useAppStore((state) => state.getFavoriteCopingMechanisms());

// Custom hooks for common operations
export const useMoodActions = () => {
  const addMoodEntry = useAppStore((state) => state.addMoodEntry);
  const updateMoodEntry = useAppStore((state) => state.updateMoodEntry);
  const deleteMoodEntry = useAppStore((state) => state.deleteMoodEntry);
  
  return { addMoodEntry, updateMoodEntry, deleteMoodEntry };
};

export const useCopingActions = () => {
  const toggleFavoriteCoping = useAppStore((state) => state.toggleFavoriteCoping);
  const copingMechanisms = useAppStore((state) => state.copingMechanisms);
  const favoriteCopingMechanisms = useAppStore((state) => state.favoriteCopingMechanisms);
  
  return { toggleFavoriteCoping, copingMechanisms, favoriteCopingMechanisms };
};

// Initialize online status listener
if (typeof window !== 'undefined') {
  const updateOnlineStatus = () => {
    useAppStore.getState().setOnlineStatus(navigator.onLine);
  };
  
  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);
  
  // Set initial status
  updateOnlineStatus();
}
