import { Quest, UserProfile, Goal, SkillProgress, LearningSession, QuestReflection } from '../../types';

export interface ScorerContext {
  profile: UserProfile;
  goals: Goal[];
  skills: SkillProgress[];
  sessions: LearningSession[];
  reflections?: QuestReflection[];
  activeTopicName?: string;
  activeTopicSlug?: string;
}

export interface ScoredQuestResult {
  quest: Quest;
  score: number;
  scoreBreakdown: {
    topicRelevance: number;
    goalRelevance: number;
    skillReadiness: number;
    difficultyMatch: number;
    learningStyleMatch: number;
    timeMatch: number;
    recentPerformance: number;
    weakSkillRelevance: number;
    reviewNecessity: number;
    variety: number;
    recencyPenalty: number;
  };
  whyExplanation: string;
}

/**
 * Calculates suitability score according to Section 15:
 * Topic relevance + Goal relevance + Skill readiness + Difficulty match +
 * Learning-style match + Time match + Recent performance + Weak skill relevance +
 * Review necessity + Variety + Recency
 */
export function scoreQuestSuitability(quest: Quest, ctx: ScorerContext): ScoredQuestResult {
  const breakdown = {
    topicRelevance: 0,
    goalRelevance: 0,
    skillReadiness: 0,
    difficultyMatch: 0,
    learningStyleMatch: 0,
    timeMatch: 0,
    recentPerformance: 0,
    weakSkillRelevance: 0,
    reviewNecessity: 0,
    variety: 0,
    recencyPenalty: 0,
  };

  const { profile, goals, skills, sessions, reflections = [], activeTopicName, activeTopicSlug } = ctx;

  // 1. TOPIC RELEVANCE (+25 max)
  const normActiveTopic = (activeTopicName || activeTopicSlug || '').toLowerCase().trim();
  const questTopic = (quest.topicName || quest.topicSlug || '').toLowerCase().trim();
  if (normActiveTopic && (questTopic.includes(normActiveTopic) || normActiveTopic.includes(questTopic))) {
    breakdown.topicRelevance = 25;
  } else if (profile.interests && profile.interests.some((i) => questTopic.includes(i.toLowerCase()))) {
    breakdown.topicRelevance = 18;
  } else {
    breakdown.topicRelevance = 5;
  }

  // 2. GOAL RELEVANCE (+20 max)
  const activeGoals = goals.filter((g) => g.status === 'active');
  const matchesGoal = activeGoals.some(
    (g) =>
      (g.topicName && questTopic.includes(g.topicName.toLowerCase())) ||
      (g.targetSkillName && quest.skillName.toLowerCase().includes(g.targetSkillName.toLowerCase())) ||
      (g.title && quest.title.toLowerCase().includes(g.title.toLowerCase()))
  );
  if (matchesGoal) {
    breakdown.goalRelevance = 20;
  } else if (activeGoals.length > 0) {
    breakdown.goalRelevance = 8;
  }

  // 3. SKILL READINESS (+15 max)
  const skillObj = skills.find(
    (s) => s.skillName === quest.skillName || s.name === quest.skillName
  );
  if (skillObj) {
    if (skillObj.status === 'active' || skillObj.status === 'available') {
      breakdown.skillReadiness = 15;
    } else if (skillObj.status === 'review') {
      breakdown.skillReadiness = 12;
    } else {
      breakdown.skillReadiness = 4;
    }
  } else {
    breakdown.skillReadiness = 10;
  }

  // 4. DIFFICULTY MATCH (Adaptive Level) (+20 max)
  // Calculate adaptive user level based on recent performance
  const recentCompleted = sessions.filter((s) => s.completed).slice(-4);
  const consecutiveHighScores = recentCompleted.filter((s) => (s.score || 80) >= 80).length;
  const recentStruggles = recentCompleted.filter((s) => (s.score || 80) < 65).length;

  let userAdaptiveLevel: 'Beginner' | 'Beginner+' | 'Intermediate' | 'Intermediate+' | 'Advanced' | 'Expert' = 'Beginner';
  const baseLvl = profile.overallLevel || profile.level || 1;
  if (baseLvl >= 6 || consecutiveHighScores >= 4) {
    userAdaptiveLevel = 'Advanced';
  } else if (baseLvl >= 4 || consecutiveHighScores >= 3) {
    userAdaptiveLevel = 'Intermediate+';
  } else if (baseLvl >= 2 || consecutiveHighScores >= 2) {
    userAdaptiveLevel = 'Beginner+';
  }

  const qDiff = (quest.difficulty || 'Beginner').toLowerCase();
  const userDiff = userAdaptiveLevel.toLowerCase();

  if (qDiff === userDiff) {
    breakdown.difficultyMatch = 20;
  } else if (
    (userDiff.includes('beginner') && qDiff.includes('beginner')) ||
    (userDiff.includes('intermediate') && qDiff.includes('intermediate'))
  ) {
    breakdown.difficultyMatch = 15;
  } else if (recentStruggles > 0 && qDiff === 'beginner') {
    breakdown.difficultyMatch = 18; // Give simpler quest when user struggled
  } else {
    breakdown.difficultyMatch = 5;
  }

  // 5. LEARNING STYLE MATCH (+15 max)
  const userStyles = profile.learningStyles || ['projects'];
  const qType = (quest.type || '').toLowerCase();
  if (userStyles.includes('projects') && (qType.includes('project') || qType.includes('build'))) {
    breakdown.learningStyleMatch = 15;
  } else if (userStyles.includes('puzzles') && (qType.includes('puzzle') || qType.includes('challenge'))) {
    breakdown.learningStyleMatch = 15;
  } else if (userStyles.includes('visual') && (quest.completionType === 'drawing_canvas' || qType.includes('visual'))) {
    breakdown.learningStyleMatch = 15;
  } else if (userStyles.includes('conversation') && (quest.completionType === 'speaking_recording' || qType.includes('conversation'))) {
    breakdown.learningStyleMatch = 15;
  } else {
    breakdown.learningStyleMatch = 8;
  }

  // 6. TIME MATCH (+15 max)
  const targetMinutes = profile.targetSessionMinutes || profile.sessionLengthMinutes || 15;
  const timeDiff = Math.abs(quest.estimatedMinutes - targetMinutes);
  if (timeDiff <= 3) {
    breakdown.timeMatch = 15;
  } else if (timeDiff <= 7) {
    breakdown.timeMatch = 10;
  } else {
    breakdown.timeMatch = 4;
  }

  // 7. RECENT PERFORMANCE (+10 max)
  if (consecutiveHighScores >= 2) {
    breakdown.recentPerformance = 10;
  } else {
    breakdown.recentPerformance = 5;
  }

  // 8. WEAK SKILL RELEVANCE (+15 max)
  const weakReflection = reflections.find(
    (r) => r.confidenceScore <= 2 && r.topicName.toLowerCase().includes(questTopic)
  );
  if (weakReflection && (qType.includes('practice') || qType.includes('review') || qType.includes('technique'))) {
    breakdown.weakSkillRelevance = 15;
  }

  // 9. REVIEW NECESSITY (+12 max)
  const lastSessionForSkill = sessions
    .filter((s) => s.skillName === quest.skillName)
    .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())[0];

  if (lastSessionForSkill) {
    const daysSince = (Date.now() - new Date(lastSessionForSkill.completedAt).getTime()) / (1000 * 60 * 60 * 24);
    if (daysSince >= 4) {
      breakdown.reviewNecessity = 12;
    }
  }

  // 10. VARIETY (+15 max)
  // Check yesterday's / last quest type
  const lastSession = sessions[sessions.length - 1];
  if (lastSession) {
    if (lastSession.type !== quest.type) {
      breakdown.variety = 15;
    } else {
      breakdown.variety = 3; // Penalize repeating exact same activity back-to-back
    }
  } else {
    breakdown.variety = 10;
  }

  // 11. RECENCY PENALTY (-50 if completed in the last 2 days)
  const recentMatch = sessions
    .filter((s) => s.questId === quest.id)
    .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())[0];

  if (recentMatch) {
    const hoursSince = (Date.now() - new Date(recentMatch.completedAt).getTime()) / (1000 * 60 * 60);
    if (hoursSince < 48) {
      breakdown.recencyPenalty = -60;
    } else if (hoursSince < 96) {
      breakdown.recencyPenalty = -25;
    }
  }

  // Total score
  const totalScore =
    breakdown.topicRelevance +
    breakdown.goalRelevance +
    breakdown.skillReadiness +
    breakdown.difficultyMatch +
    breakdown.learningStyleMatch +
    breakdown.timeMatch +
    breakdown.recentPerformance +
    breakdown.weakSkillRelevance +
    breakdown.reviewNecessity +
    breakdown.variety +
    breakdown.recencyPenalty;

  // Personalized explanation
  let whyExplanation = quest.whyThisQuest;
  if (breakdown.weakSkillRelevance > 0) {
    whyExplanation = `Calibrated to reinforce ${quest.skillName} based on your recent reflection rating.`;
  } else if (breakdown.difficultyMatch >= 18 && consecutiveHighScores >= 2) {
    whyExplanation = `Adaptive step up: you have shown great consistency, so this ${quest.difficulty} quest will stretch your skills pleasantly.`;
  } else if (breakdown.variety >= 15 && lastSession) {
    whyExplanation = `Refreshing your learning rhythm with a ${quest.type.toLowerCase()} today.`;
  }

  return {
    quest,
    score: totalScore,
    scoreBreakdown: breakdown,
    whyExplanation,
  };
}

/**
 * Evaluates all candidate quests and returns the optimal top match.
 */
export function recommendTopQuest(allCandidates: Quest[], ctx: ScorerContext): ScoredQuestResult {
  if (allCandidates.length === 0) {
    const fallbackQuest: Quest = {
      id: `quest_discovery_${Date.now()}`,
      skillName: ctx.activeTopicName || 'General',
      title: `Curious Step in ${ctx.activeTopicName || 'Learning'}`,
      description: 'A focused micro-session exploring foundational concepts.',
      type: 'lesson',
      estimatedMinutes: 10,
      difficulty: 'Beginner',
      rewardXp: 25,
      whyThisQuest: 'A gentle exploration to cultivate understanding.',
      steps: [
        {
          id: 'step_intro',
          title: 'Foundational Observation',
          instruction: 'Explore the core principle of this learning area.',
          type: 'concept',
          content: 'Learning happens best through tiny, sustained moments of focus and reflection.',
        },
      ],
    };
    return {
      quest: fallbackQuest,
      score: 100,
      scoreBreakdown: {
        topicRelevance: 25,
        goalRelevance: 20,
        skillReadiness: 15,
        difficultyMatch: 20,
        learningStyleMatch: 10,
        timeMatch: 10,
        recentPerformance: 0,
        weakSkillRelevance: 0,
        reviewNecessity: 0,
        variety: 0,
        recencyPenalty: 0,
      },
      whyExplanation: fallbackQuest.whyThisQuest,
    };
  }

  const scored = allCandidates.map((q) => scoreQuestSuitability(q, ctx));
  scored.sort((a, b) => b.score - a.score);

  return scored[0];
}

/**
 * Gathers candidate quests provided from database or fallback pool
 */
export function getAllAvailableQuests(providedQuests: Quest[] = []): Quest[] {
  return providedQuests;
}
