'use client';

import { MoodEntry } from '@/lib/types';
import { MOOD_EMOJIS } from '@/lib/data';
import { formatDate } from '@/lib/utils';

interface ResilienceChartProps {
  entries: MoodEntry[];
}

export function ResilienceChart({ entries }: ResilienceChartProps) {
  // Get last 7 days of entries
  const recentEntries = entries
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, 7)
    .reverse();

  if (recentEntries.length === 0) {
    return (
      <div className="glass-card p-6 text-center">
        <p className="text-text-secondary">No mood data yet. Start journaling to see your progress!</p>
      </div>
    );
  }

  return (
    <div className="glass-card p-4">
      <h3 className="text-lg font-semibold text-white mb-4">Recent Mood Trend</h3>
      
      <div className="space-y-3">
        {recentEntries.map((entry, index) => (
          <div key={entry.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{MOOD_EMOJIS[entry.mood]}</span>
              <div>
                <p className="text-white font-medium">{formatDate(entry.timestamp)}</p>
                {entry.notes && (
                  <p className="text-sm text-text-secondary truncate max-w-[200px]">
                    {entry.notes}
                  </p>
                )}
              </div>
            </div>
            
            {entry.triggers.length > 0 && (
              <div className="text-xs text-text-secondary">
                {entry.triggers.length} trigger{entry.triggers.length !== 1 ? 's' : ''}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
