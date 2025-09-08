# EmotiBuild Business Logic Documentation

## Overview

EmotiBuild implements a comprehensive emotional wellness tracking system with resilience building features. This document outlines the core business logic, algorithms, and decision-making processes within the application.

## Core Business Model

### Value Proposition
- **Primary**: Help users build emotional resilience through consistent mood tracking and evidence-based coping mechanisms
- **Secondary**: Provide insights into emotional patterns and progress over time
- **Tertiary**: Create a supportive, non-judgmental space for emotional wellness

### Monetization Strategy
- **Freemium Model**: Basic features free, premium coping mechanisms and advanced analytics paid
- **Micro-transactions**: Individual premium content purchases
- **Future**: Subscription tiers for comprehensive wellness programs

## Data Models and Relationships

### User Entity
```typescript
interface User {
  id: string;                           // Unique identifier
  farcasterId?: string;                 // Optional Farcaster integration
  walletAddress?: string;               // Optional Web3 wallet
  moodEntries: MoodEntry[];            // All mood entries
  favoriteCopingMechanisms: string[];  // Favorited mechanism IDs
  createdAt: Date;                     // Account creation timestamp
}
```

**Business Rules**:
- Users can exist without Farcaster or wallet connection
- User data persists locally until backend integration
- Anonymous usage supported for privacy

### Mood Entry Entity
```typescript
interface MoodEntry {
  id: string;                    // Unique entry identifier
  userId: string;                // Reference to user
  timestamp: Date;               // When entry was created
  mood: MoodType;                // Selected emotional state
  intensity: number;             // 1-10 scale of mood intensity
  triggers: string[];            // Identified triggers
  notes: string;                 // Optional user notes
  copingMechanismsUsed: string[]; // Mechanisms used after entry
}
```

**Business Rules**:
- One mood entry per user per day recommended (not enforced)
- Intensity is optional but recommended for better insights
- Triggers help identify patterns and prevention strategies
- Notes provide qualitative context for quantitative data

### Coping Mechanism Entity
```typescript
interface CopingMechanism {
  id: string;                    // Unique mechanism identifier
  name: string;                  // Display name
  description: string;           // Brief description
  type: CopingType;             // Category classification
  content: string;               // Detailed instructions
  duration: number;              // Time required in minutes
  difficulty: 'easy' | 'medium' | 'hard'; // Complexity level
  tags: string[];               // Searchable tags
  isPremium: boolean;           // Premium content flag
}
```

**Business Rules**:
- Free users access basic mechanisms only
- Premium mechanisms require payment or subscription
- Difficulty levels help users choose appropriate tools
- Tags enable personalized recommendations

## Core Algorithms

### 1. Resilience Score Calculation

The resilience score is a composite metric (0-100) that measures emotional wellness progress.

```typescript
interface ResilienceMetrics {
  overallScore: number;          // 0-100 composite score
  moodStability: number;         // Variance in mood over time
  copingUsage: number;          // Frequency of coping mechanism use
  streakDays: number;           // Consecutive days of logging
  improvementTrend: 'up' | 'down' | 'stable'; // 30-day trend
}
```

#### Algorithm Components

**1. Mood Stability (40% weight)**
```typescript
function calculateMoodStability(entries: MoodEntry[]): number {
  const last30Days = entries.filter(entry => 
    isWithinDays(entry.timestamp, 30)
  );
  
  if (last30Days.length < 7) return 50; // Insufficient data
  
  const moodValues = last30Days.map(entry => 
    getMoodValue(entry.mood) * (entry.intensity / 10)
  );
  
  const variance = calculateVariance(moodValues);
  const stability = Math.max(0, 100 - (variance * 10));
  
  return Math.min(100, stability);
}

function getMoodValue(mood: MoodType): number {
  const moodValues = {
    'happy': 8, 'content': 7, 'calm': 7, 'grateful': 8,
    'excited': 6, 'frustrated': 3, 'anxious': 2,
    'angry': 2, 'sad': 2, 'overwhelmed': 1
  };
  return moodValues[mood] || 5;
}
```

**2. Coping Usage (30% weight)**
```typescript
function calculateCopingUsage(entries: MoodEntry[]): number {
  const last30Days = entries.filter(entry => 
    isWithinDays(entry.timestamp, 30)
  );
  
  const totalEntries = last30Days.length;
  const entriesWithCoping = last30Days.filter(entry => 
    entry.copingMechanismsUsed.length > 0
  ).length;
  
  if (totalEntries === 0) return 0;
  
  const usageRate = (entriesWithCoping / totalEntries) * 100;
  return Math.min(100, usageRate);
}
```

**3. Consistency Streak (20% weight)**
```typescript
function calculateStreakScore(entries: MoodEntry[]): number {
  const streak = calculateCurrentStreak(entries);
  
  // Logarithmic scaling to prevent infinite growth
  const streakScore = Math.min(100, Math.log(streak + 1) * 25);
  return streakScore;
}

function calculateCurrentStreak(entries: MoodEntry[]): number {
  const sortedEntries = entries.sort((a, b) => 
    b.timestamp.getTime() - a.timestamp.getTime()
  );
  
  let streak = 0;
  let currentDate = new Date();
  
  for (const entry of sortedEntries) {
    const entryDate = new Date(entry.timestamp);
    const daysDiff = Math.floor(
      (currentDate.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    if (daysDiff === streak) {
      streak++;
      currentDate = entryDate;
    } else {
      break;
    }
  }
  
  return streak;
}
```

**4. Improvement Trend (10% weight)**
```typescript
function calculateImprovementTrend(entries: MoodEntry[]): {
  trend: 'up' | 'down' | 'stable';
  score: number;
} {
  const last30Days = entries.filter(entry => 
    isWithinDays(entry.timestamp, 30)
  );
  
  if (last30Days.length < 14) {
    return { trend: 'stable', score: 50 };
  }
  
  const firstHalf = last30Days.slice(0, Math.floor(last30Days.length / 2));
  const secondHalf = last30Days.slice(Math.floor(last30Days.length / 2));
  
  const firstAvg = calculateAverageMoodValue(firstHalf);
  const secondAvg = calculateAverageMoodValue(secondHalf);
  
  const improvement = secondAvg - firstAvg;
  
  if (improvement > 0.5) {
    return { trend: 'up', score: Math.min(100, 50 + improvement * 25) };
  } else if (improvement < -0.5) {
    return { trend: 'down', score: Math.max(0, 50 + improvement * 25) };
  } else {
    return { trend: 'stable', score: 50 };
  }
}
```

**5. Composite Score Calculation**
```typescript
function calculateOverallResilienceScore(
  moodStability: number,
  copingUsage: number,
  streakScore: number,
  trendScore: number
): number {
  const weightedScore = 
    (moodStability * 0.4) +
    (copingUsage * 0.3) +
    (streakScore * 0.2) +
    (trendScore * 0.1);
  
  return Math.round(Math.max(0, Math.min(100, weightedScore)));
}
```

### 2. Coping Mechanism Recommendation Engine

Recommends appropriate coping mechanisms based on current mood and historical effectiveness.

```typescript
interface RecommendationContext {
  currentMood: MoodType;
  intensity: number;
  availableTime: number; // minutes
  previouslyUsed: string[];
  favorites: string[];
  userLevel: 'beginner' | 'intermediate' | 'advanced';
}

function recommendCopingMechanisms(
  context: RecommendationContext,
  mechanisms: CopingMechanism[]
): CopingMechanism[] {
  
  // Filter by mood appropriateness
  const moodAppropriate = mechanisms.filter(mechanism => 
    isMoodAppropriate(mechanism, context.currentMood)
  );
  
  // Filter by available time
  const timeAppropriate = moodAppropriate.filter(mechanism =>
    mechanism.duration <= context.availableTime
  );
  
  // Score each mechanism
  const scored = timeAppropriate.map(mechanism => ({
    mechanism,
    score: calculateRecommendationScore(mechanism, context)
  }));
  
  // Sort by score and return top 3
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(item => item.mechanism);
}

function calculateRecommendationScore(
  mechanism: CopingMechanism,
  context: RecommendationContext
): number {
  let score = 0;
  
  // Base mood appropriateness (0-40 points)
  score += getMoodMechanismMatch(mechanism.type, context.currentMood);
  
  // Intensity matching (0-20 points)
  score += getIntensityMatch(mechanism.difficulty, context.intensity);
  
  // User preference (0-20 points)
  if (context.favorites.includes(mechanism.id)) {
    score += 20;
  }
  
  // Novelty bonus (0-10 points)
  if (!context.previouslyUsed.includes(mechanism.id)) {
    score += 10;
  }
  
  // User level appropriateness (0-10 points)
  score += getUserLevelMatch(mechanism.difficulty, context.userLevel);
  
  return score;
}

function getMoodMechanismMatch(type: CopingType, mood: MoodType): number {
  const matches = {
    'anxious': { 'breathing': 40, 'mindfulness': 35, 'movement': 20 },
    'angry': { 'movement': 40, 'breathing': 30, 'journaling': 25 },
    'sad': { 'affirmation': 35, 'journaling': 30, 'mindfulness': 25 },
    'overwhelmed': { 'breathing': 40, 'visualization': 30, 'mindfulness': 25 },
    'frustrated': { 'movement': 35, 'journaling': 30, 'breathing': 25 },
    // ... other mood-mechanism mappings
  };
  
  return matches[mood]?.[type] || 20; // Default moderate match
}
```

### 3. Pattern Recognition System

Identifies emotional patterns and triggers to provide insights.

```typescript
interface EmotionalPattern {
  type: 'trigger' | 'temporal' | 'intensity' | 'recovery';
  description: string;
  confidence: number; // 0-1
  actionable: boolean;
  recommendation?: string;
}

function identifyPatterns(entries: MoodEntry[]): EmotionalPattern[] {
  const patterns: EmotionalPattern[] = [];
  
  // Trigger pattern analysis
  patterns.push(...identifyTriggerPatterns(entries));
  
  // Temporal pattern analysis
  patterns.push(...identifyTemporalPatterns(entries));
  
  // Intensity pattern analysis
  patterns.push(...identifyIntensityPatterns(entries));
  
  // Recovery pattern analysis
  patterns.push(...identifyRecoveryPatterns(entries));
  
  return patterns
    .filter(pattern => pattern.confidence > 0.6)
    .sort((a, b) => b.confidence - a.confidence);
}

function identifyTriggerPatterns(entries: MoodEntry[]): EmotionalPattern[] {
  const triggerMoodMap = new Map<string, MoodType[]>();
  
  entries.forEach(entry => {
    entry.triggers.forEach(trigger => {
      if (!triggerMoodMap.has(trigger)) {
        triggerMoodMap.set(trigger, []);
      }
      triggerMoodMap.get(trigger)!.push(entry.mood);
    });
  });
  
  const patterns: EmotionalPattern[] = [];
  
  triggerMoodMap.forEach((moods, trigger) => {
    if (moods.length >= 3) {
      const negativeMoods = moods.filter(mood => 
        ['anxious', 'angry', 'sad', 'overwhelmed', 'frustrated'].includes(mood)
      );
      
      if (negativeMoods.length / moods.length > 0.7) {
        patterns.push({
          type: 'trigger',
          description: `"${trigger}" frequently leads to negative emotions`,
          confidence: Math.min(0.95, negativeMoods.length / moods.length),
          actionable: true,
          recommendation: `Consider developing coping strategies for "${trigger}" situations`
        });
      }
    }
  });
  
  return patterns;
}
```

## Business Rules and Validation

### Data Validation Rules

**Mood Entry Validation**
```typescript
function validateMoodEntry(entry: Partial<MoodEntry>): ValidationResult {
  const errors: string[] = [];
  
  // Required fields
  if (!entry.mood) {
    errors.push('Mood selection is required');
  }
  
  // Intensity validation
  if (entry.intensity !== undefined) {
    if (entry.intensity < 1 || entry.intensity > 10) {
      errors.push('Intensity must be between 1 and 10');
    }
  }
  
  // Notes length validation
  if (entry.notes && entry.notes.length > 500) {
    errors.push('Notes must be 500 characters or less');
  }
  
  // Triggers validation
  if (entry.triggers && entry.triggers.length > 10) {
    errors.push('Maximum 10 triggers allowed per entry');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}
```

**User Behavior Rules**
```typescript
function enforceUsageLimits(user: User, action: string): boolean {
  const today = new Date();
  const todayEntries = user.moodEntries.filter(entry =>
    isSameDay(entry.timestamp, today)
  );
  
  switch (action) {
    case 'create_mood_entry':
      // Soft limit: warn after 3 entries per day
      if (todayEntries.length >= 3) {
        showWarning('You\'ve logged several moods today. Consider using a coping mechanism.');
        return true; // Allow but warn
      }
      return true;
      
    case 'access_premium_content':
      // Check premium access
      return user.hasPremiumAccess || false;
      
    default:
      return true;
  }
}
```

### Privacy and Security Rules

**Data Retention Policy**
```typescript
function applyDataRetentionPolicy(user: User): User {
  const retentionPeriod = 365; // days
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - retentionPeriod);
  
  // Keep mood entries within retention period
  const filteredEntries = user.moodEntries.filter(entry =>
    entry.timestamp >= cutoffDate
  );
  
  return {
    ...user,
    moodEntries: filteredEntries
  };
}
```

**Data Anonymization**
```typescript
function anonymizeUserData(user: User): AnonymizedUser {
  return {
    id: hashUserId(user.id),
    moodEntries: user.moodEntries.map(entry => ({
      ...entry,
      userId: hashUserId(entry.userId),
      notes: '', // Remove personal notes
      triggers: entry.triggers.map(trigger => 
        generalizeTriger(trigger)
      )
    })),
    // Remove identifying information
    farcasterId: undefined,
    walletAddress: undefined,
    createdAt: roundToMonth(user.createdAt)
  };
}
```

## Premium Content Logic

### Freemium Model Implementation

**Content Access Control**
```typescript
function canAccessContent(
  user: User, 
  mechanism: CopingMechanism
): AccessResult {
  if (!mechanism.isPremium) {
    return { canAccess: true, reason: 'free_content' };
  }
  
  if (user.hasPremiumAccess) {
    return { canAccess: true, reason: 'premium_subscriber' };
  }
  
  // Check for trial access
  if (isEligibleForTrial(user, mechanism)) {
    return { 
      canAccess: true, 
      reason: 'trial_access',
      remainingTrials: getRemainingTrials(user)
    };
  }
  
  return { 
    canAccess: false, 
    reason: 'premium_required',
    upgradeOptions: getUpgradeOptions(mechanism)
  };
}

function isEligibleForTrial(user: User, mechanism: CopingMechanism): boolean {
  const trialLimit = 3; // 3 premium mechanisms per user
  const usedTrials = user.premiumTrialsUsed || 0;
  
  return usedTrials < trialLimit;
}
```

**Micro-transaction Logic**
```typescript
interface PurchaseOption {
  type: 'single' | 'bundle' | 'subscription';
  price: number; // in cents
  currency: 'USD' | 'ETH'; // Future crypto support
  items: string[];
  duration?: number; // for subscriptions, in days
}

function generatePurchaseOptions(mechanism: CopingMechanism): PurchaseOption[] {
  const options: PurchaseOption[] = [];
  
  // Single mechanism purchase
  options.push({
    type: 'single',
    price: 99, // $0.99
    currency: 'USD',
    items: [mechanism.id]
  });
  
  // Category bundle
  const categoryMechanisms = getCategoryMechanisms(mechanism.type);
  if (categoryMechanisms.length > 1) {
    options.push({
      type: 'bundle',
      price: Math.floor(categoryMechanisms.length * 99 * 0.8), // 20% discount
      currency: 'USD',
      items: categoryMechanisms.map(m => m.id)
    });
  }
  
  // Monthly subscription
  options.push({
    type: 'subscription',
    price: 499, // $4.99/month
    currency: 'USD',
    items: ['all_premium'],
    duration: 30
  });
  
  return options;
}
```

## Analytics and Insights

### User Engagement Metrics

```typescript
interface EngagementMetrics {
  dailyActiveUsers: number;
  weeklyActiveUsers: number;
  monthlyActiveUsers: number;
  averageSessionDuration: number;
  moodEntryCompletionRate: number;
  copingMechanismUsageRate: number;
  premiumConversionRate: number;
  retentionRates: {
    day1: number;
    day7: number;
    day30: number;
  };
}

function calculateEngagementMetrics(users: User[]): EngagementMetrics {
  const now = new Date();
  
  const dailyActive = users.filter(user =>
    hasActivityInDays(user, 1)
  ).length;
  
  const weeklyActive = users.filter(user =>
    hasActivityInDays(user, 7)
  ).length;
  
  const monthlyActive = users.filter(user =>
    hasActivityInDays(user, 30)
  ).length;
  
  // Calculate other metrics...
  
  return {
    dailyActiveUsers: dailyActive,
    weeklyActiveUsers: weeklyActive,
    monthlyActiveUsers: monthlyActive,
    // ... other metrics
  };
}
```

### A/B Testing Framework

```typescript
interface ABTest {
  id: string;
  name: string;
  variants: ABVariant[];
  startDate: Date;
  endDate: Date;
  targetMetric: string;
  isActive: boolean;
}

interface ABVariant {
  id: string;
  name: string;
  weight: number; // 0-1, sum of all variants should equal 1
  config: Record<string, any>;
}

function assignUserToVariant(userId: string, test: ABTest): ABVariant {
  const hash = hashString(userId + test.id);
  const random = (hash % 1000) / 1000; // 0-1
  
  let cumulativeWeight = 0;
  for (const variant of test.variants) {
    cumulativeWeight += variant.weight;
    if (random <= cumulativeWeight) {
      return variant;
    }
  }
  
  return test.variants[test.variants.length - 1]; // Fallback
}
```

## Error Handling and Edge Cases

### Graceful Degradation

```typescript
function handleStorageError(error: Error, operation: string): void {
  console.error(`Storage error during ${operation}:`, error);
  
  switch (operation) {
    case 'save_mood_entry':
      // Show user-friendly message
      showNotification('Unable to save mood entry. Please try again.', 'error');
      // Attempt to save to temporary storage
      saveToTemporaryStorage('pending_mood_entry', data);
      break;
      
    case 'load_user_data':
      // Initialize with default data
      initializeDefaultUserData();
      showNotification('Starting fresh - your data will be saved as you use the app.', 'info');
      break;
      
    default:
      showNotification('Something went wrong. Please refresh the app.', 'error');
  }
}
```

### Data Consistency Checks

```typescript
function validateDataConsistency(user: User): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  
  // Check for orphaned mood entries
  const validEntries = user.moodEntries.filter(entry => {
    if (!entry.id || !entry.userId || !entry.timestamp || !entry.mood) {
      issues.push({
        type: 'invalid_mood_entry',
        severity: 'high',
        description: 'Mood entry missing required fields',
        entryId: entry.id
      });
      return false;
    }
    return true;
  });
  
  // Check for invalid favorite references
  const validMechanismIds = getAllMechanismIds();
  const invalidFavorites = user.favoriteCopingMechanisms.filter(id =>
    !validMechanismIds.includes(id)
  );
  
  if (invalidFavorites.length > 0) {
    issues.push({
      type: 'invalid_favorites',
      severity: 'medium',
      description: 'References to non-existent coping mechanisms',
      invalidIds: invalidFavorites
    });
  }
  
  return issues;
}
```

## Future Business Logic Enhancements

### Planned Features

1. **AI-Powered Insights**
   - Machine learning models for pattern recognition
   - Personalized coping mechanism recommendations
   - Predictive mood forecasting

2. **Social Features**
   - Anonymous mood sharing
   - Community challenges
   - Peer support matching

3. **Gamification**
   - Achievement system
   - Streak rewards
   - Progress badges

4. **Integration Capabilities**
   - Wearable device data integration
   - Calendar event correlation
   - Weather impact analysis

### Scalability Considerations

- Implement data pagination for large datasets
- Add caching layers for frequently accessed data
- Design for horizontal scaling with user sharding
- Implement real-time synchronization for multi-device usage

This business logic documentation provides the foundation for understanding how EmotiBuild processes user data, makes recommendations, and delivers value to users while maintaining privacy and security standards.
