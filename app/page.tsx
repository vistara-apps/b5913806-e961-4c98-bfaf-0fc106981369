'use client';

import { useState, useEffect } from 'react';
import { useMiniKit } from '@coinbase/onchainkit/minikit';
import { AppShell } from '@/components/AppShell';
import { MoodInput } from '@/components/MoodInput';
import { CopingCard } from '@/components/CopingCard';
import { Modal } from '@/components/Modal';
import { ResilienceChart } from '@/components/ResilienceChart';
import { MoodEntry, MoodType, CopingMechanism } from '@/lib/types';
import { COPING_MECHANISMS, MOOD_EMOJIS } from '@/lib/data';
import { LocalStorage } from '@/lib/storage';
import { calculateResilienceMetrics, formatDate, generateId } from '@/lib/utils';
import { Plus, TrendingUp, Calendar, Target, Heart } from 'lucide-react';

export default function EmotiBuildApp() {
  const { setFrameReady } = useMiniKit();
  const [currentTab, setCurrentTab] = useState('journal');
  const [showMoodInput, setShowMoodInput] = useState(false);
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedMechanism, setSelectedMechanism] = useState<CopingMechanism | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setFrameReady();
    setMounted(true);
    
    // Load data from localStorage
    const entries = LocalStorage.getMoodEntries();
    const favs = LocalStorage.getFavorites();
    setMoodEntries(entries);
    setFavorites(favs);
  }, [setFrameReady]);

  const handleMoodSubmit = (mood: MoodType, triggers: string[], notes: string) => {
    const newEntry: MoodEntry = {
      id: generateId(),
      timestamp: new Date(),
      mood,
      triggers,
      notes,
    };

    LocalStorage.addMoodEntry(newEntry);
    setMoodEntries(prev => [...prev, newEntry]);
    setShowMoodInput(false);
  };

  const handleToggleFavorite = (mechanismId: string) => {
    LocalStorage.toggleFavorite(mechanismId);
    const newFavorites = LocalStorage.getFavorites();
    setFavorites(newFavorites);
  };

  const handleUseMechanism = (mechanismId: string) => {
    // In a real app, this would track usage and potentially update the last mood entry
    console.log('Using mechanism:', mechanismId);
    setSelectedMechanism(null);
  };

  const metrics = calculateResilienceMetrics(moodEntries);
  const todayEntry = moodEntries.find(entry => 
    entry.timestamp.toDateString() === new Date().toDateString()
  );

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  const renderJournalTab = () => (
    <div className="space-y-6">
      {/* Today's Status */}
      <div className="glass-card p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Today's Check-in</h2>
          <Calendar className="text-text-secondary" size={20} />
        </div>
        
        {todayEntry ? (
          <div className="flex items-center gap-3">
            <span className="text-3xl">{MOOD_EMOJIS[todayEntry.mood]}</span>
            <div>
              <p className="text-white font-medium">Feeling {todayEntry.mood.replace('-', ' ')}</p>
              {todayEntry.notes && (
                <p className="text-sm text-text-secondary">{todayEntry.notes}</p>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-text-secondary mb-4">How are you feeling today?</p>
            <button
              onClick={() => setShowMoodInput(true)}
              className="btn-primary flex items-center gap-2 mx-auto"
            >
              <Plus size={18} />
              Log Your Mood
            </button>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="metric-card">
          <div className="text-2xl font-bold text-white">{metrics.streakDays}</div>
          <div className="text-sm text-text-secondary">Day Streak</div>
        </div>
        <div className="metric-card">
          <div className="text-2xl font-bold text-white">{metrics.totalEntries}</div>
          <div className="text-sm text-text-secondary">Total Entries</div>
        </div>
      </div>

      {/* Recent Entries */}
      {moodEntries.length > 0 && <ResilienceChart entries={moodEntries} />}

      {/* Add Entry Button */}
      {todayEntry && (
        <button
          onClick={() => setShowMoodInput(true)}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          <Plus size={18} />
          Add Another Entry
        </button>
      )}
    </div>
  );

  const renderCopingTab = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-white mb-2">Coping Mechanisms</h2>
        <p className="text-text-secondary">Quick tools to help you feel better</p>
      </div>

      {/* Favorites */}
      {favorites.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-white mb-3 flex items-center gap-2">
            <Heart size={18} className="text-red-400" />
            Your Favorites
          </h3>
          <div className="space-y-3">
            {COPING_MECHANISMS
              .filter(mechanism => favorites.includes(mechanism.id))
              .map(mechanism => (
                <CopingCard
                  key={mechanism.id}
                  mechanism={mechanism}
                  isFavorite={true}
                  onToggleFavorite={handleToggleFavorite}
                  onUse={() => setSelectedMechanism(mechanism)}
                />
              ))}
          </div>
        </div>
      )}

      {/* All Mechanisms */}
      <div>
        <h3 className="text-lg font-medium text-white mb-3">All Techniques</h3>
        <div className="space-y-3">
          {COPING_MECHANISMS.map(mechanism => (
            <CopingCard
              key={mechanism.id}
              mechanism={mechanism}
              isFavorite={favorites.includes(mechanism.id)}
              onToggleFavorite={handleToggleFavorite}
              onUse={() => setSelectedMechanism(mechanism)}
            />
          ))}
        </div>
      </div>
    </div>
  );

  const renderInsightsTab = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-white mb-2">Your Resilience Journey</h2>
        <p className="text-text-secondary">Track your emotional wellness progress</p>
      </div>

      {/* Resilience Score */}
      <div className="glass-card p-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Target className="text-purple-400" size={24} />
          <h3 className="text-lg font-semibold text-white">Resilience Score</h3>
        </div>
        <div className="text-4xl font-bold text-gradient mb-2">{metrics.resilienceScore}</div>
        <div className="text-sm text-text-secondary">out of 100</div>
        
        {/* Progress Bar */}
        <div className="w-full bg-white bg-opacity-20 rounded-full h-2 mt-4">
          <div 
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${metrics.resilienceScore}%` }}
          />
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="metric-card">
          <div className="flex items-center justify-center gap-2 mb-2">
            <TrendingUp size={18} className="text-green-400" />
          </div>
          <div className="text-xl font-bold text-white">{metrics.averageMood.toFixed(1)}</div>
          <div className="text-sm text-text-secondary">Avg Mood</div>
        </div>
        
        <div className="metric-card">
          <div className="text-xl font-bold text-white">{metrics.copingMechanismsUsed}</div>
          <div className="text-sm text-text-secondary">Techniques Used</div>
        </div>
      </div>

      {/* Chart */}
      {moodEntries.length > 0 && <ResilienceChart entries={moodEntries} />}

      {moodEntries.length === 0 && (
        <div className="glass-card p-6 text-center">
          <p className="text-text-secondary mb-4">Start journaling to see your insights!</p>
          <button
            onClick={() => {
              setCurrentTab('journal');
              setShowMoodInput(true);
            }}
            className="btn-primary"
          >
            Log Your First Mood
          </button>
        </div>
      )}
    </div>
  );

  const renderSettingsTab = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-white mb-2">Settings</h2>
        <p className="text-text-secondary">Customize your EmotiBuild experience</p>
      </div>

      <div className="glass-card p-4">
        <h3 className="text-lg font-medium text-white mb-4">About EmotiBuild</h3>
        <p className="text-text-secondary text-sm leading-relaxed">
          EmotiBuild helps you track your emotions and build resilience through guided journaling 
          and evidence-based coping mechanisms. Your data is stored locally on your device for privacy.
        </p>
      </div>

      <div className="glass-card p-4">
        <h3 className="text-lg font-medium text-white mb-4">Data & Privacy</h3>
        <p className="text-text-secondary text-sm leading-relaxed">
          All your mood entries and preferences are stored locally on your device. 
          No data is sent to external servers without your explicit consent.
        </p>
      </div>

      <div className="glass-card p-4">
        <h3 className="text-lg font-medium text-white mb-4">Version</h3>
        <p className="text-text-secondary text-sm">EmotiBuild v1.0.0</p>
      </div>
    </div>
  );

  return (
    <AppShell currentTab={currentTab} onTabChange={setCurrentTab}>
      {currentTab === 'journal' && renderJournalTab()}
      {currentTab === 'coping' && renderCopingTab()}
      {currentTab === 'insights' && renderInsightsTab()}
      {currentTab === 'settings' && renderSettingsTab()}

      {/* Mood Input Modal */}
      <Modal
        isOpen={showMoodInput}
        onClose={() => setShowMoodInput(false)}
      >
        <MoodInput
          onSubmit={handleMoodSubmit}
          onCancel={() => setShowMoodInput(false)}
        />
      </Modal>

      {/* Coping Mechanism Detail Modal */}
      <Modal
        isOpen={!!selectedMechanism}
        onClose={() => setSelectedMechanism(null)}
      >
        {selectedMechanism && (
          <CopingCard
            mechanism={selectedMechanism}
            variant="detail"
            isFavorite={favorites.includes(selectedMechanism.id)}
            onToggleFavorite={handleToggleFavorite}
            onUse={handleUseMechanism}
          />
        )}
      </Modal>
    </AppShell>
  );
}
