'use client';

import { useState } from 'react';
import { CopingMechanism } from '@/lib/types';
import { Clock, Heart, Star, Play } from 'lucide-react';

interface CopingCardProps {
  mechanism: CopingMechanism;
  variant?: 'summary' | 'detail';
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
  onUse?: (id: string) => void;
}

export function CopingCard({ 
  mechanism, 
  variant = 'summary', 
  isFavorite = false,
  onToggleFavorite,
  onUse 
}: CopingCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const typeColors = {
    breathing: 'bg-blue-500',
    mindfulness: 'bg-green-500',
    affirmation: 'bg-purple-500',
    movement: 'bg-orange-500',
    journaling: 'bg-indigo-500',
    visualization: 'bg-pink-500',
  };

  const typeIcons = {
    breathing: '🫁',
    mindfulness: '🧘',
    affirmation: '💪',
    movement: '🏃',
    journaling: '📝',
    visualization: '🎨',
  };

  if (variant === 'summary') {
    return (
      <div 
        className="coping-card"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="text-2xl">{typeIcons[mechanism.type]}</div>
            <div>
              <h3 className="font-medium text-white">{mechanism.name}</h3>
              <p className="text-sm text-text-secondary">{mechanism.description}</p>
            </div>
          </div>
          
          {onToggleFavorite && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(mechanism.id);
              }}
              className={`p-1 rounded-full transition-colors duration-200 ${
                isFavorite ? 'text-red-400' : 'text-text-secondary hover:text-white'
              }`}
            >
              <Heart size={16} fill={isFavorite ? 'currentColor' : 'none'} />
            </button>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-text-secondary">
            {mechanism.duration && (
              <div className="flex items-center gap-1">
                <Clock size={14} />
                <span>{mechanism.duration} min</span>
              </div>
            )}
            
            <div className={`px-2 py-1 rounded-full text-xs text-white ${typeColors[mechanism.type]}`}>
              {mechanism.type}
            </div>
            
            {mechanism.isPremium && (
              <div className="flex items-center gap-1 text-yellow-400">
                <Star size={14} />
                <span className="text-xs">Premium</span>
              </div>
            )}
          </div>
        </div>

        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-white border-opacity-20 animate-fade-in">
            <p className="text-sm text-text-secondary mb-4">{mechanism.content}</p>
            
            {onUse && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onUse(mechanism.id);
                }}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                <Play size={16} />
                Start This Technique
              </button>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="glass-card p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="text-3xl">{typeIcons[mechanism.type]}</div>
          <div>
            <h2 className="text-xl font-semibold text-white">{mechanism.name}</h2>
            <p className="text-text-secondary">{mechanism.description}</p>
          </div>
        </div>
        
        {onToggleFavorite && (
          <button
            onClick={() => onToggleFavorite(mechanism.id)}
            className={`p-2 rounded-full transition-colors duration-200 ${
              isFavorite ? 'text-red-400' : 'text-text-secondary hover:text-white'
            }`}
          >
            <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
          </button>
        )}
      </div>

      <div className="flex items-center gap-4 mb-6 text-sm text-text-secondary">
        {mechanism.duration && (
          <div className="flex items-center gap-1">
            <Clock size={16} />
            <span>{mechanism.duration} minutes</span>
          </div>
        )}
        
        <div className={`px-3 py-1 rounded-full text-white ${typeColors[mechanism.type]}`}>
          {mechanism.type}
        </div>
        
        {mechanism.isPremium && (
          <div className="flex items-center gap-1 text-yellow-400">
            <Star size={16} />
            <span>Premium</span>
          </div>
        )}
      </div>

      <div className="bg-white bg-opacity-5 rounded-lg p-4 mb-6">
        <p className="text-white leading-relaxed">{mechanism.content}</p>
      </div>

      {onUse && (
        <button
          onClick={() => onUse(mechanism.id)}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          <Play size={18} />
          Start This Technique
        </button>
      )}
    </div>
  );
}
