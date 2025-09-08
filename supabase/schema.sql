-- EmotiBuild Database Schema
-- This file contains the complete database schema for the EmotiBuild application

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create custom types
CREATE TYPE mood_type AS ENUM (
  'happy', 'sad', 'anxious', 'angry', 'excited', 
  'calm', 'frustrated', 'grateful', 'overwhelmed', 'content'
);

CREATE TYPE coping_type AS ENUM (
  'breathing', 'mindfulness', 'affirmation', 
  'movement', 'journaling', 'visualization'
);

CREATE TYPE difficulty_level AS ENUM ('easy', 'medium', 'hard');

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farcaster_id TEXT UNIQUE,
  wallet_address TEXT UNIQUE,
  username TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_premium BOOLEAN DEFAULT FALSE,
  premium_expires_at TIMESTAMP WITH TIME ZONE
);

-- Mood entries table
CREATE TABLE mood_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  mood mood_type NOT NULL,
  intensity INTEGER NOT NULL CHECK (intensity >= 1 AND intensity <= 10),
  triggers TEXT[] DEFAULT '{}',
  notes TEXT DEFAULT '',
  coping_mechanisms_used TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Coping mechanisms table
CREATE TABLE coping_mechanisms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  type coping_type NOT NULL,
  content TEXT NOT NULL,
  duration INTEGER NOT NULL, -- in minutes
  difficulty difficulty_level NOT NULL DEFAULT 'easy',
  tags TEXT[] DEFAULT '{}',
  is_premium BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User favorites table (many-to-many relationship)
CREATE TABLE user_favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  coping_mechanism_id UUID NOT NULL REFERENCES coping_mechanisms(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, coping_mechanism_id)
);

-- Usage analytics table
CREATE TABLE usage_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  event_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_mood_entries_user_id ON mood_entries(user_id);
CREATE INDEX idx_mood_entries_created_at ON mood_entries(created_at DESC);
CREATE INDEX idx_mood_entries_mood ON mood_entries(mood);
CREATE INDEX idx_user_favorites_user_id ON user_favorites(user_id);
CREATE INDEX idx_usage_analytics_user_id ON usage_analytics(user_id);
CREATE INDEX idx_usage_analytics_event_type ON usage_analytics(event_type);
CREATE INDEX idx_users_farcaster_id ON users(farcaster_id);
CREATE INDEX idx_users_wallet_address ON users(wallet_address);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mood_entries_updated_at BEFORE UPDATE ON mood_entries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_coping_mechanisms_updated_at BEFORE UPDATE ON coping_mechanisms
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE mood_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_analytics ENABLE ROW LEVEL SECURITY;

-- Users can only see and modify their own data
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid()::text = id::text);

CREATE POLICY "Users can insert own profile" ON users
  FOR INSERT WITH CHECK (auth.uid()::text = id::text);

-- Mood entries policies
CREATE POLICY "Users can view own mood entries" ON mood_entries
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own mood entries" ON mood_entries
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own mood entries" ON mood_entries
  FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete own mood entries" ON mood_entries
  FOR DELETE USING (auth.uid()::text = user_id::text);

-- User favorites policies
CREATE POLICY "Users can view own favorites" ON user_favorites
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can manage own favorites" ON user_favorites
  FOR ALL USING (auth.uid()::text = user_id::text);

-- Usage analytics policies
CREATE POLICY "Users can view own analytics" ON usage_analytics
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own analytics" ON usage_analytics
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- Coping mechanisms are readable by all authenticated users
CREATE POLICY "Authenticated users can view coping mechanisms" ON coping_mechanisms
  FOR SELECT USING (auth.role() = 'authenticated');

-- Insert default coping mechanisms
INSERT INTO coping_mechanisms (name, description, type, content, duration, difficulty, tags, is_premium) VALUES
  (
    '4-7-8 Breathing',
    'A calming breathing technique to reduce anxiety and promote relaxation',
    'breathing',
    'Find a comfortable position and close your eyes. Inhale quietly through your nose for 4 counts, hold your breath for 7 counts, then exhale completely through your mouth for 8 counts. This completes one cycle. Repeat 3-4 times.',
    2,
    'easy',
    ARRAY['anxiety', 'stress', 'sleep', 'relaxation'],
    FALSE
  ),
  (
    '5-4-3-2-1 Grounding',
    'Ground yourself using your five senses to manage anxiety and panic',
    'mindfulness',
    'Look around and name 5 things you can see, 4 things you can touch, 3 things you can hear, 2 things you can smell, and 1 thing you can taste. Take your time with each step.',
    3,
    'easy',
    ARRAY['anxiety', 'panic', 'grounding', 'mindfulness'],
    FALSE
  ),
  (
    'Positive Affirmations',
    'Boost your mood and confidence with self-affirming statements',
    'affirmation',
    'Repeat these affirmations with conviction: "I am capable and strong. I can handle whatever comes my way. I am worthy of love and respect. This challenge will help me grow." Feel free to personalize them.',
    2,
    'easy',
    ARRAY['confidence', 'self-esteem', 'motivation', 'positivity'],
    FALSE
  ),
  (
    'Gratitude Journaling',
    'Focus on positive aspects of your life to improve mood',
    'journaling',
    'Write down 3 specific things you are grateful for today. For each item, write why you are grateful for it and how it makes you feel. Be as detailed as possible.',
    5,
    'easy',
    ARRAY['gratitude', 'positivity', 'reflection', 'mood'],
    FALSE
  ),
  (
    'Body Scan Meditation',
    'Release physical tension through mindful body awareness',
    'mindfulness',
    'Lie down comfortably and close your eyes. Starting from your toes, slowly move your attention up through your body. Notice any tension or sensations without judgment. Consciously relax each part as you go.',
    10,
    'medium',
    ARRAY['stress', 'tension', 'relaxation', 'mindfulness'],
    FALSE
  ),
  (
    'Progressive Muscle Relaxation',
    'Systematically tense and release muscle groups to reduce stress',
    'movement',
    'Starting with your toes, tense each muscle group for 5 seconds, then release and relax for 10 seconds. Work your way up: feet, calves, thighs, abdomen, hands, arms, shoulders, neck, and face.',
    15,
    'medium',
    ARRAY['stress', 'tension', 'relaxation', 'physical'],
    TRUE
  ),
  (
    'Loving-Kindness Meditation',
    'Cultivate compassion for yourself and others',
    'mindfulness',
    'Sit quietly and repeat these phrases: "May I be happy, may I be healthy, may I be at peace." Then extend these wishes to loved ones, neutral people, difficult people, and finally all beings.',
    10,
    'medium',
    ARRAY['compassion', 'self-love', 'relationships', 'peace'],
    TRUE
  ),
  (
    'Visualization Journey',
    'Use guided imagery to create a sense of calm and peace',
    'visualization',
    'Close your eyes and imagine a peaceful place - a beach, forest, or mountain. Engage all your senses: what do you see, hear, smell, feel? Spend time exploring this safe, calm space in your mind.',
    8,
    'medium',
    ARRAY['relaxation', 'imagination', 'peace', 'escape'],
    TRUE
  ),
  (
    'Emotional Freedom Technique (EFT)',
    'Tap on specific points while focusing on emotional issues',
    'movement',
    'While focusing on your concern, tap 7 times on each point: top of head, eyebrow, side of eye, under nose, chin, collarbone, under arm. Repeat the sequence 2-3 times while stating your concern.',
    12,
    'hard',
    ARRAY['emotional-release', 'energy', 'healing', 'advanced'],
    TRUE
  ),
  (
    'Mindful Walking',
    'Combine gentle movement with mindfulness practice',
    'movement',
    'Walk slowly and deliberately, focusing on each step. Feel your feet touching the ground, notice your breathing, observe your surroundings without judgment. If your mind wanders, gently return focus to walking.',
    10,
    'easy',
    ARRAY['mindfulness', 'movement', 'nature', 'grounding'],
    FALSE
  );

-- Create a function to get user resilience metrics
CREATE OR REPLACE FUNCTION get_user_resilience_metrics(user_uuid UUID, days_back INTEGER DEFAULT 30)
RETURNS TABLE (
  overall_score INTEGER,
  mood_stability INTEGER,
  coping_usage INTEGER,
  streak_days INTEGER,
  improvement_trend TEXT
) AS $$
DECLARE
  avg_intensity NUMERIC;
  intensity_variance NUMERIC;
  coping_count INTEGER;
  calculated_streak INTEGER;
  recent_avg NUMERIC;
  older_avg NUMERIC;
  trend TEXT;
BEGIN
  -- Get mood entries for the specified period
  WITH mood_data AS (
    SELECT intensity, coping_mechanisms_used, created_at
    FROM mood_entries 
    WHERE user_id = user_uuid 
      AND created_at >= NOW() - INTERVAL '1 day' * days_back
    ORDER BY created_at DESC
  ),
  stats AS (
    SELECT 
      AVG(intensity) as avg_int,
      VARIANCE(intensity) as var_int,
      SUM(array_length(coping_mechanisms_used, 1)) as total_coping
    FROM mood_data
  )
  SELECT avg_int, var_int, COALESCE(total_coping, 0)
  INTO avg_intensity, intensity_variance, coping_count
  FROM stats;
  
  -- Calculate mood stability (inverse of variance)
  mood_stability := GREATEST(0, 100 - (intensity_variance * 10))::INTEGER;
  
  -- Calculate streak days (simplified version)
  SELECT COUNT(DISTINCT DATE(created_at))
  INTO calculated_streak
  FROM mood_entries
  WHERE user_id = user_uuid
    AND created_at >= NOW() - INTERVAL '30 days';
  
  -- Calculate improvement trend
  WITH recent_data AS (
    SELECT AVG(intensity) as recent_avg
    FROM mood_entries
    WHERE user_id = user_uuid
      AND created_at >= NOW() - INTERVAL '7 days'
  ),
  older_data AS (
    SELECT AVG(intensity) as older_avg
    FROM mood_entries
    WHERE user_id = user_uuid
      AND created_at >= NOW() - INTERVAL '14 days'
      AND created_at < NOW() - INTERVAL '7 days'
  )
  SELECT r.recent_avg, o.older_avg
  INTO recent_avg, older_avg
  FROM recent_data r, older_data o;
  
  IF recent_avg > older_avg + 0.5 THEN
    trend := 'up';
  ELSIF recent_avg < older_avg - 0.5 THEN
    trend := 'down';
  ELSE
    trend := 'stable';
  END IF;
  
  -- Return results
  overall_score := COALESCE(((avg_intensity + mood_stability + (coping_count * 2)) / 3)::INTEGER, 0);
  coping_usage := COALESCE(coping_count, 0);
  streak_days := COALESCE(calculated_streak, 0);
  improvement_trend := COALESCE(trend, 'stable');
  
  RETURN QUERY SELECT overall_score, mood_stability, coping_usage, streak_days, improvement_trend;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
