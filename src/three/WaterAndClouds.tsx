import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface WaterAndCloudsProps {
  isSpinning?: boolean;
}

export const WaterAndClouds: React.FC<WaterAndCloudsProps> = ({ isSpinning = false }) => {
  const cloudsRef = useRef<THREE.Group>(null);
  const waterRef = useRef<THREE.Mesh>(null);
  const sparklesRef = useRef<THREE.Points>(null);

  // Soft animation in useFrame only when spinning is enabled
  useFrame((state, delta) => {
    if (!isSpinning) return;
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += delta * 0.03;
    }
    if (waterRef.current) {
      waterRef.current.rotation.z += delta * 0.01;
    }
    if (sparklesRef.current) {
      sparklesRef.current.rotation.y += delta * 0.02;
    }
  });

  // Particle positions
  const sparkleCount = 45;
  const sparklePositions = React.useMemo(() => {
    const pos = new Float32Array(sparkleCount * 3);
    for (let i = 0; i < sparkleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 1] = Math.random() * 4 + 0.5;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 16;
    }
    return pos;
  }, []);

  return (
    <group>
      {/* Calm surrounding mist/water disc */}
      <mesh ref={waterRef} position={[0, -2.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[18, 32]} />
        <meshStandardMaterial
          color="#5baec7"
          transparent
          opacity={0.35}
          roughness={0.2}
          metalness={0.1}
        />
      </mesh>

      {/* Floating Low-poly Clouds */}
      <group ref={cloudsRef} position={[0, 4.5, 0]}>
        {/* Cloud 1 */}
        <group position={[9, 0, -5]}>
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[1.4, 7, 7]} />
            <meshStandardMaterial color="#ffffff" transparent opacity={0.85} roughness={1} />
          </mesh>
          <mesh position={[1.1, -0.2, 0.2]}>
            <sphereGeometry args={[1.0, 7, 7]} />
            <meshStandardMaterial color="#ffffff" transparent opacity={0.85} roughness={1} />
          </mesh>
          <mesh position={[-1.0, -0.3, -0.1]}>
            <sphereGeometry args={[0.9, 7, 7]} />
            <meshStandardMaterial color="#ffffff" transparent opacity={0.85} roughness={1} />
          </mesh>
        </group>

        {/* Cloud 2 */}
        <group position={[-8, 1, 6]}>
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[1.6, 7, 7]} />
            <meshStandardMaterial color="#ffffff" transparent opacity={0.85} roughness={1} />
          </mesh>
          <mesh position={[1.2, -0.2, 0.4]}>
            <sphereGeometry args={[1.1, 7, 7]} />
            <meshStandardMaterial color="#ffffff" transparent opacity={0.85} roughness={1} />
          </mesh>
          <mesh position={[-1.1, -0.1, -0.3]}>
            <sphereGeometry args={[1.0, 7, 7]} />
            <meshStandardMaterial color="#ffffff" transparent opacity={0.85} roughness={1} />
          </mesh>
        </group>

        {/* Cloud 3 */}
        <group position={[-5, -0.5, -9]}>
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[1.2, 6, 6]} />
            <meshStandardMaterial color="#ffffff" transparent opacity={0.8} roughness={1} />
          </mesh>
          <mesh position={[0.9, -0.2, 0]}>
            <sphereGeometry args={[0.8, 6, 6]} />
            <meshStandardMaterial color="#ffffff" transparent opacity={0.8} roughness={1} />
          </mesh>
        </group>
      </group>

      {/* Ambient glowing spore/pollen particles */}
      <points ref={sparklesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[sparklePositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.12}
          color="#d2fcdb"
          transparent
          opacity={0.65}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
};
