import React from 'react';
import { CheckCircle2, Circle, Lock, Sparkles } from 'lucide-react';
import { SkillProgress } from '../../types';

interface LearningMemoryMapProps {
  skills: SkillProgress[];
  onSelectSkill: (skillName: string) => void;
}

export const LearningMemoryMap: React.FC<LearningMemoryMapProps> = ({ skills, onSelectSkill }) => {
  return (
    <div className="space-y-6">
      {skills.map((skill) => (
        <div
          key={skill.id || skill.skillName}
          className="p-6 rounded-3xl bg-white border border-stone-200/90 shadow-sm hover:border-emerald-200 transition"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                {skill.category}
              </span>
              <h4 className="text-xl font-extrabold text-stone-900">{skill.skillName}</h4>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-3 py-1 rounded-xl bg-stone-100 font-bold text-stone-700">
                Level {skill.level}
              </span>
              <span className="text-xs px-3 py-1 rounded-xl bg-emerald-50 text-emerald-800 font-bold border border-emerald-100">
                {skill.xp} XP
              </span>
            </div>
          </div>

          {/* Stepping Path */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {(skill.milestones || []).map((m: any, idx: number) => {
              const isComp = m.status === 'completed';
              const isCurr = m.status === 'current';
              return (
                <div
                  key={m.id}
                  className={`p-3.5 rounded-2xl border text-sm flex items-start gap-3 transition ${
                    isComp
                      ? 'bg-emerald-50/70 border-emerald-200/90 text-emerald-950 font-medium'
                      : isCurr
                      ? 'bg-amber-50/80 border-amber-300 text-amber-950 font-semibold ring-2 ring-amber-200/50'
                      : 'bg-stone-50 border-stone-200/70 text-stone-400'
                  }`}
                >
                  <div className="mt-0.5">
                    {isComp ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : isCurr ? (
                      <Sparkles className="w-4 h-4 text-amber-500 shrink-0 animate-spin" />
                    ) : (
                      <Lock className="w-4 h-4 text-stone-300 shrink-0" />
                    )}
                  </div>
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider opacity-70">
                      Step {idx + 1} • {isComp ? 'Completed' : isCurr ? 'Ready' : 'Locked'}
                    </div>
                    <div className="font-semibold text-sm mt-0.5 leading-snug">{m.name}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};
