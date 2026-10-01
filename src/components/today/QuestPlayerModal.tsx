import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  X,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Pause,
  Play,
  RotateCcw,
  Check,
  Target,
  Wrench,
  HelpCircle,
  FileCheck,
  Star,
  ChevronDown,
  ChevronUp,
  Code,
  Flame,
  Award,
} from 'lucide-react';
import { Quest, QuestStep, EncouragementStyle } from '../../types';
import { getQuestCompletedMessage } from '../../lib/notifications/encouragementCopy';
import { ChessBoardPuzzle } from './interactive/ChessBoardPuzzle';
import { DigitalDrawingCanvas } from './interactive/DigitalDrawingCanvas';
import { VoiceSpeakingPlayer } from './interactive/VoiceSpeakingPlayer';

interface QuestPlayerModalProps {
  quest: Quest;
  encouragementStyle: EncouragementStyle;
  isOpen: boolean;
  onClose: () => void;
  onComplete: (completedQuest: Quest, durationMinutes: number, score: number, note?: string) => void;
}

export const QuestPlayerModal: React.FC<QuestPlayerModalProps> = ({
  quest,
  encouragementStyle,
  isOpen,
  onClose,
  onComplete,
}) => {
  // Phase modes: 'briefing' -> 'active' -> 'reflection' -> 'celebration'
  const [modalMode, setModalMode] = useState<'briefing' | 'active' | 'reflection' | 'celebration'>('briefing');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Step interaction states
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isOptionSubmitted, setIsOptionSubmitted] = useState(false);
  const [codeEditorInput, setCodeEditorInput] = useState('');
  const [codeRunOutput, setCodeRunOutput] = useState<string | null>(null);
  const [actionDone, setActionDone] = useState(false);

  // Timer states
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Post-Quest Reflection states (Section 11)
  const [confidenceRating, setConfidenceRating] = useState(4);
  const [easiestNote, setEasiestNote] = useState('');
  const [difficultNote, setDifficultNote] = useState('');
  const [whatToChangeNote, setWhatToChangeNote] = useState('');
  const [generalReflection, setGeneralReflection] = useState('');

  // Briefing expandable details
  const [showHint, setShowHint] = useState(false);
  const [showExample, setShowExample] = useState(false);

  // Timer effect (only runs during active phase and when not paused)
  useEffect(() => {
    if (!isOpen || isPaused || modalMode !== 'active') return;
    const timer = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen, isPaused, modalMode]);

  // Reset state whenever a new quest opens
  useEffect(() => {
    if (isOpen) {
      setModalMode('briefing');
      setCurrentStepIndex(0);
      setSelectedOption(null);
      setIsOptionSubmitted(false);
      setCodeEditorInput('');
      setCodeRunOutput(null);
      setActionDone(false);
      setSecondsElapsed(0);
      setIsPaused(false);
      setConfidenceRating(4);
      setEasiestNote('');
      setDifficultNote('');
      setWhatToChangeNote('');
      setGeneralReflection('');
      setShowHint(false);
      setShowExample(false);
    }
  }, [isOpen, quest.id]);

  if (!isOpen) return null;

  const currentStep: QuestStep = quest.steps[currentStepIndex] || quest.steps[0];
  const isLastStep = currentStepIndex === quest.steps.length - 1;

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins}:${remainder < 10 ? '0' : ''}${remainder}`;
  };

  const handleStartQuestFromBriefing = () => {
    setModalMode('active');
    if (currentStep?.initialCode) {
      setCodeEditorInput(currentStep.initialCode);
    }
  };

  const handleRunCodeCheck = () => {
    if (!currentStep) return;
    const code = codeEditorInput;
    const keywords = currentStep.solutionKeywords || [];

    // Basic heuristic test runner for the mini sandbox
    const passed = keywords.length === 0 || keywords.every((kw) => code.includes(kw));

    if (passed) {
      setCodeRunOutput('✓ All test checks passed! Logic output verified.');
    } else {
      setCodeRunOutput(`⚠ Test check: make sure your code utilizes: ${keywords.join(', ')}`);
    }
  };

  const handleNextStep = () => {
    if (isLastStep) {
      // Move to reflection phase before celebration
      setModalMode('reflection');
    } else {
      const nextIdx = currentStepIndex + 1;
      setCurrentStepIndex(nextIdx);
      setSelectedOption(null);
      setIsOptionSubmitted(false);
      setActionDone(false);
      setCodeRunOutput(null);
      const nextStep = quest.steps[nextIdx];
      if (nextStep?.initialCode) {
        setCodeEditorInput(nextStep.initialCode);
      }
    }
  };

  const handleFinishReflection = () => {
    setModalMode('celebration');
    try {
      confetti({
        particleCount: 85,
        spread: 75,
        origin: { y: 0.6 },
        colors: ['#10b981', '#34d399', '#6ee7b7', '#f59e0b', '#3b82f6', '#ec4899'],
      });
    } catch {}
  };

  const handleFinalClaimAndReturn = () => {
    const duration = Math.max(1, Math.round(secondsElapsed / 60));
    const combinedNote = [
      generalReflection && `Note: ${generalReflection}`,
      easiestNote && `Easiest: ${easiestNote}`,
      difficultNote && `Toughest: ${difficultNote}`,
      whatToChangeNote && `Next time: ${whatToChangeNote}`,
      `Confidence: ${confidenceRating}/5`,
    ].filter(Boolean).join(' | ');

    onComplete(quest, duration, confidenceRating * 20, combinedNote);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/75 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-emerald-100 flex flex-col max-h-[92vh]">
        {/* ============================================================== */}
        {/* HEADER BAR                                                     */}
        {/* ============================================================== */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-50 via-teal-50 to-stone-50 border-b border-emerald-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-2xl bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-sm shadow-inner">
              {modalMode === 'briefing'
                ? '📋'
                : modalMode === 'reflection'
                ? '💭'
                : modalMode === 'celebration'
                ? '🎉'
                : `${currentStepIndex + 1}/${quest.steps.length}`}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold tracking-wider uppercase px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                  {quest.categoryTypeBadge || quest.type.toUpperCase()}
                </span>
                <span className="text-xs text-stone-500 font-semibold">{quest.topicName}</span>
              </div>
              <h3 className="text-base font-extrabold text-stone-900 truncate max-w-sm mt-0.5">
                {quest.title}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Friendly Timer (Visible during active quest) */}
            {modalMode === 'active' && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 border border-stone-200 text-xs font-semibold text-stone-600 shadow-sm">
                <Clock className="w-3.5 h-3.5 text-emerald-600" />
                <span>{formatTime(secondsElapsed)}</span>
                <button
                  type="button"
                  onClick={() => setIsPaused(!isPaused)}
                  className="hover:text-stone-900 ml-1 p-0.5 cursor-pointer"
                  title={isPaused ? 'Resume' : 'Pause'}
                >
                  {isPaused ? <Play className="w-3 h-3 text-emerald-600" /> : <Pause className="w-3 h-3" />}
                </button>
              </div>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-stone-200/60 text-stone-400 hover:text-stone-700 transition cursor-pointer"
              aria-label="Close quest"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ============================================================== */}
        {/* MODAL BODY CONTENT                                             */}
        {/* ============================================================== */}
        <div className="p-6 md:p-8 overflow-y-auto flex-1 space-y-6">
          {/* 1. PROFESSIONAL ASSIGNMENT BRIEFING (Section 25) */}
          {modalMode === 'briefing' && (
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 uppercase tracking-wider">
                    {quest.difficulty}
                  </span>
                  <span className="text-xs text-stone-500 font-medium flex items-center gap-1 px-2">
                    <Clock className="w-3.5 h-3.5 text-stone-400" />
                    ~{quest.estimatedMinutes} minutes
                  </span>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-200">
                    +{quest.rewardXp} XP
                  </span>
                  {quest.projectStage && (
                    <span className="text-xs font-extrabold px-3 py-1 rounded-xl bg-purple-100 text-purple-900 border border-purple-200 flex items-center gap-1">
                      <span>🏗️</span>
                      <span>Stage {quest.projectStage.stage} of {quest.projectStage.totalStages}: {quest.projectStage.stageName}</span>
                    </span>
                  )}
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-stone-900 tracking-tight">
                  {quest.title}
                </h2>
                <p className="text-stone-600 text-sm md:text-base leading-relaxed">
                  {quest.description}
                </p>
              </div>

              {/* OBJECTIVE SECTION */}
              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-1">
                <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-800 uppercase tracking-wider">
                  <Target className="w-4 h-4 text-emerald-600" />
                  <span>Objective</span>
                </div>
                <p className="text-stone-800 text-sm font-medium leading-relaxed">
                  {quest.objective || `Practice core mechanics in ${quest.skillName} with immediate hands-on application.`}
                </p>
              </div>

              {/* SKILLS PRACTICED & MATERIALS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-1.5">
                  <div className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                    Target Skill
                  </div>
                  <div className="text-stone-900 font-bold text-sm flex items-center gap-2">
                    <span>🌱</span>
                    <span>{quest.skillName}</span>
                  </div>
                  {quest.progressImpact && (
                    <div className="text-xs text-emerald-700 font-semibold">
                      Impact: {quest.progressImpact}
                    </div>
                  )}
                </div>

                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-stone-500 uppercase tracking-wider">
                    <Wrench className="w-3.5 h-3.5" />
                    <span>Materials / Tools</span>
                  </div>
                  <div className="text-stone-800 text-xs font-medium">
                    {quest.materials ? quest.materials.join(', ') : 'In-app interactive workbench'}
                  </div>
                </div>
              </div>

              {/* EXPECTED DELIVERABLE OUTCOME */}
              {quest.expectedOutcome && (
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 flex items-start gap-3">
                  <FileCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold text-stone-700 uppercase tracking-wider block">
                      Expected Deliverable
                    </span>
                    <p className="text-stone-800 text-xs sm:text-sm mt-0.5 leading-relaxed">
                      {quest.expectedOutcome}
                    </p>
                  </div>
                </div>
              )}

              {/* WHY THIS QUEST? */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 text-xs text-stone-600 space-y-1">
                <span className="font-extrabold text-stone-800 uppercase tracking-wider block text-[10px]">
                  Why this quest for you?
                </span>
                <p className="italic text-stone-700">"{quest.whyThisQuest}"</p>
              </div>

              {/* EXPANDABLE HINT & EXAMPLE */}
              {(quest.hint || quest.example) && (
                <div className="space-y-2 border-t border-stone-100 pt-3">
                  {quest.hint && (
                    <div>
                      <button
                        type="button"
                        onClick={() => setShowHint(!showHint)}
                        className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
                      >
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span>{showHint ? 'Hide Guidance Hint' : 'View Guidance Hint'}</span>
                        {showHint ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      </button>
                      {showHint && (
                        <div className="p-3 mt-1.5 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-950 animate-fade-in">
                          💡 {quest.hint}
                        </div>
                      )}
                    </div>
                  )}

                  {quest.example && (
                    <div>
                      <button
                        type="button"
                        onClick={() => setShowExample(!showExample)}
                        className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{showExample ? 'Hide Reference Example' : 'View Reference Example'}</span>
                        {showExample ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      </button>
                      {showExample && (
                        <div className="p-3 mt-1.5 rounded-xl bg-stone-100 border border-stone-200 text-xs text-stone-800 font-mono whitespace-pre-line animate-fade-in">
                          {quest.example}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* START QUEST CTA */}
              <div className="pt-3 flex justify-end">
                <button
                  type="button"
                  onClick={handleStartQuestFromBriefing}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-black text-sm shadow-xl shadow-emerald-600/25 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Start Assignment</span>
                </button>
              </div>
            </div>
          )}

          {/* 2. ACTIVE INTERACTIVE QUEST STEP EXECUTION */}
          {modalMode === 'active' && currentStep && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-100 uppercase tracking-wider">
                  Step {currentStepIndex + 1} of {quest.steps.length}
                </span>
                <h4 className="text-xl md:text-2xl font-extrabold text-stone-900 mt-2">
                  {currentStep.title}
                </h4>
                <p className="text-stone-600 mt-1 text-sm md:text-base leading-relaxed">
                  {currentStep.instruction}
                </p>
              </div>

              {/* STEP: Concept Content */}
              {currentStep.type === 'concept' && currentStep.content && (
                <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 text-stone-800 font-sans text-sm md:text-base whitespace-pre-line leading-relaxed shadow-inner">
                  {currentStep.content}
                </div>
              )}

              {/* STEP: Interactive Multiple Choice */}
              {currentStep.type === 'interactive_choice' && currentStep.options && (
                <div className="space-y-3">
                  {currentStep.options.map((option, idx) => {
                    const isSelected = selectedOption === idx;
                    const isCorrect = idx === currentStep.correctOptionIndex;
                    let btnStyle = 'border-stone-200 bg-white hover:border-emerald-300 text-stone-800';

                    if (isOptionSubmitted) {
                      if (isCorrect) {
                        btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-semibold shadow-sm';
                      } else if (isSelected) {
                        btnStyle = 'border-amber-400 bg-amber-50 text-stone-800';
                      } else {
                        btnStyle = 'border-stone-200 opacity-60 text-stone-400';
                      }
                    } else if (isSelected) {
                      btnStyle = 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold';
                    }

                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          if (!isOptionSubmitted) {
                            setSelectedOption(idx);
                            setIsOptionSubmitted(true);
                          }
                        }}
                        className={`w-full p-4 rounded-2xl border-2 text-left transition flex items-start gap-3 cursor-pointer ${btnStyle}`}
                      >
                        <span className="w-6 h-6 rounded-full border flex items-center justify-center text-xs shrink-0 mt-0.5">
                          {isOptionSubmitted && isCorrect ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            String.fromCharCode(65 + idx)
                          )}
                        </span>
                        <span className="text-sm md:text-base leading-snug">{option}</span>
                      </button>
                    );
                  })}

                  {/* Feedback Explanation */}
                  {isOptionSubmitted && currentStep.explanation && (
                    <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm animate-fade-in flex items-start gap-3">
                      <Sparkles className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-emerald-800">Key Insight</div>
                        <p className="mt-0.5 text-emerald-900/90 leading-relaxed">{currentStep.explanation}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* STEP: Interactive Micro Code / Debugging Sandbox */}
              {currentStep.type === 'micro_code' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-stone-500 uppercase tracking-wider">
                    <span className="flex items-center gap-1.5">
                      <Code className="w-4 h-4 text-emerald-600" />
                      <span>Interactive Code Workspace</span>
                    </span>
                    <button
                      type="button"
                      onClick={handleRunCodeCheck}
                      className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition cursor-pointer"
                    >
                      Run & Test Logic
                    </button>
                  </div>

                  <textarea
                    value={codeEditorInput}
                    onChange={(e) => setCodeEditorInput(e.target.value)}
                    rows={6}
                    className="w-full p-4 rounded-2xl font-mono text-xs sm:text-sm bg-stone-900 text-emerald-400 border border-stone-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none leading-relaxed"
                    placeholder="// Write or fix code here..."
                  />

                  {codeRunOutput && (
                    <div className={`p-3.5 rounded-xl border text-xs font-mono animate-fade-in ${
                      codeRunOutput.includes('✓')
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-900 font-bold'
                        : 'bg-amber-50 border-amber-200 text-amber-900'
                    }`}>
                      {codeRunOutput}
                    </div>
                  )}
                </div>
              )}

              {/* STEP: Micro Action / Physical Checklist */}
              {currentStep.type === 'micro_action' && (
                <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-4">
                  <div className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                    Hands-On Checklist
                  </div>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={actionDone}
                      onChange={(e) => setActionDone(e.target.checked)}
                      className="w-5 h-5 rounded-md text-emerald-600 mt-0.5 cursor-pointer"
                    />
                    <span className="text-sm font-medium text-stone-800 leading-snug">
                      I have executed this exercise in my working environment (sketchbook, camera, kitchen, or instrument) and reviewed the outcome.
                    </span>
                  </label>
                </div>
              )}

              {/* STEP: Interactive Tactical Chessboard */}
              {currentStep.type === 'chess_puzzle' && (
                <ChessBoardPuzzle
                  instruction={currentStep.chessInstruction || currentStep.instruction}
                  turn={currentStep.chessTurn || 'white'}
                  initialPieces={currentStep.chessPieces}
                  solutionMove={currentStep.chessSolutionMove}
                  onSolved={() => setActionDone(true)}
                />
              )}

              {/* STEP: Interactive Digital Drawing Canvas */}
              {currentStep.type === 'drawing_canvas' && (
                <DigitalDrawingCanvas
                  drawingPrompt={currentStep.drawingPrompt || currentStep.instruction}
                  suggestedColors={currentStep.suggestedColors}
                  criteriaChecklist={currentStep.criteriaChecklist}
                  onArtworkDrawn={() => setActionDone(true)}
                />
              )}

              {/* STEP: Interactive Voice Speaking Practice */}
              {currentStep.type === 'speaking_task' && (
                <VoiceSpeakingPlayer
                  speakingPrompt={currentStep.speakingPrompt || currentStep.instruction}
                  targetPhrases={currentStep.targetPhrases}
                  onRecordingComplete={() => setActionDone(true)}
                />
              )}

              {/* STEP: Reflection Step */}
              {currentStep.type === 'reflection' && (
                <div className="space-y-3">
                  {currentStep.promptQuestion && (
                    <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 text-emerald-900 text-sm italic">
                      💭 "{currentStep.promptQuestion}"
                    </div>
                  )}
                  <textarea
                    value={generalReflection}
                    onChange={(e) => setGeneralReflection(e.target.value)}
                    placeholder="Take a moment to jot down your takeaway, question, or note..."
                    rows={4}
                    className="w-full p-4 rounded-2xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-stone-800 text-sm resize-none"
                  />
                </div>
              )}
            </div>
          )}

          {/* 3. POST-QUEST REFLECTION SCREEN (Section 11) */}
          {modalMode === 'reflection' && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center space-y-1">
                <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-700">
                  Step Complete • Micro Reflection
                </span>
                <h3 className="text-2xl font-black text-stone-900">
                  How did that feel?
                </h3>
                <p className="text-stone-500 text-xs max-w-md mx-auto">
                  Your answers teach the recommendation engine to calibrate difficulty and pacing.
                </p>
              </div>

              {/* Confidence Rating (1-5 Stars) */}
              <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200/80 text-center space-y-2">
                <span className="text-xs font-bold text-stone-700 uppercase tracking-wider block">
                  Current Confidence Level in this Skill
                </span>
                <div className="flex items-center justify-center gap-2 pt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setConfidenceRating(star)}
                      className="p-1 cursor-pointer transition active:scale-95"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          star <= confidenceRating
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-stone-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <div className="text-xs text-stone-500 font-semibold">
                  {confidenceRating === 5
                    ? 'Effortless & Confident'
                    : confidenceRating === 4
                    ? 'Good Grip & Clear'
                    : confidenceRating === 3
                    ? 'Moderate / Needs Review'
                    : 'Struggled a bit'}
                </div>
              </div>

              {/* Reflection Questions */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    What felt easiest?
                  </label>
                  <input
                    type="text"
                    value={easiestNote}
                    onChange={(e) => setEasiestNote(e.target.value)}
                    placeholder="e.g. Grasping the formula..."
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    What was difficult?
                  </label>
                  <input
                    type="text"
                    value={difficultNote}
                    onChange={(e) => setDifficultNote(e.target.value)}
                    placeholder="e.g. Edge cases, timing..."
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    What would you change?
                  </label>
                  <input
                    type="text"
                    value={whatToChangeNote}
                    onChange={(e) => setWhatToChangeNote(e.target.value)}
                    placeholder="e.g. Break into smaller steps..."
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleFinishReflection}
                  className="px-8 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-sm shadow-md transition flex items-center gap-2 cursor-pointer"
                >
                  <span>Submit & View Rewards</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* 4. QUEST COMPLETION SCREEN (Section 26) */}
          {modalMode === 'celebration' && (
            <div className="text-center py-4 space-y-6 animate-scale-up">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center text-4xl shadow-xl shadow-emerald-500/25">
                🎉
              </div>

              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-700 px-3 py-1 rounded-full bg-emerald-100">
                  {quest.projectStage
                    ? quest.projectStage.stage === quest.projectStage.totalStages
                      ? '🏆 PROJECT COMPLETE'
                      : `🏗️ STAGE ${quest.projectStage.stage} OF ${quest.projectStage.totalStages} ACCOMPLISHED`
                    : 'Quest Accomplished'}
                </span>
                <h2 className="text-2xl md:text-3xl font-black text-stone-900 mt-2">
                  {quest.title}
                </h2>
                <p className="text-stone-600 text-sm mt-1 max-w-md mx-auto">
                  {getQuestCompletedMessage(encouragementStyle, quest.rewardXp)}
                </p>
              </div>

              {/* Tangible Reward Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-lg mx-auto">
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
                  <div className="text-xs text-amber-800 font-bold uppercase">Experience</div>
                  <div className="text-2xl font-black text-amber-900 mt-0.5">+{quest.rewardXp} XP</div>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                  <div className="text-xs text-emerald-800 font-bold uppercase">Skill Impact</div>
                  <div className="text-sm font-extrabold text-emerald-950 mt-1 truncate">
                    {quest.progressImpact || `${quest.skillName} +15%`}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200">
                  <div className="text-xs text-purple-800 font-bold uppercase">World District</div>
                  <div className="text-sm font-extrabold text-purple-950 mt-1">
                    Stage +1 Progress
                  </div>
                </div>
              </div>

              {/* World Object Unlock Feature */}
              {quest.worldReward && (
                <div className="p-4 max-w-md mx-auto rounded-2xl bg-gradient-to-r from-stone-900 to-stone-800 text-white border border-stone-700 flex items-center gap-3.5 text-left shadow-lg">
                  <span className="text-3xl p-2 rounded-xl bg-white/10 shrink-0">
                    {quest.worldReward.icon}
                  </span>
                  <div>
                    <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                      New Landmark Unlocked in 3D District
                    </div>
                    <div className="font-extrabold text-sm text-white">
                      {quest.worldReward.name}
                    </div>
                    <div className="text-xs text-stone-300">
                      {quest.worldReward.description}
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-4 flex justify-center">
                <button
                  type="button"
                  onClick={handleFinalClaimAndReturn}
                  className="px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-sm shadow-xl shadow-emerald-600/30 transition flex items-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Return to Living World</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ============================================================== */}
        {/* FOOTER NAVIGATION (Only for active quest steps)               */}
        {/* ============================================================== */}
        {modalMode === 'active' && (
          <div className="px-6 py-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
            <button
              type="button"
              disabled={currentStepIndex === 0}
              onClick={() => setCurrentStepIndex((p) => Math.max(0, p - 1))}
              className="px-4 py-2 rounded-xl text-stone-600 hover:text-stone-900 disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1.5 text-xs sm:text-sm font-semibold transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </button>

            <button
              type="button"
              onClick={handleNextStep}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs sm:text-sm shadow-md transition flex items-center gap-2 cursor-pointer"
            >
              <span>{isLastStep ? 'Complete & Reflect' : 'Continue'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
