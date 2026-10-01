import { EncouragementStyle } from '../../types';

export function getGreeting(name: string): string {
  const hour = new Date().getHours();
  let timeStr = 'day';
  if (hour >= 5 && hour < 12) timeStr = 'morning';
  else if (hour >= 12 && hour < 17) timeStr = 'afternoon';
  else if (hour >= 17 && hour < 22) timeStr = 'evening';
  else timeStr = 'night';

  return `Good ${timeStr}, ${name || 'Gardener'} 🌿`;
}

export function getEncouragementMessage(style: EncouragementStyle, isComeback = false): string {
  if (isComeback) {
    switch (style) {
      case 'energetic':
        return "Welcome back! No catching up needed—let's take one fresh spark today! 🔥";
      case 'playful':
        return "Look who's back! Your island missed your footprint. Tiny 3-minute warm-up? 👀";
      case 'focused':
        return 'Welcome back. Your skills remain intact. Next micro-task is ready.';
      case 'minimal':
        return 'Welcome back. Your quest is ready.';
      case 'gentle':
      default:
        return 'Welcome back 🌿. Nothing was lost. Ready for a tiny step?';
    }
  }

  switch (style) {
    case 'energetic':
      return "Let's make some joyful progress! Even five minutes counts! ⚡";
    case 'playful':
      return 'Your little learning world is getting suspiciously quiet 👀 Ready for a quick bite?';
    case 'focused':
      return 'Your next targeted challenge is ready.';
    case 'minimal':
      return 'Your quest is ready.';
    case 'gentle':
    default:
      return 'Ready for a tiny step? Even five minutes counts.';
  }
}

export function getQuestCompletedMessage(style: EncouragementStyle, xp: number): string {
  switch (style) {
    case 'energetic':
      return `Boom! +${xp} XP! Your world expands with every tiny spark!`;
    case 'playful':
      return `Seeds planted, branches sprouted! +${xp} XP added to your garden.`;
    case 'focused':
      return `Completed. +${xp} XP logged toward your core milestone.`;
    case 'minimal':
      return `+${xp} XP. Well done.`;
    case 'gentle':
    default:
      return `Beautifully done. +${xp} XP. Your island grows a little greener today.`;
  }
}
