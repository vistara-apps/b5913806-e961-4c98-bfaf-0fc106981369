'use client';

import { useState } from 'react';
import { User } from '@/lib/types';
import { Sparkles, Heart, TrendingUp } from 'lucide-react';

interface WelcomeScreenProps {
  onUserCreated: (user: User) => void;
}

export function WelcomeScreen({ onUserCreated }: WelcomeScreenProps) {
  const [isCreating, setIsCreating] = useState(false);

  const handleGetStarted = async () => {
    setIsCreating(true);
    
    // Simulate a brief loading state
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser: User = {
      id: `user_${Date.now()}`,
      moodEntries: [],
      favoriteCopingMechanisms: [],
      createdAt: new Date(),
    };
    
    onUserCreated(newUser);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8 animate-fade-in">
        {/* Logo/Icon */}
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
            <Heart className="w-10 h-10 text-white" />
          </div>
        </div>

        {/* Title */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-gradient">EmotiBuild</h1>
          <p className="text-xl text-text-secondary">
            Build Resilience, One Emotion at a Time
          </p>
        </div>

        {/* Features */}
        <div className="space-y-4">
          <div className="glass-card p-4 text-left">
            <div className="flex items-center space-x-3 mb-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <h3 className="font-semibold">Daily Mood Tracking</h3>
            </div>
            <p className="text-sm text-text-secondary">
              Quick, simple entries to log emotions and identify triggers
            </p>
          </div>

          <div className="glass-card p-4 text-left">
            <div className="flex items-center space-x-3 mb-2">
              <Heart className="w-5 h-5 text-pink-400" />
              <h3 className="font-semibold">Coping Mechanisms</h3>
            </div>
            <p className="text-sm text-text-secondary">
              Curated collection of techniques for stress relief and resilience
            </p>
          </div>

          <div className="glass-card p-4 text-left">
            <div className="flex items-center space-x-3 mb-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              <h3 className="font-semibold">Resilience Insights</h3>
            </div>
            <p className="text-sm text-text-secondary">
              Track your progress and build emotional strength over time
            </p>
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={handleGetStarted}
          disabled={isCreating}
          className="btn-primary w-full py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isCreating ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Getting Started...</span>
            </div>
          ) : (
            'Start Your Journey'
          )}
        </button>

        <p className="text-xs text-text-secondary">
          Your emotional wellness journey starts here. All data is stored locally and private.
        </p>
      </div>
    </div>
  );
}
