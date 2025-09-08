'use client';

import { useState, useEffect } from 'react';
import { User } from '@/lib/types';
import { LocalStorage } from '@/lib/storage';
import { MoodJournal } from './MoodJournal';
import { CopingLibrary } from './CopingLibrary';
import { ResilienceDashboard } from './ResilienceDashboard';
import { Navigation } from './Navigation';
import { WelcomeScreen } from './WelcomeScreen';

type ActiveTab = 'journal' | 'coping' | 'dashboard';

export function AppShell() {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>('journal');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize user data
    const existingUser = LocalStorage.getUser();
    if (existingUser) {
      setUser(existingUser);
    } else {
      // Create new user
      const newUser: User = {
        id: `user_${Date.now()}`,
        moodEntries: [],
        favoriteCopingMechanisms: [],
        createdAt: new Date(),
      };
      LocalStorage.setUser(newUser);
      setUser(newUser);
    }
    setIsLoading(false);
  }, []);

  const handleUserUpdate = (updatedUser: User) => {
    setUser(updatedUser);
    LocalStorage.setUser(updatedUser);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!user) {
    return <WelcomeScreen onUserCreated={handleUserUpdate} />;
  }

  const isFirstTime = user.moodEntries.length === 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700">
      <div className="max-w-md mx-auto min-h-screen bg-black bg-opacity-20 backdrop-blur-sm">
        {/* Header */}
        <header className="p-4 text-center border-b border-white border-opacity-20">
          <h1 className="text-2xl font-bold text-gradient">EmotiBuild</h1>
          <p className="text-sm text-text-secondary mt-1">
            Build resilience, one emotion at a time
          </p>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-4">
          {isFirstTime && activeTab === 'journal' && (
            <div className="glass-card p-4 mb-4 animate-fade-in">
              <h3 className="font-semibold mb-2">Welcome to EmotiBuild! 👋</h3>
              <p className="text-sm text-text-secondary">
                Start by logging your current mood. This helps you build awareness of your emotional patterns.
              </p>
            </div>
          )}

          {activeTab === 'journal' && (
            <MoodJournal user={user} onUserUpdate={handleUserUpdate} />
          )}
          
          {activeTab === 'coping' && (
            <CopingLibrary user={user} onUserUpdate={handleUserUpdate} />
          )}
          
          {activeTab === 'dashboard' && (
            <ResilienceDashboard user={user} />
          )}
        </main>

        {/* Navigation */}
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </div>
  );
}
