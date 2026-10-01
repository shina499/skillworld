import { ReminderSettings } from '../../types';
import { getEncouragementMessage } from './encouragementCopy';

export class ReminderService {
  async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      return 'denied';
    }
    return await Notification.requestPermission();
  }

  isSupported(): boolean {
    return 'Notification' in window;
  }

  hasPermission(): boolean {
    return 'Notification' in window && Notification.permission === 'granted';
  }

  canSendNow(settings: ReminderSettings): boolean {
    if (!settings.enabled) return false;

    // Check quiet hours
    const now = new Date();
    const currentHour = now.getHours();
    const currentMin = now.getMinutes();
    const currentTotalMin = currentHour * 60 + currentMin;

    const [qStartH, qStartM] = (settings.quietStart || '22:00').split(':').map(Number);
    const [qEndH, qEndM] = (settings.quietEnd || '08:00').split(':').map(Number);
    const quietStartTotal = qStartH * 60 + qStartM;
    const quietEndTotal = qEndH * 60 + qEndM;

    if (quietStartTotal > quietEndTotal) {
      // Overnight (e.g. 22:00 to 08:00)
      if (currentTotalMin >= quietStartTotal || currentTotalMin < quietEndTotal) {
        return false;
      }
    } else {
      if (currentTotalMin >= quietStartTotal && currentTotalMin < quietEndTotal) {
        return false;
      }
    }

    return true;
  }

  triggerBrowserNotification(settings: ReminderSettings, customTitle?: string): boolean {
    const body = getEncouragementMessage(settings.style);
    const title = customTitle || 'SkillGarden 🌱';

    if (this.hasPermission()) {
      try {
        new Notification(title, {
          body,
          icon: '/favicon.ico',
          badge: '/favicon.ico',
        });
        return true;
      } catch (e) {
        console.warn('Native notification failed', e);
      }
    }
    return false;
  }
}

export const reminderService = new ReminderService();
