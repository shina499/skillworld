import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CentralHubProps {
  displayName: string;
  overallIdentity: string;
  overallLevel: number;
  totalXp: number;
  onHubClick?: () => void;
  isSpinning?: boolean;
}

export const CentralHub: React.FC<CentralHubProps> = ({
  displayName,
  overallIdentity,
  overallLevel,
  totalXp,
  onHubClick,
  isSpinning = false,
}) => {
  const crystalRef = useRef<THREE.Mesh>(null);
  const fountainWaterRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!isSpinning) return;
    const t = clock.getElapsedTime();
    if (crystalRef.current) {
      crystalRef.current.position.y = 1.8 + Math.sin(t * 1.5) * 0.08;
      crystalRef.current.rotation.y += 0.015;
    }
    if (fountainWaterRef.current) {
      fountainWaterRef.current.rotation.z += 0.01;
    }
  });

  return (
    <group
      position={[0, 0, 0]}
      onClick={(e) => {
        e.stopPropagation();
        onHubClick?.();
      }}
    >
      {/* Central Island Bedrock & Lush Grassy Ring */}
      <mesh position={[0, -0.9, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[2.5, 0.8, 1.8, 10]} />
        <meshStandardMaterial color="#473a2f" roughness={0.9} flatShading />
      </mesh>

      <mesh position={[0, 0.05, 0]} receiveShadow>
        <cylinderGeometry args={[2.6, 2.5, 0.2, 12]} />
        <meshStandardMaterial color="#4ea162" roughness={0.7} flatShading />
      </mesh>

      {/* Center Stone Sanctuary Plaza */}
      <mesh position={[0, 0.08, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.5, 12]} />
        <meshStandardMaterial color="#d4ccb8" roughness={0.8} />
      </mesh>

      {/* Fountain Basin */}
      <mesh position={[0, 0.25, 0]} castShadow>
        <cylinderGeometry args={[0.75, 0.85, 0.35, 8]} />
        <meshStandardMaterial color="#78716c" roughness={0.8} />
      </mesh>

      {/* Fountain Water Surface */}
      <mesh ref={fountainWaterRef} position={[0, 0.38, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.65, 8]} />
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#0284c7"
          emissiveIntensity={0.5}
          roughness={0.2}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Floating Center Identity Crystal */}
      <mesh ref={crystalRef} position={[0, 1.8, 0]} castShadow>
        <octahedronGeometry args={[0.32, 0]} />
        <meshStandardMaterial
          color="#6ee7b7"
          emissive="#10b981"
          emissiveIntensity={0.85}
          roughness={0.2}
          wireframe={false}
        />
      </mesh>

      {/* Warm Ambient Crystal Light */}
      <pointLight position={[0, 1.8, 0]} distance={5} color="#34d399" intensity={1.5} />

      {/* Small Stone Garden Benches */}
      <mesh position={[0, 0.18, 1.1]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.6, 0.1, 0.22]} />
        <meshStandardMaterial color="#8a7c6f" />
      </mesh>
      <mesh position={[0, 0.18, -1.1]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.6, 0.1, 0.22]} />
        <meshStandardMaterial color="#8a7c6f" />
      </mesh>
    </group>
  );
};
