import React from 'react';
import { World, WeatherType } from '../types';
import { resolveEffectiveWeather } from './WeatherSystem';

interface LightingProps {
  timeOfDay: World['timeOfDay'];
  weather?: WeatherType;
  activeDaysThisWeek?: number;
  hasLearnedToday?: boolean;
}

export const Lighting: React.FC<LightingProps> = ({
  timeOfDay,
  weather = 'auto',
  activeDaysThisWeek = 3,
  hasLearnedToday = false,
}) => {
  // Determine effective time of day
  let effectiveTime = timeOfDay;
  if (effectiveTime === 'auto') {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 11) effectiveTime = 'morning';
    else if (hour >= 11 && hour < 17) effectiveTime = 'afternoon';
    else if (hour >= 17 && hour < 21) effectiveTime = 'dusk';
    else effectiveTime = 'night';
  }

  const { type: effectiveWeather } = resolveEffectiveWeather(
    weather,
    effectiveTime,
    activeDaysThisWeek,
    hasLearnedToday
  );

  // 1. GENTLE RAIN LIGHTING (Cool, serene blue-gray mist)
  if (effectiveWeather === 'gentle_rain') {
    return (
      <>
        <color attach="background" args={['#475569']} />
        <fog attach="fog" args={['#475569', 12, 34]} />
        <ambientLight intensity={0.5} color="#94a3b8" />
        <directionalLight
          position={[6, 12, 6]}
          intensity={0.65}
          color="#cbd5e1"
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <pointLight position={[0, 1.8, 0]} intensity={1.2} distance={6} color="#93c5fd" />
      </>
    );
  }

  // 2. NIGHT / TWILIGHT AURORA LIGHTING
  if (effectiveTime === 'night' || effectiveWeather === 'twilight_aurora') {
    return (
      <>
        <color attach="background" args={['#0a0f1d']} />
        <fog attach="fog" args={['#0a0f1d', 14, 38]} />
        <ambientLight intensity={0.4} color="#6366f1" />
        <directionalLight
          position={[8, 14, 8]}
          intensity={0.6}
          color="#a5b4fc"
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        {/* Warm hub lantern accent */}
        <pointLight position={[0, 2, 0]} intensity={1.8} distance={8} color="#fcd34d" />
      </>
    );
  }

  // 3. DUSK LIGHTING
  if (effectiveTime === 'dusk') {
    return (
      <>
        <color attach="background" args={['#271b2d']} />
        <fog attach="fog" args={['#271b2d', 15, 40]} />
        <ambientLight intensity={0.6} color="#f472b6" />
        <directionalLight
          position={[12, 10, -6]}
          intensity={1.25}
          color="#fb923c"
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <pointLight position={[0, 1.5, 0]} intensity={1.3} distance={6} color="#fef08a" />
      </>
    );
  }

  // 4. MORNING LIGHTING
  if (effectiveTime === 'morning') {
    return (
      <>
        <color attach="background" args={['#f0fdf4']} />
        <fog attach="fog" args={['#f0fdf4', 16, 42]} />
        <ambientLight intensity={0.8} color="#fef3c7" />
        <directionalLight
          position={[10, 14, 6]}
          intensity={1.15}
          color="#fde68a"
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
      </>
    );
  }

  // 5. RADIANT SUNNY / AFTERNOON (Default)
  return (
    <>
      <color attach="background" args={['#ecfdf5']} />
      <fog attach="fog" args={['#ecfdf5', 16, 45]} />
      <ambientLight intensity={0.85} color="#ffffff" />
      <directionalLight
        position={[10, 16, 8]}
        intensity={1.35}
        color="#fffbeb"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <hemisphereLight intensity={0.35} color="#6ee7b7" groundColor="#3b694c" />
    </>
  );
};
