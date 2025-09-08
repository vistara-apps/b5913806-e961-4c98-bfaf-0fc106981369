'use client';

import { useState, useEffect } from 'react';
import { User, CopingMechanism } from '@/lib/types';
import { LocalStorage } from '@/lib/storage';
import { Heart, Clock, Star, Play, ArrowLeft } from 'lucide-react';

interface CopingLibraryProps {
  user: User;
  onUserUpdate: (user: User) => void;
}

export function CopingLibrary({ user, onUserUpdate }: CopingLibraryProps) {
  const [mechanisms, setMechanisms] = useState<CopingMechanism[]>([]);
  const [selectedMechanism, setSelectedMechanism] = useState<CopingMechanism | null>(null);
  const [filter, setFilter] = useState<'all' | 'favorites' | 'free'>('all');

  useEffect(() => {
    const copingMechanisms = LocalStorage.getCopingMechanisms();
    setMechanisms(copingMechanisms);
  }, []);

  const filteredMechanisms = mechanisms.filter(mechanism => {
    if (filter === 'favorites') {
      return user.favoriteCopingMechanisms.includes(mechanism.id);
    }
    if (filter === 'free') {
      return !mechanism.isPremium;
    }
    return true;
  });

  const handleToggleFavorite = (mechanismId: string) => {
    const isFavorite = user.favoriteCopingMechanisms.includes(mechanismId);
    
    if (isFavorite) {
      LocalStorage.removeFavoriteCopingMechanism(user.id, mechanismId);
      const updatedUser = {
        ...user,
        favoriteCopingMechanisms: user.favoriteCopingMechanisms.filter(id => id !== mechanismId),
      };
      onUserUpdate(updatedUser);
    } else {
      LocalStorage.addFavoriteCopingMechanism(user.id, mechanismId);
      const updatedUser = {
        ...user,
        favoriteCopingMechanisms: [...user.favoriteCopingMechanisms, mechanismId],
      };
      onUserUpdate(updatedUser);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'hard': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'breathing': return '🫁';
      case 'mindfulness': return '🧘';
      case 'affirmation': return '💭';
      case 'movement': return '🏃';
      case 'journaling': return '📝';
      case 'visualization': return '🎨';
      default: return '💡';
    }
  };

  if (selectedMechanism) {
    return (
      <div className="space-y-6 animate-slide-up">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSelectedMechanism(null)}
            className="flex items-center space-x-2 text-text-secondary hover:text-white transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          <button
            onClick={() => handleToggleFavorite(selectedMechanism.id)}
            className={`p-2 rounded-full transition-colors duration-200 ${
              user.favoriteCopingMechanisms.includes(selectedMechanism.id)
                ? 'text-pink-400 hover:text-pink-300'
                : 'text-gray-400 hover:text-pink-400'
            }`}
          >
            <Heart className={`w-5 h-5 ${
              user.favoriteCopingMechanisms.includes(selectedMechanism.id) ? 'fill-current' : ''
            }`} />
          </button>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center space-x-3 mb-4">
            <span className="text-3xl">{getTypeIcon(selectedMechanism.type)}</span>
            <div>
              <h2 className="text-xl font-semibold">{selectedMechanism.name}</h2>
              <p className="text-sm text-text-secondary">{selectedMechanism.description}</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 mb-6 text-sm text-text-secondary">
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{selectedMechanism.duration} min</span>
            </div>
            <div className={`capitalize ${getDifficultyColor(selectedMechanism.difficulty)}`}>
              {selectedMechanism.difficulty}
            </div>
            {selectedMechanism.isPremium && (
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 text-white text-xs px-2 py-1 rounded-full">
                Premium
              </span>
            )}
          </div>

          <div className="bg-white bg-opacity-5 rounded-lg p-4 mb-6">
            <h3 className="font-medium mb-3">Instructions</h3>
            <p className="text-text-secondary leading-relaxed">
              {selectedMechanism.content}
            </p>
          </div>

          {selectedMechanism.tags.length > 0 && (
            <div className="mb-6">
              <h3 className="font-medium mb-2">Helpful for:</h3>
              <div className="flex flex-wrap gap-2">
                {selectedMechanism.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-purple-500 bg-opacity-30 px-2 py-1 rounded-full capitalize"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <button
            className="btn-primary w-full py-3"
            disabled={selectedMechanism.isPremium}
          >
            <Play className="w-4 h-4 mr-2" />
            {selectedMechanism.isPremium ? 'Upgrade to Access' : 'Start Practice'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Coping Mechanisms</h2>
        <p className="text-sm text-text-secondary">
          Quick, actionable techniques to help you manage difficult emotions
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-1 bg-white bg-opacity-10 rounded-lg p-1">
        {[
          { key: 'all', label: 'All' },
          { key: 'free', label: 'Free' },
          { key: 'favorites', label: 'Favorites' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key as any)}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all duration-200 ${
              filter === tab.key
                ? 'bg-white bg-opacity-20 text-white'
                : 'text-text-secondary hover:text-white'
            }`}
          >
            {tab.label}
            {tab.key === 'favorites' && user.favoriteCopingMechanisms.length > 0 && (
              <span className="ml-1 text-xs bg-purple-400 text-white rounded-full px-1.5 py-0.5">
                {user.favoriteCopingMechanisms.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Mechanisms Grid */}
      <div className="space-y-3">
        {filteredMechanisms.length === 0 ? (
          <div className="glass-card p-6 text-center">
            <div className="text-4xl mb-3">
              {filter === 'favorites' ? '⭐' : '🔍'}
            </div>
            <h3 className="font-medium mb-2">
              {filter === 'favorites' ? 'No favorites yet' : 'No mechanisms found'}
            </h3>
            <p className="text-sm text-text-secondary">
              {filter === 'favorites' 
                ? 'Start adding mechanisms to your favorites by tapping the heart icon'
                : 'Try adjusting your filter or check back later for new content'
              }
            </p>
          </div>
        ) : (
          filteredMechanisms.map((mechanism) => (
            <div
              key={mechanism.id}
              onClick={() => setSelectedMechanism(mechanism)}
              className="coping-card cursor-pointer"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{getTypeIcon(mechanism.type)}</span>
                  <div>
                    <h3 className="font-medium">{mechanism.name}</h3>
                    <p className="text-sm text-text-secondary">{mechanism.description}</p>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleFavorite(mechanism.id);
                  }}
                  className={`p-1 transition-colors duration-200 ${
                    user.favoriteCopingMechanisms.includes(mechanism.id)
                      ? 'text-pink-400'
                      : 'text-gray-400 hover:text-pink-400'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${
                    user.favoriteCopingMechanisms.includes(mechanism.id) ? 'fill-current' : ''
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between text-xs text-text-secondary">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{mechanism.duration} min</span>
                  </div>
                  <span className={`capitalize ${getDifficultyColor(mechanism.difficulty)}`}>
                    {mechanism.difficulty}
                  </span>
                </div>
                {mechanism.isPremium && (
                  <span className="bg-gradient-to-r from-purple-400 to-pink-400 text-white px-2 py-1 rounded-full">
                    Premium
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
