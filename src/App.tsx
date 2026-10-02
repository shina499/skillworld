import React, { useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { Header } from './components/common/Header';
import { NavigationBar } from './components/common/NavigationBar';
import { ToastContainer, ToastMessage } from './components/common/Toast';
import { LandingPage } from './components/landing/LandingPage';
import { TopicOnboardingModal } from './components/onboarding/TopicOnboardingModal';
import { WorldView } from './components/world/WorldView';
import { TodayView } from './components/today/TodayView';
import { ProgressView } from './components/progress/ProgressView';
import { SettingsView } from './components/settings/SettingsView';
import { AuthModal } from './components/auth/AuthModal';
import { QuestPlayerModal } from './components/today/QuestPlayerModal';
import { SupabaseSqlModal } from './components/common/SupabaseSqlModal';
import { personalizationEngine } from './lib/personalization/engine';
import { gardenDb } from './lib/supabase/client';
import {
  UserProfile,
  UserTopic,
  Goal,
  SkillNode,
  Quest,
  LearningSession,
  World,
  WorldRegion,
  ReminderSettings,
  Achievement,
  QuestReflection,
} from './types';

export function App() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'landing' | 'world' | 'today' | 'progress' | 'settings'>('world');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [isSqlModalOpen, setIsSqlModalOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [activeDirectQuest, setActiveDirectQuest] = useState<Quest | null>(null);

  // Onboarding Modal state
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isAddingSingleTopic, setIsAddingSingleTopic] = useState(false);

  // Garden State
  const [profile, setProfile] = useState<UserProfile>(() => gardenDb.getSnapshot().profile);
  const [userTopics, setUserTopics] = useState<UserTopic[]>(() => gardenDb.getSnapshot().userTopics);
  const [goals, setGoals] = useState<Goal[]>(() => gardenDb.getSnapshot().goals);
  const [skills, setSkills] = useState<SkillNode[]>(() => gardenDb.getSnapshot().skills);
  const [quests, setQuests] = useState<Quest[]>(() => gardenDb.getSnapshot().quests);
  const [sessions, setSessions] = useState<LearningSession[]>(() => gardenDb.getSnapshot().sessions);
  const [world, setWorld] = useState<World>(() => gardenDb.getSnapshot().world);
  const [worldRegions, setWorldRegions] = useState<WorldRegion[]>(() => gardenDb.getSnapshot().worldRegions);
  const [reminders, setReminders] = useState<ReminderSettings>(() => gardenDb.getSnapshot().reminders);
  const [achievements, setAchievements] = useState<Achievement[]>(() => gardenDb.getSnapshot().achievements);
  const [reflections, setReflections] = useState<QuestReflection[]>(() => gardenDb.getSnapshot().reflections || []);

  // Remote Sync on initial mount
  useEffect(() => {
    gardenDb.syncFromRemote().then((snap) => {
      setProfile(snap.profile);
      setUserTopics(snap.userTopics);
      setGoals(snap.goals);
      setSkills(snap.skills);
      setQuests(snap.quests);
      setSessions(snap.sessions);
      setWorld(snap.world);
      setWorldRegions(snap.worldRegions);
      setReminders(snap.reminders);
      setAchievements(snap.achievements);
      setReflections(snap.reflections || []);
      setLoading(false);

      if (!snap.profile.hasCompletedOnboarding) {
        setActiveTab('landing');
      }
    });
  }, []);

  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = `toast_${Date.now()}_${Math.random()}`;
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  // Helper to persist snapshot
  const persistAll = (
    p = profile,
    ut = userTopics,
    g = goals,
    sk = skills,
    q = quests,
    sess = sessions,
    w = world,
    wr = worldRegions,
    rem = reminders,
    ach = achievements,
    refl = reflections
  ) => {
    gardenDb.saveSnapshot({
      profile: p,
      userTopics: ut,
      topicPreferences: [],
      topicAnswers: [],
      goals: g,
      skills: sk,
      quests: q,
      sessions: sess,
      world: w,
      worldRegions: wr,
      reminders: rem,
      achievements: ach,
      reflections: refl,
    });
  };

  // Handle Onboarding Completion (supports multi-topic setup or adding single topic)
  const handleOnboardingComplete = (payload: any) => {
    const nowIso = new Date().toISOString();

    let updatedUserTopics = [...userTopics];
    let updatedGoals = [...goals];
    let updatedSkills = [...skills];
    let updatedQuests = [...quests];
    let updatedRegions = [...worldRegions];

    payload.topicData.forEach((item: any, idx: number) => {
      const topicId = item.topic.id;
      const userTopicId = `ut_${item.topic.slug}_${Date.now()}_${idx}`;

      // Check if already exists
      const existingIdx = updatedUserTopics.findIndex((u) => u.topicId === topicId);
      if (existingIdx >= 0) {
        // Update existing
        updatedUserTopics[existingIdx] = {
          ...updatedUserTopics[existingIdx],
          topicName: item.topic.name,
          updatedAt: nowIso,
        };
      } else {
        // Add new
        const newUt: UserTopic = {
          id: userTopicId,
          userId: profile.id,
          topicId,
          topicName: item.topic.name,
          topicIcon: item.topic.icon,
          category: item.topic.category,
          status: 'active',
          level: 1,
          xp: 20,
          confidence: 2,
          createdAt: nowIso,
          updatedAt: nowIso,
        };
        updatedUserTopics.push(newUt);

        // Add Goal
        const newGoal: Goal = {
          id: `goal_${item.topic.slug}_${Date.now()}`,
          userId: profile.id,
          userTopicId,
          topicName: item.topic.name,
          title: item.goalTitle || `Master ${item.topic.name}`,
          description: `Personal progression in ${item.topic.name}`,
          motivation: ['For curiosity & projects'],
          target: 'Launch personal project',
          status: 'active',
          createdAt: nowIso,
          updatedAt: nowIso,
        };
        updatedGoals.push(newGoal);

        // Add Skills
        const newSkills = item.initialSkills.map((s: any) => ({
          ...s,
          userTopicId,
        }));
        updatedSkills.push(...newSkills);

        // Add Quests
        const newQuests = item.starterQuests.map((q: any) => ({
          ...q,
          userTopicId,
        }));
        updatedQuests.push(...newQuests);

        // Add World Region
        const newRegion: WorldRegion = {
          ...item.region,
          id: `wr_${item.topic.slug}_${Date.now()}`,
          worldId: world.id,
          userTopicId,
        };
        updatedRegions.push(newRegion);
      }
    });

    const updatedProfile: UserProfile = {
      ...profile,
      hasCompletedOnboarding: true,
      overallIdentity: payload.generalPreferences.overallIdentity || profile.overallIdentity,
      targetSessionMinutes: payload.generalPreferences.sessionMinutes || profile.targetSessionMinutes,
      preferredTime: payload.generalPreferences.preferredTime || profile.preferredTime,
      encouragementStyle: payload.generalPreferences.encouragementStyle || profile.encouragementStyle,
      totalXp: profile.totalXp + (isAddingSingleTopic ? 20 : 40),
      lastActiveDate: nowIso,
      updatedAt: nowIso,
    };

    const updatedWorld: World = {
      ...world,
      unlockedRegionsCount: updatedRegions.length,
      updatedAt: nowIso,
    };

    setProfile(updatedProfile);
    setUserTopics(updatedUserTopics);
    setGoals(updatedGoals);
    setSkills(updatedSkills);
    setQuests(updatedQuests);
    setWorldRegions(updatedRegions);
    setWorld(updatedWorld);

    persistAll(
      updatedProfile,
      updatedUserTopics,
      updatedGoals,
      updatedSkills,
      updatedQuests,
      sessions,
      updatedWorld,
      updatedRegions,
      reminders,
      achievements
    );

    setIsOnboardingOpen(false);
    setIsAddingSingleTopic(false);
    setActiveTab('world');

    addToast({
      type: 'level',
      title: 'World Districts Formed! 🏝️',
      description: `Your personal 3D garden has expanded with your chosen topics.`,
    });

    try {
      confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
    } catch {}
  };

  // Handle Quest Completion
  const handleCompleteQuest = (
    completedQuest: Quest,
    durationMinutes: number,
    score: number,
    note?: string
  ) => {
    const earnedXp = completedQuest.rewardXp;
    const nowIso = new Date().toISOString();

    // 1. Session record
    const newSession: LearningSession = {
      id: `sess_${Date.now()}`,
      userId: profile.id,
      userTopicId: completedQuest.userTopicId,
      topicName: completedQuest.topicName,
      questId: completedQuest.id,
      questTitle: completedQuest.title,
      skillName: completedQuest.skillName,
      type: completedQuest.type,
      durationMinutes,
      completed: true,
      earnedXp,
      score,
      notes: note,
      completedAt: nowIso,
    };

    const updatedSessions = [...sessions, newSession];

    // 2. Update specific User Topic XP and Level
    const updatedUserTopics = userTopics.map((ut) => {
      if (ut.id === completedQuest.userTopicId || ut.topicName === completedQuest.topicName) {
        const nextXp = ut.xp + earnedXp;
        const nextLevel = Math.max(1, Math.floor(nextXp / 60) + 1);
        return {
          ...ut,
          xp: nextXp,
          level: nextLevel,
          updatedAt: nowIso,
        };
      }
      return ut;
    });

    // 3. Update Skill Node progress
    const updatedSkills = skills.map((sk) => {
      if (sk.name === completedQuest.skillName && (sk.userTopicId === completedQuest.userTopicId || (sk.topicSlug && completedQuest.topicName && sk.topicSlug === completedQuest.topicName.toLowerCase()))) {
        const nextXp = sk.xp + earnedXp;
        const nextPercent = Math.min(100, sk.progressPercentage + 25);
        return {
          ...sk,
          xp: nextXp,
          progressPercentage: nextPercent,
          status: nextPercent >= 100 ? ('completed' as const) : ('active' as const),
        };
      }
      return sk;
    });

    // 4. Update World Region Stage based on topic XP
    const updatedRegions = worldRegions.map((wr) => {
      if (wr.userTopicId === completedQuest.userTopicId || wr.topicName === completedQuest.topicName) {
        const topicItem = updatedUserTopics.find((t) => t.id === wr.userTopicId);
        const stage = Math.min(5, Math.max(1, Math.floor((topicItem?.level || 1) / 1.5) + 1));
        return {
          ...wr,
          stage,
          progress: Math.min(100, wr.progress + 15),
          updatedAt: nowIso,
        };
      }
      return wr;
    });

    // 5. Update Profile overall XP & level
    const nextTotalXp = profile.totalXp + earnedXp;
    const nextOverallLevel = Math.max(1, Math.floor(nextTotalXp / 80) + 1);

    const updatedProfile: UserProfile = {
      ...profile,
      totalXp: nextTotalXp,
      overallLevel: nextOverallLevel,
      lastActiveDate: nowIso,
      activeDaysThisWeek: Math.min(7, profile.activeDaysThisWeek + 1),
      updatedAt: nowIso,
    };

    // 6. Check Achievements
    const updatedAchievements = achievements.map((ach) => {
      if (ach.id === 'first_step' && !ach.isUnlocked) {
        return { ...ach, isUnlocked: true, unlockedAt: nowIso };
      }
      if (ach.id === 'builder' && !ach.isUnlocked && completedQuest.type === 'project') {
        return { ...ach, isUnlocked: true, unlockedAt: nowIso };
      }
      if (ach.id === 'deep_dive' && !ach.isUnlocked && updatedUserTopics.some((t) => t.level >= 3)) {
        return { ...ach, isUnlocked: true, unlockedAt: nowIso };
      }
      return ach;
    });

    setSessions(updatedSessions);
    setUserTopics(updatedUserTopics);
    setSkills(updatedSkills);
    setWorldRegions(updatedRegions);
    setProfile(updatedProfile);
    setAchievements(updatedAchievements);

    persistAll(
      updatedProfile,
      updatedUserTopics,
      goals,
      updatedSkills,
      quests,
      updatedSessions,
      world,
      updatedRegions,
      reminders,
      updatedAchievements
    );

    addToast({
      type: 'xp',
      title: `+${earnedXp} XP in ${completedQuest.topicName}!`,
      description: `Completed "${completedQuest.title}". Your district expanded!`,
    });
  };

  // Launch skill practice
  const handleStartSkillQuest = (skill: SkillNode) => {
    const matchingQuest = quests.find((q) => q.skillName === skill.name) || {
      id: `skill_practice_${Date.now()}`,
      userTopicId: skill.userTopicId || '',
      topicName: skill.topicSlug,
      skillId: skill.id,
      skillName: skill.name,
      title: `Focused Practice: ${skill.name}`,
      description: `A targeted session mastering the mechanics of ${skill.name}.`,
      type: 'practice',
      estimatedMinutes: profile.targetSessionMinutes || 10,
      difficulty: skill.difficulty,
      rewardXp: 30,
      whyThisQuest: `You selected this node from your ${skill.topicSlug} skill tree.`,
      steps: [
        {
          id: 'sp1',
          title: `Core Principle of ${skill.name}`,
          instruction: 'Observe the foundational technique.',
          type: 'concept',
          content: `${skill.description}\n\nExperts treat this node as an anchor for more advanced techniques.`,
        },
        {
          id: 'sp2',
          title: 'Micro Reflection Check',
          instruction: 'What feels most clear or most intriguing about this step?',
          type: 'reflection',
          promptQuestion: 'Write a quick 1-sentence note for your learning memory.',
        },
      ],
    };

    setActiveDirectQuest(matchingQuest);
  };

  // Delete an island / user topic from the 3D world and Supabase tables
  const handleDeleteTopic = async (userTopicId: string) => {
    const topicToDelete = userTopics.find((t) => t.id === userTopicId);
    if (!topicToDelete) return;

    const remainingTopics = userTopics.filter((t) => t.id !== userTopicId);
    const remainingRegions = worldRegions
      .filter((r) => r.userTopicId !== userTopicId)
      .map((r, index) => {
        const angle = (index / Math.max(1, remainingTopics.length)) * Math.PI * 2;
        const radius = 6.2;
        return {
          ...r,
          position: [Math.sin(angle) * radius, 0.05, Math.cos(angle) * radius] as [number, number, number],
        };
      });
    const remainingGoals = goals.filter((g) => g.userTopicId !== userTopicId);
    const remainingSkills = skills.filter((s) => s.userTopicId !== userTopicId);
    const remainingQuests = quests.filter((q) => q.userTopicId !== userTopicId);

    setUserTopics(remainingTopics);
    setWorldRegions(remainingRegions);
    setGoals(remainingGoals);
    setSkills(remainingSkills);
    setQuests(remainingQuests);

    const updatedWorld = {
      ...world,
      unlockedRegionsCount: remainingRegions.length,
    };
    setWorld(updatedWorld);

    persistAll(
      profile,
      remainingTopics,
      remainingGoals,
      remainingSkills,
      remainingQuests,
      sessions,
      updatedWorld,
      remainingRegions,
      reminders,
      achievements,
      reflections
    );

    await gardenDb.deleteUserTopic(userTopicId);

    addToast({
      type: 'info',
      title: 'Island Removed',
      description: `${topicToDelete.topicName} district has been removed from your 3D world.`,
    });
  };

  // Primary quest recommendation using 11-factor scoring (declared before any early returns)
  const primaryRecommendation = useMemo(() => {
    const candidatePool = quests;
    const res = personalizationEngine.getTodayRecommendation(
      profile,
      goals,
      skills,
      sessions,
      reflections,
      userTopics[0]?.topicName,
      candidatePool
    );
    return res.quest;
  }, [profile, goals, skills, sessions, reflections, userTopics, quests]);

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center p-4">
        <div className="text-5xl animate-bounce mb-3">🌱</div>
        <div className="font-extrabold text-stone-800 text-lg">Growing your world...</div>
        <div className="text-xs text-stone-500 mt-1">Preparing your multi-topic learning sanctuary</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans flex flex-col antialiased selection:bg-emerald-100 selection:text-emerald-900">
      {/* Toast Container */}
      <ToastContainer toasts={toasts} onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))} />

      {/* Main Top Header */}
      {activeTab !== 'landing' && (
        <Header
          profile={profile}
          worldState={{
            userId: profile.id,
            level: profile.overallLevel,
            unlockedRegions: userTopics.map((u) => u.topicName),
            timeOfDay: world.timeOfDay,
            growthStage: Math.min(10, userTopics.length * 2),
            waterflowSpeed: 1,
            plantDensity: 3,
            activeThematicTheme: 'general',
          }}
          activeTab={activeTab as any}
          onChangeTab={setActiveTab as any}
          onOpenAuth={() => setAuthModalOpen(true)}
          onOpenSqlModal={() => setIsSqlModalOpen(true)}
        />
      )}

      {/* Main Views */}
      <main className="flex-1 flex flex-col pb-20 md:pb-8">
        {activeTab === 'landing' && (
          <LandingPage
            onStartOnboarding={() => {
              setIsAddingSingleTopic(false);
              setIsOnboardingOpen(true);
            }}
            onExploreWorld={() => setActiveTab('world')}
          />
        )}

        {activeTab === 'world' && (
          <WorldView
            profile={profile}
            userTopics={userTopics}
            worldRegions={worldRegions}
            world={world}
            recommendedQuest={primaryRecommendation}
            onStartQuest={(quest) => setActiveDirectQuest(quest)}
            onSelectTopic={(userTopicId) => {
              setActiveTab('progress');
            }}
            onDeleteTopic={handleDeleteTopic}
            onUpdateWorld={(updated) => {
              const newWorld = { ...world, ...updated };
              setWorld(newWorld);
              persistAll(profile, userTopics, goals, skills, quests, sessions, newWorld);
            }}
          />
        )}

        {activeTab === 'today' && (
          <TodayView
            profile={profile}
            userTopics={userTopics}
            goals={goals}
            skills={skills}
            sessions={sessions}
            quests={quests}
            onCompleteQuest={handleCompleteQuest}
            onSelectTopicDistrict={(userTopicId) => setActiveTab('world')}
            onAddNewTopic={() => {
              setIsAddingSingleTopic(true);
              setIsOnboardingOpen(true);
            }}
          />
        )}

        {activeTab === 'progress' && (
          <ProgressView
            profile={profile}
            userTopics={userTopics}
            goals={goals}
            skills={skills}
            sessions={sessions}
            achievements={achievements}
            worldRegions={worldRegions}
            onAddNewTopic={() => {
              setIsAddingSingleTopic(true);
              setIsOnboardingOpen(true);
            }}
            onStartSkillQuest={handleStartSkillQuest}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsView
            profile={profile}
            userTopics={userTopics}
            reminders={reminders}
            onUpdateProfile={(updated) => {
              const newP = { ...profile, ...updated };
              setProfile(newP);
              persistAll(newP);
              addToast({ type: 'info', title: 'Profile Updated', description: 'Preferences saved.' });
            }}
            onUpdateReminders={(updated) => {
              const newR = { ...reminders, ...updated };
              setReminders(newR);
              persistAll(profile, userTopics, goals, skills, quests, sessions, world, worldRegions, newR);
              addToast({ type: 'info', title: 'Reminders Updated', description: 'Schedule saved.' });
            }}
            onAddNewTopic={() => {
              setIsAddingSingleTopic(true);
              setIsOnboardingOpen(true);
            }}
            onDeleteTopic={handleDeleteTopic}
            onResetAllData={() => {
              const fresh = gardenDb.resetAll();
              setProfile(fresh.profile);
              setUserTopics(fresh.userTopics);
              setGoals(fresh.goals);
              setSkills(fresh.skills);
              setQuests(fresh.quests);
              setSessions(fresh.sessions);
              setWorld(fresh.world);
              setWorldRegions(fresh.worldRegions);
              setReminders(fresh.reminders);
              setAchievements(fresh.achievements);
              setReflections(fresh.reflections || []);
              setActiveTab('landing');
              addToast({ type: 'info', title: 'Garden Returned to Seedling', description: 'Ready to sprout afresh.' });
            }}
            onExportData={() => {
              const snap = gardenDb.getSnapshot();
              const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(snap, null, 2));
              const downloadAnchor = document.createElement('a');
              downloadAnchor.setAttribute('href', dataStr);
              downloadAnchor.setAttribute('download', `skillgarden-backup-${new Date().toISOString().slice(0, 10)}.json`);
              document.body.appendChild(downloadAnchor);
              downloadAnchor.click();
              downloadAnchor.remove();
              addToast({ type: 'info', title: 'Backup Downloaded', description: 'Your garden data is safe.' });
            }}
          />
        )}
      </main>

      {/* Mobile Floating Bottom Bar */}
      {activeTab !== 'landing' && (
        <NavigationBar activeTab={activeTab as any} onChangeTab={setActiveTab as any} />
      )}

      {/* Direct Quest Player Modal */}
      {activeDirectQuest && (
        <QuestPlayerModal
          quest={activeDirectQuest}
          encouragementStyle={profile.encouragementStyle}
          isOpen={true}
          onClose={() => setActiveDirectQuest(null)}
          onComplete={(completedQuest, duration, score, note) => {
            handleCompleteQuest(completedQuest, duration, score, note);
            setActiveDirectQuest(null);
          }}
        />
      )}

      {/* Multi-Topic Onboarding Modal */}
      {isOnboardingOpen && (
        <TopicOnboardingModal
          isOpen={true}
          isAddingSingleTopic={isAddingSingleTopic}
          onComplete={handleOnboardingComplete}
          onClose={() => setIsOnboardingOpen(false)}
        />
      )}

      {/* Supabase & Local Auth Modal */}
      {authModalOpen && (
        <AuthModal
          isOpen={true}
          onClose={() => setAuthModalOpen(false)}
          currentUserEmail={profile.email}
          onAuthSuccess={(email) => {
            const updated = { ...profile, email };
            setProfile(updated);
            persistAll(updated);
            addToast({
              type: 'info',
              title: 'Account Connected',
              description: `Session active as ${email}`,
            });
          }}
          onSignOut={() => {
            const updated = { ...profile, email: undefined };
            setProfile(updated);
            persistAll(updated);
            addToast({
              type: 'info',
              title: 'Signed Out',
              description: 'Switched to guest mode.',
            });
          }}
        />
      )}

      {/* Supabase SQL Setup Modal */}
      <SupabaseSqlModal
        isOpen={isSqlModalOpen}
        onClose={() => setIsSqlModalOpen(false)}
      />
    </div>
  );
}

export default App;
