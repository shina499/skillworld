import React from 'react';
import { HeartHandshake, Sparkles, ArrowRight } from 'lucide-react';

interface ComebackBannerProps {
  daysAway: number;
  onStartComeback: () => void;
}

export const ComebackBanner: React.FC<ComebackBannerProps> = ({ daysAway, onStartComeback }) => {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white p-6 md:p-8 shadow-xl shadow-emerald-900/10 mb-8 animate-fade-in">
      {/* Decorative ambient leaf pattern */}
      <div className="absolute -right-6 -bottom-6 text-emerald-500/20 text-9xl select-none pointer-events-none">
        🌿
      </div>

      <div className="relative z-10 max-w-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-emerald-100 text-xs font-semibold uppercase tracking-wider mb-3">
          <HeartHandshake className="w-3.5 h-3.5 text-emerald-200" />
          <span>Welcome Back • Zero Guilt</span>
        </div>

        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
          Your world is right where you left it.
        </h2>

        <p className="mt-2 text-emerald-100 text-sm md:text-base leading-relaxed">
          {daysAway > 1 ? `You took a ${daysAway}-day pause.` : 'You took a healthy break.'} In SkillGarden, breaks are part of living. You don't need to catch up or rush. Let's do a tiny 3-minute warm-up check.
        </p>

        <div className="mt-5 flex items-center gap-4">
          <button
            type="button"
            onClick={onStartComeback}
            className="px-6 py-3 rounded-2xl bg-white text-emerald-900 hover:bg-emerald-50 font-bold text-sm shadow-md transition flex items-center gap-2 active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>3-Minute Reconnect</span>
            <ArrowRight className="w-4 h-4 text-emerald-700" />
          </button>
        </div>
      </div>
    </div>
  );
};
