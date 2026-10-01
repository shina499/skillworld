import React, { useState } from 'react';
import { CheckCircle2, Lock, Play, Sparkles, ChevronRight } from 'lucide-react';
import { SkillNode } from '../../types';

interface SkillTreeProps {
  skills: SkillNode[];
  topicName: string;
  onSelectSkillForQuest?: (skill: SkillNode) => void;
}

export const SkillTree: React.FC<SkillTreeProps> = ({
  skills,
  topicName,
  onSelectSkillForQuest,
}) => {
  const [selectedSkill, setSelectedSkill] = useState<SkillNode>(skills[0] || null);

  const sortedSkills = [...skills].sort((a, b) => a.orderIndex - b.orderIndex);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
      {/* Visual Interactive Tree Spine */}
      <div className="lg:col-span-2 space-y-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
            {topicName} Learning Path
          </span>
          <span className="text-xs text-stone-500 font-semibold">
            {skills.filter((s) => s.status === 'completed').length} / {skills.length} mastered
          </span>
        </div>

        <div className="space-y-3 relative before:absolute before:left-6 before:top-4 before:bottom-4 before:w-0.5 before:bg-stone-200">
          {sortedSkills.map((skill, idx) => {
            const isSelected = selectedSkill?.id === skill.id;
            const isCompleted = skill.status === 'completed';
            const isActive = skill.status === 'active';
            const isAvailable = skill.status === 'available';
            const isLocked = skill.status === 'locked';

            return (
              <div
                key={skill.id}
                onClick={() => setSelectedSkill(skill)}
                className={`relative pl-14 p-4 rounded-2xl border-2 transition cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/70 shadow-sm'
                    : 'border-stone-200/80 bg-white hover:border-emerald-300'
                }`}
              >
                {/* Node Marker along the spine */}
                <div
                  className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold z-10 transition ${
                    isCompleted
                      ? 'bg-emerald-600 text-white shadow-sm ring-4 ring-emerald-100'
                      : isActive
                      ? 'bg-amber-500 text-white animate-pulse ring-4 ring-amber-100'
                      : isAvailable
                      ? 'bg-white border-2 border-stone-400 text-stone-600'
                      : 'bg-stone-200 text-stone-400'
                  }`}
                >
                  {isCompleted ? (
                    '✓'
                  ) : isActive ? (
                    '●'
                  ) : isAvailable ? (
                    '○'
                  ) : (
                    <Lock className="w-2.5 h-2.5" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-stone-400">Step {skill.orderIndex}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase ${
                        isCompleted
                          ? 'bg-emerald-100 text-emerald-800'
                          : isActive
                          ? 'bg-amber-100 text-amber-900'
                          : isAvailable
                          ? 'bg-stone-100 text-stone-700'
                          : 'bg-stone-100 text-stone-400'
                      }`}
                    >
                      {skill.status}
                    </span>
                  </div>
                  <h4 className="font-extrabold text-stone-900 text-base mt-0.5">
                    {skill.name}
                  </h4>
                  <p className="text-xs text-stone-500 line-clamp-1 mt-0.5">
                    {skill.description}
                  </p>
                </div>

                <div className="text-right shrink-0 pl-3">
                  <div className="text-xs font-bold text-stone-700">{skill.progressPercentage}%</div>
                  <div className="text-[10px] text-stone-400">{skill.xp} XP</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Skill Detail Inspector Card */}
      {selectedSkill && (
        <div className="p-6 rounded-3xl bg-white border border-stone-200/90 shadow-sm space-y-5 sticky top-24">
          <div>
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 uppercase tracking-wider border border-emerald-100">
              {selectedSkill.difficulty} Node
            </span>
            <h3 className="text-xl font-extrabold text-stone-900 mt-2">
              {selectedSkill.name}
            </h3>
            <p className="text-xs text-stone-600 mt-1 leading-relaxed">
              {selectedSkill.description}
            </p>
          </div>

          {/* Progress meter */}
          <div>
            <div className="flex justify-between text-xs text-stone-500 font-semibold mb-1">
              <span>Node Progress</span>
              <span>{selectedSkill.progressPercentage}%</span>
            </div>
            <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.max(5, selectedSkill.progressPercentage)}%` }}
              />
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 text-xs text-stone-600 space-y-1">
            <div className="flex justify-between">
              <span>Status:</span>
              <strong className="capitalize text-stone-900">{selectedSkill.status}</strong>
            </div>
            <div className="flex justify-between">
              <span>Node Level:</span>
              <strong className="text-stone-900">Level {selectedSkill.level}</strong>
            </div>
            <div className="flex justify-between">
              <span>Total XP in Node:</span>
              <strong className="text-stone-900">{selectedSkill.xp} XP</strong>
            </div>
          </div>

          {onSelectSkillForQuest && (
            <button
              type="button"
              onClick={() => onSelectSkillForQuest(selectedSkill)}
              className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Practice This Node</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
