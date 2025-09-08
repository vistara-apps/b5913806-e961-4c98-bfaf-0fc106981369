'use client';

import { useState, useEffect } from 'react';
import { User, ResilienceMetrics } from '@/lib/types';
import { LocalStorage } from '@/lib/storage';
import { calculateResilienceScore, getMoodTrend, formatDate } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus, Target, Calendar, Heart } from 'lucide-react';

interface ResilienceDashboardProps {
  user: User;
}

export function ResilienceDashboard({ user }: ResilienceDashboardProps) {
  const [metrics, setMetrics] = useState<ResilienceMetrics | null>(null);
  const [moodEntries, setMoodEntries] = useState<any[]>([]);

  useEffect(() => {
    const entries = LocalStorage.getMoodEntries().filter(entry => entry.userId === user.id);
    setMoodEntries(entries);
    
    if (entries.length > 0) {
      const calculatedMetrics = calculateResilienceScore(entries);
      setMetrics(calculatedMetrics);
    }
  }, [user.id]);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
      case 'improving':
        return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'down':
      case 'declining':
        return <TrendingDown className="w-4 h-4 text-red-400" />;
      default:
        return <Minus className="w-4 h-4 text-yellow-400" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
      case 'improving':
        return 'text-green-400';
      case 'down':
      case 'declining':
        return 'text-red-400';
      default:
        return 'text-yellow-400';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    if (score >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const getScoreGradient = (score: number) => {
    if (score >= 80) return 'from-green-400 to-green-600';
    if (score >= 60) return 'from-yellow-400 to-yellow-600';
    if (score >= 40) return 'from-orange-400 to-orange-600';
    return 'from-red-400 to-red-600';
  };

  if (!metrics || moodEntries.length === 0) {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Resilience Progress</h2>
        
        <div className="glass-card p-6 text-center">
          <div className="text-4xl mb-3">📊</div>
          <h3 className="font-medium mb-2">Start Building Your Progress</h3>
          <p className="text-sm text-text-secondary mb-4">
            Log a few mood entries to see your resilience insights and track your emotional journey.
          </p>
          <div className="text-xs text-text-secondary">
            Your progress will appear here once you have some mood data to analyze.
          </div>
        </div>
      </div>
    );
  }

  const moodTrend = getMoodTrend(moodEntries);
  const recentMoods = moodEntries.slice(-7);
  const avgIntensity = recentMoods.length > 0 
    ? recentMoods.reduce((sum, entry) => sum + entry.intensity, 0) / recentMoods.length 
    : 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Resilience Progress</h2>
        <p className="text-sm text-text-secondary">
          Track your emotional wellness journey and celebrate your growth
        </p>
      </div>

      {/* Overall Score */}
      <div className="glass-card p-6 text-center">
        <div className="mb-4">
          <div className={`text-4xl font-bold ${getScoreColor(metrics.overallScore)} mb-2`}>
            {metrics.overallScore}
          </div>
          <div className="text-sm text-text-secondary">Resilience Score</div>
        </div>
        
        <div className="w-full bg-white bg-opacity-10 rounded-full h-2 mb-4">
          <div 
            className={`bg-gradient-to-r ${getScoreGradient(metrics.overallScore)} h-2 rounded-full transition-all duration-300`}
            style={{ width: `${metrics.overallScore}%` }}
          ></div>
        </div>
        
        <div className={`flex items-center justify-center space-x-1 text-sm ${getTrendColor(metrics.improvementTrend)}`}>
          {getTrendIcon(metrics.improvementTrend)}
          <span className="capitalize">{metrics.improvementTrend} trend</span>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-4">
        <div className="metric-card">
          <div className="flex items-center justify-center mb-2">
            <Target className="w-5 h-5 text-purple-400" />
          </div>
          <div className="text-2xl font-bold mb-1">{metrics.moodStability}%</div>
          <div className="text-xs text-text-secondary">Mood Stability</div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-center mb-2">
            <Heart className="w-5 h-5 text-pink-400" />
          </div>
          <div className="text-2xl font-bold mb-1">{metrics.copingUsage}%</div>
          <div className="text-xs text-text-secondary">Coping Usage</div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-center mb-2">
            <Calendar className="w-5 h-5 text-green-400" />
          </div>
          <div className="text-2xl font-bold mb-1">{metrics.streakDays}</div>
          <div className="text-xs text-text-secondary">Day Streak</div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-center mb-2">
            {getTrendIcon(moodTrend)}
          </div>
          <div className="text-2xl font-bold mb-1">{avgIntensity.toFixed(1)}</div>
          <div className="text-xs text-text-secondary">Avg Intensity</div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="glass-card p-4">
        <h3 className="font-medium mb-3">Recent Activity</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-secondary">Total Entries</span>
            <span className="font-medium">{moodEntries.length}</span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-secondary">This Week</span>
            <span className="font-medium">{recentMoods.length}</span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-secondary">Favorite Coping</span>
            <span className="font-medium">{user.favoriteCopingMechanisms.length}</span>
          </div>
          
          {moodEntries.length > 0 && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-secondary">First Entry</span>
              <span className="font-medium">{formatDate(moodEntries[0].timestamp)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Insights */}
      <div className="glass-card p-4">
        <h3 className="font-medium mb-3">Insights & Tips</h3>
        <div className="space-y-3 text-sm">
          {metrics.streakDays >= 7 && (
            <div className="flex items-start space-x-2">
              <span className="text-green-400">🎉</span>
              <div>
                <div className="font-medium text-green-400">Great consistency!</div>
                <div className="text-text-secondary">You've been tracking for {metrics.streakDays} days straight.</div>
              </div>
            </div>
          )}
          
          {metrics.copingUsage < 30 && (
            <div className="flex items-start space-x-2">
              <span className="text-blue-400">💡</span>
              <div>
                <div className="font-medium text-blue-400">Try more coping techniques</div>
                <div className="text-text-secondary">Using coping mechanisms can help improve your resilience score.</div>
              </div>
            </div>
          )}
          
          {metrics.moodStability >= 80 && (
            <div className="flex items-start space-x-2">
              <span className="text-purple-400">⭐</span>
              <div>
                <div className="font-medium text-purple-400">Excellent stability</div>
                <div className="text-text-secondary">Your mood patterns show great emotional balance.</div>
              </div>
            </div>
          )}
          
          {moodEntries.length >= 30 && (
            <div className="flex items-start space-x-2">
              <span className="text-yellow-400">🏆</span>
              <div>
                <div className="font-medium text-yellow-400">Milestone achieved</div>
                <div className="text-text-secondary">You've logged {moodEntries.length} entries. Keep up the great work!</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
