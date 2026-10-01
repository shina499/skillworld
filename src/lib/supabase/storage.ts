import {
  UserProfile,
  UserTopic,
  TopicPreference,
  TopicAnswer,
  Goal,
  SkillNode,
  Quest,
  LearningSession,
  World,
  WorldRegion,
  ReminderSettings,
  Achievement,
  QuestReflection,
} from '../../types';
import { ALL_PREDEFINED_TOPIC_CONFIGS } from '../../data/topicConfigs';
import { PROFESSIONAL_QUESTS } from '../../data/professionalQuests';

export interface FullGardenState {
  profile: UserProfile;
  userTopics: UserTopic[];
  topicPreferences: TopicPreference[];
  topicAnswers: TopicAnswer[];
  goals: Goal[];
  skills: SkillNode[];
  quests: Quest[];
  sessions: LearningSession[];
  world: World;
  worldRegions: WorldRegion[];
  reminders: ReminderSettings;
  achievements: Achievement[];
  reflections: QuestReflection[];
}

const STORAGE_KEY = 'skillgarden_real_v2';

const INITIAL_PROFILE: UserProfile = {
  id: 'gardener_local_master',
  email: 'gardener@skillgarden.app',
  displayName: 'Alex',
  avatar: '🌱',
  overallIdentity: 'Creative Builder',
  overallLevel: 3,
  totalXp: 180,
  encouragementStyle: 'gentle',
  preferredTime: 'evening',
  targetSessionMinutes: 15,
  hasCompletedOnboarding: true,
  activeDaysThisWeek: 4,
  lastActiveDate: new Date().toISOString(),
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const INITIAL_TOPICS: UserTopic[] = [
  {
    id: 'ut_prog_1',
    userId: 'gardener_local_master',
    topicId: 'programming',
    topicName: 'Programming',
    topicIcon: '💻',
    category: 'tech',
    status: 'active',
    level: 3,
    xp: 120,
    confidence: 3,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'ut_draw_2',
    userId: 'gardener_local_master',
    topicId: 'drawing',
    topicName: 'Drawing & Art',
    topicIcon: '🎨',
    category: 'art',
    status: 'active',
    level: 2,
    xp: 60,
    confidence: 2,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const INITIAL_GOALS: Goal[] = [
  {
    id: 'goal_prog_1',
    userId: 'gardener_local_master',
    userTopicId: 'ut_prog_1',
    topicName: 'Programming',
    title: 'Build interactive websites & small tools',
    description: 'Learn modern JavaScript and layout logic with tiny daily steps.',
    motivation: ['For a personal project', 'Career / Future work'],
    target: 'Full website launch',
    status: 'active',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'goal_draw_2',
    userId: 'gardener_local_master',
    userTopicId: 'ut_draw_2',
    topicName: 'Drawing & Art',
    title: 'Draw dynamic figures and character expressions',
    description: 'Master gesture lines and 3D forms without stiff wrist tension.',
    motivation: ['Pure creative joy & relaxation'],
    target: 'Complete character sketch',
    status: 'active',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const INITIAL_SKILLS: SkillNode[] = [
  ...ALL_PREDEFINED_TOPIC_CONFIGS.programming.initialSkills.map((s, idx) => ({
    ...s,
    id: `skill_p_${idx + 1}`,
    userTopicId: 'ut_prog_1',
    status: idx === 0 ? ('completed' as const) : idx === 1 ? ('active' as const) : idx === 2 ? ('available' as const) : ('locked' as const),
    xp: idx === 0 ? 80 : idx === 1 ? 40 : 0,
    level: idx === 0 ? 2 : 1,
    progressPercentage: idx === 0 ? 100 : idx === 1 ? 45 : 0,
  })),
  ...ALL_PREDEFINED_TOPIC_CONFIGS.drawing.initialSkills.map((s, idx) => ({
    ...s,
    id: `skill_d_${idx + 1}`,
    userTopicId: 'ut_draw_2',
    status: idx === 0 ? ('active' as const) : idx === 1 ? ('available' as const) : ('locked' as const),
    xp: idx === 0 ? 60 : 0,
    level: 1,
    progressPercentage: idx === 0 ? 60 : 0,
  })),
];

const INITIAL_QUESTS: Quest[] = [
  ...PROFESSIONAL_QUESTS,
  ...ALL_PREDEFINED_TOPIC_CONFIGS.programming.starterQuests('ut_prog_1'),
  ...ALL_PREDEFINED_TOPIC_CONFIGS.drawing.starterQuests('ut_draw_2'),
];

const INITIAL_SESSIONS: LearningSession[] = [
  {
    id: 'sess_1',
    userId: 'gardener_local_master',
    userTopicId: 'ut_prog_1',
    topicName: 'Programming',
    questId: 'quest_prog_var_init',
    questTitle: 'Store Your First Value in Code',
    skillName: 'Variables & State',
    type: 'lesson',
    durationMinutes: 7,
    completed: true,
    earnedXp: 25,
    score: 100,
    notes: 'Learned const vs let! Made total sense.',
    completedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'sess_2',
    userId: 'gardener_local_master',
    userTopicId: 'ut_draw_2',
    topicName: 'Drawing & Art',
    questId: 'quest_draw_gesture_init',
    questTitle: 'The 60-Second Gesture Line',
    skillName: 'Gesture & Rhythm',
    type: 'practice',
    durationMinutes: 8,
    completed: true,
    earnedXp: 25,
    score: 100,
    notes: 'Drawing from shoulder gives fluid motion.',
    completedAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

const INITIAL_WORLD: World = {
  id: 'world_master_1',
  userId: 'gardener_local_master',
  worldLevel: 3,
  theme: 'floating_archipelago',
  unlockedRegionsCount: 2,
  timeOfDay: 'auto',
  updatedAt: new Date().toISOString(),
};

const INITIAL_WORLD_REGIONS: WorldRegion[] = [
  {
    id: 'wr_prog',
    worldId: 'world_master_1',
    userTopicId: 'ut_prog_1',
    topicName: 'Programming',
    topicCategory: 'tech',
    regionType: 'coding_lab',
    stage: 2,
    progress: 45,
    unlocked: true,
    theme: 'tech',
    position: [-3.4, 0.05, 0.5],
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'wr_draw',
    worldId: 'world_master_1',
    userTopicId: 'ut_draw_2',
    topicName: 'Drawing & Art',
    topicCategory: 'art',
    regionType: 'art_studio',
    stage: 2,
    progress: 30,
    unlocked: true,
    theme: 'art',
    position: [3.4, 0.05, 0.5],
    updatedAt: new Date().toISOString(),
  },
];

const INITIAL_REMINDERS: ReminderSettings = {
  enabled: true,
  preferredTime: 'evening',
  timeString: '19:30',
  frequency: 'daily',
  style: 'gentle',
  quietStart: '22:00',
  quietEnd: '08:00',
  lastSentAt: undefined,
};

const INITIAL_ACHIEVEMENTS: Achievement[] = [
  { id: 'first_step', key: 'first_step', title: 'First Step', description: 'Completed your very first quest.', icon: '🌱', isUnlocked: true, unlockedAt: new Date(Date.now() - 86400000 * 2).toISOString() },
  { id: 'polymath', key: 'polymath', title: 'Curious Mind', description: 'Explored multiple distinct learning domains.', icon: '🧠', isUnlocked: true, unlockedAt: new Date(Date.now() - 86400000).toISOString() },
  { id: 'builder', key: 'builder', title: 'Builder', description: 'Completed your first hands-on project quest.', icon: '🏗️', isUnlocked: false },
  { id: 'rhythm', key: 'rhythm', title: 'Gentle Rhythm', description: 'Learned across multiple days without guilt.', icon: '🌿', isUnlocked: true, unlockedAt: new Date().toISOString() },
  { id: 'comeback', key: 'comeback', title: 'Comeback Star', description: 'Returned after a break without losing a step.', icon: '🌟', isUnlocked: false },
  { id: 'deep_dive', key: 'deep_dive', title: 'Deep Dive', description: 'Reached Level 3 in a dedicated topic district.', icon: '🏆', isUnlocked: true, unlockedAt: new Date().toISOString() },
];

export class LocalGardenStorage {
  load(): FullGardenState {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (e) {
      console.warn('Failed to parse garden state from localStorage', e);
    }

    return {
      profile: { ...INITIAL_PROFILE },
      userTopics: [...INITIAL_TOPICS],
      topicPreferences: [],
      topicAnswers: [],
      goals: [...INITIAL_GOALS],
      skills: [...INITIAL_SKILLS],
      quests: [...INITIAL_QUESTS],
      sessions: [...INITIAL_SESSIONS],
      world: { ...INITIAL_WORLD },
      worldRegions: [...INITIAL_WORLD_REGIONS],
      reminders: { ...INITIAL_REMINDERS },
      achievements: [...INITIAL_ACHIEVEMENTS],
      reflections: [],
    };
  }

  save(data: FullGardenState): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('Failed to save to localStorage', e);
    }
  }

  reset(): FullGardenState {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}

    const fresh: FullGardenState = {
      profile: {
        ...INITIAL_PROFILE,
        hasCompletedOnboarding: false,
        totalXp: 0,
        overallLevel: 1,
        activeDaysThisWeek: 1,
      },
      userTopics: [],
      topicPreferences: [],
      topicAnswers: [],
      goals: [],
      skills: [],
      quests: [...PROFESSIONAL_QUESTS],
      sessions: [],
      world: {
        ...INITIAL_WORLD,
        worldLevel: 1,
        unlockedRegionsCount: 0,
      },
      worldRegions: [],
      reminders: { ...INITIAL_REMINDERS },
      achievements: INITIAL_ACHIEVEMENTS.map((a) => ({ ...a, isUnlocked: false })),
      reflections: [],
    };

    this.save(fresh);
    return fresh;
  }
}

export const localGardenStore = new LocalGardenStorage();
