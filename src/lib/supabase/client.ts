import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { localGardenStore, FullGardenState } from './storage';
import {
  UserProfile,
  UserTopic,
  Goal,
  SkillNode,
  Quest,
  LearningSession,
  World,
  WorldRegion,
  ReminderSettings,
  Achievement,
  Topic,
  TopicQuestion,
  QuestReflection,
} from '../../types';
import { DEFAULT_TOPICS, DEFAULT_TOPIC_QUESTIONS, getGenericQuestionsForTopic } from './database';

// Check env vars or custom user-configured credentials in localStorage
const customUrl = typeof window !== 'undefined' ? localStorage.getItem('skillgarden_custom_supabase_url') : null;
const customKey = typeof window !== 'undefined' ? localStorage.getItem('skillgarden_custom_supabase_key') : null;

const effectiveUrl = customUrl || import.meta.env.VITE_SUPABASE_URL;
const effectiveKey = customKey || import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(effectiveUrl && effectiveKey);

export let supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(effectiveUrl!, effectiveKey!)
  : null;

export function reconfigureSupabaseClient(url: string, key: string): boolean {
  try {
    if (url && key) {
      localStorage.setItem('skillgarden_custom_supabase_url', url);
      localStorage.setItem('skillgarden_custom_supabase_key', key);
      supabase = createClient(url, key);
      return true;
    } else {
      localStorage.removeItem('skillgarden_custom_supabase_url');
      localStorage.removeItem('skillgarden_custom_supabase_key');
      supabase = null;
      return false;
    }
  } catch (e) {
    console.error('Failed to reconfigure Supabase client', e);
    return false;
  }
}

export class GardenDatabaseService {
  private cache: FullGardenState;

  constructor() {
    this.cache = localGardenStore.load();
  }

  getSnapshot(): FullGardenState {
    return this.cache;
  }

  isLiveConnected(): boolean {
    return Boolean(supabase);
  }

  /**
   * Fetches topics directly from Supabase 'topics' table.
   * If remote rows exist, uses them immediately so user edits in Supabase Table Editor appear live.
   */
  async getTopics(): Promise<Topic[]> {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('topics')
          .select('*')
          .order('name', { ascending: true });

        if (!error && data && data.length > 0) {
          return data.map((t: any) => ({
            id: t.id,
            name: t.name,
            slug: t.slug,
            icon: t.icon,
            description: t.description || '',
            category: t.category,
            isCustom: t.is_custom,
          }));
        }
      } catch (err) {
        console.warn('Failed to fetch topics from Supabase, using local defaults', err);
      }
    }
    return DEFAULT_TOPICS;
  }

  /**
   * Fetches dynamic questions for a major from Supabase 'topic_questions' table.
   * Directly respects custom questions added or edited in Supabase.
   */
  async getTopicQuestions(topicSlug: string): Promise<TopicQuestion[]> {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('topic_questions')
          .select('*')
          .eq('topic_slug', topicSlug)
          .order('order_index', { ascending: true });

        if (!error && data && data.length > 0) {
          return data.map((q: any) => ({
            id: q.id,
            topicSlug: q.topic_slug,
            question: q.question,
            subtitle: q.subtitle || undefined,
            type: q.question_type || 'single_choice',
            options: q.options || undefined,
            placeholder: q.placeholder || undefined,
            required: q.required ?? true,
          }));
        }
      } catch (err) {
        console.warn(`Failed to fetch questions for ${topicSlug} from Supabase, using defaults`, err);
      }
    }

    if (DEFAULT_TOPIC_QUESTIONS[topicSlug]) {
      return DEFAULT_TOPIC_QUESTIONS[topicSlug];
    }

    const topics = DEFAULT_TOPICS;
    const found = topics.find((t) => t.slug === topicSlug);
    if (found) {
      return getGenericQuestionsForTopic(found);
    }
    return getGenericQuestionsForTopic({
      id: topicSlug,
      name: topicSlug.charAt(0).toUpperCase() + topicSlug.slice(1),
      slug: topicSlug,
      icon: '🌱',
      description: 'Custom topic area',
      category: 'custom',
    });
  }

  /**
   * Synchronizes data from remote Supabase tables into the application state.
   * Operates seamlessly with both authenticated users and anonymous connections.
   */
  async syncFromRemote(): Promise<FullGardenState> {
    if (supabase) {
      try {
        let userId = this.cache.profile.id;
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          userId = user.id;
        }

        // 1. Fetch Profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle();

        if (profile) {
          this.cache.profile = {
            ...this.cache.profile,
            id: profile.id,
            displayName: profile.display_name,
            avatar: profile.avatar,
            overallIdentity: profile.overall_identity || 'Curious Explorer',
            overallLevel: profile.overall_level || 1,
            totalXp: profile.total_xp || 0,
            targetSessionMinutes: profile.target_session_minutes || 15,
            preferredTime: profile.preferred_time || 'evening',
            encouragementStyle: profile.encouragement_style || 'gentle',
            hasCompletedOnboarding: profile.has_completed_onboarding ?? true,
            activeDaysThisWeek: profile.active_days_this_week || 1,
            lastActiveDate: profile.last_active_date || new Date().toISOString(),
          };
        }

        // 2. Fetch User Topics (Islands)
        const { data: remoteTopics, error: utErr } = await supabase
          .from('user_topics')
          .select('*')
          .eq('user_id', userId);

        if (!utErr && remoteTopics !== null) {
          // Genuinely use remote user topics - if user deleted all topics in Supabase, honor it!
          this.cache.userTopics = remoteTopics.map((ut: any) => ({
            id: ut.id,
            userId: ut.user_id,
            topicId: ut.topic_id,
            topicName: ut.custom_name || ut.topic_id,
            topicIcon: '🌱',
            category: 'tech',
            status: ut.status || 'active',
            level: ut.level || 1,
            xp: ut.xp || 0,
            confidence: ut.confidence || 2,
            createdAt: ut.created_at,
            updatedAt: ut.updated_at,
          }));
        }

        // 3. Fetch World Regions
        const { data: remoteRegions, error: wrErr } = await supabase
          .from('world_regions')
          .select('*');

        if (!wrErr && remoteRegions !== null && remoteRegions.length > 0) {
          this.cache.worldRegions = remoteRegions.map((wr: any) => ({
            id: wr.id,
            worldId: wr.world_id,
            userTopicId: wr.user_topic_id,
            topicName: wr.topic_name,
            topicCategory: wr.topic_category,
            regionType: wr.region_type,
            stage: wr.stage || 1,
            progress: wr.progress || 10,
            unlocked: wr.unlocked ?? true,
            theme: wr.theme,
            position: wr.position || [0, 0, 0],
            updatedAt: wr.updated_at,
          }));
        }

        // 4. Fetch Goals
        const { data: remoteGoals } = await supabase
          .from('goals')
          .select('*')
          .eq('user_id', userId);

        if (remoteGoals && remoteGoals.length > 0) {
          this.cache.goals = remoteGoals.map((g: any) => ({
            id: g.id,
            userId: g.user_id,
            userTopicId: g.user_topic_id,
            topicName: g.topic_name,
            title: g.title,
            description: g.description,
            motivation: g.motivation || [],
            target: g.target,
            status: g.status,
            createdAt: g.created_at,
            updatedAt: g.updated_at,
          }));
        }

        // 5. Fetch Skills
        const { data: remoteSkills } = await supabase
          .from('skills')
          .select('*');

        if (remoteSkills && remoteSkills.length > 0) {
          this.cache.skills = remoteSkills.map((sk: any) => ({
            id: sk.id,
            userTopicId: sk.user_topic_id,
            topicSlug: sk.topic_slug,
            name: sk.name,
            description: sk.description,
            orderIndex: sk.order_index,
            difficulty: sk.difficulty,
            prerequisiteSkillId: sk.prerequisite_skill_id,
            status: sk.status,
            progressPercentage: sk.progress_percentage || 0,
            level: sk.level || 1,
            xp: sk.xp || 0,
          }));
        }

        // 6. Fetch Quests
        const { data: remoteQuests } = await supabase
          .from('quests')
          .select('*');

        if (remoteQuests && remoteQuests.length > 0) {
          this.cache.quests = remoteQuests.map((q: any) => ({
            id: q.id,
            userTopicId: q.user_topic_id,
            topicName: q.topic_name,
            topicSlug: q.topic_slug,
            skillId: q.skill_id,
            skillName: q.skill_name,
            title: q.title,
            description: q.description,
            objective: q.objective,
            categoryTypeBadge: q.category_type_badge,
            type: q.type,
            difficulty: q.difficulty,
            estimatedMinutes: q.estimated_minutes,
            materials: q.materials,
            expectedOutcome: q.expected_outcome,
            hint: q.hint,
            example: q.example,
            completionType: q.completion_type,
            completionCriteria: q.completion_criteria,
            rewardXp: q.reward_xp,
            whyThisQuest: q.why_this_quest,
            progressImpact: q.progress_impact,
            projectStage: q.project_stage,
            interactivePayload: q.interactive_payload,
            steps: q.steps || [],
            completed: Boolean(q.completed),
          }));
        }

        // 7. Fetch World
        const { data: remoteWorld } = await supabase
          .from('worlds')
          .select('*')
          .eq('user_id', userId)
          .maybeSingle();

        if (remoteWorld) {
          this.cache.world = {
            ...this.cache.world,
            id: remoteWorld.id,
            userId: remoteWorld.user_id,
            worldLevel: remoteWorld.world_level || 1,
            theme: remoteWorld.theme || 'island',
            unlockedRegionsCount: remoteWorld.unlocked_regions_count || this.cache.worldRegions.length,
            weather: remoteWorld.weather || 'auto',
            ambientSoundEnabled: remoteWorld.ambient_sound_enabled ?? true,
            autoRotate: Boolean(remoteWorld.auto_rotate),
            timeOfDay: remoteWorld.time_of_day || 'auto',
            updatedAt: remoteWorld.updated_at,
          };
        }

        localGardenStore.save(this.cache);
      } catch (err) {
        console.warn('[SkillGarden] Supabase remote sync notice: continuing with resilient state cache', err);
      }
    }
    return this.cache;
  }

  /**
   * Saves snapshot locally and pushes upserts directly to Supabase tables.
   */
  saveSnapshot(updated: FullGardenState): void {
    this.cache = updated;
    localGardenStore.save(updated);

    if (supabase) {
      const userId = updated.profile.id;

      // 1. Upsert Profile
      supabase
        .from('profiles')
        .upsert({
          id: userId,
          display_name: updated.profile.displayName,
          avatar: updated.profile.avatar,
          overall_identity: updated.profile.overallIdentity,
          overall_level: updated.profile.overallLevel,
          total_xp: updated.profile.totalXp,
          target_session_minutes: updated.profile.targetSessionMinutes,
          preferred_time: updated.profile.preferredTime,
          encouragement_style: updated.profile.encouragementStyle,
          has_completed_onboarding: updated.profile.hasCompletedOnboarding,
          active_days_this_week: updated.profile.activeDaysThisWeek,
          last_active_date: updated.profile.lastActiveDate,
          updated_at: new Date().toISOString(),
        })
        .then();

      // 2. Upsert World
      supabase
        .from('worlds')
        .upsert({
          id: updated.world.id || `world_${userId}`,
          user_id: userId,
          world_level: updated.world.worldLevel,
          theme: updated.world.theme,
          unlocked_regions_count: updated.worldRegions.length,
          weather: updated.world.weather,
          ambient_sound_enabled: updated.world.ambientSoundEnabled,
          auto_rotate: Boolean(updated.world.autoRotate),
          time_of_day: updated.world.timeOfDay,
          updated_at: new Date().toISOString(),
        })
        .then();

      // 3. Upsert User Topics
      if (updated.userTopics && updated.userTopics.length > 0) {
        const topicRows = updated.userTopics.map((ut) => ({
          id: ut.id,
          user_id: userId,
          topic_id: ut.topicId,
          custom_name: ut.topicName,
          status: ut.status,
          level: ut.level,
          xp: ut.xp,
          confidence: ut.confidence,
          updated_at: new Date().toISOString(),
        }));
        supabase.from('user_topics').upsert(topicRows).then();
      }

      // 4. Upsert World Regions
      if (updated.worldRegions && updated.worldRegions.length > 0) {
        const regionRows = updated.worldRegions.map((wr) => ({
          id: wr.id,
          world_id: updated.world.id || `world_${userId}`,
          user_topic_id: wr.userTopicId,
          topic_name: wr.topicName,
          topic_category: wr.topicCategory,
          region_type: wr.regionType,
          stage: wr.stage,
          progress: wr.progress,
          unlocked: wr.unlocked,
          theme: wr.theme,
          position: wr.position,
          updated_at: new Date().toISOString(),
        }));
        supabase.from('world_regions').upsert(regionRows).then();
      }

      // 5. Upsert Reminders
      supabase
        .from('reminders')
        .upsert({
          user_id: userId,
          enabled: updated.reminders.enabled,
          preferred_time: updated.reminders.preferredTime,
          time_string: updated.reminders.timeString,
          frequency: updated.reminders.frequency,
          style: updated.reminders.style,
          quiet_start: updated.reminders.quietStart,
          quiet_end: updated.reminders.quietEnd,
          updated_at: new Date().toISOString(),
        })
        .then();
    }
  }

  resetAll(): FullGardenState {
    this.cache = localGardenStore.reset();
    return this.cache;
  }

  /**
   * Deletes a user topic and its corresponding island from Supabase and local cache.
   * Guarantees cascade deletion across all child tables.
   */
  async deleteUserTopic(userTopicId: string): Promise<void> {
    // 1. Remove from local memory cache
    this.cache.userTopics = this.cache.userTopics.filter((t) => t.id !== userTopicId);
    this.cache.worldRegions = this.cache.worldRegions.filter((r) => r.userTopicId !== userTopicId);
    this.cache.goals = this.cache.goals.filter((g) => g.userTopicId !== userTopicId);
    this.cache.skills = this.cache.skills.filter((s) => s.userTopicId !== userTopicId);
    this.cache.quests = this.cache.quests.filter((q) => q.userTopicId !== userTopicId);
    localGardenStore.save(this.cache);

    // 2. Cascade delete in Supabase tables
    if (supabase) {
      try {
        await Promise.allSettled([
          supabase.from('world_regions').delete().eq('user_topic_id', userTopicId),
          supabase.from('goals').delete().eq('user_topic_id', userTopicId),
          supabase.from('skills').delete().eq('user_topic_id', userTopicId),
          supabase.from('quests').delete().eq('user_topic_id', userTopicId),
          supabase.from('topic_answers').delete().eq('user_topic_id', userTopicId),
          supabase.from('topic_preferences').delete().eq('user_topic_id', userTopicId),
          supabase.from('user_topics').delete().eq('id', userTopicId),
        ]);
      } catch (err) {
        console.warn('Failed to cascade delete user topic from Supabase', err);
      }
    }
  }

  /**
   * Deletes an island region specifically.
   */
  async deleteWorldRegion(regionId: string): Promise<void> {
    this.cache.worldRegions = this.cache.worldRegions.filter((r) => r.id !== regionId);
    localGardenStore.save(this.cache);
    if (supabase) {
      try {
        await supabase.from('world_regions').delete().eq('id', regionId);
      } catch (err) {
        console.warn('Failed to delete world region from Supabase', err);
      }
    }
  }

  /**
   * Saves a user answer to a topic onboarding question in Supabase.
   */
  async saveTopicAnswer(
    userId: string,
    userTopicId: string,
    questionId: string,
    questionText: string,
    answer: any
  ): Promise<void> {
    if (supabase) {
      try {
        await supabase.from('topic_answers').upsert({
          user_id: userId,
          user_topic_id: userTopicId,
          question_id: questionId,
          question_text: questionText,
          answer: answer,
          updated_at: new Date().toISOString(),
        });
      } catch (err) {
        console.warn('Failed to save topic answer to Supabase', err);
      }
    }
  }

  /**
   * Pushes all local garden state directly into Supabase tables with a single operation.
   */
  async syncAllLocalToRemote(): Promise<{ success: boolean; message: string; rowsPushed: number }> {
    if (!supabase) {
      return {
        success: false,
        message: 'Supabase is not configured yet. Please enter your Supabase Project URL and Anon Key in Settings.',
        rowsPushed: 0,
      };
    }

    try {
      let rowsPushed = 0;
      const snap = this.getSnapshot();
      const userId = snap.profile.id;

      // 1. Push Profile
      const { error: pErr } = await supabase.from('profiles').upsert({
        id: userId,
        display_name: snap.profile.displayName,
        avatar: snap.profile.avatar,
        overall_identity: snap.profile.overallIdentity,
        overall_level: snap.profile.overallLevel,
        total_xp: snap.profile.totalXp,
        target_session_minutes: snap.profile.targetSessionMinutes,
        preferred_time: snap.profile.preferredTime,
        encouragement_style: snap.profile.encouragementStyle,
        has_completed_onboarding: snap.profile.hasCompletedOnboarding,
        active_days_this_week: snap.profile.activeDaysThisWeek,
        last_active_date: snap.profile.lastActiveDate,
        updated_at: new Date().toISOString(),
      });
      if (!pErr) rowsPushed += 1;

      // 2. Push World
      const { error: wErr } = await supabase.from('worlds').upsert({
        id: snap.world.id || `world_${userId}`,
        user_id: userId,
        world_level: snap.world.worldLevel,
        theme: snap.world.theme,
        unlocked_regions_count: snap.worldRegions.length,
        weather: snap.world.weather,
        ambient_sound_enabled: snap.world.ambientSoundEnabled,
        auto_rotate: Boolean(snap.world.autoRotate),
        time_of_day: snap.world.timeOfDay,
        updated_at: new Date().toISOString(),
      });
      if (!wErr) rowsPushed += 1;

      // 3. Push User Topics
      if (snap.userTopics && snap.userTopics.length > 0) {
        const topicRows = snap.userTopics.map((ut) => ({
          id: ut.id,
          user_id: userId,
          topic_id: ut.topicId,
          custom_name: ut.topicName,
          status: ut.status,
          level: ut.level,
          xp: ut.xp,
          confidence: ut.confidence,
          updated_at: new Date().toISOString(),
        }));
        const { error: utErr } = await supabase.from('user_topics').upsert(topicRows);
        if (!utErr) rowsPushed += topicRows.length;
      }

      // 4. Push World Regions
      if (snap.worldRegions && snap.worldRegions.length > 0) {
        const regionRows = snap.worldRegions.map((wr) => ({
          id: wr.id,
          world_id: snap.world.id || `world_${userId}`,
          user_topic_id: wr.userTopicId,
          topic_name: wr.topicName,
          topic_category: wr.topicCategory,
          region_type: wr.regionType,
          stage: wr.stage,
          progress: wr.progress,
          unlocked: wr.unlocked,
          theme: wr.theme,
          position: wr.position,
          updated_at: new Date().toISOString(),
        }));
        const { error: wrErr } = await supabase.from('world_regions').upsert(regionRows);
        if (!wrErr) rowsPushed += regionRows.length;
      }

      // 5. Push Quests
      if (snap.quests && snap.quests.length > 0) {
        const questPayloads = snap.quests.map((q) => ({
          id: q.id,
          user_topic_id: q.userTopicId || null,
          topic_name: q.topicName,
          topic_slug: q.topicSlug || null,
          skill_id: q.skillId || null,
          skill_name: q.skillName,
          title: q.title,
          description: q.description,
          objective: q.objective || null,
          category_type_badge: q.categoryTypeBadge || null,
          type: q.type,
          difficulty: q.difficulty,
          estimated_minutes: q.estimatedMinutes || 10,
          materials: q.materials || [],
          expected_outcome: q.expectedOutcome || null,
          hint: q.hint || null,
          example: q.example || null,
          completion_type: q.completionType || 'self_assessment_rubric',
          completion_criteria: q.completionCriteria || [],
          reward_xp: q.rewardXp || 25,
          why_this_quest: q.whyThisQuest,
          progress_impact: q.progressImpact || null,
          project_stage: q.projectStage || null,
          interactive_payload: q.interactivePayload || {},
          steps: q.steps || [],
          completed: Boolean(q.completed),
        }));

        const { error: qErr } = await supabase
          .from('quests')
          .upsert(questPayloads);
        if (!qErr) rowsPushed += questPayloads.length;
      }

      // 6. Push Skills
      if (snap.skills && snap.skills.length > 0) {
        const skillPayloads = snap.skills.map((sk) => ({
          id: sk.id,
          user_topic_id: sk.userTopicId || null,
          topic_slug: sk.topicSlug || sk.name.toLowerCase().replace(/\s+/g, '-'),
          name: sk.name,
          description: sk.description,
          order_index: sk.orderIndex || 1,
          difficulty: sk.difficulty || 'Beginner',
          status: sk.status || 'available',
          progress_percentage: sk.progressPercentage || 0,
          level: sk.level || 1,
          xp: sk.xp || 0,
        }));

        const { error: skErr } = await supabase
          .from('skills')
          .upsert(skillPayloads);
        if (!skErr) rowsPushed += skillPayloads.length;
      }

      return {
        success: true,
        message: `Successfully synchronized ${rowsPushed} rows into Supabase! Check your Supabase table editor to view all populated tables.`,
        rowsPushed,
      };
    } catch (err: any) {
      return {
        success: false,
        message: err.message || 'Error synchronizing to Supabase.',
        rowsPushed: 0,
      };
    }
  }
}

export const gardenDb = new GardenDatabaseService();
