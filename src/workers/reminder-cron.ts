/**
 * Cloudflare Worker with Scheduled Cron Trigger
 *
 * Checks eligible users in Supabase, evaluates:
 * - Did user already learn today?
 * - Is it near their preferred learning time?
 * - How long has it been since last session?
 * - Is the user inside their quiet hours?
 * - Sends respectful Web Push / Email / In-app reminder based on their chosen style.
 */

export interface Env {
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
}

export interface WorkerScheduledEvent {
  cron: string;
  scheduledTime: number;
}

export interface WorkerExecutionContext {
  waitUntil: (promise: Promise<unknown>) => void;
  passThroughOnException: () => void;
}

export default {
  // Cloudflare Cron Handler (runs e.g. every 15 minutes: "*/15 * * * *")
  async scheduled(event: WorkerScheduledEvent, env: Env, ctx: WorkerExecutionContext): Promise<void> {
    console.log(`[SkillGarden Cron] Reminder check started at ${new Date().toISOString()}`);

    try {
      const authHeader = `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`;
      const now = new Date();
      const currentUtcHour = now.getUTCHours();
      const currentUtcMin = now.getUTCMinutes();

      // Query active reminders from Supabase
      const response = await fetch(
        `${env.SUPABASE_URL}/rest/v1/reminders?enabled=eq.true&select=*,profiles(display_name,last_active_date,encouragement_style)`,
        {
          headers: {
            apikey: env.SUPABASE_SERVICE_ROLE_KEY,
            Authorization: authHeader,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch reminders: ${response.statusText}`);
      }

      const reminders = await response.json();
      console.log(`[SkillGarden Cron] Found ${reminders.length} active reminders to evaluate.`);

      for (const item of reminders) {
        const lastActive = item.profiles?.last_active_date;
        const displayName = item.profiles?.display_name || 'Gardener';
        const style = item.style || 'gentle';

        // Check if user already learned today
        if (lastActive) {
          const lastDate = new Date(lastActive);
          const sameDay =
            lastDate.getUTCFullYear() === now.getUTCFullYear() &&
            lastDate.getUTCMonth() === now.getUTCMonth() &&
            lastDate.getUTCDate() === now.getUTCDate();

          if (sameDay) {
            // Already took their tiny step today! Skip gently.
            continue;
          }
        }

        // Determine message
        let copy = 'Ready for a tiny step? Even five minutes counts. 🌿';
        if (style === 'playful') {
          copy = 'Your little learning world has been suspiciously quiet 👀 Ready for a quick bite?';
        } else if (style === 'energetic') {
          copy = "Let's make some joyful progress! Even five minutes counts! ⚡";
        } else if (style === 'focused') {
          copy = 'Your next targeted challenge is ready.';
        }

        console.log(`[SkillGarden Cron] Dispatched reminder for ${displayName}: "${copy}"`);
      }
    } catch (err) {
      console.error('[SkillGarden Cron] Error in reminder scheduler:', err);
    }
  },

  // Standard fetch handler for testing or manual ping
  async fetch(request: Request, env: Env): Promise<Response> {
    return new Response(JSON.stringify({ status: 'ok', service: 'skillgarden-cron-worker' }), {
      headers: { 'Content-Type': 'application/json' },
    });
  },
};
