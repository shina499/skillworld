import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CentralHub } from './CentralHub';
import { TopicDistrict } from './TopicDistrict';
import { UserProfile, UserTopic, WorldRegion, World } from '../types';

interface IslandProps {
  profile: UserProfile;
  userTopics: UserTopic[];
  worldRegions: WorldRegion[];
  world: World;
  selectedTopicId?: string;
  onSelectTopic: (userTopicId: string) => void;
  onHubClick?: () => void;
}

export const Island: React.FC<IslandProps> = ({
  profile,
  userTopics,
  worldRegions,
  world,
  selectedTopicId,
  onSelectTopic,
  onHubClick,
}) => {
  const worldGroupRef = useRef<THREE.Group>(null);

  // Subtle floating motion
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (worldGroupRef.current) {
      worldGroupRef.current.position.y = Math.sin(t * 0.7) * 0.06;
    }
  });

  return (
    <group ref={worldGroupRef}>
      {/* 1. Central Personal Learner Hub */}
      <CentralHub
        displayName={profile.displayName}
        overallIdentity={profile.overallIdentity}
        overallLevel={profile.overallLevel}
        totalXp={profile.totalXp}
        onHubClick={onHubClick}
      />

      {/* 2. Surrounding Connected Thematic Topic Districts */}
      {worldRegions.map((region) => {
        const matchingTopic = userTopics.find((ut) => ut.id === region.userTopicId);
        if (!matchingTopic) return null;

        return (
          <TopicDistrict
            key={region.id || region.userTopicId}
            region={region}
            userTopic={matchingTopic}
            isSelected={selectedTopicId === region.userTopicId}
            onSelect={() => onSelectTopic(region.userTopicId)}
          />
        );
      })}
    </group>
  );
};
