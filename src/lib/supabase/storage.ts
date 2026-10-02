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

const STORAGE_KEY = 'skillgarden_real_v3';

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
  {
    id: 'skill_p_1',
    userTopicId: 'ut_prog_1',
    topicSlug: 'programming',
    name: 'Variables & State',
    description: 'Store and manipulate reactive data with const and let.',
    orderIndex: 1,
    difficulty: 'Beginner',
    status: 'completed',
    progressPercentage: 100,
    level: 2,
    xp: 80,
  },
  {
    id: 'skill_p_2',
    userTopicId: 'ut_prog_1',
    topicSlug: 'programming',
    name: 'Functions & Logic',
    description: 'Reusable algorithmic blocks and input transformations.',
    orderIndex: 2,
    difficulty: 'Beginner',
    status: 'active',
    progressPercentage: 45,
    level: 1,
    xp: 40,
  },
  {
    id: 'skill_p_3',
    userTopicId: 'ut_prog_1',
    topicSlug: 'programming',
    name: 'Arrays & Collections',
    description: 'Map, filter, and stateful list transformations.',
    orderIndex: 3,
    difficulty: 'Beginner+',
    status: 'available',
    progressPercentage: 0,
    level: 1,
    xp: 0,
  },
  {
    id: 'skill_d_1',
    userTopicId: 'ut_draw_2',
    topicSlug: 'drawing',
    name: 'Gesture & Rhythm',
    description: 'Capturing natural fluid motion from the shoulder without wrist stiffness.',
    orderIndex: 1,
    difficulty: 'Beginner',
    status: 'active',
    progressPercentage: 60,
    level: 1,
    xp: 60,
  },
  {
    id: 'skill_d_2',
    userTopicId: 'ut_draw_2',
    topicSlug: 'drawing',
    name: 'Shape-to-Form Construction',
    description: 'Building solid characters using 3D boxes, cylinders, and spheres.',
    orderIndex: 2,
    difficulty: 'Beginner',
    status: 'available',
    progressPercentage: 0,
    level: 1,
    xp: 0,
  },
];

const INITIAL_QUESTS: Quest[] = [
  {
    id: 'quest_prog_debug_calc',
    userTopicId: 'ut_prog_1',
    topicName: 'Programming',
    topicSlug: 'programming',
    skillName: 'Functions & Logic',
    title: 'Debug the Broken Calculator Logic',
    description: 'A junior colleague wrote a price calculator that outputs NaN and strings instead of numbers. Spot and fix the type-coercion bug.',
    objective: 'Identify and fix the bug in a simple calculation function so all 3 unit test cases pass cleanly.',
    categoryTypeBadge: 'DEBUGGING CHALLENGE',
    type: 'Debugging challenge',
    difficulty: 'Beginner',
    estimatedMinutes: 8,
    rewardXp: 30,
    whyThisQuest: 'Debugging is 70% of real-world software engineering. Spotting type coercion trains sharp attention to detail.',
    steps: [
      {
        id: 'step1',
        title: 'Inspect the Buggy Code',
        instruction: 'Look at how total is parsed. Number() or parseInt() is missing.',
        type: 'concept',
        content: 'In JavaScript, adding an empty string or passing an unparsed input can trigger string concatenation instead of numeric addition.',
      },
      {
        id: 'step2',
        title: 'Fix the Calculation',
        instruction: 'Wrap the parameters in Number() and ensure accurate addition.',
        type: 'interactive_code',
        initialCode: 'function calculateTotal(subtotal, taxRate) {\n  // Fix: taxRate and subtotal might be strings\n  return Number(subtotal) * (1 + Number(taxRate));\n}',
        solutionKeywords: ['Number', 'subtotal', 'taxRate'],
      },
    ],
  },
  {
    id: 'quest_prog_cart_array',
    userTopicId: 'ut_prog_1',
    topicName: 'Programming',
    topicSlug: 'programming',
    skillName: 'Arrays & Collections',
    title: 'Build a Dynamic Shopping Cart Array',
    description: 'Write a clean array reducer function that calculates total price and applies a discount code if total exceeds $50.',
    objective: 'Construct an immutable cart calculation pipeline that correctly aggregates item totals and returns a final receipt object.',
    categoryTypeBadge: 'CODING CHALLENGE',
    type: 'Coding challenge',
    difficulty: 'Beginner+',
    estimatedMinutes: 12,
    rewardXp: 35,
    whyThisQuest: 'Array manipulation is foundational for modern web development. This prepares you for data rendering.',
    steps: [
      {
        id: 'step1',
        title: 'Calculate Total Price',
        instruction: 'Iterate through cart items multiplying price by quantity.',
        type: 'concept',
        content: 'Arrays in modern JavaScript utilize array.reduce() or for...of loops for clean aggregation.',
      },
      {
        id: 'step2',
        title: 'Complete Cart Function',
        instruction: 'Implement the cart total calculation.',
        type: 'interactive_code',
        initialCode: 'function getCartTotal(items) {\n  return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);\n}',
        solutionKeywords: ['reduce', 'price', 'quantity'],
      },
    ],
  },
  {
    id: 'quest_draw_shape_char',
    userTopicId: 'ut_draw_2',
    topicName: 'Drawing & Art',
    topicSlug: 'drawing',
    skillName: 'Shape-to-Form Construction',
    title: 'Shape-to-Character Construction',
    description: 'Turn basic geometric silhouettes (a trapezoid, a circle, and a bean shape) into expressive character faces.',
    objective: 'Draw 3 character heads by layering facial features over fundamental silhouette primitives on the interactive canvas.',
    categoryTypeBadge: 'DRAWING EXERCISE',
    type: 'Drawing exercise',
    difficulty: 'Beginner',
    estimatedMinutes: 10,
    rewardXp: 30,
    whyThisQuest: 'All professional illustration begins with shape language. Triangular shapes feel energetic, circular shapes feel gentle.',
    steps: [
      {
        id: 'step1',
        title: 'Primitive Shapes as Anchors',
        instruction: 'Notice how animators define character personality using primitive shapes before adding any lines.',
        type: 'concept',
        content: 'Round shapes indicate warmth. Square shapes convey stability. Angular wedges suggest speed.',
      },
      {
        id: 'step2',
        title: 'Sketch on Digital Canvas',
        instruction: 'Use the canvas below to sketch 3 facial silhouettes.',
        type: 'drawing_canvas',
        drawingPrompt: 'Sketch 3 character heads starting with basic geometric shapes (a circle, an egg, and a rounded wedge).',
      },
    ],
  },
];

const INITIAL_SESSIONS: LearningSession[] = [
  {
    id: 'sess_1',
    userId: 'gardener_local_master',
    userTopicId: 'ut_prog_1',
    topicName: 'Programming',
    questId: 'quest_prog_debug_calc',
    questTitle: 'Debug the Broken Calculator Logic',
    skillName: 'Functions & Logic',
    type: 'Debugging challenge',
    durationMinutes: 7,
    completed: true,
    earnedXp: 30,
    score: 100,
    notes: 'Learned type casting with Number()! Made total sense.',
    completedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'sess_2',
    userId: 'gardener_local_master',
    userTopicId: 'ut_draw_2',
    topicName: 'Drawing & Art',
    questId: 'quest_draw_shape_char',
    questTitle: 'Shape-to-Character Construction',
    skillName: 'Shape-to-Form Construction',
    type: 'Drawing exercise',
    durationMinutes: 8,
    completed: true,
    earnedXp: 30,
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
  weather: 'auto',
  ambientSoundEnabled: true,
  autoRotate: false,
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
    regionType: 'atelier_studio',
    stage: 1,
    progress: 20,
    unlocked: true,
    theme: 'art',
    position: [3.4, 0.05, -0.5],
    updatedAt: new Date().toISOString(),
  },
];

const INITIAL_REMINDERS: ReminderSettings = {
  id: 'rem_master',
  userId: 'gardener_local_master',
  enabled: true,
  preferredTime: 'evening',
  timeString: '19:30',
  frequency: 'daily',
  style: 'gentle',
  quietStart: '22:00',
  quietEnd: '08:00',
};

const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_step',
    key: 'first_step',
    title: 'First Step',
    description: 'Completed your very first micro quest.',
    icon: '🌱',
    isUnlocked: true,
    unlockedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'polymath',
    key: 'polymath',
    title: 'Curious Mind',
    description: 'Explored multiple learning areas.',
    icon: '🧠',
    isUnlocked: true,
    unlockedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'builder',
    key: 'builder',
    title: 'Builder',
    description: 'Completed your first hands-on challenge.',
    icon: '🏗️',
    isUnlocked: true,
    unlockedAt: new Date().toISOString(),
  },
  {
    id: 'rhythm',
    key: 'rhythm',
    title: 'Gentle Rhythm',
    description: 'Learned across multiple days without guilt.',
    icon: '🌿',
    isUnlocked: false,
  },
];

export class LocalGardenStorage {
  load(): FullGardenState {
    if (typeof window === 'undefined') {
      return this.getDefault();
    }
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.profile && parsed.userTopics) {
          return {
            ...this.getDefault(),
            ...parsed,
          };
        }
      }
    } catch (e) {
      console.warn('Failed to load local garden state', e);
    }
    const def = this.getDefault();
    this.save(def);
    return def;
  }

  save(state: FullGardenState): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save garden state', e);
    }
  }

  reset(): FullGardenState {
    const fresh: FullGardenState = {
      profile: {
        ...INITIAL_PROFILE,
        overallLevel: 1,
        totalXp: 0,
        activeDaysThisWeek: 1,
        hasCompletedOnboarding: false,
        lastActiveDate: new Date().toISOString(),
      },
      userTopics: [],
      topicPreferences: [],
      topicAnswers: [],
      goals: [],
      skills: [],
      quests: INITIAL_QUESTS,
      sessions: [],
      world: {
        ...INITIAL_WORLD,
        worldLevel: 1,
        unlockedRegionsCount: 0,
        autoRotate: false,
      },
      worldRegions: [],
      reminders: INITIAL_REMINDERS,
      achievements: INITIAL_ACHIEVEMENTS.map((a) => ({ ...a, isUnlocked: false })),
      reflections: [],
    };
    this.save(fresh);
    return fresh;
  }

  getDefault(): FullGardenState {
    return {
      profile: INITIAL_PROFILE,
      userTopics: INITIAL_TOPICS,
      topicPreferences: [],
      topicAnswers: [],
      goals: INITIAL_GOALS,
      skills: INITIAL_SKILLS,
      quests: INITIAL_QUESTS,
      sessions: INITIAL_SESSIONS,
      world: INITIAL_WORLD,
      worldRegions: INITIAL_WORLD_REGIONS,
      reminders: INITIAL_REMINDERS,
      achievements: INITIAL_ACHIEVEMENTS,
      reflections: [],
    };
  }
}

export const localGardenStore = new LocalGardenStorage();
