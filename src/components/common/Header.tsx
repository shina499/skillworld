import React from 'react';
import { Sparkles, User, Shield, Database } from 'lucide-react';
import { UserProfile, WorldState } from '../../types';

interface HeaderProps {
  profile: UserProfile;
  worldState: WorldState;
  activeTab: 'world' | 'today' | 'progress' | 'settings';
  onChangeTab: (tab: 'world' | 'today' | 'progress' | 'settings') => void;
  onOpenAuth: () => void;
  onOpenSqlModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  worldState,
  activeTab,
  onChangeTab,
  onOpenAuth,
  onOpenSqlModal,
}) => {
  return (
    <header className="h-16 px-4 md:px-8 bg-white/90 backdrop-blur-md border-b border-stone-200/80 sticky top-0 z-40 flex items-center justify-between">
      {/* Brand */}
      <div className="flex items-center gap-6">
        <button
          type="button"
          onClick={() => onChangeTab('world')}
          className="flex items-center gap-2.5 text-left group cursor-pointer"
        >
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center text-lg font-bold shadow-md shadow-emerald-600/20 group-hover:scale-105 transition">
            🌱
          </div>
          <div>
            <div className="text-base font-extrabold text-stone-900 tracking-tight leading-none">
              SkillGarden
            </div>
            <div className="text-[10px] text-stone-600 font-semibold mt-0.5 tracking-wider uppercase">
              Personal Learning
            </div>
          </div>
        </button>

        {/* Desktop Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-stone-100/80 p-1 rounded-2xl border border-stone-200/60">
          <button
            type="button"
            onClick={() => onChangeTab('world')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'world'
                ? 'bg-white text-emerald-800 shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <span>🌍</span>
            <span>World</span>
          </button>

          <button
            type="button"
            onClick={() => onChangeTab('today')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'today'
                ? 'bg-white text-emerald-800 shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <span>🎯</span>
            <span>Today</span>
          </button>

          <button
            type="button"
            onClick={() => onChangeTab('progress')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'progress'
                ? 'bg-white text-emerald-800 shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <span>📈</span>
            <span>Progress</span>
          </button>

          <button
            type="button"
            onClick={() => onChangeTab('settings')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-white text-emerald-800 shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <span>⚙️</span>
            <span>Settings</span>
          </button>
        </nav>
      </div>

      {/* Right User Stats & Profile */}
      <div className="flex items-center gap-3">
        {/* XP Counter */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-xs font-extrabold text-emerald-800 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>{profile.totalXp} XP</span>
        </div>

        {/* Level Badge */}
        <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full bg-stone-100 border border-stone-200 text-stone-700 text-xs font-bold">
          <span>Lvl {worldState.level}</span>
        </div>

        {/* Supabase SQL Button */}
        {onOpenSqlModal && (
          <button
            type="button"
            onClick={onOpenSqlModal}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-100 hover:bg-emerald-50 border border-stone-200 hover:border-emerald-300 text-stone-700 hover:text-emerald-800 text-xs font-bold transition cursor-pointer shadow-sm"
            title="View & Copy Supabase SQL Schema"
          >
            <Database className="w-3.5 h-3.5 text-emerald-600" />
            <span>SQL</span>
          </button>
        )}

        {/* Account / Profile Button */}
        <button
          type="button"
          onClick={onOpenAuth}
          className="p-1.5 rounded-2xl hover:bg-stone-100 border border-stone-200 transition flex items-center gap-2 text-stone-700 cursor-pointer"
          title="Account & Storage"
        >
          <span className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-sm font-bold">
            {profile.avatar || '🌱'}
          </span>
          <span className="text-xs font-bold pr-1 hidden lg:inline truncate max-w-24">
            {profile.displayName}
          </span>
        </button>
      </div>
    </header>
  );
};
