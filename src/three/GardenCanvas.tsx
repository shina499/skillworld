import React, { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Island } from './Island';
import { WaterAndClouds } from './WaterAndClouds';
import { Lighting } from './Lighting';
import { WeatherSystem } from './WeatherSystem';
import { UserProfile, UserTopic, WorldRegion, World } from '../types';

interface GardenCanvasProps {
  profile: UserProfile;
  userTopics: UserTopic[];
  worldRegions: WorldRegion[];
  world: World;
  selectedTopicId?: string;
  onSelectTopic: (userTopicId: string) => void;
  onHubClick?: () => void;
  lowPowerMode?: boolean;
  hasLearnedToday?: boolean;
  autoRotate?: boolean;
}

function Fallback2DWorld({
  profile,
  userTopics,
  world,
  onSelectTopic,
}: {
  profile: UserProfile;
  userTopics: UserTopic[];
  world: World;
  onSelectTopic: (id: string) => void;
}) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-emerald-50 via-teal-50 to-stone-100 p-8 text-center select-none">
      <div className="text-5xl mb-3 animate-bounce">🌱</div>
      <h3 className="text-2xl font-extrabold text-stone-900">{profile.displayName}'s World Hub</h3>
      <p className="text-stone-600 text-sm mt-1 max-w-md">
        {profile.overallIdentity} • Overall Level {profile.overallLevel} ({profile.totalXp} XP)
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6 max-w-lg w-full">
        {userTopics.map((ut) => (
          <div
            key={ut.id}
            onClick={() => onSelectTopic(ut.id)}
            className="p-4 rounded-2xl bg-white/90 backdrop-blur border border-emerald-200/80 shadow-sm text-left hover:border-emerald-400 transition cursor-pointer"
          >
            <div className="flex items-center gap-2 font-bold text-stone-900">
              <span className="text-xl">{ut.topicIcon}</span>
              <span>{ut.topicName} District</span>
            </div>
            <div className="text-xs text-emerald-700 font-semibold mt-1">
              Level {ut.level} • {ut.xp} XP
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export const GardenCanvas: React.FC<GardenCanvasProps> = ({
  profile,
  userTopics,
  worldRegions,
  world,
  selectedTopicId,
  onSelectTopic,
  onHubClick,
  lowPowerMode = false,
  hasLearnedToday = false,
  autoRotate = false,
}) => {
  const [hasWebGlError, setHasWebGlError] = useState(false);

  if (lowPowerMode || hasWebGlError) {
    return (
      <Fallback2DWorld
        profile={profile}
        userTopics={userTopics}
        world={world}
        onSelectTopic={onSelectTopic}
      />
    );
  }

  return (
    <div className="relative w-full h-full select-none">
      <Canvas
        shadows
        camera={{ position: [10, 8, 12], fov: 42 }}
        onError={() => setHasWebGlError(true)}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      >
        <Suspense fallback={null}>
          <Lighting
            timeOfDay={world.timeOfDay}
            weather={world.weather}
            activeDaysThisWeek={profile.activeDaysThisWeek}
            hasLearnedToday={hasLearnedToday}
          />
          <WeatherSystem
            weather={world.weather}
            timeOfDay={world.timeOfDay}
            activeDaysThisWeek={profile.activeDaysThisWeek}
            hasLearnedToday={hasLearnedToday}
          />
          <WaterAndClouds isSpinning={Boolean(autoRotate)} />
          <Island
            profile={profile}
            userTopics={userTopics}
            worldRegions={worldRegions}
            world={world}
            selectedTopicId={selectedTopicId}
            onSelectTopic={onSelectTopic}
            onHubClick={onHubClick}
            isSpinning={Boolean(autoRotate)}
          />
          <OrbitControls
            enablePan={false}
            minDistance={6}
            maxDistance={26}
            maxPolarAngle={Math.PI / 2.15}
            minPolarAngle={Math.PI / 8}
            autoRotate={Boolean(autoRotate)}
            autoRotateSpeed={0.3}
            dampingFactor={0.06}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};
