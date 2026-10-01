import { Quest, DifficultyLevel, QuestType, LearningStyle } from '../../types';
import { SEED_QUESTS, generateComebackQuest } from '../../data/seedQuests';

export interface RecommendationContext {
  skillName: string;
  category: string;
  preferredMinutes: number;
  learningStyles: LearningStyle[];
  completedQuestIds: string[];
  daysSinceLastActivity: number;
  consecutiveSuccessCount: number;
  recentAbandonCount: number;
  currentLevel: number;
}

export function generateCustomQuestForGoal(
  goalTitle: string,
  skillName: string,
  preferredMinutes: number,
  learningStyles: LearningStyle[],
  level: number
): Quest {
  const isBuilder = learningStyles.includes('projects');
  const isGamer = learningStyles.includes('games') || learningStyles.includes('puzzles');
  const isVisual = learningStyles.includes('visual');

  const type: QuestType = isBuilder ? 'build' : isGamer ? 'challenge' : isVisual ? 'learn' : 'practice';
  const duration = Math.min(Math.max(preferredMinutes, 5), 20);

  return {
    id: `custom_${skillName.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`,
    skillName,
    title: `Tiny Step in ${skillName}: Core Discovery`,
    description: `A focused ${duration}-minute exploration tailored to your goal "${goalTitle}".`,
    type,
    estimatedMinutes: duration,
    difficulty: level <= 1 ? 'beginner' : level <= 3 ? 'intermediate' : 'advanced',
    rewardXp: duration >= 15 ? 40 : 25,
    whyThisQuest: `Matched to your goal "${goalTitle}" and your preferred ${duration}-minute learning pace.`,
    steps: [
      {
        id: 'c_s1',
        title: `The 1-Minute Core Concept`,
        instruction: `Break down ${skillName} into one manageable mental model.`,
        type: 'concept',
        content: `When exploring ${skillName}, experts don't try to memorize everything at once. They focus on the single lever that moves 80% of results.\n\nTake two minutes to visualize how this connects directly to your goal: "${goalTitle}".`,
      },
      {
        id: 'c_s2',
        title: `Active Exploration Choice`,
        instruction: `Which aspect of ${skillName} would feel most satisfying to practice today?`,
        type: 'interactive_choice',
        options: [
          'Deconstructing a working example or finished project',
          'Practicing one foundational movement or exercise',
          'Experimenting with a mini creative test of my own',
          'Writing down three core questions to look into next',
        ],
        correctOptionIndex: 2,
        explanation: 'Creative play and experimentation build direct neural pathways and make learning stick!',
      },
      {
        id: 'c_s3',
        title: `Micro Reflection Log`,
        instruction: `What is one takeaway or spark you noticed about ${skillName}?`,
        type: 'reflection',
        promptQuestion: `Write a single sentence about what you discovered or want to try next in ${skillName}.`,
      },
    ],
  };
}

export function pickOrGenerateQuest(ctx: RecommendationContext): Quest {
  // 1. Check for Comeback condition (inactivity >= 3 days)
  if (ctx.daysSinceLastActivity >= 3) {
    return generateComebackQuest(ctx.skillName, ctx.daysSinceLastActivity);
  }

  // 2. Check if we have pre-authored curated quests for this domain
  const normalizedKey = ctx.skillName.toLowerCase().replace(/[^a-z]/g, '');
  let domainQuests: Quest[] | undefined;

  for (const [key, quests] of Object.entries(SEED_QUESTS)) {
    if (normalizedKey.includes(key) || key.includes(normalizedKey)) {
      domainQuests = quests;
      break;
    }
  }

  if (domainQuests && domainQuests.length > 0) {
    // Find uncompleted quest
    const uncompleted = domainQuests.filter((q) => !ctx.completedQuestIds.includes(q.id));
    if (uncompleted.length > 0) {
      // Pick best matching time and difficulty
      let candidate = uncompleted[0];

      // If user had several successes, favor intermediate/challenge
      if (ctx.consecutiveSuccessCount >= 2 && uncompleted.length > 1) {
        const harder = uncompleted.find((q) => q.difficulty === 'intermediate' || q.type === 'challenge' || q.type === 'build');
        if (harder) candidate = harder;
      }

      return candidate;
    }
  }

  // 3. Dynamic generator for custom/new goals
  return generateCustomQuestForGoal(
    `Explore ${ctx.skillName}`,
    ctx.skillName,
    ctx.preferredMinutes,
    ctx.learningStyles,
    ctx.currentLevel
  );
}
