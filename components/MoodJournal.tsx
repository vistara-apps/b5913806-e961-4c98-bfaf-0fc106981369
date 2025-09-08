'use client';

import { useState } from 'react';
import { User, MoodEntry, MoodType, MOOD_EMOJIS } from '@/lib/types';
import { LocalStorage } from '@/lib/storage';
import { formatTime } from '@/lib/utils';
import { Plus, Save, X } from 'lucide-react';

interface MoodJournalProps {
  user: User;
  onUserUpdate: (user: User) => void;
}

export function MoodJournal({ user, onUserUpdate }: MoodJournalProps) {
  const [isAddingEntry, setIsAddingEntry] = useState(false);
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [intensity, setIntensity] = useState(5);
  const [notes, setNotes] = useState('');
  const [triggers, setTriggers] = useState<string[]>([]);
  const [triggerInput, setTriggerInput] = useState('');

  const moodEntries = LocalStorage.getMoodEntries().filter(entry => entry.userId === user.id);
  const recentEntries = moodEntries.slice(-5).reverse();

  const moodOptions: MoodType[] = [
    'happy', 'sad', 'anxious', 'angry', 'excited', 
    'calm', 'frustrated', 'grateful', 'overwhelmed', 'content'
  ];

  const handleAddTrigger = () => {
    if (triggerInput.trim() && !triggers.includes(triggerInput.trim())) {
      setTriggers([...triggers, triggerInput.trim()]);
      setTriggerInput('');
    }
  };

  const handleRemoveTrigger = (trigger: string) => {
    setTriggers(triggers.filter(t => t !== trigger));
  };

  const handleSaveEntry = () => {
    if (!selectedMood) return;

    const newEntry: MoodEntry = {
      id: `entry_${Date.now()}`,
      userId: user.id,
      timestamp: new Date(),
      mood: selectedMood,
      intensity,
      triggers,
      notes,
      copingMechanismsUsed: [],
    };

    LocalStorage.addMoodEntry(newEntry);
    
    // Update user's mood entries
    const updatedUser = {
      ...user,
      moodEntries: [...user.moodEntries, newEntry.id],
    };
    onUserUpdate(updatedUser);

    // Reset form
    setIsAddingEntry(false);
    setSelectedMood(null);
    setIntensity(5);
    setNotes('');
    setTriggers([]);
    setTriggerInput('');
  };

  const handleCancel = () => {
    setIsAddingEntry(false);
    setSelectedMood(null);
    setIntensity(5);
    setNotes('');
    setTriggers([]);
    setTriggerInput('');
  };

  if (isAddingEntry) {
    return (
      <div className="space-y-6 animate-slide-up">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">How are you feeling?</h2>
          <button
            onClick={handleCancel}
            className="p-2 hover:bg-white hover:bg-opacity-10 rounded-full transition-colors duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mood Selection */}
        <div className="glass-card p-4">
          <h3 className="font-medium mb-3">Select your mood</h3>
          <div className="grid grid-cols-5 gap-3">
            {moodOptions.map((mood) => (
              <button
                key={mood}
                onClick={() => setSelectedMood(mood)}
                className={`mood-emoji p-2 rounded-lg transition-all duration-200 ${
                  selectedMood === mood
                    ? 'bg-purple-500 bg-opacity-30 scale-110'
                    : 'hover:bg-white hover:bg-opacity-10'
                }`}
              >
                <div className="text-2xl">{MOOD_EMOJIS[mood]}</div>
                <div className="text-xs mt-1 capitalize">{mood}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Intensity Slider */}
        {selectedMood && (
          <div className="glass-card p-4">
            <h3 className="font-medium mb-3">Intensity (1-10)</h3>
            <div className="space-y-3">
              <input
                type="range"
                min="1"
                max="10"
                value={intensity}
                onChange={(e) => setIntensity(Number(e.target.value))}
                className="w-full h-2 bg-white bg-opacity-20 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-sm text-text-secondary">
                <span>Low</span>
                <span className="font-medium text-white">{intensity}</span>
                <span>High</span>
              </div>
            </div>
          </div>
        )}

        {/* Triggers */}
        <div className="glass-card p-4">
          <h3 className="font-medium mb-3">What triggered this feeling?</h3>
          <div className="space-y-3">
            <div className="flex space-x-2">
              <input
                type="text"
                value={triggerInput}
                onChange={(e) => setTriggerInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddTrigger()}
                placeholder="e.g., work stress, traffic"
                className="flex-1 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg px-3 py-2 text-sm placeholder-text-secondary focus:outline-none focus:border-purple-400"
              />
              <button
                onClick={handleAddTrigger}
                className="btn-secondary px-3 py-2"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            
            {triggers.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {triggers.map((trigger) => (
                  <span
                    key={trigger}
                    className="inline-flex items-center space-x-1 bg-purple-500 bg-opacity-30 text-sm px-2 py-1 rounded-full"
                  >
                    <span>{trigger}</span>
                    <button
                      onClick={() => handleRemoveTrigger(trigger)}
                      className="hover:text-red-400 transition-colors duration-200"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Notes */}
        <div className="glass-card p-4">
          <h3 className="font-medium mb-3">Additional notes (optional)</h3>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="How are you feeling? What's on your mind?"
            rows={3}
            className="w-full bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg px-3 py-2 text-sm placeholder-text-secondary focus:outline-none focus:border-purple-400 resize-none"
          />
        </div>

        {/* Save Button */}
        <button
          onClick={handleSaveEntry}
          disabled={!selectedMood}
          className="btn-primary w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="w-4 h-4 mr-2" />
          Save Entry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Mood Journal</h2>
        <button
          onClick={() => setIsAddingEntry(true)}
          className="btn-primary px-4 py-2"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Entry
        </button>
      </div>

      {recentEntries.length === 0 ? (
        <div className="glass-card p-6 text-center">
          <div className="text-4xl mb-3">📝</div>
          <h3 className="font-medium mb-2">Start Your Journey</h3>
          <p className="text-sm text-text-secondary mb-4">
            Begin tracking your emotions to build self-awareness and resilience.
          </p>
          <button
            onClick={() => setIsAddingEntry(true)}
            className="btn-primary px-6 py-2"
          >
            Log Your First Mood
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <h3 className="font-medium text-text-secondary">Recent Entries</h3>
          {recentEntries.map((entry) => (
            <div key={entry.id} className="glass-card p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{MOOD_EMOJIS[entry.mood]}</span>
                  <div>
                    <div className="font-medium capitalize">{entry.mood}</div>
                    <div className="text-sm text-text-secondary">
                      Intensity: {entry.intensity}/10
                    </div>
                  </div>
                </div>
                <div className="text-xs text-text-secondary">
                  {formatTime(entry.timestamp)}
                </div>
              </div>
              
              {entry.triggers.length > 0 && (
                <div className="mb-2">
                  <div className="text-xs text-text-secondary mb-1">Triggers:</div>
                  <div className="flex flex-wrap gap-1">
                    {entry.triggers.map((trigger) => (
                      <span
                        key={trigger}
                        className="text-xs bg-white bg-opacity-10 px-2 py-1 rounded-full"
                      >
                        {trigger}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {entry.notes && (
                <div className="text-sm text-text-secondary mt-2">
                  "{entry.notes}"
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
