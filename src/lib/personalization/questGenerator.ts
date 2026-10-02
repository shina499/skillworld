import { Quest, QuestType, LearningStyle } from '../../types';

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

export function generateComebackQuest(skillName: string, daysAway: number): Quest {
  return {
    id: `comeback_${Date.now()}`,
    skillName,
    title: `Welcome Back: A Gentle 3-Minute Refresh in ${skillName}`,
    description: `It has been ${daysAway} days. No pressure, no guilt—just a cozy return to your garden.`,
    type: 'comeback',
    estimatedMinutes: 3,
    difficulty: 'beginner',
    rewardXp: 30,
    whyThisQuest: 'Breaks happen! A warm, guilt-free micro-step gets the rhythm back instantly.',
    steps: [
      {
        id: 'cb_1',
        title: 'Welcome Back',
        instruction: 'Take a calm breath. Your knowledge did not vanish.',
        type: 'concept',
        content: `Learning is cyclical like a garden. Returning after ${daysAway} days is a success.\n\nTake two minutes to reconnect with ${skillName} without performance anxiety.`,
      },
      {
        id: 'cb_2',
        title: 'Spark of Curiosity',
        instruction: 'What sounds most appealing right now?',
        type: 'interactive_choice',
        options: [
          'Review a concept I previously understood well',
          'Explore a completely fresh idea for 2 minutes',
          'Just wander and observe without testing myself',
        ],
        correctOptionIndex: 0,
        explanation: 'Any direction is valid—welcome back to your learning sanctuary!',
      },
      {
        id: 'cb_3',
        title: 'One-Sentence Check-in',
        instruction: 'How does it feel to return today?',
        type: 'reflection',
        promptQuestion: 'A single word or phrase (e.g., curious, calm, ready).',
      },
    ],
  };
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

export function pickOrGenerateQuest(ctx: RecommendationContext, candidateQuests: Quest[] = []): Quest {
  // 1. Check for Comeback condition (inactivity >= 3 days)
  if (ctx.daysSinceLastActivity >= 3) {
    return generateComebackQuest(ctx.skillName, ctx.daysSinceLastActivity);
  }

  // 2. Check candidate quests from database
  if (candidateQuests && candidateQuests.length > 0) {
    const uncompleted = candidateQuests.filter((q) => !ctx.completedQuestIds.includes(q.id));
    if (uncompleted.length > 0) {
      let candidate = uncompleted[0];
      if (ctx.consecutiveSuccessCount >= 2 && uncompleted.length > 1) {
        const harder = uncompleted.find(
          (q) => q.difficulty === 'intermediate' || q.type === 'challenge' || q.type === 'build'
        );
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
