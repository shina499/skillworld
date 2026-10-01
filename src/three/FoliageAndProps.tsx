import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface FoliageProps {
  growthStage: number; // 1 to 10
  level: number;
  onTreeClick?: () => void;
}

export const FoliageAndProps: React.FC<FoliageProps> = ({ growthStage, level, onTreeClick }) => {
  const centralTreeFoliageRef = useRef<THREE.Group>(null);
  const lanternLightRef = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (centralTreeFoliageRef.current) {
      centralTreeFoliageRef.current.rotation.y = Math.sin(t * 0.5) * 0.05;
      centralTreeFoliageRef.current.position.y = 1.6 + Math.sin(t * 1.2) * 0.04;
    }
    if (lanternLightRef.current) {
      lanternLightRef.current.intensity = 1.2 + Math.sin(t * 3) * 0.2;
    }
  });

  // Calculate scaling based on user level & growth stage
  const treeScale = Math.min(1.4, 0.8 + growthStage * 0.06);

  return (
    <group>
      {/* 1. CENTRAL HEART TREE (Tree of Learning) */}
      <group
        position={[0, 0, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onTreeClick?.();
        }}
      >
        {/* Trunk */}
        <mesh position={[0, 0.8, 0]} castShadow>
          <cylinderGeometry args={[0.24, 0.42, 1.6, 6]} />
          <meshStandardMaterial color="#6a472c" roughness={0.9} />
        </mesh>

        {/* Tree Roots */}
        <mesh position={[0.2, 0.1, 0.2]} rotation={[0.4, 0.2, 0.1]}>
          <cylinderGeometry args={[0.08, 0.16, 0.5, 4]} />
          <meshStandardMaterial color="#5a3b22" roughness={0.9} />
        </mesh>
        <mesh position={[-0.2, 0.1, -0.15]} rotation={[-0.3, 0.4, -0.2]}>
          <cylinderGeometry args={[0.08, 0.15, 0.5, 4]} />
          <meshStandardMaterial color="#5a3b22" roughness={0.9} />
        </mesh>

        {/* Lush Canopy that expands with level */}
        <group ref={centralTreeFoliageRef} position={[0, 1.6, 0]} scale={[treeScale, treeScale, treeScale]}>
          <mesh position={[0, 0.4, 0]} castShadow>
            <dodecahedronGeometry args={[1.2, 1]} />
            <meshStandardMaterial color="#429e64" roughness={0.8} flatShading />
          </mesh>
          <mesh position={[0.5, 0.8, 0.3]} castShadow>
            <dodecahedronGeometry args={[0.85, 1]} />
            <meshStandardMaterial color="#5bb87d" roughness={0.8} flatShading />
          </mesh>
          <mesh position={[-0.45, 0.7, -0.2]} castShadow>
            <dodecahedronGeometry args={[0.8, 1]} />
            <meshStandardMaterial color="#368352" roughness={0.8} flatShading />
          </mesh>
        </group>
      </group>

      {/* 2. STEPPING STONE PATHWAY (Appears level 2+) */}
      {growthStage >= 2 && (
        <group position={[0, 0.05, 0]}>
          <mesh position={[0.4, 0, 1.0]} rotation={[-Math.PI / 2, 0, 0.2]}>
            <circleGeometry args={[0.24, 6]} />
            <meshStandardMaterial color="#c2b8a3" roughness={0.9} />
          </mesh>
          <mesh position={[0.8, 0, 1.6]} rotation={[-Math.PI / 2, 0, 0.6]}>
            <circleGeometry args={[0.28, 6]} />
            <meshStandardMaterial color="#b3a994" roughness={0.9} />
          </mesh>
          <mesh position={[1.4, 0, 2.0]} rotation={[-Math.PI / 2, 0, -0.3]}>
            <circleGeometry args={[0.25, 6]} />
            <meshStandardMaterial color="#c2b8a3" roughness={0.9} />
          </mesh>
          <mesh position={[-0.5, 0, 1.2]} rotation={[-Math.PI / 2, 0, -0.4]}>
            <circleGeometry args={[0.22, 6]} />
            <meshStandardMaterial color="#b3a994" roughness={0.9} />
          </mesh>
          <mesh position={[-1.1, 0, 1.7]} rotation={[-Math.PI / 2, 0, 0.5]}>
            <circleGeometry args={[0.26, 6]} />
            <meshStandardMaterial color="#c2b8a3" roughness={0.9} />
          </mesh>
        </group>
      )}

      {/* 3. FLOWERING BUSHES & SPROUTS */}
      <group position={[-1.8, 0.1, 0.4]}>
        <mesh position={[0, 0.2, 0]} castShadow>
          <sphereGeometry args={[0.35, 6, 6]} />
          <meshStandardMaterial color="#50b47b" flatShading />
        </mesh>
        <mesh position={[0.1, 0.45, 0]}>
          <sphereGeometry args={[0.12, 5, 5]} />
          <meshStandardMaterial color="#ffc059" emissive="#ffc059" emissiveIntensity={0.2} />
        </mesh>
      </group>

      {growthStage >= 3 && (
        <group position={[1.7, 0.1, -1.2]}>
          <mesh position={[0, 0.22, 0]} castShadow>
            <sphereGeometry args={[0.4, 6, 6]} />
            <meshStandardMaterial color="#3d9762" flatShading />
          </mesh>
          <mesh position={[-0.1, 0.5, 0.1]}>
            <sphereGeometry args={[0.13, 5, 5]} />
            <meshStandardMaterial color="#ff7aa2" emissive="#ff7aa2" emissiveIntensity={0.2} />
          </mesh>
        </group>
      )}

      {/* 4. COZY WOODEN BENCH (Appears level 2+) */}
      {growthStage >= 2 && (
        <group position={[-1.2, 0.05, -0.9]} rotation={[0, 0.8, 0]}>
          {/* Seat */}
          <mesh position={[0, 0.35, 0]} castShadow>
            <boxGeometry args={[0.8, 0.06, 0.32]} />
            <meshStandardMaterial color="#7a5435" roughness={0.8} />
          </mesh>
          {/* Legs */}
          <mesh position={[-0.32, 0.17, 0.1]}>
            <cylinderGeometry args={[0.03, 0.03, 0.35, 4]} />
            <meshStandardMaterial color="#50351f" />
          </mesh>
          <mesh position={[0.32, 0.17, 0.1]}>
            <cylinderGeometry args={[0.03, 0.03, 0.35, 4]} />
            <meshStandardMaterial color="#50351f" />
          </mesh>
          <mesh position={[-0.32, 0.17, -0.1]}>
            <cylinderGeometry args={[0.03, 0.03, 0.35, 4]} />
            <meshStandardMaterial color="#50351f" />
          </mesh>
          <mesh position={[0.32, 0.17, -0.1]}>
            <cylinderGeometry args={[0.03, 0.03, 0.35, 4]} />
            <meshStandardMaterial color="#50351f" />
          </mesh>
        </group>
      )}

      {/* 5. GENTLE GARDEN LANTERN */}
      <group position={[1.5, 0.05, 0.9]}>
        <mesh position={[0, 0.55, 0]}>
          <cylinderGeometry args={[0.04, 0.05, 1.1, 5]} />
          <meshStandardMaterial color="#473a30" roughness={0.7} />
        </mesh>
        {/* Lantern Glass Box */}
        <mesh position={[0, 1.1, 0]}>
          <boxGeometry args={[0.22, 0.26, 0.22]} />
          <meshStandardMaterial color="#ffeaad" emissive="#ffc459" emissiveIntensity={0.8} transparent opacity={0.9} />
        </mesh>
        <pointLight ref={lanternLightRef} position={[0, 1.1, 0]} distance={4.5} color="#ffd074" />
      </group>

      {/* 6. LOW-POLY ROCKS */}
      <mesh position={[2.4, 0.15, -0.4]} rotation={[0.2, 0.5, 0.1]} castShadow>
        <dodecahedronGeometry args={[0.42, 0]} />
        <meshStandardMaterial color="#7f8b92" roughness={0.9} flatShading />
      </mesh>
      <mesh position={[-2.3, 0.12, 1.4]} rotation={[0.4, -0.3, 0.2]} castShadow>
        <dodecahedronGeometry args={[0.35, 0]} />
        <meshStandardMaterial color="#6e7880" roughness={0.9} flatShading />
      </mesh>
    </group>
  );
};
