import React from 'react';

interface NavigationBarProps {
  activeTab: 'world' | 'today' | 'progress' | 'settings';
  onChangeTab: (tab: 'world' | 'today' | 'progress' | 'settings') => void;
}

export const NavigationBar: React.FC<NavigationBarProps> = ({ activeTab, onChangeTab }) => {
  return (
    <nav className="md:hidden fixed bottom-4 left-4 right-4 z-40 bg-white/95 backdrop-blur-lg border border-stone-200/90 shadow-xl rounded-3xl p-1.5 flex items-center justify-around">
      <button
        type="button"
        onClick={() => onChangeTab('world')}
        className={`flex-1 py-2 rounded-2xl flex flex-col items-center gap-0.5 text-[11px] font-bold transition ${
          activeTab === 'world' ? 'bg-emerald-100/70 text-emerald-900 shadow-sm' : 'text-stone-500'
        }`}
      >
        <span className="text-base leading-none">🌍</span>
        <span>World</span>
      </button>

      <button
        type="button"
        onClick={() => onChangeTab('today')}
        className={`flex-1 py-2 rounded-2xl flex flex-col items-center gap-0.5 text-[11px] font-bold transition ${
          activeTab === 'today' ? 'bg-emerald-100/70 text-emerald-900 shadow-sm' : 'text-stone-500'
        }`}
      >
        <span className="text-base leading-none">🎯</span>
        <span>Today</span>
      </button>

      <button
        type="button"
        onClick={() => onChangeTab('progress')}
        className={`flex-1 py-2 rounded-2xl flex flex-col items-center gap-0.5 text-[11px] font-bold transition ${
          activeTab === 'progress' ? 'bg-emerald-100/70 text-emerald-900 shadow-sm' : 'text-stone-500'
        }`}
      >
        <span className="text-base leading-none">📈</span>
        <span>Progress</span>
      </button>

      <button
        type="button"
        onClick={() => onChangeTab('settings')}
        className={`flex-1 py-2 rounded-2xl flex flex-col items-center gap-0.5 text-[11px] font-bold transition ${
          activeTab === 'settings' ? 'bg-emerald-100/70 text-emerald-900 shadow-sm' : 'text-stone-500'
        }`}
      >
        <span className="text-base leading-none">⚙️</span>
        <span>Settings</span>
      </button>
    </nav>
  );
};
