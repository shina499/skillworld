import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Play, Sparkles, Compass, Eye, ShieldCheck, Heart, Trash2 } from 'lucide-react';
import { GardenCanvas } from '../../three/GardenCanvas';
import { WorldControls } from './WorldControls';
import { UserProfile, UserTopic, WorldRegion, World, Quest, SkillNode } from '../../types';

interface WorldViewProps {
  profile: UserProfile;
  userTopics: UserTopic[];
  worldRegions: WorldRegion[];
  world: World;
  recommendedQuest: Quest;
  onStartQuest: (quest: Quest) => void;
  onSelectTopic: (userTopicId: string) => void;
  onDeleteTopic?: (userTopicId: string) => void;
  onUpdateWorld: (updated: Partial<World>) => void;
}

export const WorldView: React.FC<WorldViewProps> = ({
  profile,
  userTopics,
  worldRegions,
  world,
  recommendedQuest,
  onStartQuest,
  onSelectTopic,
  onDeleteTopic,
  onUpdateWorld,
}) => {
  const [selectedTopicId, setSelectedTopicId] = useState<string | undefined>(userTopics[0]?.id);
  const [inspectingTopic, setInspectingTopic] = useState<UserTopic | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [lowPowerMode, setLowPowerMode] = useState(false);

  // Trigger gentle growth sparkle bloom
  const handleTriggerBloom = () => {
    try {
      confetti({
        particleCount: 45,
        spread: 70,
        origin: { y: 0.65 },
        colors: ['#4ade80', '#38bdf8', '#fbbf24', '#f472b6', '#a78bfa'],
      });
    } catch {}
  };

  const handleSelectDistrict = (userTopicId: string) => {
    setSelectedTopicId(userTopicId);
    const target = userTopics.find((t) => t.id === userTopicId);
    if (target) {
      setInspectingTopic(target);
    }
  };

  const nextLevelXp = profile.overallLevel * 100;
  const currentLevelBaseXp = (profile.overallLevel - 1) * 100;
  const levelProgressPercent = Math.min(
    100,
    Math.max(5, Math.round(((profile.totalXp - currentLevelBaseXp) / 100) * 100))
  );

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] overflow-hidden bg-stone-100">
      {/* 3D Canvas Centerpiece */}
      <GardenCanvas
        profile={profile}
        userTopics={userTopics}
        worldRegions={worldRegions}
        world={world}
        selectedTopicId={selectedTopicId}
        onSelectTopic={handleSelectDistrict}
        onHubClick={handleTriggerBloom}
        lowPowerMode={lowPowerMode}
        autoRotate={Boolean(world.autoRotate)}
        hasLearnedToday={Boolean(profile.lastActiveDate && new Date(profile.lastActiveDate).toDateString() === new Date().toDateString())}
      />

      {/* Top Left HUD: Learner Identity & World Hub */}
      <div className="absolute top-4 left-4 z-20 pointer-events-none">
        <div className="pointer-events-auto bg-white/90 backdrop-blur-md px-4 py-3 rounded-2xl border border-stone-200/80 shadow-md">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">🏝️</span>
            <div>
              <div className="text-[10px] font-extrabold text-emerald-700 uppercase tracking-wider">
                {profile.overallIdentity}
              </div>
              <div className="text-base font-extrabold text-stone-900 flex items-center gap-2">
                <span>{profile.displayName}'s Garden Hub</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                  Lvl {profile.overallLevel}
                </span>
              </div>
            </div>
          </div>

          {/* Level Progress Bar */}
          <div className="mt-2.5 w-44">
            <div className="flex justify-between text-[10px] text-stone-500 font-semibold mb-1">
              <span>{profile.totalXp} XP</span>
              <span>{nextLevelXp} XP</span>
            </div>
            <div className="w-full h-1.5 bg-stone-200/70 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
                style={{ width: `${levelProgressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Top Right Controls */}
      <WorldControls
        worldState={{
          userId: profile.id,
          level: profile.overallLevel,
          unlockedRegions: userTopics.map((u) => u.topicName),
          timeOfDay: world.timeOfDay,
          weather: world.weather,
          growthStage: Math.min(10, userTopics.length * 2),
          waterflowSpeed: 1,
          plantDensity: 3,
          activeThematicTheme: 'general',
        }}
        weather={world.weather}
        activeDaysThisWeek={profile.activeDaysThisWeek}
        hasLearnedToday={Boolean(profile.lastActiveDate && new Date(profile.lastActiveDate).toDateString() === new Date().toDateString())}
        autoRotate={Boolean(world.autoRotate)}
        onToggleAutoRotate={(val) => onUpdateWorld({ autoRotate: val })}
        onChangeTimeOfDay={(time) => onUpdateWorld({ timeOfDay: time })}
        onChangeWeather={(weather) => onUpdateWorld({ weather })}
        lowPowerMode={lowPowerMode}
        onToggleLowPower={() => setLowPowerMode(!lowPowerMode)}
        onTriggerBloom={handleTriggerBloom}
        onResetView={() => {
          setSelectedTopicId(undefined);
          setInspectingTopic(null);
        }}
      />

      {/* Bottom Floating Quick Quest Callout */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 w-11/12 max-w-xl pointer-events-none">
        <div className="pointer-events-auto bg-white/90 backdrop-blur-lg rounded-3xl p-4 md:p-5 border border-stone-200/80 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-base shrink-0 shadow-inner">
              🌱
            </div>
            <div className="overflow-hidden">
              <div className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
                {recommendedQuest.topicName} • {recommendedQuest.estimatedMinutes} mins
              </div>
              <div className="text-sm md:text-base font-extrabold text-stone-900 truncate">
                {recommendedQuest.title}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onStartQuest(recommendedQuest)}
            className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-sm shadow-md shadow-emerald-600/25 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Start</span>
          </button>
        </div>

        {/* Active Topics Quick Selector Dock */}
        <div className="pointer-events-auto mt-2 flex justify-center gap-2 overflow-x-auto py-1">
          {userTopics.map((ut) => {
            const isSelected = selectedTopicId === ut.id;
            return (
              <button
                key={ut.id}
                onClick={() => handleSelectDistrict(ut.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold backdrop-blur transition flex items-center gap-1.5 shadow-sm cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-700 text-white ring-2 ring-emerald-300'
                    : 'bg-white/85 hover:bg-white text-stone-700 border border-stone-200/70'
                }`}
              >
                <span>{ut.topicIcon}</span>
                <span>{ut.topicName}</span>
                <span className="opacity-75 text-[10px]">Lvl {ut.level}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Inspecting Topic Quick Modal */}
      {inspectingTopic && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 border border-emerald-100 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl p-2 rounded-2xl bg-emerald-50 border border-emerald-100">
                  {inspectingTopic.topicIcon}
                </span>
                <div>
                  <h3 className="text-xl font-extrabold text-stone-900">
                    {inspectingTopic.topicName} District
                  </h3>
                  <div className="text-xs text-emerald-700 font-bold">
                    Level {inspectingTopic.level} • {inspectingTopic.xp} XP
                  </div>
                </div>
              </div>
              <button
                onClick={() => setInspectingTopic(null)}
                className="text-stone-400 hover:text-stone-700 p-1"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              This 3D district evolves as you complete quests in {inspectingTopic.topicName}. Each stage unlocks new landmarks, structures, and props.
            </p>

            {showDeleteConfirm ? (
              <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 space-y-2 animate-fade-in">
                <div className="text-xs font-black text-red-900">
                  Delete {inspectingTopic.topicName} Island?
                </div>
                <p className="text-[11px] text-red-700 leading-relaxed">
                  This will remove this district from your 3D archipelago and remove its active quests.
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      onDeleteTopic?.(inspectingTopic.id);
                      setInspectingTopic(null);
                      setShowDeleteConfirm(false);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs transition active:scale-95 cursor-pointer"
                  >
                    Yes, Delete Island
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-3.5 py-1.5 rounded-xl bg-white border border-stone-300 text-stone-700 text-xs font-bold transition hover:bg-stone-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-2 pt-2 border-t border-stone-100">
                {onDeleteTopic && (
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                    title="Delete this island from your world"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-red-500" />
                    <span>Delete Island</span>
                  </button>
                )}

                <div className="flex items-center gap-2 ml-auto">
                  <button
                    type="button"
                    onClick={() => {
                      onSelectTopic(inspectingTopic.id);
                      setInspectingTopic(null);
                    }}
                    className="px-3.5 py-2 rounded-xl text-stone-600 hover:text-stone-900 text-xs font-bold transition cursor-pointer"
                  >
                    View Topic Path
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onStartQuest(recommendedQuest);
                      setInspectingTopic(null);
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Start Next Quest</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
