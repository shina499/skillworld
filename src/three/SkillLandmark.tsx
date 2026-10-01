import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface SkillLandmarkProps {
  type: 'tech' | 'art' | 'language' | 'music' | 'science' | 'photo' | 'custom';
  position: [number, number, number];
  skillName: string;
  level: number;
  xp: number;
  isSelected?: boolean;
  onSelect: () => void;
}

export const SkillLandmark: React.FC<SkillLandmarkProps> = ({
  type,
  position,
  skillName,
  level,
  isSelected,
  onSelect,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const floatingItemRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (floatingItemRef.current) {
      floatingItemRef.current.position.y = 1.6 + Math.sin(t * 2 + position[0]) * 0.08;
      floatingItemRef.current.rotation.y += 0.015;
    }
    if (groupRef.current && hovered) {
      groupRef.current.position.y = position[1] + Math.sin(t * 4) * 0.05;
    } else if (groupRef.current) {
      groupRef.current.position.y = position[1];
    }
  });

  return (
    <group
      ref={groupRef}
      position={position}
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
      {/* Base platform ring */}
      <mesh position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.9, 16]} />
        <meshStandardMaterial
          color={hovered || isSelected ? '#a8ebc2' : '#e0d8c8'}
          roughness={0.7}
        />
      </mesh>

      {/* 1. TECH LAB (Programming) */}
      {type === 'tech' && (
        <group>
          {/* Wooden Desk */}
          <mesh position={[0, 0.4, 0]} castShadow>
            <boxGeometry args={[0.9, 0.06, 0.5]} />
            <meshStandardMaterial color="#533b28" />
          </mesh>
          <mesh position={[-0.38, 0.2, 0.18]}>
            <cylinderGeometry args={[0.03, 0.03, 0.4, 4]} />
            <meshStandardMaterial color="#352417" />
          </mesh>
          <mesh position={[0.38, 0.2, 0.18]}>
            <cylinderGeometry args={[0.03, 0.03, 0.4, 4]} />
            <meshStandardMaterial color="#352417" />
          </mesh>
          <mesh position={[-0.38, 0.2, -0.18]}>
            <cylinderGeometry args={[0.03, 0.03, 0.4, 4]} />
            <meshStandardMaterial color="#352417" />
          </mesh>
          <mesh position={[0.38, 0.2, -0.18]}>
            <cylinderGeometry args={[0.03, 0.03, 0.4, 4]} />
            <meshStandardMaterial color="#352417" />
          </mesh>

          {/* Glowing Laptop / Terminal Screen */}
          <mesh position={[0, 0.58, -0.05]} rotation={[-0.15, 0, 0]}>
            <boxGeometry args={[0.42, 0.28, 0.03]} />
            <meshStandardMaterial
              color="#2a303c"
              emissive="#10b981"
              emissiveIntensity={0.65}
            />
          </mesh>
          <mesh position={[0, 0.44, 0.06]}>
            <boxGeometry args={[0.42, 0.02, 0.22]} />
            <meshStandardMaterial color="#475569" />
          </mesh>

          {/* Floating Data Cube */}
          <group ref={floatingItemRef} position={[0, 1.4, 0]}>
            <mesh castShadow>
              <boxGeometry args={[0.22, 0.22, 0.22]} />
              <meshStandardMaterial
                color="#34d399"
                emissive="#059669"
                emissiveIntensity={0.8}
                wireframe={false}
                transparent
                opacity={0.9}
              />
            </mesh>
          </group>
        </group>
      )}

      {/* 2. ART STUDIO (Drawing) */}
      {type === 'art' && (
        <group>
          {/* Wooden Easel */}
          <group position={[0, 0.5, 0]}>
            <mesh position={[-0.22, 0, 0]} rotation={[0, 0, -0.15]}>
              <cylinderGeometry args={[0.03, 0.03, 1.1, 4]} />
              <meshStandardMaterial color="#85532d" />
            </mesh>
            <mesh position={[0.22, 0, 0]} rotation={[0, 0, 0.15]}>
              <cylinderGeometry args={[0.03, 0.03, 1.1, 4]} />
              <meshStandardMaterial color="#85532d" />
            </mesh>
            <mesh position={[0, 0, -0.25]} rotation={[-0.2, 0, 0]}>
              <cylinderGeometry args={[0.03, 0.03, 1.1, 4]} />
              <meshStandardMaterial color="#704423" />
            </mesh>
          </group>

          {/* Canvas with artwork */}
          <mesh position={[0, 0.75, 0.06]} rotation={[-0.1, 0, 0]} castShadow>
            <boxGeometry args={[0.55, 0.45, 0.04]} />
            <meshStandardMaterial color="#fef3c7" roughness={0.9} />
          </mesh>

          {/* Paint dab on canvas */}
          <mesh position={[0.05, 0.78, 0.09]} rotation={[-0.1, 0, 0]}>
            <circleGeometry args={[0.1, 6]} />
            <meshStandardMaterial color="#f43f5e" />
          </mesh>

          {/* Floating colorful paint orb */}
          <group ref={floatingItemRef} position={[0, 1.5, 0]}>
            <mesh>
              <sphereGeometry args={[0.15, 8, 8]} />
              <meshStandardMaterial color="#ec4899" emissive="#db2777" emissiveIntensity={0.6} />
            </mesh>
          </group>
        </group>
      )}

      {/* 3. LIBRARY / LANGUAGE PERGOLA */}
      {type === 'language' && (
        <group>
          {/* Gazebo Pillars */}
          <mesh position={[-0.35, 0.55, -0.2]}>
            <cylinderGeometry args={[0.04, 0.05, 1.1, 5]} />
            <meshStandardMaterial color="#8c6239" />
          </mesh>
          <mesh position={[0.35, 0.55, -0.2]}>
            <cylinderGeometry args={[0.04, 0.05, 1.1, 5]} />
            <meshStandardMaterial color="#8c6239" />
          </mesh>
          {/* Canopy Roof */}
          <mesh position={[0, 1.15, -0.1]} rotation={[0, 0, 0]}>
            <coneGeometry args={[0.65, 0.35, 4]} />
            <meshStandardMaterial color="#2d5a3f" />
          </mesh>
          {/* Stack of books */}
          <mesh position={[0, 0.12, 0]} rotation={[0, 0.2, 0]}>
            <boxGeometry args={[0.35, 0.1, 0.25]} />
            <meshStandardMaterial color="#b91c1c" />
          </mesh>
          <mesh position={[0.02, 0.22, 0]} rotation={[0, -0.15, 0]}>
            <boxGeometry args={[0.32, 0.08, 0.22]} />
            <meshStandardMaterial color="#1d4ed8" />
          </mesh>
          {/* Floating open book or scroll */}
          <group ref={floatingItemRef} position={[0, 1.4, 0]}>
            <mesh rotation={[0.4, 0, 0]}>
              <boxGeometry args={[0.26, 0.04, 0.18]} />
              <meshStandardMaterial color="#fef9c3" emissive="#facc15" emissiveIntensity={0.5} />
            </mesh>
          </group>
        </group>
      )}

      {/* 4. MUSIC PAVILION */}
      {type === 'music' && (
        <group>
          {/* Round acoustic podium */}
          <mesh position={[0, 0.15, 0]}>
            <cylinderGeometry args={[0.55, 0.65, 0.3, 8]} />
            <meshStandardMaterial color="#92400e" />
          </mesh>
          {/* Gramophone base and horn */}
          <mesh position={[0, 0.42, 0]}>
            <boxGeometry args={[0.3, 0.2, 0.3]} />
            <meshStandardMaterial color="#78350f" />
          </mesh>
          <mesh position={[0.1, 0.65, 0.1]} rotation={[0.3, 0.6, -0.5]}>
            <coneGeometry args={[0.24, 0.35, 8]} />
            <meshStandardMaterial color="#eab308" metalness={0.6} roughness={0.3} />
          </mesh>
          {/* Floating musical note crystal */}
          <group ref={floatingItemRef} position={[0, 1.45, 0]}>
            <mesh>
              <octahedronGeometry args={[0.14, 0]} />
              <meshStandardMaterial color="#a855f7" emissive="#9333ea" emissiveIntensity={0.8} />
            </mesh>
          </group>
        </group>
      )}

      {/* 5. SCIENCE OBSERVATORY */}
      {type === 'science' && (
        <group>
          {/* Stone pedestal */}
          <mesh position={[0, 0.25, 0]}>
            <cylinderGeometry args={[0.35, 0.42, 0.5, 6]} />
            <meshStandardMaterial color="#64748b" roughness={0.8} />
          </mesh>
          {/* Brass Telescope pointing to the sky */}
          <group position={[0, 0.65, 0]} rotation={[0.6, 0.4, 0]}>
            <mesh>
              <cylinderGeometry args={[0.07, 0.05, 0.65, 8]} />
              <meshStandardMaterial color="#d97706" metalness={0.5} roughness={0.3} />
            </mesh>
          </group>
          {/* Floating glowing atom / planetoid */}
          <group ref={floatingItemRef} position={[0, 1.5, 0]}>
            <mesh>
              <sphereGeometry args={[0.13, 8, 8]} />
              <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={0.9} />
            </mesh>
          </group>
        </group>
      )}

      {/* 6. PHOTOGRAPHY / CUSTOM */}
      {(type === 'photo' || type === 'custom') && (
        <group>
          {/* Tripod Stand */}
          <mesh position={[-0.18, 0.35, 0.1]} rotation={[0.2, 0, -0.2]}>
            <cylinderGeometry args={[0.02, 0.02, 0.75, 4]} />
            <meshStandardMaterial color="#334155" />
          </mesh>
          <mesh position={[0.18, 0.35, 0.1]} rotation={[0.2, 0, 0.2]}>
            <cylinderGeometry args={[0.02, 0.02, 0.75, 4]} />
            <meshStandardMaterial color="#334155" />
          </mesh>
          <mesh position={[0, 0.35, -0.18]} rotation={[-0.25, 0, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.75, 4]} />
            <meshStandardMaterial color="#334155" />
          </mesh>
          {/* Camera body and lens */}
          <mesh position={[0, 0.75, 0]}>
            <boxGeometry args={[0.26, 0.18, 0.16]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
          <mesh position={[0, 0.75, 0.12]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.07, 0.07, 0.1, 8]} />
            <meshStandardMaterial color="#0f172a" metalness={0.7} />
          </mesh>
          {/* Floating photo print */}
          <group ref={floatingItemRef} position={[0, 1.45, 0]}>
            <mesh>
              <boxGeometry args={[0.25, 0.3, 0.02]} />
              <meshStandardMaterial color="#f8fafc" emissive="#f59e0b" emissiveIntensity={0.4} />
            </mesh>
          </group>
        </group>
      )}

      {/* Hover / Active Indicator Badge */}
      {(hovered || isSelected) && (
        <mesh position={[0, 2.1, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.15, 0.25, 4]} />
          <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={0.5} />
        </mesh>
      )}
    </group>
  );
};
