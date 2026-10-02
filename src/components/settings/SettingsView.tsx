import React, { useState } from 'react';
import {
  Settings,
  Bell,
  User,
  Clock,
  Sparkles,
  Download,
  RotateCcw,
  Check,
  CheckCircle,
  Shield,
  Layers,
  Database,
  Plus,
  Trash2,
  UploadCloud,
  AlertTriangle,
} from 'lucide-react';
import { UserProfile, UserTopic, ReminderSettings, EncouragementStyle } from '../../types';
import { reminderService } from '../../lib/notifications/reminderService';
import { getEncouragementMessage } from '../../lib/notifications/encouragementCopy';
import { isSupabaseConfigured, reconfigureSupabaseClient, gardenDb } from '../../lib/supabase/client';
import { SupabaseSqlModal } from './SupabaseSqlModal';

interface SettingsViewProps {
  profile: UserProfile;
  userTopics: UserTopic[];
  reminders: ReminderSettings;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onUpdateReminders: (updated: Partial<ReminderSettings>) => void;
  onAddNewTopic: () => void;
  onDeleteTopic?: (userTopicId: string) => void;
  onResetAllData: () => void;
  onExportData: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  profile,
  userTopics,
  reminders,
  onUpdateProfile,
  onUpdateReminders,
  onAddNewTopic,
  onDeleteTopic,
  onResetAllData,
  onExportData,
}) => {
  const [nameInput, setNameInput] = useState(profile.displayName);
  const [sessionLen, setSessionLen] = useState(profile.targetSessionMinutes || 15);
  const [notificationTestStatus, setNotificationTestStatus] = useState<string | null>(null);
  const [isSqlModalOpen, setIsSqlModalOpen] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [deletingTopicId, setDeletingTopicId] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  // Supabase Custom Config State
  const [supabaseUrlInput, setSupabaseUrlInput] = useState(() => localStorage.getItem('skillgarden_custom_supabase_url') || '');
  const [supabaseKeyInput, setSupabaseKeyInput] = useState(() => localStorage.getItem('skillgarden_custom_supabase_key') || '');
  const [supabaseStatusMsg, setSupabaseStatusMsg] = useState<string | null>(null);

  const handlePushToSupabase = async () => {
    setIsSyncing(true);
    setSyncMessage(null);
    const res = await gardenDb.syncAllLocalToRemote();
    setSyncMessage(res.message);
    setIsSyncing(false);
  };

  const encouragementStyles: { id: EncouragementStyle; label: string; sample: string; icon: string }[] = [
    { id: 'gentle', label: 'Gentle', sample: '"Ready for a tiny step? Even five minutes counts."', icon: '🌱' },
    { id: 'energetic', label: 'Energetic', sample: '"Let\'s build something exciting today!"', icon: '🔥' },
    { id: 'focused', label: 'Focused', sample: '"Your next targeted challenge is ready."', icon: '🎯' },
    { id: 'playful', label: 'Playful', sample: '"Your learning world has been suspiciously quiet 👀"', icon: '👀' },
    { id: 'minimal', label: 'Minimal', sample: '"Quest ready."', icon: '🤍' },
  ];

  const handleSaveProfile = () => {
    onUpdateProfile({
      displayName: nameInput.trim() || 'Gardener',
      targetSessionMinutes: sessionLen,
    });
  };

  const handleConnectSupabase = () => {
    if (!supabaseUrlInput.trim() || !supabaseKeyInput.trim()) {
      reconfigureSupabaseClient('', '');
      setSupabaseStatusMsg('Cleared custom Supabase settings. Using local persistent storage mode.');
      return;
    }
    const success = reconfigureSupabaseClient(supabaseUrlInput.trim(), supabaseKeyInput.trim());
    if (success) {
      setSupabaseStatusMsg('Supabase credentials saved and connected! Data sync active.');
    } else {
      setSupabaseStatusMsg('Failed to initialize client. Please check the URL format.');
    }
  };

  const handleTriggerTestReminder = async () => {
    if ('Notification' in window) {
      if (Notification.permission !== 'granted') {
        const res = await reminderService.requestPermission();
        if (res !== 'granted') {
          setNotificationTestStatus('Browser notification permission not granted. In-app test active.');
          setTimeout(() => setNotificationTestStatus(null), 4000);
          return;
        }
      }
      reminderService.triggerBrowserNotification(reminders, 'SkillGarden Reminder 🌱');
      setNotificationTestStatus(`Sent reminder in ${reminders.style} style!`);
      setTimeout(() => setNotificationTestStatus(null), 4000);
    } else {
      setNotificationTestStatus('In-app reminder tested successfully!');
      setTimeout(() => setNotificationTestStatus(null), 4000);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/70 border border-emerald-200 text-emerald-800 text-xs font-semibold mb-2">
          <Settings className="w-3.5 h-3.5 text-emerald-700" />
          <span>Preferences & Control</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-stone-900 tracking-tight">
          Garden Settings
        </h1>
        <p className="text-stone-600 mt-1 text-sm md:text-base">
          Manage your active topics, learning pace, encouragement tone, and database storage.
        </p>
      </div>

      {/* 1. Active Topics Manager (Section 54) */}
      <div className="p-6 md:p-8 rounded-3xl bg-white border border-stone-200/90 shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-stone-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-600" />
              <span>Your Active Topics</span>
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Each topic grows its own 3D world region and skill path.
            </p>
          </div>

          <button
            type="button"
            onClick={onAddNewTopic}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Topic</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {userTopics.map((ut) => (
            <div
              key={ut.id}
              className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 flex flex-col justify-between gap-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl p-2 rounded-xl bg-white border border-stone-200/80 shadow-xs">
                    {ut.topicIcon}
                  </span>
                  <div>
                    <h4 className="font-bold text-stone-900 text-sm">{ut.topicName} District</h4>
                    <div className="text-xs text-emerald-700 font-semibold">
                      Level {ut.level} • {ut.xp} XP
                    </div>
                  </div>
                </div>
                <span className="text-xs font-semibold px-2 py-1 rounded-lg bg-emerald-100 text-emerald-800">
                  Active Island
                </span>
              </div>

              {deletingTopicId === ut.id ? (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 space-y-2 animate-fade-in">
                  <p className="text-xs font-bold text-red-900">
                    Delete the {ut.topicName} island from your 3D world?
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        onDeleteTopic?.(ut.id);
                        setDeletingTopicId(null);
                      }}
                      className="px-3 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs cursor-pointer active:scale-95"
                    >
                      Yes, Delete Island
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeletingTopicId(null)}
                      className="px-3 py-1 rounded-lg bg-white border border-stone-300 text-stone-700 text-xs font-semibold cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                onDeleteTopic && (
                  <div className="flex justify-end pt-1 border-t border-stone-200/60">
                    <button
                      type="button"
                      onClick={() => setDeletingTopicId(ut.id)}
                      className="text-xs text-red-600 hover:text-red-800 font-bold flex items-center gap-1.5 p-1 transition cursor-pointer"
                      title="Delete this island and its quests from your world"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove Island</span>
                    </button>
                  </div>
                )
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 2. Profile & Learning Pace Card */}
      <div className="p-6 md:p-8 rounded-3xl bg-white border border-stone-200/90 shadow-sm space-y-6">
        <h3 className="text-xl font-bold text-stone-900 flex items-center gap-2">
          <User className="w-5 h-5 text-emerald-600" />
          <span>Profile & Pace</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Gardener Name
            </label>
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl border border-stone-300 text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Realistic Session Length
            </label>
            <div className="flex flex-wrap gap-2">
              {[5, 10, 15, 20, 30].map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => setSessionLen(mins)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                    sessionLen === mins
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  {mins} min
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={handleSaveProfile}
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-sm shadow-md transition"
          >
            Save Profile
          </button>
        </div>
      </div>

      {/* 3. Encouragement Style Card */}
      <div className="p-6 md:p-8 rounded-3xl bg-white border border-stone-200/90 shadow-sm space-y-6">
        <h3 className="text-xl font-bold text-stone-900 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-500" />
          <span>Encouragement Style</span>
        </h3>
        <p className="text-stone-600 text-xs sm:text-sm">
          Select how SkillGarden speaks to you. Never guilt-driven. Always respectful.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {encouragementStyles.map((item) => {
            const isSelected = profile.encouragementStyle === item.id;
            return (
              <div
                key={item.id}
                onClick={() => {
                  onUpdateProfile({ encouragementStyle: item.id });
                  onUpdateReminders({ style: item.id });
                }}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition flex flex-col justify-between ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/60 shadow-sm'
                    : 'border-stone-200 hover:border-emerald-200 bg-white'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xl">{item.icon}</span>
                    {isSelected && <Check className="w-4 h-4 text-emerald-600 font-bold" />}
                  </div>
                  <h4 className="font-extrabold text-stone-900 text-base mt-2">{item.label}</h4>
                  <p className="text-xs text-stone-600 italic mt-1 leading-relaxed">{item.sample}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Supportive Reminders Card */}
      <div className="p-6 md:p-8 rounded-3xl bg-white border border-stone-200/90 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-stone-900 flex items-center gap-2">
            <Bell className="w-5 h-5 text-emerald-600" />
            <span>Supportive Reminders</span>
          </h3>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={reminders.enabled}
              onChange={(e) => onUpdateReminders({ enabled: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
          </label>
        </div>

        {reminders.enabled && (
          <div className="space-y-4 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Preferred Time
                </label>
                <select
                  value={reminders.preferredTime}
                  onChange={(e) => onUpdateReminders({ preferredTime: e.target.value as any })}
                  className="w-full px-4 py-2.5 rounded-2xl border border-stone-300 text-sm font-medium bg-white"
                >
                  <option value="morning">Morning (08:00 - 11:00)</option>
                  <option value="afternoon">Afternoon (12:00 - 16:00)</option>
                  <option value="evening">Evening (17:00 - 21:00)</option>
                  <option value="night">Night (21:00 - 23:00)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Target Hour
                </label>
                <input
                  type="time"
                  value={reminders.timeString}
                  onChange={(e) => onUpdateReminders({ timeString: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-2xl border border-stone-300 text-sm font-medium bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Quiet Hours Start
                </label>
                <input
                  type="time"
                  value={reminders.quietStart}
                  onChange={(e) => onUpdateReminders({ quietStart: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-2xl border border-stone-300 text-sm font-medium bg-white"
                />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="font-bold text-sm text-stone-800">Test Reminder Notification</div>
                <div className="text-xs text-stone-500">
                  Sends a sample reminder matching your tone: "{getEncouragementMessage(profile.encouragementStyle)}"
                </div>
              </div>
              <button
                type="button"
                onClick={handleTriggerTestReminder}
                className="px-4 py-2 rounded-xl bg-white border border-stone-300 hover:border-emerald-400 text-stone-700 hover:text-emerald-800 text-xs font-bold shadow-sm transition active:scale-95 shrink-0"
              >
                Send Test
              </button>
            </div>

            {notificationTestStatus && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium animate-fade-in flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>{notificationTestStatus}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 5. Real Supabase Database Connection & Credentials */}
      <div className="p-6 md:p-8 rounded-3xl bg-white border border-stone-200/90 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-stone-900 flex items-center gap-2">
            <Database className="w-5 h-5 text-emerald-600" />
            <span>Supabase Cloud Database</span>
          </h3>

          <span className={`text-xs font-bold px-3 py-1 rounded-full ${
            isSupabaseConfigured
              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
              : 'bg-stone-100 text-stone-700 border border-stone-200'
          }`}>
            {isSupabaseConfigured ? 'Connected to Cloud' : 'Local Persistent Storage Mode'}
          </span>
        </div>

        <p className="text-xs text-stone-600 leading-relaxed">
          SkillGarden persists all topics, questions, answers, and world states. You can connect your own live Supabase project by providing your Project URL and Anon Key below:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
              Supabase Project URL
            </label>
            <input
              type="text"
              placeholder="https://xyzcompany.supabase.co"
              value={supabaseUrlInput}
              onChange={(e) => setSupabaseUrlInput(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl border border-stone-300 text-xs font-mono bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
              Supabase Anon Key
            </label>
            <input
              type="password"
              placeholder="eyJhbGciOi..."
              value={supabaseKeyInput}
              onChange={(e) => setSupabaseKeyInput(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl border border-stone-300 text-xs font-mono bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setIsSqlModalOpen(true)}
              className="text-xs text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3.5 py-2 rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              <Database className="w-3.5 h-3.5 text-emerald-700" />
              <span>View & Copy Supabase SQL Schema</span>
            </button>

            <button
              type="button"
              onClick={handlePushToSupabase}
              disabled={isSyncing}
              className="text-xs text-purple-900 bg-purple-50 hover:bg-purple-100 border border-purple-200 px-3.5 py-2 rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <UploadCloud className="w-3.5 h-3.5 text-purple-700" />
              <span>{isSyncing ? 'Pushing Data...' : 'Push Local Data into Supabase Tables'}</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleConnectSupabase}
            className="px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-black text-white font-bold text-xs shadow-sm transition cursor-pointer self-start sm:self-auto"
          >
            Save & Connect Supabase
          </button>
        </div>

        {syncMessage && (
          <div className="p-3 rounded-xl bg-purple-50 border border-purple-200 text-purple-900 text-xs font-medium animate-fade-in flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-purple-600 shrink-0" />
            <span>{syncMessage}</span>
          </div>
        )}

        {supabaseStatusMsg && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium animate-fade-in flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{supabaseStatusMsg}</span>
          </div>
        )}
      </div>

      {/* Supabase SQL Schema Modal */}
      <SupabaseSqlModal
        isOpen={isSqlModalOpen}
        onClose={() => setIsSqlModalOpen(false)}
      />

      {/* 6. Data Backup & Reset */}
      <div className="p-6 md:p-8 rounded-3xl bg-white border border-stone-200/90 shadow-sm space-y-4">
        <h3 className="text-xl font-bold text-stone-900 flex items-center gap-2">
          <Shield className="w-5 h-5 text-emerald-600" />
          <span>Data Backup & World Reset</span>
        </h3>

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            type="button"
            onClick={onExportData}
            className="px-5 py-2.5 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-700 font-bold text-xs flex items-center gap-2 transition cursor-pointer"
          >
            <Download className="w-4 h-4 text-stone-500" />
            <span>Export Garden Backup (JSON)</span>
          </button>

          {!showResetConfirm ? (
            <button
              type="button"
              onClick={() => setShowResetConfirm(true)}
              className="px-5 py-2.5 rounded-xl border border-red-200 hover:bg-red-50 text-red-600 font-bold text-xs flex items-center gap-2 transition cursor-pointer active:scale-95"
            >
              <RotateCcw className="w-4 h-4 text-red-500" />
              <span>Reset World to Fresh Seedling</span>
            </button>
          ) : (
            <div className="w-full p-4 rounded-2xl bg-red-50 border border-red-200 space-y-3 animate-fade-in">
              <div className="flex items-center gap-2 text-red-900 font-extrabold text-sm">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <span>Confirm World Reset</span>
              </div>
              <p className="text-xs text-red-700 leading-relaxed">
                This will reset your world level to 1, clear completed quests, and return your garden archipelago to a fresh seedling. Your custom settings will remain.
              </p>
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    onResetAllData();
                    setShowResetConfirm(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow transition active:scale-95 cursor-pointer"
                >
                  Yes, Reset World Now
                </button>
                <button
                  type="button"
                  onClick={() => setShowResetConfirm(false)}
                  className="px-4 py-2 rounded-xl bg-white border border-stone-300 text-stone-700 hover:bg-stone-50 font-bold text-xs transition cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
