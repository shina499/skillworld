import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Clock,
  HelpCircle,
  Play,
  RotateCcw,
  Compass,
  CheckCircle,
  Plus,
  Flame,
  Target,
  FileCheck,
  Wrench,
  Database,
  Award,
  ChevronRight,
} from 'lucide-react';
import { UserProfile, UserTopic, Goal, SkillNode, Quest, LearningSession } from '../../types';
import { getGreeting, getEncouragementMessage } from '../../lib/notifications/encouragementCopy';
import { ComebackBanner } from './ComebackBanner';
import { QuestPlayerModal } from './QuestPlayerModal';
import { SupabaseSqlModal } from '../common/SupabaseSqlModal';
import { PROFESSIONAL_QUESTS } from '../../data/professionalQuests';
import { personalizationEngine } from '../../lib/personalization/engine';
import { scoreQuestSuitability } from '../../lib/personalization/recommendationScorer';

interface TodayViewProps {
  profile: UserProfile;
  userTopics: UserTopic[];
  goals: Goal[];
  skills: SkillNode[];
  sessions: LearningSession[];
  quests: Quest[];
  onCompleteQuest: (completedQuest: Quest, durationMinutes: number, score: number, note?: string) => void;
  onSelectTopicDistrict: (userTopicId: string) => void;
  onAddNewTopic: () => void;
}

export const TodayView: React.FC<TodayViewProps> = ({
  profile,
  userTopics,
  goals,
  skills,
  sessions,
  quests,
  onCompleteQuest,
  onSelectTopicDistrict,
  onAddNewTopic,
}) => {
  const [selectedTopicId, setSelectedTopicId] = useState<string>(userTopics[0]?.id || '');
  const [activePlayerQuest, setActivePlayerQuest] = useState<Quest | null>(null);
  const [showSqlModal, setShowSqlModal] = useState(false);

  const activeTopic = userTopics.find((t) => t.id === selectedTopicId) || userTopics[0];

  // Candidates for this topic + professional curated library
  const topicCandidates = useMemo(() => {
    const topicNorm = (activeTopic?.topicName || '').toLowerCase().trim();
    const list = [
      ...PROFESSIONAL_QUESTS.filter((q) => (q.topicName || '').toLowerCase().includes(topicNorm)),
      ...quests.filter(
        (q) => q.userTopicId === activeTopic?.id || (q.topicName || '').toLowerCase().includes(topicNorm)
      ),
    ];

    // Deduplicate by ID
    const map = new Map<string, Quest>();
    for (const q of list) {
      map.set(q.id, q);
    }
    return map.size > 0 ? Array.from(map.values()) : PROFESSIONAL_QUESTS;
  }, [activeTopic, quests]);

  // Run the 11-factor recommendation engine
  const recommendation = useMemo(() => {
    return personalizationEngine.getTodayRecommendation(
      profile,
      goals,
      skills,
      sessions,
      [],
      activeTopic?.topicName,
      topicCandidates
    );
  }, [profile, goals, skills, sessions, activeTopic, topicCandidates]);

  const primaryQuest = recommendation.quest;

  const scoredInfo = useMemo(() => {
    return scoreQuestSuitability(primaryQuest, {
      profile,
      goals,
      skills,
      sessions,
      activeTopicName: activeTopic?.topicName,
    });
  }, [primaryQuest, profile, goals, skills, sessions, activeTopic]);

  // Other available quests in this topic
  const alternativeQuests = useMemo(() => {
    return topicCandidates.filter((q) => q.id !== primaryQuest.id).slice(0, 3);
  }, [topicCandidates, primaryQuest]);

  // Inactivity calculation for comeback check
  const lastSessionDate =
    sessions.length > 0 ? new Date(sessions[sessions.length - 1].completedAt).getTime() : Date.now();
  const diffHours = (Date.now() - lastSessionDate) / (1000 * 60 * 60);
  const daysAway = Math.max(0, Math.floor(diffHours / 24));
  const isComeback = daysAway >= 3;

  const greeting = getGreeting(profile.displayName);
  const encouragement = getEncouragementMessage(profile.encouragementStyle, isComeback);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
      {/* 1. Header & Zero-Guilt Learning Rhythm */}
      <div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/70 border border-emerald-200 text-emerald-800 text-xs font-semibold mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>{profile.overallIdentity}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-stone-900 tracking-tight">
              {greeting}
            </h1>
            <p className="text-stone-600 mt-1 text-sm md:text-base">
              {encouragement}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3 bg-white/90 backdrop-blur px-5 py-3 rounded-2xl border border-stone-200/80 shadow-sm">
              <div className="text-2xl">🌱</div>
              <div>
                <div className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">
                  Weekly Rhythm
                </div>
                <div className="text-stone-800 font-bold text-sm">
                  {profile.activeDaysThisWeek} active {profile.activeDaysThisWeek === 1 ? 'day' : 'days'} this week
                </div>
              </div>
            </div>

            {/* Supabase SQL Setup Action */}
            <button
              type="button"
              onClick={() => setShowSqlModal(true)}
              className="p-3 rounded-2xl bg-white hover:bg-emerald-50 border border-stone-200 hover:border-emerald-300 text-stone-700 hover:text-emerald-800 transition shadow-sm flex items-center gap-2 cursor-pointer text-xs font-bold"
              title="View & Copy Supabase SQL Schema"
            >
              <Database className="w-4 h-4 text-emerald-600" />
              <span className="hidden sm:inline">Supabase SQL</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Comeback Banner if returning after a break */}
      {isComeback && (
        <ComebackBanner
          daysAway={daysAway}
          onStartComeback={() => setActivePlayerQuest(primaryQuest)}
        />
      )}

      {/* 3. Topic Selector Strip */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <span className="text-xs font-bold text-stone-500 uppercase tracking-wider pr-1 shrink-0">
          Focus:
        </span>
        {userTopics.map((ut) => {
          const isSelected = activeTopic?.id === ut.id;
          return (
            <button
              key={ut.id}
              type="button"
              onClick={() => setSelectedTopicId(ut.id)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-2 shrink-0 cursor-pointer ${
                isSelected
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'bg-white border border-stone-200 text-stone-700 hover:border-emerald-300'
              }`}
            >
              <span>{ut.topicIcon}</span>
              <span>{ut.topicName}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                  isSelected ? 'bg-white/20' : 'bg-stone-100 text-stone-500'
                }`}
              >
                Lvl {ut.level}
              </span>
            </button>
          );
        })}

        <button
          type="button"
          onClick={onAddNewTopic}
          className="px-3.5 py-2 rounded-2xl border border-dashed border-stone-300 hover:border-emerald-400 text-stone-600 hover:text-emerald-700 text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Topic</span>
        </button>
      </div>

      {/* 4. MAIN RECOMMENDED QUEST */}
      <div className="relative overflow-hidden rounded-3xl bg-white border border-stone-200/90 shadow-xl p-6 md:p-8 hover:border-emerald-300 transition-all">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-amber-400" />

        <div className="space-y-6">
          {/* Top Badges & Recommendation Score */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-xl bg-emerald-100 text-emerald-900 border border-emerald-200 font-extrabold text-xs uppercase tracking-wider">
                {activeTopic?.topicIcon} {primaryQuest.categoryTypeBadge || primaryQuest.type.toUpperCase()}
              </span>
              <span className="px-2.5 py-1 rounded-xl bg-stone-100 text-stone-700 text-xs font-bold uppercase tracking-wider">
                {primaryQuest.difficulty}
              </span>
              <span className="flex items-center gap-1 text-xs text-stone-500 font-medium px-2 py-0.5">
                <Clock className="w-3.5 h-3.5 text-stone-400" />
                ~{primaryQuest.estimatedMinutes} mins
              </span>
              <span className="text-xs px-2.5 py-1 rounded-xl bg-amber-50 text-amber-800 font-bold border border-amber-200">
                +{primaryQuest.rewardXp} XP
              </span>
            </div>

            {/* Recommendation Engine Match Badge */}
            <div className="text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-emerald-600" />
              <span>Recommended Match • Fit {Math.min(99, Math.max(78, 60 + scoredInfo.score))}%</span>
            </div>
          </div>

          {/* Title & Description */}
          <div>
            <div className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">
              Practicing: <span className="text-emerald-700 font-extrabold">{primaryQuest.skillName}</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-stone-900 tracking-tight">
              {primaryQuest.title}
            </h2>
            <p className="text-stone-600 mt-2 text-sm md:text-base leading-relaxed">
              {primaryQuest.description}
            </p>
          </div>

          {/* Objective & Deliverable Outcome */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-1">
              <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-800 uppercase tracking-wider">
                <Target className="w-4 h-4 text-emerald-600" />
                <span>Measurable Objective</span>
              </div>
              <p className="text-stone-800 text-xs sm:text-sm font-medium leading-relaxed">
                {primaryQuest.objective || `Apply foundational principles of ${primaryQuest.skillName} with immediate practice.`}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-1">
              <div className="flex items-center gap-2 text-xs font-extrabold text-stone-700 uppercase tracking-wider">
                <FileCheck className="w-4 h-4 text-emerald-600" />
                <span>Expected Deliverable</span>
              </div>
              <p className="text-stone-800 text-xs sm:text-sm font-medium leading-relaxed">
                {primaryQuest.expectedOutcome || 'A completed interactive exercise with verified completion criteria.'}
              </p>
            </div>
          </div>

          {/* Why This Quest Feature */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 text-sm flex items-start gap-3">
            <HelpCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-extrabold text-stone-800 block text-xs uppercase tracking-wider mb-0.5">
                Why this quest for you?
              </span>
              <p className="text-stone-600 text-sm leading-relaxed italic">
                "{recommendation.whyExplanation}"
              </p>
            </div>
          </div>

          {/* Start CTA */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-2 text-xs text-stone-500 font-medium">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Interactive verification included • Zero failure penalty</span>
            </div>

            <button
              type="button"
              onClick={() => setActivePlayerQuest(primaryQuest)}
              className="px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-black text-sm shadow-xl shadow-emerald-600/25 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Start Assignment</span>
            </button>
          </div>
        </div>
      </div>

      {/* 5. ALTERNATIVE QUESTS IN THIS TOPIC DISTRICT */}
      {alternativeQuests.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-stone-800">
              More Quests in {activeTopic?.topicName}
            </h3>
            <span className="text-xs text-stone-500 font-medium">
              Adaptive library
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {alternativeQuests.map((altQuest) => (
              <div
                key={altQuest.id}
                className="p-4 rounded-2xl bg-white border border-stone-200 hover:border-emerald-300 transition-all flex flex-col justify-between gap-3 shadow-sm hover:shadow"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-stone-100 text-stone-700">
                      {altQuest.categoryTypeBadge || altQuest.type}
                    </span>
                    <span className="text-xs font-bold text-amber-700">
                      +{altQuest.rewardXp} XP
                    </span>
                  </div>
                  <h4 className="font-extrabold text-stone-900 text-sm line-clamp-1">
                    {altQuest.title}
                  </h4>
                  <p className="text-stone-500 text-xs mt-1 line-clamp-2 leading-relaxed">
                    {altQuest.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                  <span className="text-xs text-stone-400 font-medium">
                    ~{altQuest.estimatedMinutes}m
                  </span>
                  <button
                    type="button"
                    onClick={() => setActivePlayerQuest(altQuest)}
                    className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-emerald-600 hover:text-white text-stone-800 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                  >
                    <span>Launch</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quest Player Modal */}
      {activePlayerQuest && (
        <QuestPlayerModal
          quest={activePlayerQuest}
          encouragementStyle={profile.encouragementStyle}
          isOpen={true}
          onClose={() => setActivePlayerQuest(null)}
          onComplete={(completedQuest, duration, score, note) => {
            onCompleteQuest(completedQuest, duration, score, note);
            setActivePlayerQuest(null);
          }}
        />
      )}

      {/* Supabase SQL Setup Modal */}
      <SupabaseSqlModal
        isOpen={showSqlModal}
        onClose={() => setShowSqlModal(false)}
      />
    </div>
  );
};
