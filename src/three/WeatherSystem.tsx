import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { WeatherType, World } from '../types';

interface WeatherSystemProps {
  weather?: WeatherType;
  timeOfDay: World['timeOfDay'];
  activeDaysThisWeek: number;
  hasLearnedToday: boolean;
}

export function resolveEffectiveWeather(
  setting: WeatherType = 'auto',
  timeOfDay: World['timeOfDay'],
  activeDaysThisWeek: number,
  hasLearnedToday: boolean
): { type: 'sunny' | 'gentle_rain' | 'breezy_mist' | 'twilight_aurora'; reason: string } {
  if (setting && setting !== 'auto') {
    switch (setting) {
      case 'sunny':
        return { type: 'sunny', reason: 'Radiant Sunshine • Warm golden light over your garden' };
      case 'gentle_rain':
        return { type: 'gentle_rain', reason: 'Gentle Rain • Rain nourishing and replenishing the garden roots' };
      case 'breezy_mist':
        return { type: 'breezy_mist', reason: 'Breezy Mist • Soft drifting mountain breeze across the districts' };
      case 'twilight_aurora':
        return { type: 'twilight_aurora', reason: 'Twilight Aurora • Cosmic starlight and shimmering celestial dust' };
    }
  }

  // Automatic calculation based on streak / daily activity and time of day
  if (timeOfDay === 'night') {
    return {
      type: 'twilight_aurora',
      reason: 'Night Starlight • Quiet evening hours resting under the stars',
    };
  }

  if (hasLearnedToday || activeDaysThisWeek >= 3) {
    return {
      type: 'sunny',
      reason: `High Activity Streak (${activeDaysThisWeek}d this week) • Golden sunbeams radiating across your world`,
    };
  }

  return {
    type: 'gentle_rain',
    reason: 'Rest & Nourishment Day • Gentle rain replenishing your garden. No pressure today.',
  };
}

export const WeatherSystem: React.FC<WeatherSystemProps> = ({
  weather = 'auto',
  timeOfDay,
  activeDaysThisWeek,
  hasLearnedToday,
}) => {
  const { type } = resolveEffectiveWeather(weather, timeOfDay, activeDaysThisWeek, hasLearnedToday);

  // Rain Drops
  const rainCount = 180;
  const rainGeoRef = useRef<THREE.BufferGeometry>(null);
  const rainLinesRef = useRef<THREE.LineSegments>(null);

  const [rainPositions, rainVelocities] = useMemo(() => {
    const pos = new Float32Array(rainCount * 6); // 2 vertices per line drop
    const vel = new Float32Array(rainCount);

    for (let i = 0; i < rainCount; i++) {
      const x = (Math.random() - 0.5) * 20;
      const z = (Math.random() - 0.5) * 20;
      const y = Math.random() * 12 + 1;
      const dropLen = 0.35 + Math.random() * 0.25;

      // Top vertex
      pos[i * 6] = x;
      pos[i * 6 + 1] = y;
      pos[i * 6 + 2] = z;

      // Bottom vertex
      pos[i * 6 + 3] = x;
      pos[i * 6 + 4] = y - dropLen;
      pos[i * 6 + 5] = z;

      vel[i] = 12 + Math.random() * 8;
    }
    return [pos, vel];
  }, [rainCount]);

  // Sunny Sparkles
  const sunCount = 60;
  const sunPosRef = useRef<Float32Array>(null);
  const sunPointsRef = useRef<THREE.Points>(null);

  const sunPositions = useMemo(() => {
    const pos = new Float32Array(sunCount * 3);
    for (let i = 0; i < sunCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 1] = Math.random() * 6 + 0.2;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 16;
    }
    return pos;
  }, [sunCount]);

  // Breezy Leaves
  const leafCount = 40;
  const leafPointsRef = useRef<THREE.Points>(null);
  const leafPositions = useMemo(() => {
    const pos = new Float32Array(leafCount * 3);
    for (let i = 0; i < leafCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 18;
      pos[i * 3 + 1] = Math.random() * 4 + 0.5;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 18;
    }
    return pos;
  }, [leafCount]);

  // Animation Loop
  useFrame((_, delta) => {
    // 1. Rain Animation
    if (type === 'gentle_rain' && rainGeoRef.current) {
      const attr = rainGeoRef.current.getAttribute('position') as THREE.BufferAttribute;
      if (attr) {
        const arr = attr.array as Float32Array;
        for (let i = 0; i < rainCount; i++) {
          const speed = rainVelocities[i] * delta;
          arr[i * 6 + 1] -= speed;
          arr[i * 6 + 4] -= speed;

          // Reset when below ground
          if (arr[i * 6 + 4] < -0.2) {
            const newY = 12 + Math.random() * 2;
            const dropLen = 0.35 + Math.random() * 0.25;
            arr[i * 6 + 1] = newY;
            arr[i * 6 + 4] = newY - dropLen;
          }
        }
        attr.needsUpdate = true;
      }
    }

    // 2. Sunny Sparkles Animation
    if (type === 'sunny' && sunPointsRef.current) {
      sunPointsRef.current.rotation.y += delta * 0.04;
      const attr = sunPointsRef.current.geometry.getAttribute('position') as THREE.BufferAttribute;
      if (attr) {
        const arr = attr.array as Float32Array;
        for (let i = 0; i < sunCount; i++) {
          arr[i * 3 + 1] += delta * 0.3;
          if (arr[i * 3 + 1] > 7) {
            arr[i * 3 + 1] = 0.2;
          }
        }
        attr.needsUpdate = true;
      }
    }

    // 3. Breezy Leaves Animation
    if (type === 'breezy_mist' && leafPointsRef.current) {
      leafPointsRef.current.rotation.y += delta * 0.08;
    }
  });

  return (
    <group>
      {/* 1. GENTLE RAIN EFFECT */}
      {type === 'gentle_rain' && (
        <group>
          <lineSegments ref={rainLinesRef}>
            <bufferGeometry ref={rainGeoRef}>
              <bufferAttribute
                attach="attributes-position"
                args={[rainPositions, 3]}
              />
            </bufferGeometry>
            <lineBasicMaterial
              color="#93c5fd"
              transparent
              opacity={0.65}
              linewidth={1}
            />
          </lineSegments>

          {/* Gentle puddle ripple discs on island surface */}
          <mesh position={[0.8, 0.08, 0.6]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.35, 16]} />
            <meshStandardMaterial
              color="#60a5fa"
              transparent
              opacity={0.3}
              roughness={0.1}
            />
          </mesh>
          <mesh position={[-1.2, 0.08, -0.4]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.45, 16]} />
            <meshStandardMaterial
              color="#60a5fa"
              transparent
              opacity={0.25}
              roughness={0.1}
            />
          </mesh>
        </group>
      )}

      {/* 2. SUNNY GOLDEN RAYS & DUST */}
      {type === 'sunny' && (
        <points ref={sunPointsRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[sunPositions, 3]}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.18}
            color="#fde047"
            transparent
            opacity={0.7}
            blending={THREE.AdditiveBlending}
          />
        </points>
      )}

      {/* 3. BREEZY DRIFTING LEAVES */}
      {type === 'breezy_mist' && (
        <points ref={leafPointsRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[leafPositions, 3]}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.22}
            color="#86efac"
            transparent
            opacity={0.75}
          />
        </points>
      )}

      {/* 4. TWILIGHT AURORA / CELESTIAL STARDUST */}
      {type === 'twilight_aurora' && (
        <group position={[0, 5, 0]}>
          <points>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                args={[sunPositions, 3]}
              />
            </bufferGeometry>
            <pointsMaterial
              size={0.15}
              color="#c084fc"
              transparent
              opacity={0.8}
              blending={THREE.AdditiveBlending}
            />
          </points>

          {/* Soft Aurora Ribbon Disk */}
          <mesh rotation={[-Math.PI / 2.5, 0, 0]} position={[0, 2, -6]}>
            <ringGeometry args={[10, 14, 32]} />
            <meshStandardMaterial
              color="#818cf8"
              emissive="#a855f7"
              emissiveIntensity={0.6}
              transparent
              opacity={0.25}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      )}
    </group>
  );
};
