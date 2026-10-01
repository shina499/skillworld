import React from 'react';
import { Award, Lock, Sparkles } from 'lucide-react';
import { Achievement } from '../../types';

interface AchievementsListProps {
  achievements: Achievement[];
}

export const AchievementsList: React.FC<AchievementsListProps> = ({ achievements }) => {
  const unlockedCount = achievements.filter((a) => a.isUnlocked).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-500" />
          <span>Milestone Badges</span>
        </h3>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-xl bg-amber-50 text-amber-900 border border-amber-200">
          {unlockedCount} of {achievements.length} Unlocked
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {achievements.map((item) => (
          <div
            key={item.id}
            className={`p-4 rounded-3xl border transition flex items-start gap-3.5 ${
              item.isUnlocked
                ? 'bg-gradient-to-br from-amber-50/70 to-white border-amber-200 shadow-sm'
                : 'bg-stone-50 border-stone-200/70 opacity-60'
            }`}
          >
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 ${
                item.isUnlocked ? 'bg-amber-100/80 shadow-inner' : 'bg-stone-200 text-stone-400'
              }`}
            >
              {item.isUnlocked ? item.icon : <Lock className="w-5 h-5 text-stone-400" />}
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-stone-900 text-sm">{item.title}</span>
                {item.isUnlocked && <Sparkles className="w-3.5 h-3.5 text-amber-500" />}
              </div>
              <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                {item.description}
              </p>
              {item.unlockedAt && (
                <div className="text-[10px] text-amber-800/80 font-medium mt-2">
                  Unlocked {new Date(item.unlockedAt).toLocaleDateString()}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
