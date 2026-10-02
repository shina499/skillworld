-- =========================================================================
-- SkillGarden Complete PostgreSQL Database Schema for Supabase
-- Run this script in your Supabase SQL Editor:
-- Supabase Dashboard -> Project -> SQL Editor -> New Query -> Paste & Run
-- =========================================================================

-- Enable pgcrypto extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =========================================================================
-- 1. PROFILES
-- Flexible TEXT primary key so both Supabase Auth UUIDs and guest profiles work
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
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
DROP POLICY IF EXISTS "Public access to profiles" ON public.profiles;
CREATE POLICY "Public access to profiles" ON public.profiles FOR ALL TO authenticated, anon USING (true) WITH CHECK (true);

-- =========================================================================
-- 2. TOPICS (Master library of learning majors)
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
DROP POLICY IF EXISTS "Public access to topics" ON public.topics;
CREATE POLICY "Public access to topics" ON public.topics FOR ALL TO authenticated, anon USING (true) WITH CHECK (true);

-- =========================================================================
-- 3. TOPIC QUESTIONS (Dynamic questions for each major during onboarding)
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
DROP POLICY IF EXISTS "Public access to topic_questions" ON public.topic_questions;
CREATE POLICY "Public access to topic_questions" ON public.topic_questions FOR ALL TO authenticated, anon USING (true) WITH CHECK (true);

-- =========================================================================
-- 4. USER TOPICS (Active islands / majors selected by a user)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.user_topics (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT NOT NULL,
  topic_id TEXT NOT NULL,
  custom_name TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  level INTEGER NOT NULL DEFAULT 1,
  xp INTEGER NOT NULL DEFAULT 0,
  confidence INTEGER NOT NULL DEFAULT 2,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.user_topics ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public access to user_topics" ON public.user_topics;
CREATE POLICY "Public access to user_topics" ON public.user_topics FOR ALL TO authenticated, anon USING (true) WITH CHECK (true);

-- =========================================================================
-- 5. TOPIC PREFERENCES & ANSWERS
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.topic_preferences (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT NOT NULL,
  user_topic_id TEXT NOT NULL,
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
DROP POLICY IF EXISTS "Public access to topic_preferences" ON public.topic_preferences;
CREATE POLICY "Public access to topic_preferences" ON public.topic_preferences FOR ALL TO authenticated, anon USING (true) WITH CHECK (true);

CREATE TABLE IF NOT EXISTS public.topic_answers (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT NOT NULL,
  user_topic_id TEXT NOT NULL,
  question_id TEXT NOT NULL,
  question_text TEXT NOT NULL,
  answer JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.topic_answers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public access to topic_answers" ON public.topic_answers;
CREATE POLICY "Public access to topic_answers" ON public.topic_answers FOR ALL TO authenticated, anon USING (true) WITH CHECK (true);

-- =========================================================================
-- 6. GOALS
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.goals (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT NOT NULL,
  user_topic_id TEXT,
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
DROP POLICY IF EXISTS "Public access to goals" ON public.goals;
CREATE POLICY "Public access to goals" ON public.goals FOR ALL TO authenticated, anon USING (true) WITH CHECK (true);

-- =========================================================================
-- 7. SKILLS (Skill tree nodes for each district)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.skills (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_topic_id TEXT,
  topic_slug TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL DEFAULT 1,
  difficulty TEXT NOT NULL DEFAULT 'Beginner',
  prerequisite_skill_id TEXT,
  status TEXT NOT NULL DEFAULT 'locked',
  progress_percentage INTEGER NOT NULL DEFAULT 0,
  level INTEGER NOT NULL DEFAULT 1,
  xp INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public access to skills" ON public.skills;
CREATE POLICY "Public access to skills" ON public.skills FOR ALL TO authenticated, anon USING (true) WITH CHECK (true);

-- =========================================================================
-- 8. QUESTS (Daily quests and interactive exercises)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.quests (
  id TEXT PRIMARY KEY,
  user_topic_id TEXT,
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
DROP POLICY IF EXISTS "Public access to quests" ON public.quests;
CREATE POLICY "Public access to quests" ON public.quests FOR ALL TO authenticated, anon USING (true) WITH CHECK (true);

-- =========================================================================
-- 9. LEARNING SESSIONS & REFLECTIONS
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.learning_sessions (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT NOT NULL,
  user_topic_id TEXT,
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
DROP POLICY IF EXISTS "Public access to learning_sessions" ON public.learning_sessions;
CREATE POLICY "Public access to learning_sessions" ON public.learning_sessions FOR ALL TO authenticated, anon USING (true) WITH CHECK (true);

CREATE TABLE IF NOT EXISTS public.quest_reflections (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT NOT NULL,
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
DROP POLICY IF EXISTS "Public access to quest_reflections" ON public.quest_reflections;
CREATE POLICY "Public access to quest_reflections" ON public.quest_reflections FOR ALL TO authenticated, anon USING (true) WITH CHECK (true);

-- =========================================================================
-- 10. WORLDS & WORLD REGIONS (3D Archipelago islands)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.worlds (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT NOT NULL UNIQUE,
  world_level INTEGER NOT NULL DEFAULT 1,
  theme TEXT NOT NULL DEFAULT 'island',
  unlocked_regions_count INTEGER NOT NULL DEFAULT 1,
  weather TEXT NOT NULL DEFAULT 'auto',
  ambient_sound_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  auto_rotate BOOLEAN NOT NULL DEFAULT FALSE,
  time_of_day TEXT NOT NULL DEFAULT 'auto',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.worlds ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public access to worlds" ON public.worlds;
CREATE POLICY "Public access to worlds" ON public.worlds FOR ALL TO authenticated, anon USING (true) WITH CHECK (true);

CREATE TABLE IF NOT EXISTS public.world_regions (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  world_id TEXT NOT NULL,
  user_topic_id TEXT NOT NULL,
  topic_name TEXT NOT NULL,
  topic_category TEXT NOT NULL DEFAULT 'tech',
  region_type TEXT NOT NULL,
  stage INTEGER NOT NULL DEFAULT 1,
  progress INTEGER NOT NULL DEFAULT 10,
  unlocked BOOLEAN NOT NULL DEFAULT TRUE,
  theme TEXT NOT NULL,
  position JSONB NOT NULL DEFAULT '[0, 0, 0]'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.world_regions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public access to world_regions" ON public.world_regions;
CREATE POLICY "Public access to world_regions" ON public.world_regions FOR ALL TO authenticated, anon USING (true) WITH CHECK (true);

-- =========================================================================
-- 11. REMINDERS & ACHIEVEMENTS
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.reminders (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT NOT NULL UNIQUE,
  enabled BOOLEAN NOT NULL DEFAULT TRUE,
  preferred_time TEXT NOT NULL DEFAULT 'evening',
  time_string TEXT NOT NULL DEFAULT '19:00',
  frequency TEXT NOT NULL DEFAULT 'daily',
  style TEXT NOT NULL DEFAULT 'gentle',
  quiet_start TEXT NOT NULL DEFAULT '22:00',
  quiet_end TEXT NOT NULL DEFAULT '08:00',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public access to reminders" ON public.reminders;
CREATE POLICY "Public access to reminders" ON public.reminders FOR ALL TO authenticated, anon USING (true) WITH CHECK (true);

CREATE TABLE IF NOT EXISTS public.achievements (
  id TEXT PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  is_unlocked BOOLEAN NOT NULL DEFAULT FALSE,
  unlocked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public access to achievements" ON public.achievements;
CREATE POLICY "Public access to achievements" ON public.achievements FOR ALL TO authenticated, anon USING (true) WITH CHECK (true);

-- =========================================================================
-- SEED DATA: 8 Learning Majors / Topics
-- =========================================================================
INSERT INTO public.topics (id, name, slug, icon, description, category) VALUES
  ('programming', 'Programming', 'programming', '💻', 'Code, apps, web development, and interactive software.', 'tech'),
  ('drawing', 'Drawing & Art', 'drawing', '🎨', 'Digital illustration, gesture drawing, and character art.', 'art'),
  ('photography', 'Photography', 'photography', '📸', 'Composition, exposure triangle, and visual storytelling.', 'photo'),
  ('english', 'English Fluency', 'english', '🇬🇧', 'Conversational fluency, spoken dialogue, and idioms.', 'language'),
  ('music', 'Music & Instrument', 'music', '🎵', 'Rhythm, ear training, pentatonic scales, and songs.', 'music'),
  ('cooking', 'Culinary & Cooking', 'cooking', '🍳', 'Knife skills, heat control, and flavor balancing.', 'culinary'),
  ('chess', 'Chess Strategy', 'chess', '♟️', 'Tactical puzzles, positional analysis, and endgames.', 'tactics'),
  ('science', 'Science & Cosmos', 'science', '🔬', 'Empirical curiosity, physics, cosmos, and natural phenomena.', 'science')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  icon = EXCLUDED.icon,
  description = EXCLUDED.description,
  category = EXCLUDED.category;

-- =========================================================================
-- SEED DATA: Unique Questions for EACH Major
-- =========================================================================
INSERT INTO public.topic_questions (id, topic_slug, question, subtitle, question_type, options, placeholder, order_index, required) VALUES
  -- Programming
  ('tq_p1', 'programming', 'What do you want to accomplish in Programming?', 'Your personal north star for writing code.', 'text', NULL, 'e.g. Learn JavaScript well enough to build my own apps and interactive tools.', 1, true),
  ('tq_p2', 'programming', 'What would you love to build most?', 'Customizes your coding challenges and mini-projects.', 'single_choice', ARRAY['Websites & Web Apps', 'Automations & Scripts', 'Interactive Visuals & Games', 'Core Computer Science & Logic'], NULL, 2, true),
  ('tq_p3', 'programming', 'What is your current familiarity with code?', 'We calibrate step complexity accordingly.', 'single_choice', ARRAY['Absolute beginner (first time)', 'Know basics (variables, loops)', 'Built small scripts or projects', 'Experienced in another language'], NULL, 3, true),
  ('tq_p4', 'programming', 'How do you prefer learning programming?', 'Shape your daily practice experience.', 'single_choice', ARRAY['Building real projects', 'Coding challenges & puzzles', 'Visual games', 'Short concept breakdowns'], NULL, 4, true),

  -- Drawing & Art
  ('tq_d1', 'drawing', 'What is your primary drawing goal?', 'The vision you want to bring to life on paper or screen.', 'text', NULL, 'e.g. Draw expressive characters and scenes without stiff reference tracing.', 1, true),
  ('tq_d2', 'drawing', 'What visual medium excites you most?', 'Customizes your sketchbook and digital art prompts.', 'single_choice', ARRAY['Digital illustration & iPad', 'Traditional pencil & sketchbook', 'Anime & Character design', 'Urban sketching & landscapes'], NULL, 2, true),
  ('tq_d3', 'drawing', 'What is your current drawing experience?', 'Helps us suggest the right gesture and shape exercises.', 'single_choice', ARRAY['Starting from stick figures', 'Know basic shapes and lines', 'Draw occasionally', 'Experienced artist looking for consistency'], NULL, 3, true),
  ('tq_d4', 'drawing', 'What feels most challenging right now?', 'We target this area gently with micro-quests.', 'single_choice', ARRAY['Stiff lines & shaky hand control', 'Proportions & 3D perspective', 'Color choices & shading', 'Finishing pieces'], NULL, 4, true),

  -- Photography
  ('tq_ph1', 'photography', 'What kind of moments do you want to capture?', 'Your artistic photographic viewpoint.', 'text', NULL, 'e.g. Take cinematic street and travel photos with beautiful natural light.', 1, true),
  ('tq_ph2', 'photography', 'What gear do you primarily use?', 'Quests adapt to your camera interface.', 'single_choice', ARRAY['Smartphone camera', 'Mirrorless / DSLR', 'Vintage Film camera', 'Action / Drone'], NULL, 2, true),
  ('tq_ph3', 'photography', 'What subjects inspire you most?', 'Determines your field observation challenges.', 'single_choice', ARRAY['Street & Candid Life', 'Portraits & People', 'Nature & Landscapes', 'Architecture & Geometry'], NULL, 3, true),
  ('tq_ph4', 'photography', 'What would you like to master first?', 'Your initial skill focus.', 'single_choice', ARRAY['Composition & Rule of Thirds', 'Lighting & Shadow contrast', 'Storytelling in a single shot', 'Color grading & Editing'], NULL, 4, true),

  -- English Fluency
  ('tq_en1', 'english', 'What is your main fluency goal?', 'The speaking milestone you want to reach.', 'text', NULL, 'e.g. Speak smoothly in everyday conversations without freezing or searching for words.', 1, true),
  ('tq_en2', 'english', 'Where do you most want to use English?', 'Focuses your interactive dialogue simulations.', 'single_choice', ARRAY['Casual daily social chats', 'Travel & Ordering food abroad', 'Work meetings & Professional presentation', 'Consuming media without subtitles'], NULL, 2, true),
  ('tq_en3', 'english', 'How does your speaking feel today?', 'Helps us tailor speaking vs listening pace.', 'single_choice', ARRAY['Hesitant to speak aloud', 'Understand well but struggle to reply quickly', 'Conversational with grammar slips', 'Comfortable but want natural idioms'], NULL, 3, true),
  ('tq_en4', 'english', 'How do you enjoy practicing languages?', 'Customizes your interactive audio workbench.', 'single_choice', ARRAY['Spoken dialogue simulations', 'Short audio listening challenges', 'Real-life scenario vocabulary', 'Pronunciation & shadow repetition'], NULL, 4, true),

  -- Music & Instruments
  ('tq_mu1', 'music', 'What is your musical dream?', 'The songs or sounds you want to play.', 'text', NULL, 'e.g. Play my favorite songs smoothly by ear and understand basic chord progressions.', 1, true),
  ('tq_mu2', 'music', 'What instrument are you learning?', 'Guides technical exercises and notation.', 'single_choice', ARRAY['Piano / Keyboard', 'Acoustic / Electric Guitar', 'Singing & Voice', 'Music Production & Beats'], NULL, 2, true),
  ('tq_mu3', 'music', 'What is your current background in music?', 'Calibrates ear training and exercises.', 'single_choice', ARRAY['Complete beginner (never played)', 'Know a few open chords or keys', 'Played in childhood', 'Intermediate player returning to basics'], NULL, 3, true),
  ('tq_mu4', 'music', 'What skill would you love to develop first?', 'Your immediate learning track.', 'single_choice', ARRAY['Rhythm & Groove timing', 'Ear training & recognizing melodies', 'Learning whole songs', 'Music theory made simple'], NULL, 4, true),

  -- Cooking & Culinary
  ('tq_ck1', 'cooking', 'What do you want to accomplish in the kitchen?', 'Your culinary aspiration.', 'text', NULL, 'e.g. Cook delicious, healthy weeknight dinners with confidence and great knife skills.', 1, true),
  ('tq_ck2', 'cooking', 'What type of food inspires you most?', 'Shapes your recipe experiments and technique quests.', 'single_choice', ARRAY['Quick wholesome weeknight meals', 'Comfort food & Baking', 'Global street food & Spices', 'Classic restaurant techniques'], NULL, 2, true),
  ('tq_ck3', 'cooking', 'How comfortable are you right now?', 'Helps us match ingredient and knife technique levels.', 'single_choice', ARRAY['Total beginner (can make eggs and toast)', 'Know basic cooking but follow recipes strictly', 'Cook regularly and want more flavor intuition', 'Confident cook exploring new cuisines'], NULL, 3, true),
  ('tq_ck4', 'cooking', 'What is one culinary skill you want to master?', 'Focus for your hands-on quests.', 'single_choice', ARRAY['Safe knife skills & speed', 'Flavor balancing (acid, salt, fat, heat)', 'Sauces & Marinades', 'Pan searing & heat control'], NULL, 4, true),

  -- Chess Strategy
  ('tq_ch1', 'chess', 'What is your chess aspiration?', 'Your rating or strategic milestone.', 'text', NULL, 'e.g. Reach 1200 rating and spot tactical forks before making moves.', 1, true),
  ('tq_ch2', 'chess', 'What is your current chess level?', 'Calibrates interactive chessboard puzzles.', 'single_choice', ARRAY['Just learned how pieces move', 'Casual player (under 1000 ELO)', 'Club player (1000 - 1400 ELO)', 'Experienced (1400+ ELO)'], NULL, 2, true),
  ('tq_ch3', 'chess', 'Where do you feel you lose most games?', 'We will target this area with custom puzzles.', 'single_choice', ARRAY['Missing simple tactical forks & pins', 'Back-rank blunders & king safety', 'Middle-game planning when there are no captures', 'Endgame conversion with few pieces'], NULL, 3, true),
  ('tq_ch4', 'chess', 'How do you prefer calculating?', 'Shapes your tactical training curriculum.', 'single_choice', ARRAY['Interactive move-by-move puzzles', 'Positional master game analysis', 'Opening principles and ideas', 'Endgame drills'], NULL, 4, true),

  -- Science & Cosmos
  ('tq_sc1', 'science', 'What scientific curiosity drives you?', 'Your intellectual exploration frontier.', 'text', NULL, 'e.g. Understand how the cosmos and quantum mechanics actually work.', 1, true),
  ('tq_sc2', 'science', 'Which scientific domain excites you most?', 'Shapes your conceptual deep-dive quests.', 'single_choice', ARRAY['Astrophysics & Space', 'Quantum Physics & Reality', 'Neuroscience & Human Mind', 'Evolution & Biological Systems'], NULL, 2, true),
  ('tq_sc3', 'science', 'How do you best absorb scientific ideas?', 'Shapes your explanation formats.', 'single_choice', ARRAY['Intuitive visual thought experiments', 'Mathematical logic and formulas', 'Historical discoveries and context', 'Hands-on kitchen experiments'], NULL, 3, true),
  ('tq_sc4', 'science', 'What is your primary exploration goal?', 'Your personal science milestone.', 'single_choice', ARRAY['Conversational understanding of modern physics', 'Develop empirical skepticism', 'Understand biological evolution', 'Satisfy deep existential wonder'], NULL, 4, true)
ON CONFLICT (id) DO UPDATE SET
  topic_slug = EXCLUDED.topic_slug,
  question = EXCLUDED.question,
  subtitle = EXCLUDED.subtitle,
  question_type = EXCLUDED.question_type,
  options = EXCLUDED.options,
  placeholder = EXCLUDED.placeholder,
  order_index = EXCLUDED.order_index,
  required = EXCLUDED.required;

-- =========================================================================
-- SEED DATA: Starter Skills for Majors
-- =========================================================================
INSERT INTO public.skills (id, topic_slug, name, description, order_index, difficulty, status, progress_percentage, level, xp) VALUES
  -- Programming Skills
  ('sk_prog_var', 'programming', 'Variables & Data Types', 'Storing data in memory, strings, numbers, booleans, and null values.', 1, 'Beginner', 'active', 60, 1, 30),
  ('sk_prog_fn', 'programming', 'Functions & Scope', 'Pure functions, parameters, return values, and lexical scope.', 2, 'Beginner', 'available', 20, 1, 10),
  ('sk_prog_arr', 'programming', 'Arrays & Iteration', 'Lists of data, mapping, filtering, reducing, and loop structures.', 3, 'Beginner', 'locked', 0, 1, 0),
  ('sk_prog_dom', 'programming', 'DOM Manipulation & Events', 'Querying elements, listening for clicks/inputs, and dynamic UI updates.', 4, 'Intermediate', 'locked', 0, 1, 0),

  -- Drawing Skills
  ('sk_draw_lines', 'drawing', 'Gesture & Confidence Lines', 'Loose wrist motion, continuous gesture drawings, and avoiding hairy strokes.', 1, 'Beginner', 'active', 40, 1, 20),
  ('sk_draw_shapes', 'drawing', 'Basic Form Construction', 'Breaking complex figures down into spheres, cylinders, and boxes.', 2, 'Beginner', 'available', 0, 1, 0),
  ('sk_draw_persp', 'drawing', '1-Point & 2-Point Perspective', 'Horizon lines, vanishing points, and creating realistic depth.', 3, 'Intermediate', 'locked', 0, 1, 0),

  -- Photography Skills
  ('sk_photo_thirds', 'photography', 'Rule of Thirds & Framing', 'Positioning horizons and subjects along natural eye balance grids.', 1, 'Beginner', 'available', 0, 1, 0),
  ('sk_photo_light', 'photography', 'Golden Hour & Directional Light', 'Using morning and evening side-lighting to reveal surface texture.', 2, 'Beginner', 'locked', 0, 1, 0),

  -- English Skills
  ('sk_eng_convo', 'english', 'Spontaneous Conversational Openers', 'Natural greetings, reacting warmly, and asking open questions.', 1, 'Beginner', 'available', 0, 1, 0),
  ('sk_eng_idioms', 'english', 'Common Colloquial Idioms', 'Phrasal verbs and everyday metaphors used in daily dialogues.', 2, 'Intermediate', 'locked', 0, 1, 0),

  -- Chess Skills
  ('sk_chess_tactics', 'chess', 'Forks, Pins & Skewers', 'Double attacks using knights, bishops, and rooks to win material.', 1, 'Beginner', 'available', 0, 1, 0),
  ('sk_chess_endgame', 'chess', 'King & Pawn Endgames', 'Opposition, key squares, and promoting passed pawns safely.', 2, 'Intermediate', 'locked', 0, 1, 0)
ON CONFLICT (id) DO UPDATE SET
  topic_slug = EXCLUDED.topic_slug,
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  order_index = EXCLUDED.order_index,
  difficulty = EXCLUDED.difficulty;

-- =========================================================================
-- SEED DATA: Starter Quests
-- =========================================================================
INSERT INTO public.quests (id, topic_name, topic_slug, skill_name, title, description, objective, category_type_badge, type, difficulty, estimated_minutes, reward_xp, why_this_quest, steps) VALUES
  ('quest_prog_todo', 'Programming', 'programming', 'DOM Manipulation & Events', 'Build an Interactive Micro To-Do Counter', 'Build a reactive counter and item toggler using vanilla JavaScript event listeners.', 'Write an event listener that dynamically updates the item count badge when tasks are marked complete.', 'INTERACTIVE CODE', 'project', 'Beginner+', 12, 35, 'Manipulating the DOM directly teaches the core mental model that all frontend frameworks like React build upon.', '[{"id":"step1","title":"The Event Loop Mental Model","instruction":"Understand how user clicks queue microtasks in JavaScript.","type":"concept","content":"When a user clicks a button, the browser emits an event object containing target information."},{"id":"step2","title":"Interactive Coding Sandbox","instruction":"Write the listener that updates state and element textContent.","type":"interactive_code","codeTemplate":"function toggleItem(id) {\n  // Complete the state toggle\n}","solutionCode":"function toggleItem(id) {\n  items = items.map(item => item.id === id ? { ...item, done: !item.done } : item);\n  render();\n}"}]'::jsonb),
  ('quest_draw_shapes', 'Drawing & Art', 'drawing', 'Basic Form Construction', '3D Form Shading on Digital Canvas', 'Turn 2D flat circles and squares into volumetric 3D spheres and cylinders using light source logic.', 'Draw a sphere with a defined core shadow, midtone, cast shadow, and highlight.', 'DIGITAL SKETCH', 'project', 'Beginner', 10, 30, 'Volume illusion is the fundamental bridge between flat cartooning and realistic illustration.', '[{"id":"step1","title":"Light Falloff Physics","instruction":"Notice how light grazes the curved surface before fading into the terminator line.","type":"concept","content":"The darkest tone is not at the edge, but at the core shadow before reflected bounce light."},{"id":"step2","title":"Canvas Drawing Exercise","instruction":"Use the digital stylus or mouse to paint the values on the canvas.","type":"drawing_canvas"}]'::jsonb),
  ('quest_chess_back_rank', 'Chess Strategy', 'chess', 'Forks, Pins & Skewers', 'Back-Rank Mate Tactical Puzzle', 'Black king is castled behind three pawns with zero escape squares (luft). Find the winning rook sacrifice.', 'Solve the 2-move back-rank checkmate sequence on the interactive chessboard.', 'TACTICAL PUZZLE', 'tactics', 'Beginner+', 8, 30, 'Back-rank vulnerabilities appear in over 40% of club-level chess matches. Recognizing the pattern prevents painful oversights.', '[{"id":"step1","title":"The Back-Rank Theme","instruction":"When a king has no flight square on the 7th rank, a heavy piece check on the 8th rank is lethal.","type":"concept","content":"Always monitor your king escape square (h3 or g3 for White, h6 or g6 for Black)."},{"id":"step2","title":"Execute the Checkmate Move","instruction":"Move the White Rook to the 8th rank to deliver the winning checkmate.","type":"chess_puzzle","chessInstruction":"White to move and win in 1 move: deliver back-rank checkmate!","chessTurn":"white","chessSolutionMove":{"from":"d1","to":"d8"}}]'::jsonb),
  ('quest_eng_cafe_sim', 'English Fluency', 'english', 'Spontaneous Conversational Openers', 'Café Order & Small Talk Dialogue', 'Practice ordering specialty coffee, asking about dairy alternatives, and answering standard counter questions.', 'Listen to the barista audio prompt, record your spoken order clearly, and confirm the receipt breakdown.', 'CONVERSATION SIMULATION', 'speaking', 'Beginner', 10, 25, 'Ordering food in English creates spontaneous real-world fluency without textbook stiffness.', '[{"id":"step1","title":"Natural Dialogue Rhythm","instruction":"Notice how native speakers naturally use soft openers: Can I get..., Could I have..., Would you mind...","type":"concept","content":"Polite requests sound friendlier with rising intonation at the end of the phrase."},{"id":"step2","title":"Audio Speaking Task","instruction":"Listen to the barista audio and practice saying your complete order clearly aloud.","type":"speaking_task","speakingPrompt":"Order an oat milk latte to-go and ask if they have blueberry muffins left today."}]'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  steps = EXCLUDED.steps,
  reward_xp = EXCLUDED.reward_xp;

-- =========================================================================
-- SEED DATA: Achievements
-- =========================================================================
INSERT INTO public.achievements (id, key, title, description, icon) VALUES
  ('first_step', 'first_step', 'First Step', 'Completed your very first tiny quest.', '🌱'),
  ('polymath', 'polymath', 'Curious Mind', 'Explored multiple distinct learning domains in your sanctuary.', '🧭'),
  ('builder', 'builder', 'Hands-On Maker', 'Constructed a completed interactive mini-creation.', '🛠️'),
  ('rhythm', 'rhythm', 'Gentle Rhythm', 'Learned across multiple days without guilt.', '🌿'),
  ('comeback', 'comeback', 'Comeback Star', 'Returned after a break without losing a step.', '🌟'),
  ('deep_dive', 'deep_dive', 'Deep Dive', 'Reached Level 3 in a dedicated topic district.', '🏆'),
  ('tactician', 'tactician', 'Sharp Mind', 'Solved your first tactical position or puzzle correctly.', '⚡'),
  ('reflective', 'reflective', 'Thoughtful Learner', 'Logged a post-quest reflection on what you achieved.', '💭')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  icon = EXCLUDED.icon;
