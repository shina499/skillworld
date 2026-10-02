import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { WorldRegion, UserTopic } from '../types';

interface TopicDistrictProps {
  region: WorldRegion;
  userTopic: UserTopic;
  isSelected?: boolean;
  onSelect: () => void;
  isSpinning?: boolean;
}

export const TopicDistrict: React.FC<TopicDistrictProps> = ({
  region,
  userTopic,
  isSelected,
  onSelect,
  isSpinning = false,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const floatingPropRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  const stage = region.stage || 1;
  const category = region.topicCategory || 'tech';

  useFrame(({ clock }) => {
    if (!isSpinning) {
      if (groupRef.current) {
        groupRef.current.position.y = region.position[1];
      }
      return;
    }
    const t = clock.getElapsedTime();
    if (floatingPropRef.current) {
      floatingPropRef.current.position.y = 1.6 + Math.sin(t * 2 + region.position[0]) * 0.08;
      floatingPropRef.current.rotation.y += 0.015;
    }
    if (groupRef.current && hovered) {
      groupRef.current.position.y = region.position[1] + Math.sin(t * 4) * 0.04;
    } else if (groupRef.current) {
      groupRef.current.position.y = region.position[1];
    }
  });

  // Calculate bridge stone positions connecting (0,0,0) to region.position
  const bridgePositions = React.useMemo(() => {
    const [targetX, , targetZ] = region.position;
    const count = 3;
    const stones: [number, number, number][] = [];
    for (let i = 1; i <= count; i++) {
      const factor = (i / (count + 1)) * 0.75;
      stones.push([targetX * factor, 0.04, targetZ * factor]);
    }
    return stones;
  }, [region.position]);

  return (
    <group>
      {/* 1. Connecting Stepping Stone Bridge */}
      {bridgePositions.map((pos, idx) => (
        <mesh key={idx} position={pos} rotation={[-Math.PI / 2, 0, idx * 0.4]}>
          <circleGeometry args={[0.22, 6]} />
          <meshStandardMaterial color="#c7bfae" roughness={0.9} />
        </mesh>
      ))}

      {/* 2. Topic District Island & Structures */}
      <group
        ref={groupRef}
        position={region.position}
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = 'auto';
        }}
      >
        {/* District Bedrock */}
        <mesh position={[0, -0.7, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[1.8, 0.5, 1.4, 8]} />
          <meshStandardMaterial color="#423428" roughness={0.9} flatShading />
        </mesh>

        {/* District Grassy Top with Theme Accent */}
        <mesh position={[0, 0.04, 0]} receiveShadow>
          <cylinderGeometry args={[1.85, 1.8, 0.15, 10]} />
          <meshStandardMaterial
            color={
              category === 'tech'
                ? '#388e5d'
                : category === 'art'
                ? '#86516a'
                : category === 'photo'
                ? '#544639'
                : category === 'language'
                ? '#3f5d75'
                : category === 'music'
                ? '#683f7a'
                : category === 'culinary'
                ? '#784634'
                : category === 'tactics'
                ? '#475569'
                : '#254e58'
            }
            roughness={0.7}
            flatShading
          />
        </mesh>

        {/* Outer Highlight Ring on Selection */}
        {(hovered || isSelected) && (
          <mesh position={[0, 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[1.75, 1.92, 24]} />
            <meshStandardMaterial color="#34d399" emissive="#10b981" emissiveIntensity={0.6} />
          </mesh>
        )}

        {/* ============================================================== */}
        {/* TOPIC STRUCTURES BY CATEGORY & STAGE                          */}
        {/* ============================================================== */}

        {/* 💻 TECH / PROGRAMMING DISTRICT */}
        {category === 'tech' && (
          <group>
            {/* Wooden Desk */}
            <mesh position={[0, 0.35, 0]} castShadow>
              <boxGeometry args={[0.9, 0.06, 0.45]} />
              <meshStandardMaterial color="#50351f" />
            </mesh>
            <mesh position={[-0.38, 0.17, 0.16]}>
              <cylinderGeometry args={[0.03, 0.03, 0.35, 4]} />
              <meshStandardMaterial color="#301f11" />
            </mesh>
            <mesh position={[0.38, 0.17, 0.16]}>
              <cylinderGeometry args={[0.03, 0.03, 0.35, 4]} />
              <meshStandardMaterial color="#301f11" />
            </mesh>

            {/* Glowing Terminal Monitor */}
            <mesh position={[0, 0.52, -0.06]} rotation={[-0.1, 0, 0]}>
              <boxGeometry args={[0.42, 0.28, 0.03]} />
              <meshStandardMaterial color="#1e293b" emissive="#10b981" emissiveIntensity={0.7} />
            </mesh>
            <mesh position={[0, 0.39, 0.05]}>
              <boxGeometry args={[0.38, 0.02, 0.18]} />
              <meshStandardMaterial color="#475569" />
            </mesh>

            {/* Stage 2+: Server Tower */}
            {stage >= 2 && (
              <mesh position={[0.65, 0.5, -0.2]} castShadow>
                <boxGeometry args={[0.3, 1.0, 0.35]} />
                <meshStandardMaterial color="#1e293b" emissive="#06b6d4" emissiveIntensity={0.3} />
              </mesh>
            )}

            {/* Stage 3+: Automated Tech Antenna */}
            {stage >= 3 && (
              <group position={[-0.65, 0.4, -0.2]}>
                <mesh position={[0, 0.4, 0]}>
                  <cylinderGeometry args={[0.02, 0.03, 0.8, 5]} />
                  <meshStandardMaterial color="#64748b" />
                </mesh>
                <mesh position={[0, 0.8, 0]}>
                  <sphereGeometry args={[0.08, 6, 6]} />
                  <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={0.8} />
                </mesh>
              </group>
            )}

            {/* Floating Holographic Data Cube */}
            <group ref={floatingPropRef} position={[0, 1.5, 0]}>
              <mesh>
                <boxGeometry args={[0.2, 0.2, 0.2]} />
                <meshStandardMaterial color="#34d399" emissive="#059669" emissiveIntensity={0.9} transparent opacity={0.85} />
              </mesh>
            </group>
          </group>
        )}

        {/* 🎨 ART & DRAWING DISTRICT */}
        {category === 'art' && (
          <group>
            {/* Wooden Easel */}
            <group position={[0, 0.45, 0]}>
              <mesh position={[-0.2, 0, 0]} rotation={[0, 0, -0.15]}>
                <cylinderGeometry args={[0.025, 0.025, 1.0, 4]} />
                <meshStandardMaterial color="#784724" />
              </mesh>
              <mesh position={[0.2, 0, 0]} rotation={[0, 0, 0.15]}>
                <cylinderGeometry args={[0.025, 0.025, 1.0, 4]} />
                <meshStandardMaterial color="#784724" />
              </mesh>
            </group>

            {/* Canvas */}
            <mesh position={[0, 0.68, 0.04]} rotation={[-0.1, 0, 0]} castShadow>
              <boxGeometry args={[0.55, 0.42, 0.03]} />
              <meshStandardMaterial color="#fef3c7" />
            </mesh>

            {/* Paint Splatter Artwork */}
            <mesh position={[0.06, 0.7, 0.06]} rotation={[-0.1, 0, 0]}>
              <circleGeometry args={[0.1, 6]} />
              <meshStandardMaterial color="#ec4899" />
            </mesh>

            {/* Stage 2+: Art Stool & Color Wheel Palette */}
            {stage >= 2 && (
              <mesh position={[0.5, 0.2, 0.3]}>
                <cylinderGeometry args={[0.16, 0.18, 0.35, 6]} />
                <meshStandardMaterial color="#6b4c3b" />
              </mesh>
            )}

            {/* Stage 3+: Gallery Pillars */}
            {stage >= 3 && (
              <group position={[-0.55, 0.4, -0.2]}>
                <mesh position={[0, 0.3, 0]}>
                  <cylinderGeometry args={[0.05, 0.06, 0.6, 5]} />
                  <meshStandardMaterial color="#dfd8c8" />
                </mesh>
              </group>
            )}

            {/* Floating Color Orb */}
            <group ref={floatingPropRef} position={[0, 1.5, 0]}>
              <mesh>
                <sphereGeometry args={[0.15, 8, 8]} />
                <meshStandardMaterial color="#f43f5e" emissive="#e11d48" emissiveIntensity={0.8} />
              </mesh>
            </group>
          </group>
        )}

        {/* 📸 PHOTOGRAPHY DISTRICT */}
        {category === 'photo' && (
          <group>
            {/* Tripod Stand */}
            <mesh position={[-0.16, 0.35, 0.1]} rotation={[0.2, 0, -0.2]}>
              <cylinderGeometry args={[0.02, 0.02, 0.75, 4]} />
              <meshStandardMaterial color="#334155" />
            </mesh>
            <mesh position={[0.16, 0.35, 0.1]} rotation={[0.2, 0, 0.2]}>
              <cylinderGeometry args={[0.02, 0.02, 0.75, 4]} />
              <meshStandardMaterial color="#334155" />
            </mesh>
            <mesh position={[0, 0.35, -0.16]} rotation={[-0.25, 0, 0]}>
              <cylinderGeometry args={[0.02, 0.02, 0.75, 4]} />
              <meshStandardMaterial color="#334155" />
            </mesh>
            {/* Camera */}
            <mesh position={[0, 0.75, 0]}>
              <boxGeometry args={[0.26, 0.18, 0.16]} />
              <meshStandardMaterial color="#1e293b" />
            </mesh>
            <mesh position={[0, 0.75, 0.12]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.07, 0.07, 0.1, 8]} />
              <meshStandardMaterial color="#0f172a" metalness={0.7} />
            </mesh>

            {/* Stage 2+: Darkroom Red Lantern */}
            {stage >= 2 && (
              <mesh position={[-0.55, 0.35, 0]}>
                <boxGeometry args={[0.18, 0.24, 0.18]} />
                <meshStandardMaterial color="#b91c1c" emissive="#ef4444" emissiveIntensity={0.8} />
              </mesh>
            )}

            {/* Floating Photo Print */}
            <group ref={floatingPropRef} position={[0, 1.45, 0]}>
              <mesh>
                <boxGeometry args={[0.25, 0.3, 0.02]} />
                <meshStandardMaterial color="#ffffff" emissive="#f59e0b" emissiveIntensity={0.5} />
              </mesh>
            </group>
          </group>
        )}

        {/* 📚 ENGLISH & LANGUAGE DISTRICT */}
        {category === 'language' && (
          <group>
            {/* Gazebo Roof */}
            <mesh position={[0, 1.05, 0]}>
              <coneGeometry args={[0.65, 0.35, 4]} />
              <meshStandardMaterial color="#2d5a3f" />
            </mesh>
            <mesh position={[-0.3, 0.5, -0.2]}>
              <cylinderGeometry args={[0.03, 0.04, 1.0, 4]} />
              <meshStandardMaterial color="#7a5435" />
            </mesh>
            <mesh position={[0.3, 0.5, -0.2]}>
              <cylinderGeometry args={[0.03, 0.04, 1.0, 4]} />
              <meshStandardMaterial color="#7a5435" />
            </mesh>
            {/* Stack of books */}
            <mesh position={[0, 0.12, 0]}>
              <boxGeometry args={[0.35, 0.1, 0.25]} />
              <meshStandardMaterial color="#b91c1c" />
            </mesh>
            <mesh position={[0.02, 0.22, 0]}>
              <boxGeometry args={[0.32, 0.08, 0.22]} />
              <meshStandardMaterial color="#1d4ed8" />
            </mesh>

            {/* Stage 2+: Reading Armchair */}
            {stage >= 2 && (
              <mesh position={[0.55, 0.25, 0.2]}>
                <boxGeometry args={[0.3, 0.3, 0.3]} />
                <meshStandardMaterial color="#78350f" />
              </mesh>
            )}

            {/* Floating Open Scroll */}
            <group ref={floatingPropRef} position={[0, 1.45, 0]}>
              <mesh rotation={[0.4, 0, 0]}>
                <boxGeometry args={[0.28, 0.04, 0.18]} />
                <meshStandardMaterial color="#fef9c3" emissive="#facc15" emissiveIntensity={0.6} />
              </mesh>
            </group>
          </group>
        )}

        {/* 🎵 MUSIC DISTRICT */}
        {category === 'music' && (
          <group>
            {/* Podium */}
            <mesh position={[0, 0.15, 0]}>
              <cylinderGeometry args={[0.5, 0.6, 0.3, 8]} />
              <meshStandardMaterial color="#78350f" />
            </mesh>
            {/* Gramophone */}
            <mesh position={[0, 0.42, 0]}>
              <boxGeometry args={[0.26, 0.18, 0.26]} />
              <meshStandardMaterial color="#5a2b0e" />
            </mesh>
            <mesh position={[0.1, 0.65, 0.1]} rotation={[0.3, 0.6, -0.5]}>
              <coneGeometry args={[0.22, 0.32, 8]} />
              <meshStandardMaterial color="#eab308" metalness={0.6} roughness={0.3} />
            </mesh>

            {/* Floating Musical Octahedron */}
            <group ref={floatingPropRef} position={[0, 1.45, 0]}>
              <mesh>
                <octahedronGeometry args={[0.15, 0]} />
                <meshStandardMaterial color="#a855f7" emissive="#9333ea" emissiveIntensity={0.8} />
              </mesh>
            </group>
          </group>
        )}

        {/* 🍳 CULINARY DISTRICT */}
        {category === 'culinary' && (
          <group>
            {/* Herb Planter Table */}
            <mesh position={[0, 0.3, 0]} castShadow>
              <boxGeometry args={[0.7, 0.35, 0.45]} />
              <meshStandardMaterial color="#57382d" />
            </mesh>
            {/* Herbs */}
            <mesh position={[0, 0.52, 0]}>
              <sphereGeometry args={[0.16, 6, 6]} />
              <meshStandardMaterial color="#22c55e" />
            </mesh>
            {/* Cast Iron Skillet */}
            <mesh position={[0.4, 0.2, 0.2]}>
              <cylinderGeometry args={[0.12, 0.12, 0.04, 6]} />
              <meshStandardMaterial color="#1e293b" />
            </mesh>

            {/* Floating Golden Spice Flask */}
            <group ref={floatingPropRef} position={[0, 1.45, 0]}>
              <mesh>
                <octahedronGeometry args={[0.14, 0]} />
                <meshStandardMaterial color="#f59e0b" emissive="#d97706" emissiveIntensity={0.7} />
              </mesh>
            </group>
          </group>
        )}

        {/* ♟️ TACTICS & CHESS DISTRICT */}
        {category === 'tactics' && (
          <group>
            {/* Checkerboard Stone Base */}
            <mesh position={[0, 0.1, 0]}>
              <boxGeometry args={[0.8, 0.1, 0.8]} />
              <meshStandardMaterial color="#64748b" />
            </mesh>
            {/* Carved Knight Figure */}
            <mesh position={[0, 0.35, 0]}>
              <cylinderGeometry args={[0.1, 0.15, 0.4, 6]} />
              <meshStandardMaterial color="#f8fafc" />
            </mesh>

            {/* Floating Pawn Gem */}
            <group ref={floatingPropRef} position={[0, 1.45, 0]}>
              <mesh>
                <dodecahedronGeometry args={[0.14, 0]} />
                <meshStandardMaterial color="#cbd5e1" emissive="#94a3b8" emissiveIntensity={0.6} />
              </mesh>
            </group>
          </group>
        )}

        {/* 🔬 SCIENCE & COSMOS DISTRICT */}
        {category === 'science' && (
          <group>
            {/* Stone Plinth */}
            <mesh position={[0, 0.25, 0]}>
              <cylinderGeometry args={[0.35, 0.45, 0.5, 6]} />
              <meshStandardMaterial color="#475569" />
            </mesh>
            {/* Brass Telescope */}
            <group position={[0, 0.65, 0]} rotation={[0.6, 0.4, 0]}>
              <mesh>
                <cylinderGeometry args={[0.07, 0.05, 0.65, 8]} />
                <meshStandardMaterial color="#d97706" metalness={0.6} roughness={0.3} />
              </mesh>
            </group>

            {/* Floating Planet Sphere */}
            <group ref={floatingPropRef} position={[0, 1.5, 0]}>
              <mesh>
                <sphereGeometry args={[0.15, 8, 8]} />
                <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={0.9} />
              </mesh>
            </group>
          </group>
        )}

        {/* 🌱 CUSTOM DISTRICT */}
        {category === 'custom' && (
          <group>
            <mesh position={[0, 0.3, 0]}>
              <boxGeometry args={[0.6, 0.2, 0.4]} />
              <meshStandardMaterial color="#5c4436" />
            </mesh>
            <group ref={floatingPropRef} position={[0, 1.45, 0]}>
              <mesh>
                <octahedronGeometry args={[0.16, 0]} />
                <meshStandardMaterial color="#10b981" emissive="#059669" emissiveIntensity={0.8} />
              </mesh>
            </group>
          </group>
        )}

        {/* Topic Title Badge Hover Marker */}
        {(hovered || isSelected) && (
          <mesh position={[0, 2.05, 0]} rotation={[Math.PI, 0, 0]}>
            <coneGeometry args={[0.15, 0.25, 4]} />
            <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={0.6} />
          </mesh>
        )}
      </group>
    </group>
  );
};
