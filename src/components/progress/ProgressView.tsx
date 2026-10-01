import React, { useState } from 'react';
import {
  TrendingUp,
  Sparkles,
  Award,
  Layers,
  Calendar,
  Plus,
  BookOpen,
  Target,
  CheckCircle2,
  Compass,
} from 'lucide-react';
import { UserProfile, UserTopic, Goal, SkillNode, LearningSession, Achievement, WorldRegion, Quest } from '../../types';
import { SkillTree } from './SkillTree';
import { AchievementsList } from './AchievementsList';
import { HistoryTimeline } from './HistoryTimeline';

interface ProgressViewProps {
  profile: UserProfile;
  userTopics: UserTopic[];
  goals: Goal[];
  skills: SkillNode[];
  sessions: LearningSession[];
  achievements: Achievement[];
  worldRegions: WorldRegion[];
  onAddNewTopic: () => void;
  onStartSkillQuest: (skill: SkillNode) => void;
}

export const ProgressView: React.FC<ProgressViewProps> = ({
  profile,
  userTopics,
  goals,
  skills,
  sessions,
  achievements,
  worldRegions,
  onAddNewTopic,
  onStartSkillQuest,
}) => {
  const [selectedTopicId, setSelectedTopicId] = useState<string>(userTopics[0]?.id || '');
  const [activeTab, setActiveTab] = useState<'skills' | 'history' | 'achievements' | 'goals'>('skills');

  const activeTopic = userTopics.find((t) => t.id === selectedTopicId) || userTopics[0];
  const topicSkills = skills.filter((s) => s.userTopicId === activeTopic?.id || s.topicSlug === activeTopic?.topicId);
  const topicGoals = goals.filter((g) => g.userTopicId === activeTopic?.id || g.topicName === activeTopic?.topicName);
  const topicSessions = sessions.filter((s) => s.userTopicId === activeTopic?.id || s.topicName === activeTopic?.topicName);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* 1. Overall Learner Header */}
      <div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/70 border border-emerald-200 text-emerald-800 text-xs font-bold mb-2">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-700" />
              <span>Multi-Topic Journey</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-stone-900 tracking-tight">
              Your Learning Forest
            </h1>
            <p className="text-stone-600 mt-1 text-sm md:text-base">
              Each topic grows its own skills, level, and 3D district. Nothing disappears.
            </p>
          </div>

          <button
            type="button"
            onClick={onAddNewTopic}
            className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5 self-start md:self-auto cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Topic</span>
          </button>
        </div>

        {/* 2. Independent Topic Progress Cards (Section 62) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
          {userTopics.map((ut) => {
            const isSelected = activeTopic?.id === ut.id;
            return (
              <div
                key={ut.id}
                onClick={() => setSelectedTopicId(ut.id)}
                className={`p-5 rounded-3xl border-2 transition cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/60 shadow-md ring-2 ring-emerald-500/20'
                    : 'border-stone-200/80 bg-white hover:border-emerald-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{ut.topicIcon}</span>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-xl bg-white border border-stone-200 text-stone-700">
                      Level {ut.level}
                    </span>
                  </div>
                  <h3 className="font-extrabold text-stone-900 text-lg mt-2">{ut.topicName}</h3>
                  <div className="text-xs text-emerald-700 font-semibold mt-0.5">{ut.xp} XP Earned</div>
                </div>

                {/* Progress bar */}
                <div className="mt-4">
                  <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, Math.max(15, (ut.xp % 100) + 15))}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Topic View Navigation Tabs */}
      <div className="flex border-b border-stone-200 overflow-x-auto gap-2">
        <button
          type="button"
          onClick={() => setActiveTab('skills')}
          className={`pb-3 px-3 font-bold text-sm transition relative whitespace-nowrap ${
            activeTab === 'skills'
              ? 'text-emerald-700 border-b-2 border-emerald-600'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          {activeTopic?.topicName} Skill Tree ({topicSkills.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('goals')}
          className={`pb-3 px-3 font-bold text-sm transition relative whitespace-nowrap ${
            activeTab === 'goals'
              ? 'text-emerald-700 border-b-2 border-emerald-600'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          Goals ({topicGoals.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('history')}
          className={`pb-3 px-3 font-bold text-sm transition relative whitespace-nowrap ${
            activeTab === 'history'
              ? 'text-emerald-700 border-b-2 border-emerald-600'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          History ({sessions.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('achievements')}
          className={`pb-3 px-3 font-bold text-sm transition relative whitespace-nowrap ${
            activeTab === 'achievements'
              ? 'text-emerald-700 border-b-2 border-emerald-600'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          Milestone Badges ({achievements.filter((a) => a.isUnlocked).length})
        </button>
      </div>

      {/* 4. Tab Contents */}
      {activeTab === 'skills' && (
        <SkillTree
          skills={topicSkills}
          topicName={activeTopic?.topicName || 'Topic'}
          onSelectSkillForQuest={onStartSkillQuest}
        />
      )}

      {activeTab === 'goals' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {topicGoals.map((g) => (
              <div key={g.id} className="p-6 rounded-3xl bg-white border border-stone-200/90 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-100">
                    {g.topicName}
                  </span>
                  <span className="text-xs text-stone-400">Added {new Date(g.createdAt).toLocaleDateString()}</span>
                </div>
                <h4 className="font-extrabold text-stone-900 text-lg">{g.title}</h4>
                <p className="text-xs text-stone-600 leading-relaxed">{g.description}</p>
                <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                  <span>Target: <strong className="text-stone-800">{g.target}</strong></span>
                  <span className="text-emerald-600 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Active
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <HistoryTimeline sessions={sessions} />
      )}

      {activeTab === 'achievements' && (
        <AchievementsList achievements={achievements} />
      )}
    </div>
  );
};
