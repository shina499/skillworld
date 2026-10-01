import React from 'react';
import { X, Award, CheckCircle2, Circle, Lock, Play, Sparkles } from 'lucide-react';
import { SkillProgress, Quest } from '../../types';

interface SkillInspectorModalProps {
  skill: SkillProgress;
  isOpen: boolean;
  onClose: () => void;
  onStartQuest: (skillName: string) => void;
}

export const SkillInspectorModal: React.FC<SkillInspectorModalProps> = ({
  skill,
  isOpen,
  onClose,
  onStartQuest,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-emerald-100 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 uppercase tracking-wider">
              {skill.category}
            </span>
            <h3 className="text-2xl font-extrabold text-stone-900 mt-1">
              {skill.skillName}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-stone-200/60 text-stone-400 hover:text-stone-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 text-center">
              <div className="text-xs text-stone-500 font-medium">Rank</div>
              <div className="text-xl font-bold text-stone-900 mt-0.5">Lvl {skill.level}</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-center">
              <div className="text-xs text-emerald-700 font-medium">Experience</div>
              <div className="text-xl font-bold text-emerald-900 mt-0.5">{skill.xp} XP</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200/80 text-center">
              <div className="text-xs text-amber-700 font-medium">Mastery</div>
              <div className="text-xl font-bold text-amber-900 mt-0.5">{skill.completionPercentage}%</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div>
            <div className="flex justify-between text-xs text-stone-500 font-medium mb-1.5">
              <span>Path Progress</span>
              <span>{skill.completionPercentage}% explored</span>
            </div>
            <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(5, skill.completionPercentage ?? skill.progressPercentage ?? 0))}%` }}
              />
            </div>
          </div>

          {/* Milestones / Learning Memory Map */}
          <div>
            <h4 className="text-sm font-bold text-stone-800 uppercase tracking-wider mb-3">
              Learning Memory
            </h4>
            <div className="space-y-2.5">
              {(skill.milestones || []).map((m: any) => {
                const isComp = m.status === 'completed';
                const isCurr = m.status === 'current';
                return (
                  <div
                    key={m.id}
                    className={`p-3 rounded-2xl border flex items-center justify-between text-sm ${
                      isComp
                        ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950 font-medium'
                        : isCurr
                        ? 'bg-amber-50/60 border-amber-200 text-amber-950 font-semibold'
                        : 'bg-stone-50/40 border-stone-200 text-stone-400'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {isComp ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : isCurr ? (
                        <Sparkles className="w-4 h-4 text-amber-500 shrink-0 animate-spin" />
                      ) : (
                        <Lock className="w-4 h-4 text-stone-300 shrink-0" />
                      )}
                      <span>{m.name}</span>
                    </div>
                    <span className="text-xs capitalize font-semibold">
                      {isComp ? 'Done' : isCurr ? 'In Progress' : 'Next'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="px-6 py-4 bg-stone-50 border-t border-stone-200 flex justify-end">
          <button
            type="button"
            onClick={() => {
              onStartQuest(skill.skillName || skill.name);
              onClose();
            }}
            className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition flex items-center gap-2 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Practice {skill.skillName || skill.name}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
