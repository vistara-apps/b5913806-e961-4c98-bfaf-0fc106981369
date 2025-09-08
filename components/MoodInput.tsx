'use client';

import { useState } from 'react';
import { MoodType } from '@/lib/types';
import { MOOD_EMOJIS, MOOD_LABELS, COMMON_TRIGGERS } from '@/lib/data';
import { X } from 'lucide-react';

interface MoodInputProps {
  onSubmit: (mood: MoodType, triggers: string[], notes: string) => void;
  onCancel?: () => void;
}

export function MoodInput({ onSubmit, onCancel }: MoodInputProps) {
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [step, setStep] = useState<'mood' | 'triggers' | 'notes'>('mood');

  const handleMoodSelect = (mood: MoodType) => {
    setSelectedMood(mood);
    setStep('triggers');
  };

  const handleTriggerToggle = (trigger: string) => {
    setSelectedTriggers(prev => 
      prev.includes(trigger) 
        ? prev.filter(t => t !== trigger)
        : [...prev, trigger]
    );
  };

  const handleSubmit = () => {
    if (selectedMood) {
      onSubmit(selectedMood, selectedTriggers, notes);
    }
  };

  const handleBack = () => {
    if (step === 'triggers') {
      setStep('mood');
    } else if (step === 'notes') {
      setStep('triggers');
    }
  };

  return (
    <div className="glass-card p-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">
          {step === 'mood' && 'How are you feeling?'}
          {step === 'triggers' && 'What triggered this mood?'}
          {step === 'notes' && 'Any additional notes?'}
        </h2>
        {onCancel && (
          <button onClick={onCancel} className="text-text-secondary hover:text-white">
            <X size={20} />
          </button>
        )}
      </div>

      {/* Mood Selection */}
      {step === 'mood' && (
        <div className="grid grid-cols-4 gap-4">
          {Object.entries(MOOD_EMOJIS).map(([mood, emoji]) => (
            <button
              key={mood}
              onClick={() => handleMoodSelect(mood as MoodType)}
              className={`mood-emoji p-4 rounded-lg text-center transition-all duration-200 ${
                selectedMood === mood ? 'selected bg-white bg-opacity-20' : 'hover:bg-white hover:bg-opacity-10'
              }`}
            >
              <div className="text-3xl mb-2">{emoji}</div>
              <div className="text-xs text-text-secondary">{MOOD_LABELS[mood as MoodType]}</div>
            </button>
          ))}
        </div>
      )}

      {/* Trigger Selection */}
      {step === 'triggers' && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {COMMON_TRIGGERS.map((trigger) => (
              <button
                key={trigger}
                onClick={() => handleTriggerToggle(trigger)}
                className={`px-3 py-2 rounded-full text-sm transition-all duration-200 ${
                  selectedTriggers.includes(trigger)
                    ? 'bg-purple-500 text-white'
                    : 'bg-white bg-opacity-10 text-text-secondary hover:bg-opacity-20'
                }`}
              >
                {trigger}
              </button>
            ))}
          </div>
          
          <div className="flex gap-2 mt-6">
            <button
              onClick={handleBack}
              className="btn-secondary flex-1"
            >
              Back
            </button>
            <button
              onClick={() => setStep('notes')}
              className="btn-primary flex-1"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Notes Input */}
      {step === 'notes' && (
        <div className="space-y-4">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Share what's on your mind... (optional)"
            className="w-full p-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white placeholder-text-secondary resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
            rows={4}
          />
          
          <div className="flex gap-2">
            <button
              onClick={handleBack}
              className="btn-secondary flex-1"
            >
              Back
            </button>
            <button
              onClick={handleSubmit}
              className="btn-primary flex-1"
            >
              Save Entry
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
