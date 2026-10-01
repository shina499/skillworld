import React from 'react';
import { Sparkles, ArrowRight, Compass, ShieldCheck, HeartHandshake, Layers } from 'lucide-react';

interface LandingPageProps {
  onStartOnboarding: () => void;
  onExploreWorld: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartOnboarding,
  onExploreWorld,
}) => {
  return (
    <div className="min-h-screen bg-stone-50 flex flex-col justify-between selection:bg-emerald-100 selection:text-emerald-900">
      {/* Top Banner Navigation */}
      <header className="px-6 md:px-12 py-5 flex items-center justify-between border-b border-stone-200/80 bg-white/70 backdrop-blur-md sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center text-xl font-bold shadow-md shadow-emerald-600/20">
            🌱
          </div>
          <div>
            <span className="text-lg font-extrabold text-stone-900 tracking-tight block leading-none">
              SkillGarden
            </span>
            <span className="text-[10px] text-stone-500 font-bold uppercase tracking-wider">
              Personalized 3D Learning
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onExploreWorld}
            className="hidden sm:inline-flex px-4 py-2 rounded-xl text-stone-600 hover:text-stone-900 text-xs font-bold transition"
          >
            Explore Garden
          </button>
          <button
            type="button"
            onClick={onStartOnboarding}
            className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition flex items-center gap-1.5"
          >
            <span>Start Building</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-5xl mx-auto px-6 py-12 md:py-20 text-center space-y-8 flex-1 flex flex-col justify-center items-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-200 text-emerald-900 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Zero-Guilt • Real 3D World • Multi-Topic Progression</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-stone-900 tracking-tight max-w-3xl leading-[1.12]">
          Grow what you're genuinely curious about.
        </h1>

        <p className="text-base sm:text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
          SkillGarden turns your hobbies and learning goals into tiny 10-minute adventures. As you learn, watch a living 3D world sculpt unique districts for code, art, language, and custom passions.
        </p>

        {/* Call to Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
          <button
            type="button"
            onClick={onStartOnboarding}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-extrabold text-base shadow-xl shadow-emerald-600/25 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Start Building Your World</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onExploreWorld}
            className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white border border-stone-300 hover:border-emerald-300 text-stone-800 font-bold text-base shadow-sm transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Compass className="w-4 h-4 text-emerald-600" />
            <span>See How It Works</span>
          </button>
        </div>

        {/* Core Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 text-left max-w-4xl w-full">
          <div className="p-6 rounded-3xl bg-white border border-stone-200/80 shadow-sm space-y-2">
            <div className="text-2xl">🌍</div>
            <h4 className="font-extrabold text-stone-900 text-base">Separate 3D Topic Districts</h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              Programming gets a coding lab. Drawing gets an art studio. Photography gets a camera outlook. Each evolves independently as you earn XP.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-stone-200/80 shadow-sm space-y-2">
            <div className="text-2xl">🌱</div>
            <h4 className="font-extrabold text-stone-900 text-base">You Can Always Come Back</h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              No broken streaks. No guilt notifications. When you return after a break, a gentle 3-minute reconnect lets you resume right where you left off.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-stone-200/80 shadow-sm space-y-2">
            <div className="text-2xl">🧩</div>
            <h4 className="font-extrabold text-stone-900 text-base">Topic-Specific Questions</h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              No generic questionnaires. We ask coding questions for code, drawing questions for art, and generate custom quests for any passion you type.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-6 border-t border-stone-200/80 text-center text-xs text-stone-500 bg-white/40">
        SkillGarden • Real Personalized Learning Companion • Built with Three.js & Supabase
      </footer>
    </div>
  );
};
