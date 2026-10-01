import React, { useState } from 'react';
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
  TopicPreference,
  TopicAnswer,
  Goal,
  SkillNode,
  Quest,
  WorldRegion,
  UserProfile,
} from '../../types';
import {
  ALL_PREDEFINED_TOPIC_CONFIGS,
  getTopicConfig,
  generateCustomTopicConfig,
} from '../../data/topicConfigs';

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
  // Phase 1: Selection of topics
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

  // General preferences
  const [sessionMinutes, setSessionMinutes] = useState(15);
  const [preferredTime, setPreferredTime] = useState<UserProfile['preferredTime']>('evening');
  const [encouragementStyle, setEncouragementStyle] = useState<UserProfile['encouragementStyle']>('gentle');

  if (!isOpen) return null;

  // Active topic list
  const allAvailableTopics: Topic[] = [
    ...Object.values(ALL_PREDEFINED_TOPIC_CONFIGS).map((c) => c.topic),
    ...customTopics,
  ];

  const chosenTopics: Topic[] = selectedTopicSlugs.map((slug) => {
    const found = allAvailableTopics.find((t) => t.slug === slug);
    if (found) return found;
    return generateCustomTopicConfig(slug).topic;
  });

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
    const cfg = generateCustomTopicConfig(customTopicInput.trim());
    setCustomTopics((prev) => [...prev, cfg.topic]);
    setSelectedTopicSlugs((prev) => [...prev, cfg.topic.slug]);
    setCustomTopicInput('');
  };

  // Helper for answering a question in a specific topic
  const setAnswer = (topicSlug: string, questionId: string, val: any) => {
    setAnswersByTopic((prev) => ({
      ...prev,
      [topicSlug]: {
        ...(prev[topicSlug] || {}),
        [questionId]: val,
      },
    }));
  };

  // Check which topic is currently being questioned
  const currentTopicIndex = phase - 1;
  const isQuestioningTopics = currentTopicIndex >= 0 && currentTopicIndex < chosenTopics.length;
  const currentTopic = isQuestioningTopics ? chosenTopics[currentTopicIndex] : null;
  const currentTopicConfig = currentTopic ? getTopicConfig(currentTopic.slug) : null;

  const isGeneralPrefPhase = phase === chosenTopics.length + 1;
  const isWorldGrowingReveal = phase === chosenTopics.length + 2;

  // Calculate learner identity
  const calculateIdentity = () => {
    const hasTech = chosenTopics.some((t) => t.category === 'tech');
    const hasArt = chosenTopics.some((t) => t.category === 'art' || t.category === 'photo' || t.category === 'music');
    if (hasTech && hasArt) return 'Creative Builder';
    if (hasTech) return 'Logical Architect';
    if (hasArt) return 'Expressive Artisan';
    return 'Curious Explorer';
  };

  // Final submission
  const handleFinalBuild = () => {
    const topicData = chosenTopics.map((top, idx) => {
      const cfg = getTopicConfig(top.slug);
      const topAnswers = answersByTopic[top.slug] || {};
      const goalKey = Object.keys(topAnswers).find((k) => k.includes('goal')) || '';
      const goalTitle = topAnswers[goalKey] || `Master ${top.name}`;

      const initialSkills: SkillNode[] = cfg.initialSkills.map((s, sIdx) => ({
        ...s,
        id: `skill_${top.slug}_${sIdx + 1}`,
        status: sIdx === 0 ? 'active' : sIdx === 1 ? 'available' : 'locked',
        xp: sIdx === 0 ? 20 : 0,
        level: 1,
        progressPercentage: sIdx === 0 ? 20 : 0,
      }));

      // Positions around the central hub for up to 6 regions
      const angle = (idx / Math.max(1, chosenTopics.length)) * Math.PI * 2;
      const radius = 3.6;
      const posX = Math.sin(angle) * radius;
      const posZ = Math.cos(angle) * radius;

      return {
        topic: top,
        answers: topAnswers,
        goalTitle,
        initialSkills,
        starterQuests: cfg.starterQuests(`ut_${top.slug}_init`),
        region: {
          topicName: top.name,
          topicCategory: top.category,
          regionType: `${top.slug}_district`,
          stage: 1,
          progress: 15,
          unlocked: true,
          theme: top.category,
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
                  ? 'Choose What You Care About'
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
                  ? `Topic ${currentTopicIndex + 1} of ${chosenTopics.length}`
                  : 'Finalizing Your Garden'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">
              {phase === 0 ? 'Select Topics' : isQuestioningTopics ? `${currentTopicIndex + 1}/${chosenTopics.length}` : 'Done'}
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 md:p-8 overflow-y-auto flex-1 space-y-6">
          {/* PHASE 0: TOPIC SELECTION */}
          {phase === 0 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Discovery</span>
                <h2 className="text-2xl md:text-3xl font-extrabold text-stone-900 mt-1">
                  What are you curious about?
                </h2>
                <p className="text-stone-600 text-sm mt-1">
                  Select one or more topics. SkillGarden will build a tailored questionnaire, skill tree, and 3D world region for each!
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-h-72 overflow-y-auto pr-1">
                {allAvailableTopics.map((top) => {
                  const isSelected = selectedTopicSlugs.includes(top.slug);
                  return (
                    <button
                      key={top.slug}
                      type="button"
                      onClick={() => handleToggleTopic(top.slug)}
                      className={`p-3.5 rounded-2xl border text-left transition flex flex-col justify-between gap-2 text-xs font-semibold cursor-pointer ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50/80 text-emerald-950 font-bold shadow-sm ring-2 ring-emerald-500/20'
                          : 'border-stone-200 hover:border-stone-300 bg-white text-stone-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-2xl">{top.icon}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                      </div>
                      <div className="truncate font-bold text-stone-900">{top.name}</div>
                    </button>
                  );
                })}
              </div>

              {/* Add Custom Topic Input */}
              <div className="pt-2 border-t border-stone-100">
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Have a custom passion? (e.g. "Blender", "Astronomy", "Sewing")
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customTopicInput}
                    onChange={(e) => setCustomTopicInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCustomTopic())}
                    placeholder="Enter any subject..."
                    className="flex-1 px-4 py-2.5 rounded-2xl border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomTopic}
                    className="px-5 py-2.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Custom</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* PHASE 1..N: TOPIC-SPECIFIC QUESTIONS */}
          {isQuestioningTopics && currentTopic && currentTopicConfig && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center gap-3">
                <span className="text-3xl p-2.5 rounded-2xl bg-emerald-100/70 border border-emerald-200">
                  {currentTopic.icon}
                </span>
                <div>
                  <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                    Topic {currentTopicIndex + 1} of {chosenTopics.length} • {currentTopic.name}
                  </span>
                  <h2 className="text-xl md:text-2xl font-extrabold text-stone-900">
                    Let's personalize your {currentTopic.name} journey
                  </h2>
                </div>
              </div>

              {/* Combined Generic & Topic-Specific Questions */}
              <div className="space-y-6">
                {[...currentTopicConfig.genericQuestions, ...currentTopicConfig.topicSpecificQuestions].map((q) => {
                  const currentVal = answersByTopic[currentTopic.slug]?.[q.id];

                  return (
                    <div key={q.id} className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-3">
                      <div>
                        <h4 className="font-bold text-sm text-stone-900">{q.question}</h4>
                        {q.subtitle && <p className="text-xs text-stone-500 mt-0.5">{q.subtitle}</p>}
                      </div>

                      {q.type === 'text' && (
                        <input
                          type="text"
                          value={currentVal || ''}
                          onChange={(e) => setAnswer(currentTopic.slug, q.id, e.target.value)}
                          placeholder={q.placeholder || 'Type your answer...'}
                          className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      )}

                      {q.type === 'single_choice' && q.options && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {q.options.map((opt) => {
                            const isSelected = currentVal === opt;
                            return (
                              <button
                                key={opt}
                                type="button"
                                onClick={() => setAnswer(currentTopic.slug, q.id, opt)}
                                className={`p-2.5 rounded-xl border text-left text-xs font-medium transition flex items-center justify-between ${
                                  isSelected
                                    ? 'bg-emerald-600 text-white border-emerald-600 font-bold shadow-sm'
                                    : 'bg-white border-stone-200 text-stone-700 hover:border-emerald-300'
                                }`}
                              >
                                <span>{opt}</span>
                                {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                              </button>
                            );
                          })}
                        </div>
                      )}

                      {q.type === 'multi_choice' && q.options && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {q.options.map((opt) => {
                            const selectedList: string[] = Array.isArray(currentVal) ? currentVal : [];
                            const isSelected = selectedList.includes(opt);
                            return (
                              <button
                                key={opt}
                                type="button"
                                onClick={() => {
                                  const next = isSelected
                                    ? selectedList.filter((x) => x !== opt)
                                    : [...selectedList, opt];
                                  setAnswer(currentTopic.slug, q.id, next);
                                }}
                                className={`p-2.5 rounded-xl border text-left text-xs font-medium transition flex items-center justify-between ${
                                  isSelected
                                    ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold'
                                    : 'bg-white border-stone-200 text-stone-700 hover:border-emerald-300'
                                }`}
                              >
                                <span>{opt}</span>
                                {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* PHASE N+1: GENERAL PREFERENCES */}
          {isGeneralPrefPhase && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Pace & Tone</span>
                <h2 className="text-2xl font-extrabold text-stone-900 mt-1">
                  How should SkillGarden support you?
                </h2>
                <p className="text-stone-600 text-sm mt-1">
                  We encourage consistency through manageable sessions and zero-guilt encouragement.
                </p>
              </div>

              {/* Session Length */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                  Realistic Session Length
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {[5, 10, 15, 20, 30].map((mins) => (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => setSessionMinutes(mins)}
                      className={`p-3 rounded-2xl border text-center transition ${
                        sessionMinutes === mins
                          ? 'bg-emerald-600 text-white font-bold border-emerald-600 shadow-sm'
                          : 'bg-white border-stone-200 text-stone-700 hover:border-stone-300'
                      }`}
                    >
                      <div className="text-lg font-bold">{mins}</div>
                      <div className="text-[10px] opacity-80">minutes</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Preferred Time */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                  When do you usually have calm moments?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'morning' as const, label: 'Morning 🌅' },
                    { id: 'afternoon' as const, label: 'Afternoon ☀️' },
                    { id: 'evening' as const, label: 'Evening 🌇' },
                    { id: 'night' as const, label: 'Night 🌙' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setPreferredTime(t.id)}
                      className={`p-3 rounded-2xl border text-center text-xs font-semibold transition ${
                        preferredTime === t.id
                          ? 'bg-emerald-50 border-emerald-600 text-emerald-950 font-bold'
                          : 'bg-white border-stone-200 text-stone-700'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Encouragement Style */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                  Encouragement Tone
                </label>
                <div className="space-y-2">
                  {[
                    { id: 'gentle' as const, title: 'Gentle 🌱', quote: '"Ready for a tiny step? Even five minutes counts."' },
                    { id: 'energetic' as const, title: 'Energetic 🔥', quote: '"Let\'s build something exciting today!"' },
                    { id: 'focused' as const, title: 'Focused 🎯', quote: '"Your next targeted challenge is ready."' },
                    { id: 'playful' as const, title: 'Playful 👀', quote: '"Your learning world has been suspiciously quiet 👀"' },
                    { id: 'minimal' as const, title: 'Minimal 🤍', quote: '"Quest ready."' },
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setEncouragementStyle(s.id)}
                      className={`w-full p-3 rounded-2xl border text-left transition flex items-center justify-between text-xs sm:text-sm ${
                        encouragementStyle === s.id
                          ? 'bg-emerald-50 border-emerald-600 text-emerald-950 font-bold'
                          : 'bg-white border-stone-200 text-stone-700'
                      }`}
                    >
                      <div>
                        <div className="font-bold">{s.title}</div>
                        <div className="text-xs text-stone-500 italic mt-0.5">{s.quote}</div>
                      </div>
                      {encouragementStyle === s.id && <Check className="w-4 h-4 text-emerald-600" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* PHASE N+2: WORLD GROWING CINEMATIC REVEAL (Section 81) */}
          {isWorldGrowingReveal && (
            <div className="text-center py-6 space-y-6 animate-scale-up">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center text-4xl shadow-xl shadow-emerald-500/20 animate-pulse">
                🌱
              </div>

              <div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-stone-900">
                  Your world is taking root!
                </h2>
                <p className="text-stone-600 text-sm mt-1 max-w-md mx-auto">
                  Constructing personalized 3D regions for each of your topics:
                </p>
              </div>

              <div className="flex flex-wrap gap-2.5 justify-center max-w-md mx-auto">
                {chosenTopics.map((top) => (
                  <div
                    key={top.slug}
                    className="px-4 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-stone-800 text-xs font-bold flex items-center gap-2 shadow-sm animate-fade-in"
                  >
                    <span>{top.icon}</span>
                    <span>{top.name} District</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex justify-center">
                <button
                  type="button"
                  onClick={handleFinalBuild}
                  className="px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-extrabold text-sm shadow-xl shadow-emerald-600/30 transition flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Enter My 3D World</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        {!isWorldGrowingReveal && (
          <div className="px-6 py-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
            <button
              type="button"
              disabled={phase === 0}
              onClick={() => setPhase((p) => Math.max(0, p - 1))}
              className="px-4 py-2 rounded-xl text-stone-600 hover:text-stone-900 disabled:opacity-30 disabled:pointer-events-none text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>

            <button
              type="button"
              onClick={() => {
                if (phase === 0 && chosenTopics.length === 0) return;
                setPhase((p) => p + 1);
              }}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs sm:text-sm shadow-md transition flex items-center gap-2 cursor-pointer"
            >
              <span>{isGeneralPrefPhase ? 'Construct World' : 'Continue'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
