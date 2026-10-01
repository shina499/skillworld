-- =========================================================================
-- SkillGarden Complete PostgreSQL Database Schema for Supabase
-- Run this script in your Supabase SQL Editor:
-- Supabase Dashboard -> Project -> SQL Editor -> New Query -> Paste & Run
-- =========================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =========================================================================
-- 1. PROFILES (Extends Supabase auth.users)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL DEFAULT 'Gardener',
  avatar TEXT NOT NULL DEFAULT '🌱',
  overall_identity TEXT NOT NULL DEFAULT 'Curious Explorer',
  overall_level INTEGER NOT NULL DEFAULT 1,
  total_xp INTEGER NOT NULL DEFAULT 0,
  target_session_minutes INTEGER NOT NULL DEFAULT 15,
  preferred_time TEXT NOT NULL DEFAULT 'evening',
  encouragement_style TEXT NOT NULL DEFAULT 'gentle',
  has_completed_onboarding BOOLEAN NOT NULL DEFAULT FALSE,
  active_days_this_week INTEGER NOT NULL DEFAULT 1,
  last_active_date TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users view own profile" ON public.profiles;
CREATE POLICY "Users view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users update own profile" ON public.profiles;
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users insert own profile" ON public.profiles;
CREATE POLICY "Users insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- =========================================================================
-- 2. TOPICS (Master library of learning domains)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.topics (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  icon TEXT NOT NULL DEFAULT '🌱',
  description TEXT,
  category TEXT NOT NULL DEFAULT 'tech',
  is_custom BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Topics readable by all" ON public.topics;
CREATE POLICY "Topics readable by all" ON public.topics FOR SELECT TO authenticated, anon USING (true);

DROP POLICY IF EXISTS "Users can create custom topics" ON public.topics;
CREATE POLICY "Users can create custom topics" ON public.topics FOR INSERT TO authenticated WITH CHECK (true);

-- =========================================================================
-- 3. USER TOPICS (Active topics selected by a user)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.user_topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  topic_id TEXT NOT NULL REFERENCES public.topics(id) ON DELETE CASCADE,
  custom_name TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  level INTEGER NOT NULL DEFAULT 1,
  xp INTEGER NOT NULL DEFAULT 0,
  confidence INTEGER NOT NULL DEFAULT 2,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  UNIQUE(user_id, topic_id)
);

ALTER TABLE public.user_topics ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users manage own user_topics" ON public.user_topics;
CREATE POLICY "Users manage own user_topics" ON public.user_topics FOR ALL 
  USING (auth.uid() = user_id) 
  WITH CHECK (auth.uid() = user_id);

-- =========================================================================
-- 4. TOPIC PREFERENCES (Specific preferences per user topic)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.topic_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  user_topic_id UUID NOT NULL REFERENCES public.user_topics(id) ON DELETE CASCADE UNIQUE,
  experience_level TEXT NOT NULL DEFAULT 'beginner',
  motivation TEXT[] DEFAULT ARRAY['curiosity'],
  learning_style TEXT[] DEFAULT ARRAY['projects'],
  desired_session_minutes INTEGER NOT NULL DEFAULT 15,
  frequency TEXT NOT NULL DEFAULT 'daily',
  importance TEXT NOT NULL DEFAULT 'important',
  target_description TEXT,
  custom_preferences JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.topic_preferences ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users manage own topic_preferences" ON public.topic_preferences;
CREATE POLICY "Users manage own topic_preferences" ON public.topic_preferences FOR ALL 
  USING (auth.uid() = user_id) 
  WITH CHECK (auth.uid() = user_id);

-- =========================================================================
-- 5. TOPIC QUESTIONS (Dynamic questions for onboarding)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.topic_questions (
  id TEXT PRIMARY KEY,
  topic_slug TEXT NOT NULL,
  question TEXT NOT NULL,
  subtitle TEXT,
  question_type TEXT NOT NULL DEFAULT 'single_choice',
  options TEXT[],
  placeholder TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  required BOOLEAN NOT NULL DEFAULT TRUE
);

ALTER TABLE public.topic_questions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read topic_questions" ON public.topic_questions;
CREATE POLICY "Public read topic_questions" ON public.topic_questions FOR SELECT TO authenticated, anon USING (true);

-- =========================================================================
-- 6. TOPIC ANSWERS (User responses to questions)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.topic_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  user_topic_id UUID NOT NULL REFERENCES public.user_topics(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL,
  question_text TEXT NOT NULL,
  answer JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  UNIQUE(user_id, user_topic_id, question_id)
);

ALTER TABLE public.topic_answers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users manage own topic_answers" ON public.topic_answers;
CREATE POLICY "Users manage own topic_answers" ON public.topic_answers FOR ALL 
  USING (auth.uid() = user_id) 
  WITH CHECK (auth.uid() = user_id);

-- =========================================================================
-- 7. GOALS
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  user_topic_id UUID REFERENCES public.user_topics(id) ON DELETE CASCADE,
  topic_name TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  motivation TEXT[],
  target TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users manage own goals" ON public.goals;
CREATE POLICY "Users manage own goals" ON public.goals FOR ALL 
  USING (auth.uid() = user_id) 
  WITH CHECK (auth.uid() = user_id);

-- =========================================================================
-- 8. SKILLS & PROGRESS (Supports both template skills and user skills)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_topic_id UUID REFERENCES public.user_topics(id) ON DELETE CASCADE,
  topic_slug TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL DEFAULT 1,
  difficulty TEXT NOT NULL DEFAULT 'Beginner',
  prerequisite_skill_id UUID REFERENCES public.skills(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'locked',
  progress_percentage INTEGER NOT NULL DEFAULT 0,
  level INTEGER NOT NULL DEFAULT 1,
  xp INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Skills readable by users" ON public.skills;
CREATE POLICY "Skills readable by users" ON public.skills FOR SELECT TO authenticated, anon 
  USING (user_topic_id IS NULL OR user_topic_id IN (SELECT id FROM public.user_topics WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "Users manage own skills" ON public.skills;
CREATE POLICY "Users manage own skills" ON public.skills FOR ALL 
  USING (user_topic_id IN (SELECT id FROM public.user_topics WHERE user_id = auth.uid()))
  WITH CHECK (user_topic_id IN (SELECT id FROM public.user_topics WHERE user_id = auth.uid()));

-- =========================================================================
-- 9. QUESTS (Professional Quest System with rich domain fields)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.quests (
  id TEXT PRIMARY KEY,
  user_topic_id UUID REFERENCES public.user_topics(id) ON DELETE CASCADE,
  topic_name TEXT NOT NULL,
  topic_slug TEXT,
  skill_id TEXT,
  skill_name TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  objective TEXT,
  category_type_badge TEXT,
  type TEXT NOT NULL DEFAULT 'lesson',
  difficulty TEXT NOT NULL DEFAULT 'Beginner',
  estimated_minutes INTEGER NOT NULL DEFAULT 10,
  materials TEXT[],
  expected_outcome TEXT,
  hint TEXT,
  example TEXT,
  completion_type TEXT DEFAULT 'self_assessment_rubric',
  completion_criteria TEXT[],
  reward_xp INTEGER NOT NULL DEFAULT 25,
  why_this_quest TEXT NOT NULL,
  progress_impact TEXT,
  project_stage JSONB,
  interactive_payload JSONB DEFAULT '{}'::jsonb,
  steps JSONB NOT NULL DEFAULT '[]'::jsonb,
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.quests ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Quests readable by all users" ON public.quests;
CREATE POLICY "Quests readable by all users" ON public.quests FOR SELECT TO authenticated, anon 
  USING (user_topic_id IS NULL OR user_topic_id IN (SELECT id FROM public.user_topics WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "Users manage own quests" ON public.quests;
CREATE POLICY "Users manage own quests" ON public.quests FOR ALL 
  USING (user_topic_id IN (SELECT id FROM public.user_topics WHERE user_id = auth.uid()))
  WITH CHECK (user_topic_id IN (SELECT id FROM public.user_topics WHERE user_id = auth.uid()));

-- =========================================================================
-- 10. QUEST REFLECTIONS (Post-Quest Calibration & Confidence)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.quest_reflections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  quest_id TEXT NOT NULL,
  topic_name TEXT NOT NULL,
  confidence_score INTEGER NOT NULL DEFAULT 4,
  easiest_part TEXT,
  difficult_part TEXT,
  what_to_change TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.quest_reflections ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users manage own quest reflections" ON public.quest_reflections;
CREATE POLICY "Users manage own quest reflections" ON public.quest_reflections FOR ALL 
  USING (auth.uid() = user_id) 
  WITH CHECK (auth.uid() = user_id);

-- =========================================================================
-- 11. QUEST ATTEMPTS (Historical records of quest runs)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.quest_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  quest_id TEXT NOT NULL,
  user_topic_id UUID REFERENCES public.user_topics(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  completed_at TIMESTAMPTZ,
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  score INTEGER,
  duration_minutes INTEGER NOT NULL DEFAULT 5,
  notes TEXT
);

ALTER TABLE public.quest_attempts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users manage own quest_attempts" ON public.quest_attempts;
CREATE POLICY "Users manage own quest_attempts" ON public.quest_attempts FOR ALL 
  USING (auth.uid() = user_id) 
  WITH CHECK (auth.uid() = user_id);

-- =========================================================================
-- 12. LEARNING SESSIONS (Gentle history timeline)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.learning_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  user_topic_id UUID REFERENCES public.user_topics(id) ON DELETE CASCADE,
  topic_name TEXT NOT NULL,
  quest_id TEXT NOT NULL,
  quest_title TEXT NOT NULL,
  skill_name TEXT NOT NULL,
  type TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 10,
  completed BOOLEAN NOT NULL DEFAULT TRUE,
  earned_xp INTEGER NOT NULL DEFAULT 25,
  score INTEGER,
  notes TEXT,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.learning_sessions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users manage own sessions" ON public.learning_sessions;
CREATE POLICY "Users manage own sessions" ON public.learning_sessions FOR ALL 
  USING (auth.uid() = user_id) 
  WITH CHECK (auth.uid() = user_id);

-- =========================================================================
-- 13. WORLDS & WORLD REGIONS (With Dynamic Weather & Streak Synced Atmosphere)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.worlds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  world_level INTEGER NOT NULL DEFAULT 1,
  theme TEXT NOT NULL DEFAULT 'island',
  unlocked_regions_count INTEGER NOT NULL DEFAULT 1,
  weather TEXT NOT NULL DEFAULT 'auto',
  ambient_sound_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  time_of_day TEXT NOT NULL DEFAULT 'auto',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.worlds ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users manage own world" ON public.worlds;
CREATE POLICY "Users manage own world" ON public.worlds FOR ALL 
  USING (auth.uid() = user_id) 
  WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.world_regions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  world_id UUID NOT NULL REFERENCES public.worlds(id) ON DELETE CASCADE,
  user_topic_id UUID NOT NULL REFERENCES public.user_topics(id) ON DELETE CASCADE,
  topic_name TEXT NOT NULL,
  topic_category TEXT NOT NULL DEFAULT 'tech',
  region_type TEXT NOT NULL,
  stage INTEGER NOT NULL DEFAULT 1,
  progress INTEGER NOT NULL DEFAULT 10,
  unlocked BOOLEAN NOT NULL DEFAULT TRUE,
  theme TEXT NOT NULL,
  position JSONB NOT NULL DEFAULT '[0, 0, 0]'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  UNIQUE(world_id, user_topic_id)
);

ALTER TABLE public.world_regions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users manage own world_regions" ON public.world_regions;
CREATE POLICY "Users manage own world_regions" ON public.world_regions FOR ALL 
  USING (world_id IN (SELECT id FROM public.worlds WHERE user_id = auth.uid()))
  WITH CHECK (world_id IN (SELECT id FROM public.worlds WHERE user_id = auth.uid()));

-- =========================================================================
-- 14. REMINDERS (Guilt-Free Supportive Rhythm)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  enabled BOOLEAN NOT NULL DEFAULT TRUE,
  preferred_time TEXT NOT NULL DEFAULT 'evening',
  time_string TEXT NOT NULL DEFAULT '19:00',
  frequency TEXT NOT NULL DEFAULT 'daily',
  style TEXT NOT NULL DEFAULT 'gentle',
  quiet_start TEXT NOT NULL DEFAULT '22:00',
  quiet_end TEXT NOT NULL DEFAULT '08:00',
  last_sent_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users manage own reminders" ON public.reminders;
CREATE POLICY "Users manage own reminders" ON public.reminders FOR ALL 
  USING (auth.uid() = user_id) 
  WITH CHECK (auth.uid() = user_id);

-- =========================================================================
-- 15. ACHIEVEMENTS & USER UNLOCKS
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.achievements (
  id TEXT PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  topic_name TEXT
);

ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read achievements" ON public.achievements;
CREATE POLICY "Public read achievements" ON public.achievements FOR SELECT TO authenticated, anon USING (true);

CREATE TABLE IF NOT EXISTS public.user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  achievement_id TEXT NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  UNIQUE(user_id, achievement_id)
);

ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users manage own user_achievements" ON public.user_achievements;
CREATE POLICY "Users manage own user_achievements" ON public.user_achievements FOR ALL 
  USING (auth.uid() = user_id) 
  WITH CHECK (auth.uid() = user_id);

-- =========================================================================
-- INDEXES FOR HIGH QUERY EFFICIENCY
-- =========================================================================
CREATE INDEX IF NOT EXISTS idx_user_topics_user_id ON public.user_topics(user_id);
CREATE INDEX IF NOT EXISTS idx_topic_preferences_user_topic_id ON public.topic_preferences(user_topic_id);
CREATE INDEX IF NOT EXISTS idx_goals_user_id ON public.goals(user_id);
CREATE INDEX IF NOT EXISTS idx_skills_user_topic_id ON public.skills(user_topic_id);
CREATE INDEX IF NOT EXISTS idx_quests_user_topic_id ON public.quests(user_topic_id);
CREATE INDEX IF NOT EXISTS idx_quest_reflections_user_id ON public.quest_reflections(user_id);
CREATE INDEX IF NOT EXISTS idx_learning_sessions_user_id ON public.learning_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_world_regions_world_id ON public.world_regions(world_id);

-- =========================================================================
-- TRIGGER: Auto-create Profile & World when user registers in Supabase Auth
-- =========================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, avatar)
  VALUES (new.id, coalesce(new.raw_user_meta_data->>'full_name', 'Gardener'), '🌱')
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.worlds (user_id, world_level, theme, weather, time_of_day)
  VALUES (new.id, 1, 'floating_archipelago', 'auto', 'auto')
  ON CONFLICT (user_id) DO NOTHING;

  INSERT INTO public.reminders (user_id, enabled, preferred_time, style)
  VALUES (new.id, true, 'evening', 'gentle')
  ON CONFLICT (user_id) DO NOTHING;

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- =========================================================================
-- SEED DATA: Predefined Topics & Achievements
-- =========================================================================
INSERT INTO public.topics (id, name, slug, icon, description, category) VALUES
  ('programming', 'Programming', 'programming', '💻', 'Code, software engineering, and interactive tools.', 'tech'),
  ('drawing', 'Drawing & Art', 'drawing', '🎨', 'Digital illustration, perspective, and character art.', 'art'),
  ('photography', 'Photography', 'photography', '📸', 'Composition, lighting, and visual storytelling.', 'photo'),
  ('english', 'English Fluency', 'english', '🇬🇧', 'Spoken fluency, dialogue simulations, and natural communication.', 'language'),
  ('music', 'Music & Instrument', 'music', '🎵', 'Ear training, rhythm, chords, and performance practice.', 'music'),
  ('cooking', 'Culinary & Cooking', 'cooking', '🍳', 'Technique exercises, flavor balance, and knife skills.', 'culinary'),
  ('chess', 'Chess Strategy', 'chess', '♟️', 'Tactical puzzles, position analysis, and endgame calculations.', 'tactics'),
  ('science', 'Science & Cosmos', 'science', '🔬', 'Empirical curiosity, natural phenomena, and astronomical wonders.', 'science')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.achievements (id, key, title, description, icon) VALUES
  ('first_step', 'first_step', 'First Step', 'Completed your very first tiny quest.', '🌱'),
  ('polymath', 'polymath', 'Curious Mind', 'Explored multiple distinct learning domains.', '🧠'),
  ('builder', 'builder', 'Builder', 'Completed your first hands-on project quest stage.', '🏗️'),
  ('rhythm', 'rhythm', 'Gentle Rhythm', 'Learned across multiple days without guilt.', '🌿'),
  ('comeback', 'comeback', 'Comeback Star', 'Returned after a break without losing a step.', '🌟'),
  ('deep_dive', 'deep_dive', 'Deep Dive', 'Reached Level 3 in a dedicated topic district.', '🏆'),
  ('tactician', 'tactician', 'Sharp Mind', 'Solved your first tactical position or puzzle correctly.', '⚡'),
  ('reflective', 'reflective', 'Thoughtful Learner', 'Logged a post-quest reflection on what you achieved.', '💭')
ON CONFLICT (id) DO NOTHING;
