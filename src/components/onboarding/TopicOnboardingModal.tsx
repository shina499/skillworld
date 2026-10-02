import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Check,
  Compass,
  Layers,
  Heart,
  Clock,
  Shield,
  Plus,
} from 'lucide-react';
import {
  Topic,
  TopicQuestion,
  Goal,
  SkillNode,
  Quest,
  WorldRegion,
  UserProfile,
} from '../../types';
import { gardenDb } from '../../lib/supabase/client';
import { DEFAULT_TOPICS, getCategoryIslandTheme } from '../../lib/supabase/database';

interface TopicOnboardingModalProps {
  isOpen: boolean;
  isAddingSingleTopic?: boolean;
  preselectedTopicSlug?: string;
  onComplete: (payload: {
    selectedTopics: Topic[];
    topicData: {
      topic: Topic;
      answers: Record<string, any>;
      goalTitle: string;
      initialSkills: SkillNode[];
      starterQuests: Quest[];
      region: Omit<WorldRegion, 'id' | 'worldId' | 'userTopicId'>;
    }[];
    generalPreferences: {
      sessionMinutes: number;
      preferredTime: UserProfile['preferredTime'];
      encouragementStyle: UserProfile['encouragementStyle'];
      overallIdentity: string;
    };
  }) => void;
  onClose?: () => void;
}

export const TopicOnboardingModal: React.FC<TopicOnboardingModalProps> = ({
  isOpen,
  isAddingSingleTopic = false,
  preselectedTopicSlug,
  onComplete,
  onClose,
}) => {
  const [availableTopics, setAvailableTopics] = useState<Topic[]>(DEFAULT_TOPICS);
  const [selectedTopicSlugs, setSelectedTopicSlugs] = useState<string[]>(() => {
    if (preselectedTopicSlug) return [preselectedTopicSlug];
    return ['programming', 'drawing'];
  });
  const [customTopicInput, setCustomTopicInput] = useState('');
  const [customTopics, setCustomTopics] = useState<Topic[]>([]);

  // Phase index: 0 = Choose Topics, 1..N = Topic Specific Questions, N+1 = General Preferences, N+2 = Growing World reveal
  const [phase, setPhase] = useState<number>(isAddingSingleTopic ? 1 : 0);

  // Store answers per topic: { [topicSlug]: { [questionId]: value } }
  const [answersByTopic, setAnswersByTopic] = useState<Record<string, Record<string, any>>>({});

  // Dynamic questions loaded per topic from Supabase database table 'topic_questions'
  const [topicQuestionsMap, setTopicQuestionsMap] = useState<Record<string, TopicQuestion[]>>({});
  const [loadingQuestions, setLoadingQuestions] = useState(false);

  // General preferences
  const [sessionMinutes, setSessionMinutes] = useState(15);
  const [preferredTime, setPreferredTime] = useState<UserProfile['preferredTime']>('evening');
  const [encouragementStyle, setEncouragementStyle] = useState<UserProfile['encouragementStyle']>('gentle');

  // Load topics dynamically from Supabase database table
  useEffect(() => {
    gardenDb.getTopics().then((res) => {
      if (res && res.length > 0) {
        setAvailableTopics(res);
      }
    });
  }, []);

  // When selected topic changes or phase advances, fetch that topic's specific questions from database
  const allAvailableTopics: Topic[] = [...availableTopics, ...customTopics];
  const chosenTopics: Topic[] = selectedTopicSlugs.map((slug) => {
    const found = allAvailableTopics.find((t) => t.slug === slug);
    if (found) return found;
    return {
      id: slug,
      name: slug.charAt(0).toUpperCase() + slug.slice(1),
      slug: slug,
      icon: '🌱',
      description: 'Personal learning district',
      category: 'custom',
    };
  });

  const currentTopicIndex = phase - 1;
  const isQuestioningTopics = currentTopicIndex >= 0 && currentTopicIndex < chosenTopics.length;
  const currentTopic = isQuestioningTopics ? chosenTopics[currentTopicIndex] : null;

  useEffect(() => {
    if (currentTopic && !topicQuestionsMap[currentTopic.slug]) {
      setLoadingQuestions(true);
      gardenDb.getTopicQuestions(currentTopic.slug).then((qs) => {
        setTopicQuestionsMap((prev) => ({ ...prev, [currentTopic.slug]: qs }));
        setLoadingQuestions(false);
      });
    }
  }, [currentTopic, topicQuestionsMap]);

  if (!isOpen) return null;

  const handleToggleTopic = (slug: string) => {
    if (selectedTopicSlugs.includes(slug)) {
      if (selectedTopicSlugs.length > 1) {
        setSelectedTopicSlugs(selectedTopicSlugs.filter((s) => s !== slug));
      }
    } else {
      setSelectedTopicSlugs([...selectedTopicSlugs, slug]);
    }
  };

  const handleAddCustomTopic = () => {
    if (!customTopicInput.trim()) return;
    const slug = customTopicInput.trim().toLowerCase().replace(/[^a-z0-9]/g, '-');
    const newTopic: Topic = {
      id: `topic_${slug}_${Date.now()}`,
      name: customTopicInput.trim(),
      slug,
      icon: '✨',
      description: 'Your personal custom passion district',
      category: 'custom',
      isCustom: true,
    };
    setCustomTopics((prev) => [...prev, newTopic]);
    setSelectedTopicSlugs((prev) => [...prev, slug]);
    setCustomTopicInput('');
  };

  const setAnswer = (topicSlug: string, questionId: string, val: any) => {
    setAnswersByTopic((prev) => ({
      ...prev,
      [topicSlug]: {
        ...(prev[topicSlug] || {}),
        [questionId]: val,
      },
    }));
  };

  const isGeneralPrefPhase = phase === chosenTopics.length + 1;
  const isWorldGrowingReveal = phase === chosenTopics.length + 2;

  // Calculate learner identity
  const calculateIdentity = () => {
    const hasTech = chosenTopics.some((t) => t.category === 'tech' || t.slug === 'programming');
    const hasArt = chosenTopics.some((t) => t.category === 'art' || t.category === 'photo' || t.category === 'music');
    if (hasTech && hasArt) return 'Creative Builder';
    if (hasTech) return 'Logical Architect';
    if (hasArt) return 'Expressive Artisan';
    return 'Curious Explorer';
  };

  // Final submission: generate skills and regions using dynamic database configuration
  const handleFinalBuild = () => {
    const topicData = chosenTopics.map((top, idx) => {
      const topAnswers = answersByTopic[top.slug] || {};
      const goalKey = Object.keys(topAnswers).find((k) => k.includes('goal')) || '';
      const goalTitle = topAnswers[goalKey] || `Explore & Practice ${top.name}`;
      const theme = getCategoryIslandTheme(top.category);

      const initialSkills: SkillNode[] = [
        {
          id: `skill_${top.slug}_1`,
          topicSlug: top.slug,
          name: `${top.name} Foundations`,
          description: `Core principles and observation techniques in ${top.name}.`,
          orderIndex: 1,
          difficulty: 'Beginner',
          status: 'active',
          xp: 25,
          level: 1,
          progressPercentage: 25,
        },
        {
          id: `skill_${top.slug}_2`,
          topicSlug: top.slug,
          name: `${top.name} Creative Practice`,
          description: `Hands-on creative experimentation and exercises.`,
          orderIndex: 2,
          difficulty: 'Beginner',
          status: 'available',
          xp: 0,
          level: 1,
          progressPercentage: 0,
        },
        {
          id: `skill_${top.slug}_3`,
          topicSlug: top.slug,
          name: `${top.name} Project Construction`,
          description: `Building finished creations and personal showcases.`,
          orderIndex: 3,
          difficulty: 'Intermediate',
          status: 'locked',
          xp: 0,
          level: 1,
          progressPercentage: 0,
        },
      ];

      const starterQuests: Quest[] = [
        {
          id: `quest_${top.slug}_discovery_init`,
          topicName: top.name,
          topicSlug: top.slug,
          skillName: `${top.name} Foundations`,
          title: `Discovering ${top.name}: The 5-Minute Primer`,
          description: `A gentle interactive exploration tailored to your goal "${goalTitle}".`,
          type: 'lesson',
          difficulty: 'Beginner',
          estimatedMinutes: 5,
          rewardXp: 25,
          whyThisQuest: `Matched to your ambition in ${top.name}.`,
          steps: [
            {
              id: 's1',
              title: `The Core Anchor of ${top.name}`,
              instruction: 'Observe the foundational technique before applying it.',
              type: 'concept',
              content: `In ${top.name}, true progress comes from tiny daily touchpoints rather than weekend cramming.`,
            },
            {
              id: 's2',
              title: 'Micro Reflection Check',
              instruction: 'What feels most intriguing about this step?',
              type: 'reflection',
              promptQuestion: 'Write a quick 1-sentence note for your learning memory.',
            },
          ],
        },
      ];

      // Distribute island positions around central hub
      const angle = (idx / Math.max(1, chosenTopics.length)) * Math.PI * 2;
      const radius = 6.2;
      const posX = Math.sin(angle) * radius;
      const posZ = Math.cos(angle) * radius;

      return {
        topic: top,
        answers: topAnswers,
        goalTitle,
        initialSkills,
        starterQuests,
        region: {
          topicName: top.name,
          topicCategory: top.category,
          regionType: theme.regionType,
          stage: 1,
          progress: 15,
          unlocked: true,
          theme: theme.theme,
          position: [posX, 0.05, posZ] as [number, number, number],
          updatedAt: new Date().toISOString(),
        },
      };
    });

    onComplete({
      selectedTopics: chosenTopics,
      topicData,
      generalPreferences: {
        sessionMinutes,
        preferredTime,
        encouragementStyle,
        overallIdentity: calculateIdentity(),
      },
    });
  };

  const activeQuestions: TopicQuestion[] = currentTopic ? (topicQuestionsMap[currentTopic.slug] || []) : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/75 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-emerald-100 flex flex-col max-h-[92vh]">
        {/* Header Bar */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-50 via-stone-50 to-teal-50 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-sm font-bold shadow-sm">
              🌱
            </span>
            <div>
              <h3 className="font-extrabold text-stone-900 text-sm tracking-tight">
                {phase === 0
                  ? 'Choose Your Learning Passions'
                  : isQuestioningTopics && currentTopic
                  ? `${currentTopic.icon} ${currentTopic.name} Setup`
                  : isGeneralPrefPhase
                  ? 'Your Learning Rhythm'
                  : 'Constructing Your World'}
              </h3>
              <p className="text-[11px] text-stone-500">
                {phase === 0
                  ? 'Step 1 of Discovery'
                  : isQuestioningTopics
                  ? `Topic ${currentTopicIndex + 1} of ${chosenTopics.length} • Powered by Supabase`
                  : isGeneralPrefPhase
                  ? 'Daily cadence and style'
                  : 'Synthesizing your 3D islands'}
              </p>
            </div>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="text-stone-400 hover:text-stone-700 text-sm font-bold p-1 cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Phase 0: Choose Topics */}
          {phase === 0 && (
            <div className="space-y-5 animate-fade-in">
              <div className="space-y-1">
                <h4 className="text-xl font-black text-stone-900">
                  What would you love to learn or practice?
                </h4>
                <p className="text-xs text-stone-600">
                  Select all topics that spark your curiosity. Each topic generates a distinct floating island in your 3D world.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {allAvailableTopics.map((top) => {
                  const isSelected = selectedTopicSlugs.includes(top.slug);
                  return (
                    <button
                      key={top.id}
                      type="button"
                      onClick={() => handleToggleTopic(top.slug)}
                      className={`p-3.5 rounded-2xl border text-left transition flex items-start gap-3 cursor-pointer ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-50/70 shadow-sm ring-2 ring-emerald-500/20'
                          : 'border-stone-200 hover:border-stone-300 bg-white hover:bg-stone-50/50'
                      }`}
                    >
                      <span className="text-2xl p-2 rounded-xl bg-white border border-stone-200/80 shadow-xs shrink-0">
                        {top.icon}
                      </span>
                      <div className="overflow-hidden">
                        <div className="font-extrabold text-stone-900 text-sm flex items-center justify-between">
                          <span>{top.name}</span>
                          {isSelected && <Check className="w-4 h-4 text-emerald-600" />}
                        </div>
                        <p className="text-[11px] text-stone-500 line-clamp-2 mt-0.5">
                          {top.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Add Custom Topic Input */}
              <div className="pt-2 border-t border-stone-200/60 flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Have a custom passion? (e.g. Japanese, Calisthenics, Gardening)"
                  value={customTopicInput}
                  onChange={(e) => setCustomTopicInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddCustomTopic();
                    }
                  }}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-stone-50/50"
                />
                <button
                  type="button"
                  onClick={handleAddCustomTopic}
                  disabled={!customTopicInput.trim()}
                  className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-black text-white font-bold text-xs disabled:opacity-40 transition flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Island</span>
                </button>
              </div>
            </div>
          )}

          {/* Phase 1..N: Specific Questions per Topic */}
          {isQuestioningTopics && currentTopic && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80">
                <span className="text-3xl p-2 rounded-xl bg-white shadow-xs">
                  {currentTopic.icon}
                </span>
                <div>
                  <div className="text-[10px] font-extrabold text-emerald-700 uppercase tracking-wider">
                    Island Calibration
                  </div>
                  <h4 className="text-base font-black text-stone-900">
                    {currentTopic.name} District
                  </h4>
                  <p className="text-xs text-stone-500">
                    Questions dynamically loaded from Supabase database table <code className="text-emerald-700 font-mono text-[10px]">topic_questions</code>
                  </p>
                </div>
              </div>

              {loadingQuestions ? (
                <div className="py-8 text-center text-xs text-stone-500 animate-pulse">
                  Loading tailored questions for {currentTopic.name}...
                </div>
              ) : (
                <div className="space-y-5">
                  {activeQuestions.map((q) => {
                    const currentVal = answersByTopic[currentTopic.slug]?.[q.id];

                    return (
                      <div key={q.id} className="space-y-2 p-4 rounded-2xl border border-stone-200/70 bg-white">
                        <div>
                          <label className="block text-xs font-black text-stone-900">
                            {q.question}
                          </label>
                          {q.subtitle && (
                            <p className="text-[11px] text-stone-500 mt-0.5">{q.subtitle}</p>
                          )}
                        </div>

                        {/* Input rendering based on type */}
                        {q.type === 'text' && (
                          <input
                            type="text"
                            placeholder={q.placeholder || 'Type your answer...'}
                            value={currentVal || ''}
                            onChange={(e) => setAnswer(currentTopic.slug, q.id, e.target.value)}
                            className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          />
                        )}

                        {q.type === 'single_choice' && q.options && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                            {q.options.map((opt) => {
                              const isSelected = currentVal === opt;
                              return (
                                <button
                                  key={opt}
                                  type="button"
                                  onClick={() => setAnswer(currentTopic.slug, q.id, opt)}
                                  className={`px-3 py-2 rounded-xl text-xs font-semibold text-left transition border cursor-pointer ${
                                    isSelected
                                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold'
                                      : 'border-stone-200 hover:border-stone-300 bg-stone-50 text-stone-700'
                                  }`}
                                >
                                  {opt}
                                </button>
                              );
                            })}
                          </div>
                        )}

                        {q.type === 'multi_choice' && q.options && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                            {q.options.map((opt) => {
                              const list = Array.isArray(currentVal) ? currentVal : [];
                              const isSelected = list.includes(opt);
                              return (
                                <button
                                  key={opt}
                                  type="button"
                                  onClick={() => {
                                    if (isSelected) {
                                      setAnswer(
                                        currentTopic.slug,
                                        q.id,
                                        list.filter((x: string) => x !== opt)
                                      );
                                    } else {
                                      setAnswer(currentTopic.slug, q.id, [...list, opt]);
                                    }
                                  }}
                                  className={`px-3 py-2 rounded-xl text-xs font-semibold text-left transition border cursor-pointer ${
                                    isSelected
                                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold'
                                      : 'border-stone-200 hover:border-stone-300 bg-stone-50 text-stone-700'
                                  }`}
                                >
                                  {opt}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Phase N+1: General Preferences */}
          {isGeneralPrefPhase && (
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-1">
                <h4 className="text-xl font-black text-stone-900">
                  How does learning best fit your life?
                </h4>
                <p className="text-xs text-stone-600">
                  SkillGarden is designed for tiny, sustainable progress without overwhelming guilt.
                </p>
              </div>

              {/* Session Duration */}
              <div className="space-y-2 p-4 rounded-2xl border border-stone-200/80 bg-white">
                <label className="block text-xs font-black text-stone-900 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Ideal Daily Session Length</span>
                </label>
                <div className="grid grid-cols-4 gap-2 pt-1">
                  {[5, 10, 15, 25].map((mins) => (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => setSessionMinutes(mins)}
                      className={`py-2 rounded-xl text-xs font-extrabold transition border cursor-pointer ${
                        sessionMinutes === mins
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-500/20'
                          : 'border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700'
                      }`}
                    >
                      {mins} mins
                    </button>
                  ))}
                </div>
              </div>

              {/* Time of Day */}
              <div className="space-y-2 p-4 rounded-2xl border border-stone-200/80 bg-white">
                <label className="block text-xs font-black text-stone-900 flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Preferred Learning Time</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                  {(['morning', 'afternoon', 'evening', 'night'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setPreferredTime(t)}
                      className={`py-2 px-2 rounded-xl text-xs font-bold capitalize transition border cursor-pointer ${
                        preferredTime === t
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-extrabold'
                          : 'border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Encouragement Style */}
              <div className="space-y-2 p-4 rounded-2xl border border-stone-200/80 bg-white">
                <label className="block text-xs font-black text-stone-900 flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Encouragement Tone</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                  {[
                    { id: 'gentle', label: 'Gentle & Kind', desc: 'No pressure, guilt-free' },
                    { id: 'focused', label: 'Clear & Focused', desc: 'Direct steps, no fluff' },
                    { id: 'energetic', label: 'High Energy', desc: 'Excited & ambitious' },
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setEncouragementStyle(s.id as any)}
                      className={`p-2.5 rounded-xl text-left border transition cursor-pointer ${
                        encouragementStyle === s.id
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold'
                          : 'border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700'
                      }`}
                    >
                      <div className="text-xs font-bold">{s.label}</div>
                      <div className="text-[10px] text-stone-500 mt-0.5">{s.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Phase N+2: Reveal World Generation */}
          {isWorldGrowingReveal && (
            <div className="space-y-6 text-center py-6 animate-fade-in">
              <div className="w-16 h-16 mx-auto rounded-3xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-3xl shadow-sm animate-bounce">
                🏝️
              </div>
              <div className="space-y-1">
                <h4 className="text-2xl font-black text-stone-900">
                  Your Learning Archipelago Is Sprouting!
                </h4>
                <p className="text-xs text-stone-600 max-w-md mx-auto">
                  We have mapped out {chosenTopics.length} distinct districts for{' '}
                  {chosenTopics.map((t) => t.name).join(', ')}. Each island will grow with your daily quests.
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-2 pt-2">
                {chosenTopics.map((t) => (
                  <span
                    key={t.id}
                    className="px-3 py-1.5 rounded-xl bg-white border border-stone-200 shadow-xs text-xs font-bold text-stone-800 flex items-center gap-1.5"
                  >
                    <span>{t.icon}</span>
                    <span>{t.name}</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="px-6 py-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
          {phase > 0 && !isWorldGrowingReveal ? (
            <button
              type="button"
              onClick={() => setPhase((p) => Math.max(0, p - 1))}
              className="px-4 py-2 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-700 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {phase < chosenTopics.length + 1 && (
            <button
              type="button"
              onClick={() => setPhase((p) => p + 1)}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition cursor-pointer active:scale-95"
            >
              <span>{phase === 0 ? 'Continue to Questions' : 'Next Topic'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          {isGeneralPrefPhase && (
            <button
              type="button"
              onClick={() => setPhase(chosenTopics.length + 2)}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition cursor-pointer active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Generate My Islands</span>
            </button>
          )}

          {isWorldGrowingReveal && (
            <button
              type="button"
              onClick={handleFinalBuild}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 transition cursor-pointer active:scale-95"
            >
              <span>Enter My Learning World</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
