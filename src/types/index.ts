export type EncouragementStyle = 'gentle' | 'energetic' | 'focused' | 'playful' | 'minimal';
export type PreferredTime = 'morning' | 'afternoon' | 'evening' | 'night' | 'custom';
export type QuestType =
  // Standard generic types
  | 'lesson'
  | 'learn'
  | 'practice'
  | 'challenge'
  | 'project'
  | 'build'
  | 'review'
  | 'explore'
  | 'comeback'
  | 'reflection'
  // Programming
  | 'Coding challenge'
  | 'Debugging challenge'
  | 'Mini project'
  | 'Build task'
  | 'Refactoring task'
  | 'Algorithm problem'
  | 'Code reading'
  | 'Feature implementation'
  | 'Review task'
  // Drawing
  | 'Drawing exercise'
  | 'Observation exercise'
  | 'Composition challenge'
  | 'Character study'
  | 'Perspective exercise'
  | 'Shading study'
  | 'Color study'
  | 'Mini illustration'
  | 'Portfolio task'
  // Photography
  | 'Photo challenge'
  | 'Composition exercise'
  | 'Lighting experiment'
  | 'Field assignment'
  | 'Photo comparison'
  | 'Editing task'
  | 'Visual analysis'
  | 'Storytelling assignment'
  // English
  | 'Vocabulary challenge'
  | 'Grammar practice'
  | 'Speaking task'
  | 'Listening task'
  | 'Writing task'
  | 'Conversation simulation'
  | 'Pronunciation practice'
  | 'Reading task'
  | 'Real-life communication task'
  // Music
  | 'Technique exercise'
  | 'Ear training'
  | 'Rhythm exercise'
  | 'Song practice'
  | 'Theory challenge'
  | 'Composition task'
  | 'Performance task'
  // Cooking
  | 'Recipe challenge'
  | 'Ingredient substitution'
  | 'Flavor experiment'
  | 'Presentation challenge'
  | 'Planning task'
  // Chess
  | 'Tactical puzzle'
  | 'Position analysis'
  | 'Opening exercise'
  | 'Endgame exercise'
  | 'Game review'
  | 'Strategy challenge'
  | (string & {});
export type DifficultyLevel =
  | 'Beginner'
  | 'Beginner+'
  | 'Intermediate'
  | 'Intermediate+'
  | 'Advanced'
  | 'Expert'
  | 'beginner'
  | 'intermediate'
  | 'advanced';
export type SkillStatus = 'locked' | 'available' | 'active' | 'completed' | 'review';
export type LearningStyle = string;

export interface InterestCategory {
  id: string;
  name: string;
  icon: string;
  theme: string;
  description: string;
  popularTopics: string[];
}

export interface UserProfile {
  id: string;
  email?: string;
  displayName: string;
  avatar: string;
  overallIdentity: string; // e.g. "Creative Builder", "Curious Explorer"
  overallLevel: number;
  level?: number;
  totalXp: number;
  encouragementStyle: EncouragementStyle;
  preferredTime: PreferredTime;
  targetSessionMinutes: number;
  sessionLengthMinutes?: number;
  hasCompletedOnboarding: boolean;
  activeDaysThisWeek: number;
  lastActiveDate: string;
  interests?: string[];
  learningStyles?: string[];
  experienceLevel?: string;
  mainDifficulty?: string;
  motivationDriver?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Topic {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  category: 'tech' | 'art' | 'language' | 'music' | 'photo' | 'culinary' | 'tactics' | 'science' | 'custom';
  isCustom?: boolean;
}

export interface UserTopic {
  id: string;
  userId: string;
  topicId: string;
  topicName: string;
  topicIcon: string;
  category: Topic['category'];
  status: 'active' | 'archived' | 'completed';
  level: number;
  xp: number;
  confidence: number;
  createdAt: string;
  updatedAt: string;
}

export interface TopicQuestion {
  id: string;
  topicSlug: string;
  question: string;
  subtitle?: string;
  type: 'single_choice' | 'multi_choice' | 'text' | 'scale';
  options?: string[];
  placeholder?: string;
  required?: boolean;
}

export interface TopicAnswer {
  id: string;
  userId: string;
  userTopicId: string;
  questionId: string;
  questionText: string;
  answer: string | string[];
}

export interface TopicPreference {
  id: string;
  userId: string;
  userTopicId: string;
  experienceLevel: 'beginner' | 'some' | 'intermediate' | 'advanced';
  motivation: string[];
  learningStyle: string[];
  desiredSessionMinutes: number;
  frequency: 'daily' | 'few_times_week' | 'once_week' | 'flexible';
  importance: 'exploring' | 'casual' | 'important' | 'main_goal';
  targetDescription: string;
  customPreferences?: Record<string, any>;
}

export interface Goal {
  id: string;
  userId: string;
  userTopicId?: string;
  topicName?: string;
  category?: string;
  targetSkillName?: string;
  title: string;
  description: string;
  motivation: string[];
  target?: string;
  status: 'active' | 'completed' | 'paused';
  createdAt: string;
  updatedAt: string;
}

export interface SkillNode {
  id: string;
  userTopicId?: string;
  topicSlug?: string;
  skillName?: string;
  category?: string;
  name: string;
  description: string;
  orderIndex: number;
  difficulty: DifficultyLevel;
  prerequisiteSkillId?: string;
  status: SkillStatus;
  progressPercentage: number;
  completionPercentage?: number;
  level: number;
  xp: number;
  milestones?: {
    id: string;
    name: string;
    status: 'completed' | 'current' | 'locked';
  }[];
}

export type SkillProgress = SkillNode;

export type CompletionType =
  | 'interactive_quiz'
  | 'coding'
  | 'text_submission'
  | 'self_assessment_rubric'
  | 'checklist'
  | 'drawing_canvas'
  | 'speaking_recording'
  | 'tactical_chess'
  | 'rhythm_tap'
  | 'photo_upload';

export interface ProjectStage {
  stage: number;
  totalStages: number;
  stageName: string;
  isFinalStage?: boolean;
}

export interface QuestStep {
  id: string;
  title: string;
  instruction: string;
  type:
    | 'concept'
    | 'interactive_choice'
    | 'micro_code'
    | 'micro_action'
    | 'reflection'
    | 'speaking_task'
    | 'drawing_canvas'
    | 'chess_puzzle'
    | 'audio_rhythm';
  content?: string;
  options?: string[];
  correctOptionIndex?: number;
  explanation?: string;
  promptQuestion?: string;
  codeSnippet?: string;
  initialCode?: string;
  solutionKeywords?: string[];
  // Topic-specific interactive payloads
  speakingPrompt?: string;
  targetPhrases?: string[];
  chessInitialFen?: string;
  chessTurn?: 'white' | 'black';
  chessInstruction?: string;
  chessSolutionMove?: { from: string; to: string; description: string };
  chessPieces?: { square: string; piece: string }[];
  drawingPrompt?: string;
  suggestedColors?: string[];
  criteriaChecklist?: string[];
}

export interface WorldReward {
  unlockKey: string;
  name: string;
  icon: string;
  description: string;
}

export interface Quest {
  id: string;
  userTopicId?: string;
  topicName?: string;
  topicSlug?: string;
  skillId?: string;
  skillName: string;
  title: string;
  description: string;
  objective?: string;
  categoryTypeBadge?: string; // e.g. "CODING CHALLENGE", "TACTICAL PUZZLE", "FIELD ASSIGNMENT"
  type: QuestType;
  difficulty: DifficultyLevel;
  estimatedMinutes: number;
  materials?: string[];
  expectedOutcome?: string;
  hint?: string;
  example?: string;
  completionType?: CompletionType;
  completionCriteria?: string[];
  rewardXp: number;
  whyThisQuest: string;
  worldReward?: WorldReward;
  progressImpact?: string;
  steps: QuestStep[];
  completed?: boolean;
  projectStage?: ProjectStage;
  interactivePayload?: Record<string, any>;
}

export interface QuestReflection {
  id: string;
  userId: string;
  questId: string;
  topicName: string;
  confidenceScore: number; // 1 to 5
  easiestPart?: string;
  difficultPart?: string;
  whatToChange?: string;
  notes?: string;
  createdAt: string;
}

export interface QuestAttempt {
  id: string;
  userId: string;
  questId: string;
  userTopicId: string;
  startedAt: string;
  completedAt?: string;
  completed: boolean;
  score?: number;
  durationMinutes: number;
  notes?: string;
}

export interface LearningSession {
  id: string;
  userId: string;
  userTopicId?: string;
  topicName?: string;
  questId: string;
  questTitle: string;
  skillName: string;
  type: QuestType;
  durationMinutes: number;
  completed: boolean;
  earnedXp: number;
  score?: number;
  notes?: string;
  completedAt: string;
}

export interface WorldRegion {
  id: string;
  worldId: string;
  userTopicId: string;
  topicName: string;
  topicCategory: Topic['category'];
  regionType: string;
  stage: number;
  progress: number;
  unlocked: boolean;
  theme: string;
  position: [number, number, number];
  updatedAt: string;
}

export type WeatherType = 'auto' | 'sunny' | 'gentle_rain' | 'breezy_mist' | 'twilight_aurora';

export interface World {
  id?: string;
  userId?: string;
  worldLevel?: number;
  level?: number;
  growthStage?: number;
  unlockedRegions?: string[];
  theme?: string;
  unlockedRegionsCount?: number;
  waterflowSpeed?: number;
  plantDensity?: number;
  activeThematicTheme?: string;
  weather?: WeatherType;
  ambientSoundEnabled?: boolean;
  timeOfDay: 'auto' | 'morning' | 'afternoon' | 'dusk' | 'night';
  updatedAt?: string;
}

export type WorldState = World;

export interface ReminderSettings {
  id?: string;
  userId?: string;
  enabled: boolean;
  preferredTime: PreferredTime;
  timeString: string;
  frequency: 'daily' | 'weekdays' | 'flexible';
  style: EncouragementStyle;
  quietStart: string;
  quietEnd: string;
  lastSentAt?: string;
}

export interface Achievement {
  id: string;
  key?: string;
  type?: string;
  title: string;
  description: string;
  icon: string;
  topicName?: string;
  isUnlocked: boolean;
  unlockedAt?: string;
}
