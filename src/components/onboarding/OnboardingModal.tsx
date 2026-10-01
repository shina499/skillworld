import React, { useState } from 'react';
import {
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Check,
  Compass,
  Heart,
  Clock,
  Sun,
  Flame,
  HelpCircle,
} from 'lucide-react';
import { PREDEFINED_INTERESTS } from '../../data/predefinedInterests';
import {
  LearningStyle,
  EncouragementStyle,
  PreferredTime,
  UserProfile,
  Goal,
  SkillProgress,
  WorldState,
} from '../../types';

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: (data: {
    profile: Partial<UserProfile>;
    goal: { title: string; category: string; targetSkillName: string; motivation: string[] };
    worldState: Partial<WorldState>;
  }) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onComplete }) => {
  const [step, setStep] = useState(1);
  const totalSteps = 7;

  // Question 1: Interests
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['programming', 'art']);
  const [customInterest, setCustomInterest] = useState('');

  // Question 2: Learning Goal
  const [goalText, setGoalText] = useState('Learn JavaScript to build my own apps');
  const [targetSkillName, setTargetSkillName] = useState('JavaScript');
  const [goalCategory, setGoalCategory] = useState('programming');

  // Question 3: Motivation (Why)
  const [motivations, setMotivations] = useState<string[]>(['For a project', 'Because I genuinely enjoy it']);
  const [customMotivation, setCustomMotivation] = useState('');

  // Question 4: Learning Style
  const [learningStyles, setLearningStyles] = useState<LearningStyle[]>(['projects', 'visual']);

  // Question 5: Session Length
  const [sessionLength, setSessionLength] = useState(15);

  // Question 6: Preferred Time
  const [preferredTime, setPreferredTime] = useState<PreferredTime>('evening');

  // Question 7: Encouragement Style
  const [encouragementStyle, setEncouragementStyle] = useState<EncouragementStyle>('gentle');

  // Optional Depth toggles
  const [showOptional, setShowOptional] = useState(false);
  const [experienceLevel, setExperienceLevel] = useState<'beginner' | 'some' | 'intermediate' | 'advanced'>('beginner');
  const [mainDifficulty, setMainDifficulty] = useState('Finding time');
  const [motivationDriver, setMotivationDriver] = useState('Visible progress');

  if (!isOpen) return null;

  const toggleInterest = (id: string) => {
    if (selectedInterests.includes(id)) {
      if (selectedInterests.length > 1) {
        setSelectedInterests(selectedInterests.filter((i) => i !== id));
      }
    } else {
      setSelectedInterests([...selectedInterests, id]);
    }
  };

  const addCustomInterest = () => {
    if (customInterest.trim() && !selectedInterests.includes(customInterest.trim())) {
      setSelectedInterests([...selectedInterests, customInterest.trim()]);
      setCustomInterest('');
    }
  };

  const toggleMotivation = (mot: string) => {
    if (motivations.includes(mot)) {
      if (motivations.length > 1) {
        setMotivations(motivations.filter((m) => m !== mot));
      }
    } else {
      setMotivations([...motivations, mot]);
    }
  };

  const toggleStyle = (style: LearningStyle) => {
    if (learningStyles.includes(style)) {
      if (learningStyles.length > 1) {
        setLearningStyles(learningStyles.filter((s) => s !== style));
      }
    } else {
      setLearningStyles([...learningStyles, style]);
    }
  };

  const handleFinish = () => {
    onComplete({
      profile: {
        hasCompletedOnboarding: true,
        interests: selectedInterests,
        learningStyles,
        sessionLengthMinutes: sessionLength,
        preferredTime,
        encouragementStyle,
        experienceLevel,
        mainDifficulty,
        motivationDriver,
        totalXp: 10, // Seed welcome XP
        level: 1,
        activeDaysThisWeek: 1,
        lastActiveDate: new Date().toISOString(),
      },
      goal: {
        title: goalText.trim() || 'Explore my curiosities',
        category: goalCategory,
        targetSkillName: targetSkillName.trim() || 'Creative Practice',
        motivation: motivations,
      },
      worldState: {
        level: 1,
        growthStage: 1,
        unlockedRegions: ['main_island'],
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-emerald-100 flex flex-col max-h-[92vh]">
        {/* Top Progress Bar */}
        <div className="px-6 py-4 bg-stone-50 border-b border-stone-200/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🌱</span>
            <span className="font-extrabold text-stone-900 text-sm tracking-tight">
              SkillGarden Discovery
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
              {step <= totalSteps ? `${step} / ${totalSteps}` : 'Ready'}
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 md:p-8 overflow-y-auto flex-1">
          {/* STEP 1: INTERESTS */}
          {step === 1 && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Step 1</span>
                <h2 className="text-2xl md:text-3xl font-extrabold text-stone-900 mt-1">
                  What are you curious about?
                </h2>
                <p className="text-stone-600 text-sm mt-1">
                  Choose one or multiple topics. Your 3D world will sculpt areas for each.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-72 overflow-y-auto pr-1">
                {PREDEFINED_INTERESTS.map((cat) => {
                  const isSelected = selectedInterests.includes(cat.id);
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => toggleInterest(cat.id)}
                      className={`p-3 rounded-2xl border text-left transition flex items-center gap-2.5 text-xs font-semibold cursor-pointer ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold shadow-sm'
                          : 'border-stone-200 hover:border-stone-300 bg-white text-stone-700'
                      }`}
                    >
                      <span className="text-lg">{cat.icon}</span>
                      <span className="truncate">{cat.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* Custom input */}
              <div className="pt-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Something else... (e.g. Chess, Astronomy, Piano)"
                    value={customInterest}
                    onChange={(e) => setCustomInterest(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomInterest())}
                    className="flex-1 px-4 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={addCustomInterest}
                    className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: LEARNING GOAL */}
          {step === 2 && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Step 2</span>
                <h2 className="text-2xl md:text-3xl font-extrabold text-stone-900 mt-1">
                  What would you like to get better at?
                </h2>
                <p className="text-stone-600 text-sm mt-1">
                  Select a starter goal or write your own custom aspiration.
                </p>
              </div>

              <div className="space-y-2">
                {[
                  { title: 'Learn JavaScript to build websites and web apps', skill: 'JavaScript', cat: 'programming' },
                  { title: 'Improve my English speaking for natural conversations', skill: 'English Speaking', cat: 'languages' },
                  { title: 'Learn digital drawing and gesture sketching', skill: 'Art & Drawing', cat: 'art' },
                  { title: 'Master composition and mobile photography', skill: 'Photography', cat: 'photography' },
                  { title: 'Learn piano fundamentals and melodies', skill: 'Music', cat: 'music' },
                ].map((preset) => {
                  const isSelected = goalText === preset.title;
                  return (
                    <button
                      key={preset.title}
                      type="button"
                      onClick={() => {
                        setGoalText(preset.title);
                        setTargetSkillName(preset.skill);
                        setGoalCategory(preset.cat);
                      }}
                      className={`w-full p-3.5 rounded-2xl border text-left transition flex items-center justify-between text-sm ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold'
                          : 'border-stone-200 hover:border-stone-300 bg-white text-stone-700'
                      }`}
                    >
                      <span>{preset.title}</span>
                      {isSelected && <Check className="w-4 h-4 text-emerald-600" />}
                    </button>
                  );
                })}
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Or customize your exact learning goal:
                </label>
                <input
                  type="text"
                  value={goalText}
                  onChange={(e) => {
                    setGoalText(e.target.value);
                    if (!targetSkillName) setTargetSkillName(e.target.value.slice(0, 20));
                  }}
                  className="w-full px-4 py-2.5 rounded-2xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium"
                  placeholder="e.g. Learn Blender to make cozy 3D scenes"
                />
              </div>
            </div>
          )}

          {/* STEP 3: WHY? */}
          {step === 3 && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Step 3</span>
                <h2 className="text-2xl md:text-3xl font-extrabold text-stone-900 mt-1">
                  Why does this matter to you?
                </h2>
                <p className="text-stone-600 text-sm mt-1">
                  Understanding your true motivation helps us tailor gentle prompts and quests.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {[
                  '🎮 For fun',
                  '🎓 For school',
                  '💼 For my future',
                  '🛠️ For a project',
                  '🧠 To challenge myself',
                  '🌱 To improve myself',
                  '🔎 To explore something new',
                  '❤️ Because I genuinely enjoy it',
                ].map((mot) => {
                  const isSelected = motivations.includes(mot);
                  return (
                    <button
                      key={mot}
                      type="button"
                      onClick={() => toggleMotivation(mot)}
                      className={`p-3 rounded-2xl border text-left transition text-xs sm:text-sm font-semibold flex items-center justify-between ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold'
                          : 'border-stone-200 hover:border-stone-300 bg-white text-stone-700'
                      }`}
                    >
                      <span>{mot}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Another reason..."
                  value={customMotivation}
                  onChange={(e) => setCustomMotivation(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && customMotivation.trim()) {
                      e.preventDefault();
                      setMotivations([...motivations, customMotivation.trim()]);
                      setCustomMotivation('');
                    }
                  }}
                  className="w-full px-4 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          )}

          {/* STEP 4: LEARNING STYLE */}
          {step === 4 && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Step 4</span>
                <h2 className="text-2xl md:text-3xl font-extrabold text-stone-900 mt-1">
                  How do you like learning?
                </h2>
                <p className="text-stone-600 text-sm mt-1">
                  We adapt your daily quests to match your learning personality.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { id: 'projects' as LearningStyle, label: '🔨 Building Projects' },
                  { id: 'games' as LearningStyle, label: '🎮 Games' },
                  { id: 'puzzles' as LearningStyle, label: '🧩 Puzzles' },
                  { id: 'practicing' as LearningStyle, label: '✍️ Practicing' },
                  { id: 'visual' as LearningStyle, label: '👀 Visual Examples' },
                  { id: 'reading' as LearningStyle, label: '📖 Reading' },
                  { id: 'explaining' as LearningStyle, label: '🗣️ Explaining Things' },
                  { id: 'experiments' as LearningStyle, label: '🧪 Experiments' },
                ].map((item) => {
                  const isSelected = learningStyles.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleStyle(item.id)}
                      className={`p-3 rounded-2xl border text-left transition text-xs sm:text-sm font-semibold flex items-center justify-between ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold'
                          : 'border-stone-200 hover:border-stone-300 bg-white text-stone-700'
                      }`}
                    >
                      <span>{item.label}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 5: TIME */}
          {step === 5 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Step 5</span>
                <h2 className="text-2xl md:text-3xl font-extrabold text-stone-900 mt-1">
                  How much time feels realistic?
                </h2>
                <p className="text-stone-600 text-sm mt-1">
                  "There is no right answer. Pick what you can realistically do. Even five minutes counts."
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[5, 10, 15, 20, 30, 45].map((mins) => {
                  const isSelected = sessionLength === mins;
                  return (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => setSessionLength(mins)}
                      className={`p-4 rounded-2xl border text-center transition ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold shadow-sm'
                          : 'border-stone-200 hover:border-stone-300 bg-white text-stone-700'
                      }`}
                    >
                      <div className="text-2xl font-extrabold">{mins}</div>
                      <div className="text-xs text-stone-500 font-semibold mt-0.5">minutes</div>
                    </button>
                  );
                })}
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 text-emerald-900 text-xs flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>We never assume longer sessions equal better learning. Consistency without guilt is king.</span>
              </div>
            </div>
          )}

          {/* STEP 6: WHEN? */}
          {step === 6 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Step 6</span>
                <h2 className="text-2xl md:text-3xl font-extrabold text-stone-900 mt-1">
                  When do you usually have time to learn?
                </h2>
                <p className="text-stone-600 text-sm mt-1">
                  Helps our reminder system know when to respectfully check in.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { id: 'morning' as PreferredTime, title: 'Morning', desc: 'Fresh coffee & clear mind (08:00 - 11:00)', icon: '🌅' },
                  { id: 'afternoon' as PreferredTime, title: 'Afternoon', desc: 'Lunch break or midday spark (12:00 - 16:00)', icon: '☀️' },
                  { id: 'evening' as PreferredTime, title: 'Evening', desc: 'Winding down after work/school (17:00 - 21:00)', icon: '🌇' },
                  { id: 'night' as PreferredTime, title: 'Night', desc: 'Quiet late-night cozy hours (21:00 - 23:30)', icon: '🌙' },
                ].map((item) => {
                  const isSelected = preferredTime === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setPreferredTime(item.id)}
                      className={`p-4 rounded-2xl border text-left transition flex items-start gap-3 ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold shadow-sm'
                          : 'border-stone-200 hover:border-stone-300 bg-white text-stone-700'
                      }`}
                    >
                      <span className="text-2xl">{item.icon}</span>
                      <div>
                        <div className="font-extrabold text-sm">{item.title}</div>
                        <div className="text-xs text-stone-500 mt-0.5">{item.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 7: ENCOURAGEMENT STYLE */}
          {step === 7 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Step 7</span>
                <h2 className="text-2xl md:text-3xl font-extrabold text-stone-900 mt-1">
                  How should SkillGarden encourage you?
                </h2>
                <p className="text-stone-600 text-sm mt-1">
                  Pick your favorite vibe. You can change this at any time in settings.
                </p>
              </div>

              <div className="space-y-2.5">
                {[
                  { id: 'gentle' as EncouragementStyle, name: 'Gentle 🌱', quote: '"Ready for a tiny step? Even five minutes counts."' },
                  { id: 'energetic' as EncouragementStyle, name: 'Energetic 🔥', quote: '"Let\'s make some joyful progress today!"' },
                  { id: 'focused' as EncouragementStyle, name: 'Focused 🎯', quote: '"Your next targeted challenge is ready."' },
                  { id: 'playful' as EncouragementStyle, name: 'Playful 👀', quote: '"Your learning world has been suspiciously quiet 👀"' },
                  { id: 'minimal' as EncouragementStyle, name: 'Minimal 🤍', quote: '"Your quest is ready."' },
                ].map((item) => {
                  const isSelected = encouragementStyle === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setEncouragementStyle(item.id)}
                      className={`w-full p-3.5 rounded-2xl border text-left transition flex items-center justify-between text-sm ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold shadow-sm'
                          : 'border-stone-200 hover:border-stone-300 bg-white text-stone-700'
                      }`}
                    >
                      <div>
                        <div className="font-extrabold text-stone-900">{item.name}</div>
                        <div className="text-xs text-stone-500 italic mt-0.5">{item.quote}</div>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-emerald-600" />}
                    </button>
                  );
                })}
              </div>

              {/* Optional Questions Accordion */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowOptional(!showOptional)}
                  className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{showOptional ? 'Hide' : 'Show'} optional depth questions</span>
                </button>

                {showOptional && (
                  <div className="mt-3 p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-4 animate-fade-in text-xs">
                    <div>
                      <label className="font-bold text-stone-700 block mb-1">Current Experience:</label>
                      <div className="flex gap-2">
                        {(['beginner', 'some', 'intermediate', 'advanced'] as const).map((lvl) => (
                          <button
                            key={lvl}
                            type="button"
                            onClick={() => setExperienceLevel(lvl)}
                            className={`px-3 py-1.5 rounded-xl capitalize font-semibold ${
                              experienceLevel === lvl ? 'bg-emerald-600 text-white' : 'bg-white border text-stone-700'
                            }`}
                          >
                            {lvl}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="font-bold text-stone-700 block mb-1">Main Challenge:</label>
                      <select
                        value={mainDifficulty}
                        onChange={(e) => setMainDifficulty(e.target.value)}
                        className="w-full p-2 rounded-xl bg-white border border-stone-300 text-stone-800"
                      >
                        <option>Finding time</option>
                        <option>Starting</option>
                        <option>Staying consistent</option>
                        <option>Understanding difficult topics</option>
                        <option>Knowing what to learn next</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 8: PERSONALIZED ONBOARDING RESULT (Section 13) */}
          {step === 8 && (
            <div className="space-y-6 text-center py-4 animate-scale-up">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-4xl shadow-inner mb-4">
                🌱
              </div>

              <h2 className="text-3xl font-extrabold text-stone-900 tracking-tight">
                Your world is ready 🌱
              </h2>

              <div className="max-w-md mx-auto text-left p-6 rounded-3xl bg-stone-50 border border-stone-200/80 space-y-3 text-sm text-stone-700">
                <div className="flex items-start gap-2.5">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Curious about <strong>{selectedInterests.join(', ')}</strong></span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Goal: <strong>"{goalText}"</strong></span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Short, manageable <strong>{sessionLength}-minute</strong> sessions</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Learning style: <strong>{learningStyles.join(' + ')}</strong></span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Support tone: <strong className="capitalize">{encouragementStyle}</strong></span>
                </div>
              </div>

              <div className="pt-4 flex justify-center">
                <button
                  type="button"
                  onClick={handleFinish}
                  className="px-10 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-extrabold text-base shadow-xl shadow-emerald-600/30 transition flex items-center gap-3 cursor-pointer"
                >
                  <Sparkles className="w-5 h-5" />
                  <span>Enter My World</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        {step <= totalSteps && (
          <div className="px-6 py-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
            <button
              type="button"
              disabled={step === 1}
              onClick={() => setStep((p) => Math.max(1, p - 1))}
              className="px-4 py-2 rounded-xl text-stone-600 hover:text-stone-900 disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1.5 text-sm font-semibold transition"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>

            <button
              type="button"
              onClick={() => setStep((p) => p + 1)}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-sm shadow-md transition flex items-center gap-2"
            >
              <span>{step === totalSteps ? 'Review Garden' : 'Continue'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
