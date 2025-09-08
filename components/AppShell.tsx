'use client';

import { useState, useEffect } from 'react';
import { Home, BookOpen, BarChart3, Settings2 } from 'lucide-react';

interface AppShellProps {
  children: React.ReactNode;
  currentTab: string;
  onTabChange: (tab: string) => void;
}

export function AppShell({ children, currentTab, onTabChange }: AppShellProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  const tabs = [
    { id: 'journal', label: 'Journal', icon: Home },
    { id: 'coping', label: 'Coping', icon: BookOpen },
    { id: 'insights', label: 'Insights', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings2 },
  ];

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700">
      {/* Header */}
      <header className="p-4 text-center">
        <h1 className="text-2xl font-bold text-gradient">EmotiBuild</h1>
        <p className="text-sm text-text-secondary mt-1">Build resilience, one emotion at a time</p>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 pb-20">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-black bg-opacity-20 backdrop-blur-md border-t border-white border-opacity-20">
        <div className="flex justify-around py-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex flex-col items-center py-2 px-3 rounded-lg transition-all duration-200 ${
                  isActive 
                    ? 'text-white bg-white bg-opacity-20' 
                    : 'text-text-secondary hover:text-white'
                }`}
              >
                <Icon size={20} />
                <span className="text-xs mt-1">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
