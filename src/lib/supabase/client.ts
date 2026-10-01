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
} from '../../types';

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

  async syncFromRemote(): Promise<FullGardenState> {
    if (supabase) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          // Fetch profile
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

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

            // Fetch user topics
            const { data: userTopics } = await supabase
              .from('user_topics')
              .select('*')
              .eq('user_id', user.id);

            if (userTopics && userTopics.length > 0) {
              this.cache.userTopics = userTopics.map((ut: any) => ({
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
          }
        }
      } catch (err) {
        console.warn('[SkillGarden] Supabase remote sync notice: continuing with resilient state cache', err);
      }
    }
    return this.cache;
  }

  saveSnapshot(updated: FullGardenState): void {
    this.cache = updated;
    localGardenStore.save(updated);

    // If Supabase authenticated, push changes asynchronously
    if (supabase) {
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (!user) return;

        // Upsert Profile
        supabase!
          .from('profiles')
          .upsert({
            id: user.id,
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

        // Upsert World
        supabase!
          .from('worlds')
          .upsert({
            user_id: user.id,
            world_level: updated.world.worldLevel,
            theme: updated.world.theme,
            unlocked_regions_count: updated.worldRegions.length,
            time_of_day: updated.world.timeOfDay,
            updated_at: new Date().toISOString(),
          })
          .then();

        // Upsert Reminders
        supabase!
          .from('reminders')
          .upsert({
            user_id: user.id,
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
      }).catch(() => {});
    }
  }

  resetAll(): FullGardenState {
    this.cache = localGardenStore.reset();
    return this.cache;
  }
}

export const gardenDb = new GardenDatabaseService();
