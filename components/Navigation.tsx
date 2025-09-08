'use client';

import { BookOpen, Heart, TrendingUp } from 'lucide-react';

type ActiveTab = 'journal' | 'coping' | 'dashboard';

interface NavigationProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
}

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const tabs = [
    {
      id: 'journal' as const,
      label: 'Journal',
      icon: BookOpen,
    },
    {
      id: 'coping' as const,
      label: 'Coping',
      icon: Heart,
    },
    {
      id: 'dashboard' as const,
      label: 'Progress',
      icon: TrendingUp,
    },
  ];

  return (
    <nav className="border-t border-white border-opacity-20 bg-black bg-opacity-30 backdrop-blur-md">
      <div className="flex">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex-1 py-3 px-2 text-center transition-all duration-200 ${
                isActive
                  ? 'text-purple-400 bg-white bg-opacity-10'
                  : 'text-text-secondary hover:text-white hover:bg-white hover:bg-opacity-5'
              }`}
            >
              <Icon className="w-5 h-5 mx-auto mb-1" />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
