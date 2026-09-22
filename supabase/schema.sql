-- =============================================
-- SwasthyaSaathi Database Schema
-- Run this in your Supabase SQL Editor
-- =============================================

-- Users (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  full_name TEXT,
  preferred_language TEXT DEFAULT 'en' CHECK (preferred_language IN ('en', 'hi', 'kn')),
  phone TEXT,
  location_lat FLOAT8,
  location_lng FLOAT8,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Symptom check records
CREATE TABLE IF NOT EXISTS symptom_checks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  transcript TEXT NOT NULL,
  language TEXT NOT NULL CHECK (language IN ('en', 'hi', 'kn')),
  detected_symptoms JSONB,
  duration TEXT,
  urgency_level TEXT NOT NULL CHECK (urgency_level IN ('mild', 'moderate', 'urgent')),
  recommended_specialist TEXT,
  ai_reasoning TEXT,
  red_flag_triggered BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_symptom_checks_user_id ON symptom_checks(user_id);
CREATE INDEX IF NOT EXISTS idx_symptom_checks_created_at ON symptom_checks(created_at DESC);

-- =============================================
-- Row Level Security (RLS)
-- =============================================

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE symptom_checks ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read/update their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Symptom checks: users can manage their own records
-- Also allow anonymous inserts (user_id = null) for non-logged-in users
CREATE POLICY "Users can view own symptom checks"
  ON symptom_checks FOR SELECT
  USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Anyone can insert symptom checks"
  ON symptom_checks FOR INSERT
  WITH CHECK (TRUE);

CREATE POLICY "Users can delete own symptom checks"
  ON symptom_checks FOR DELETE
  USING (auth.uid() = user_id);
