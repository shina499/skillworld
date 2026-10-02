import {
  UserProfile,
  Goal,
  SkillProgress,
  Quest,
  LearningSession,
  Achievement,
  WorldState,
  QuestReflection,
} from '../../types';
import { generateComebackQuest } from './questGenerator';
import { recommendTopQuest, getAllAvailableQuests } from './recommendationScorer';

export interface RecommendationResult {
  quest: Quest;
  isComeback: boolean;
  daysAway: number;
  whyExplanation: string;
}

export class PersonalizationEngine {
  /**
   * Evaluates the user's state and selects the optimal next quest using 11-factor scoring
   */
  getTodayRecommendation(
    profile: UserProfile,
    goals: Goal[],
    skills: SkillProgress[],
    sessions: LearningSession[],
    reflections?: QuestReflection[],
    activeTopicName?: string,
    candidateQuests?: Quest[]
  ): RecommendationResult {
    // 1. Calculate inactivity
    const now = Date.now();
    const lastSessionDate = sessions.length > 0
      ? new Date(sessions[sessions.length - 1].completedAt).getTime()
      : new Date(profile.lastActiveDate || profile.createdAt).getTime();

    const diffHours = (now - lastSessionDate) / (1000 * 60 * 60);
    const daysAway = Math.max(0, Math.floor(diffHours / 24));
    const isComeback = daysAway >= 3;

    // If comeback, provide gentle guilt-free warm up
    if (isComeback) {
      const primaryGoal = goals.find((g) => g.status === 'active') || goals[0];
      const targetSkill = primaryGoal?.targetSkillName || skills[0]?.skillName || 'General';
      const comebackQuest = generateComebackQuest(targetSkill, daysAway);
      return {
        quest: comebackQuest,
        isComeback: true,
        daysAway,
        whyExplanation: `Welcome back 🌿. It has been ${daysAway} days since your last session. Your progress is completely safe. Let's do a gentle 3-minute warm-up.`,
      };
    }

    // 2. Gather candidates
    const allPool = candidateQuests && candidateQuests.length > 0 ? candidateQuests : getAllAvailableQuests();

    // 3. Score candidates with Section 15 formula
    const topResult = recommendTopQuest(allPool, {
      profile,
      goals,
      skills,
      sessions,
      reflections,
      activeTopicName,
    });

    return {
      quest: topResult.quest,
      isComeback: false,
      daysAway,
      whyExplanation: topResult.whyExplanation,
    };
  }

  /**
   * Evaluates achievements after a completed quest
   */
  checkAchievements(
    completedQuest: Quest,
    sessions: LearningSession[],
    skills: SkillProgress[],
    achievements: Achievement[],
    worldState: WorldState
  ): Achievement[] {
    const updated = achievements.map((a) => ({ ...a }));
    const nowIso = new Date().toISOString();

    const totalCompleted = sessions.filter((s) => s.completed).length + 1; // +1 for current

    // First Step
    const firstStep = updated.find((a) => a.id === 'first_step');
    if (firstStep && !firstStep.isUnlocked && totalCompleted >= 1) {
      firstStep.isUnlocked = true;
      firstStep.unlockedAt = nowIso;
    }

    // Builder
    const builder = updated.find((a) => a.id === 'builder');
    if (builder && !builder.isUnlocked && completedQuest.type === 'build') {
      builder.isUnlocked = true;
      builder.unlockedAt = nowIso;
    }

    // Curious Mind (explored 2+ skills)
    const curious = updated.find((a) => a.id === 'curious_mind');
    const distinctSkills = new Set([...sessions.map((s) => s.skillName), completedQuest.skillName]);
    if (curious && !curious.isUnlocked && distinctSkills.size >= 2) {
      curious.isUnlocked = true;
      curious.unlockedAt = nowIso;
    }

    // Finding Your Rhythm (3+ distinct days)
    const rhythm = updated.find((a) => a.id === 'finding_rhythm');
    if (rhythm && !rhythm.isUnlocked && totalCompleted >= 3) {
      rhythm.isUnlocked = true;
      rhythm.unlockedAt = nowIso;
    }

    // Comeback
    const comeback = updated.find((a) => a.id === 'comeback');
    if (comeback && !comeback.isUnlocked && completedQuest.type === 'comeback') {
      comeback.isUnlocked = true;
      comeback.unlockedAt = nowIso;
    }

    // Explorer (unlocked more than main island)
    const explorer = updated.find((a) => a.id === 'explorer');
    if (explorer && !explorer.isUnlocked && (worldState.unlockedRegions || []).length > 1) {
      explorer.isUnlocked = true;
      explorer.unlockedAt = nowIso;
    }

    // Deep dive (any skill >= level 3)
    const deepDive = updated.find((a) => a.id === 'deep_dive');
    const hasHighLevelSkill = skills.some((s) => s.level >= 3);
    if (deepDive && !deepDive.isUnlocked && hasHighLevelSkill) {
      deepDive.isUnlocked = true;
      deepDive.unlockedAt = nowIso;
    }

    return updated;
  }

  /**
   * Calculates new world level and visual growth stage based on XP
   */
  calculateWorldGrowth(totalXp: number, currentUnlocked: string[]): {
    level: number;
    growthStage: number;
    unlockedRegions: string[];
  } {
    // Every 80 XP = 1 level
    const level = Math.max(1, Math.floor(totalXp / 80) + 1);
    const growthStage = Math.min(10, Math.max(1, Math.floor(level / 1.5) + 1));

    const regions = new Set(currentUnlocked);
    regions.add('main_island');

    if (level >= 2) regions.add('tech_lab');
    if (level >= 3) regions.add('art_grove');
    if (level >= 5) regions.add('library_pergola');
    if (level >= 7) regions.add('music_pavilion');
    if (level >= 10) regions.add('zen_gardens');

    return {
      level,
      growthStage,
      unlockedRegions: Array.from(regions),
    };
  }
}

export const personalizationEngine = new PersonalizationEngine();
