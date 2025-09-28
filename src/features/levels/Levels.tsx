import React, { useEffect, useState, useCallback } from 'react';
import { DotPosition, mapTemplates } from './data/MapTemplate';
import LevelItem from './components/LevelItem';
import Inventory from '@/components/common/InventoryModal/Inventory';
import styles from './Levels.module.css';
import { CompletionStatus } from '@datn242/questify-common';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import axios from 'axios';
import {
  getUserLevelsForIsland,
  UserLevelData,
  getIslandDetails,
  getTemplateIdByPathType,
} from '@/services/progressService';
import LeaderboardButton from '@/components/common/LeaderboardModal/leaderboardButton';
import CommonLeaderboardModal, {
  LeaderboardType,
} from '@/components/common/LeaderboardModal/leaderboardModal';
import Image from 'next/image';
import { islandImage } from '@/assets/images';
import { useRouter } from 'next/router';

interface LevelItemData {
  id: string;
  name: string;
  description: string;
  position: { x: number; y: number };
  completionStatus: CompletionStatus;
  point: number;
}

interface LevelsProps {
  courseId: string;
  islandId: string;
  isInstructor?: boolean;
}

// Interface for level data in instructor mode
interface LevelData {
  id: string;
  name: string;
  description: string;
  position: number;
  islandId: string;
}

const Levels: React.FC<LevelsProps> = ({ courseId, islandId, isInstructor = false }) => {
  const router = useRouter();
  const [levelItems, setLevelItems] = useState<LevelItemData[]>([]);
  const [userLevels, setUserLevels] = useState<UserLevelData[]>([]);
  const [instructorLevels, setInstructorLevels] = useState<LevelData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [backgroundImage, setBackgroundImage] = useState<string>('');
  const [currentMapTemplateId, setCurrentMapTemplateId] = useState<string>('map-desert-001');
  const [dotPositions, setDotPositions] = useState<DotPosition[]>([]);
  const { userData: currentUser, loading: userLoading } = useCurrentUser();
  const [isIslandLeaderboardOpen, setIsIslandLeaderboardOpen] = useState<boolean>(false);
  const [islandName, setIslandName] = useState<string>('Island');

  // Fetch island data
  const fetchIslandData = useCallback(async () => {
    if (!courseId || !islandId) {
      setLoading(false);
      return;
    }

    try {
      const { island, dotPositions, backgroundImageUrl } = await getIslandDetails(
        courseId,
        islandId,
      );

      setBackgroundImage(backgroundImageUrl);
      setCurrentMapTemplateId(getTemplateIdByPathType(island.pathType));
      setDotPositions(dotPositions);
      setIslandName(island.name || 'Island'); // Store island name for leaderboard
    } catch (err) {
      console.error('Error fetching island data:', err);
      // Fallback is now handled by the service
    }
  }, [courseId, islandId]);

  // Fetch levels for instructor view
  const fetchInstructorLevels = useCallback(async () => {
    if (!islandId) return;

    try {
      setLoading(true);
      const response = await axios.get(`/api/course-mgmt/islands/${islandId}/levels`);
      setInstructorLevels(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching instructor levels:', err);
      setError('Failed to load levels. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [islandId]);

  // Fetch user levels for the current island (student view)
  const fetchUserLevels = useCallback(async () => {
    if (!currentUser || !islandId || isInstructor) return;

    try {
      setLoading(true);
      const levels = await getUserLevelsForIsland(islandId);
      setUserLevels(levels);
      setError(null);
    } catch (err) {
      console.error('Error fetching user levels:', err);
      setError('Failed to load levels. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [islandId, currentUser, isInstructor]);

  // Toggle island leaderboard
  const handleToggleIslandLeaderboard = () => {
    setIsIslandLeaderboardOpen(!isIslandLeaderboardOpen);
  };

  // Update level positions based on the map template
  const updateLevelPositions = useCallback(() => {
    // Get map template and dot positions
    const mapTemplate = mapTemplates.find((template) => template.id === currentMapTemplateId);
    if (!mapTemplate) return;

    const positions = dotPositions.length > 0 ? dotPositions : mapTemplate.dotPositions;
    if (!positions.length) return;

    if (isInstructor) {
      // For instructor view
      if (!instructorLevels.length) return;

      // Sort levels by position
      const sortedLevels = [...instructorLevels].sort(
        (a, b) => (a.position || 0) - (b.position || 0),
      );

      const dotCount = positions.length;
      const levelCount = sortedLevels.length;

      const dotIndices: number[] = [];
      if (levelCount === 1) {
        dotIndices.push(0);
      } else {
        for (let i = 0; i < levelCount; i++) {
          const dotIndex = Math.round((i * (dotCount - 1)) / (levelCount - 1));
          dotIndices.push(dotIndex);
        }
      }

      const items = sortedLevels.map((level, index) => {
        const dotPosition = positions[dotIndices[index]];

        return {
          id: level.id,
          name: level.name || `Level ${index + 1}`,
          description: level.description || '',
          position: dotPosition,
          completionStatus: CompletionStatus.Completed, // Default for instructor view
          point: 0,
        };
      });

      setLevelItems(items);
    } else {
      // For student view
      if (!userLevels.length) return;

      // Sort levels by position
      const sortedLevels = [...userLevels].sort(
        (a, b) => (a.Level?.position || 0) - (b.Level?.position || 0),
      );

      const dotCount = positions.length;
      const levelCount = sortedLevels.length;

      const dotIndices: number[] = [];
      if (levelCount === 1) {
        dotIndices.push(0);
      } else {
        for (let i = 0; i < levelCount; i++) {
          const dotIndex = Math.round((i * (dotCount - 1)) / (levelCount - 1));
          dotIndices.push(dotIndex);
        }
      }

      const items = sortedLevels.map((userLevel, index) => {
        const dotPosition = positions[dotIndices[index]];

        return {
          id: userLevel.levelId,
          name: userLevel.Level?.name || `Level ${index + 1}`,
          description: userLevel.Level?.description || '',
          position: dotPosition,
          completionStatus: userLevel.completionStatus,
          point: userLevel.point || 0,
        };
      });

      setLevelItems(items);
    }
  }, [currentMapTemplateId, userLevels, dotPositions, isInstructor, instructorLevels]);

  // Load island data first
  useEffect(() => {
    fetchIslandData();
  }, [fetchIslandData]);

  // Then fetch appropriate levels data
  useEffect(() => {
    if (isInstructor) {
      fetchInstructorLevels();
    } else if (!userLoading && currentUser) {
      fetchUserLevels();
    }
  }, [fetchUserLevels, fetchInstructorLevels, userLoading, currentUser, isInstructor]);

  // Update level positions when user levels are loaded
  useEffect(() => {
    if (isInstructor) {
      if (!loading && instructorLevels.length > 0) {
        updateLevelPositions();
      }
    } else {
      if (!loading && userLevels.length > 0) {
        updateLevelPositions();
      }
    }
  }, [updateLevelPositions, loading, userLevels, instructorLevels, isInstructor]);

  if (!isInstructor && userLoading) {
    return <div className={styles.loading}>Loading user data...</div>;
  }

  if (loading) {
    return <div className={styles.loading}>Loading levels...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  const onBackClick = () => {
    router.push(`/course/${courseId}/islands`);
  };

  // Always show the UI even if there are no levels
  return (
    <div className={styles.appContainer}>
      <div
        className={styles.levelsContainer}
        style={{
          backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
        }}
      >
        {levelItems.length > 0 ? (
          levelItems.map((level) => (
            <LevelItem
              key={level.id}
              id={level.id}
              name={level.name}
              description={level.description}
              position={level.position}
              completionStatus={level.completionStatus}
              point={level.point}
              isInstructor={isInstructor}
            />
          ))
        ) : (
          <div className={styles.empty}>No levels found for this island.</div>
        )}

        <div className={styles.buttonContainer}>
          <button className={styles.backButton} onClick={onBackClick}>
            <Image
              src={islandImage.backButton}
              alt="Back"
              width={100}
              height={100}
              className={styles.buttonImage}
              draggable={false}
            />
          </button>
        </div>

        {/* Island Leaderboard Button */}
        <div className={styles.leaderboardButtonContainer}>
          <LeaderboardButton onClick={handleToggleIslandLeaderboard} />
        </div>

        {/* Island Leaderboard Modal */}
        {isIslandLeaderboardOpen && (
          <CommonLeaderboardModal
            id={islandId}
            name={islandName}
            type={LeaderboardType.ISLAND}
            onClose={() => setIsIslandLeaderboardOpen(false)}
          />
        )}

        {!isInstructor && currentUser && <Inventory courseId={courseId} userId={currentUser.id} />}
      </div>
    </div>
  );
};

export default Levels;
