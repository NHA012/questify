import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { levelImage } from '@/assets/images';
import LevelModal from './LevelModal';
import LeaderboardModal from './LeaderboardModal';
import styles from './LevelItem.module.css';
import { CompletionStatus, LevelContent } from '@datn242/questify-common';

interface LevelItemProps {
  id: string;
  name: string;
  description: string;
  position: { x: number; y: number };
  completionStatus: CompletionStatus;
  point: number;
  isInstructor?: boolean;
}

interface LevelData {
  id: string;
  name: string;
  description: string;
  position: number;
  islandId: string;
  createdAt: string;
  updatedAt: string;
  Challenge?: {
    id: string;
    levelId: string;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
  };
  contentType?: string;
}

const LevelItem: React.FC<LevelItemProps> = ({
  id,
  name,
  description,
  position,
  completionStatus,
  point,
  isInstructor = false,
}) => {
  const [isLevelModalOpen, setIsLevelModalOpen] = useState(false);
  const [isLeaderboardModalOpen, setIsLeaderboardModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<{
    name: string;
    description: string;
    completionStatus: CompletionStatus;
    point: number;
    contentType?: string; // Added contentType here
  }>({ name: '', description: '', completionStatus: CompletionStatus.Locked, point: 0 });
  const [levelData, setLevelData] = useState<LevelData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const nodeRef = useRef<HTMLDivElement>(null);
  const levelModalRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Fetch level data when component mounts or id changes
  useEffect(() => {
    const fetchLevelData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/course-learning/levels/${id}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch level data: ${response.statusText}`);
        }
        const data = await response.json();
        setLevelData(data);
      } catch (err) {
        console.error('Error fetching level data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch level data');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchLevelData();
    }
  }, [id]);

  const handleNodeClick = () => {
    setModalContent({
      name,
      description,
      completionStatus,
      point,
      contentType: levelData?.contentType,
    });
    setIsLevelModalOpen(true);
  };

  const handleLevelModalClose = () => {
    setIsLevelModalOpen(false);
  };

  const getModalPosition = () => {
    if (!nodeRef.current) return { left: 0, top: 0 };

    const nodeRect = nodeRef.current.getBoundingClientRect();
    const modalWidth = 360; // Width of the modal as defined in CSS
    const windowHeight = window.innerHeight;
    const windowWidth = window.innerWidth;

    // Calculate positions
    const centerX = nodeRect.left + nodeRect.width / 2;
    const spaceBelow = windowHeight - nodeRect.bottom;
    const modalX = Math.max(10, Math.min(windowWidth - modalWidth - 10, centerX - modalWidth / 2));

    // Default to below, only position above if not enough space below
    if (spaceBelow < 100 && nodeRect.top > 200) {
      // not enough space below but enough above
      // Position above
      return {
        left: modalX,
        top: nodeRect.top - 210, // position above with some margin
      };
    } else {
      // Position below (default)
      return {
        left: modalX,
        top: nodeRect.bottom + 10, // position below with some margin
      };
    }
  };

  const handleLevelModalClickOutside = (event: MouseEvent) => {
    if (levelModalRef.current && !levelModalRef.current.contains(event.target as Node)) {
      setIsLevelModalOpen(false); // Close LevelModal when clicked outside
    }
  };

  // useEffect to close LevelModal when clicked outside
  useEffect(() => {
    if (isLevelModalOpen) {
      document.addEventListener('mousedown', handleLevelModalClickOutside);
    } else {
      document.removeEventListener('mousedown', handleLevelModalClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleLevelModalClickOutside);
    };
  }, [isLevelModalOpen]);

  const handlePlayClick = async () => {
    if (isInstructor) return;

    // Handle locked or failed levels
    if (
      completionStatus === CompletionStatus.Locked ||
      completionStatus === CompletionStatus.Fail
    ) {
      return;
    }

    try {
      setIsLoading(true);
      // Call the attempt API
      const response = await fetch(`/api/course-learning/levels/${id}/attempt`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Add any body data if needed
      });

      if (!response.ok) {
        throw new Error(`Failed to attempt level: ${response.statusText}`);
      }

      if (levelData) {
        if (levelData.contentType === LevelContent.Challenge && levelData.Challenge) {
          router.push(`/challenge/${levelData.Challenge.id}`);
        } else if (levelData.contentType === LevelContent.CodeProblem) {
          const codeProblemResponse = await fetch(`/api/code-problem/level/${id}`);
          if (!codeProblemResponse.ok) {
            throw new Error(`Failed to fetch code problem: ${codeProblemResponse.statusText}`);
          }
          const codeProblemData = await codeProblemResponse.json();
          router.push(`/problems/${codeProblemData.id}`);
        } else if (!levelData.contentType) {
          alert("This level doesn't have any content yet. Please check back later!");
        }
      }
    } catch (err) {
      console.error('Error attempting level:', err);
      setError(err instanceof Error ? err.message : 'Failed to attempt level');
    } finally {
      setIsLoading(false);
    }
  };

  const handleScoreClick = () => {
    setIsLeaderboardModalOpen(true);
  };

  // render the button for level description based on the completion status
  const renderButtons = () => {
    if (isInstructor) {
      // For instructor, show only Score button to view leaderboard
      return (
        <button className={styles.scoreButton} onClick={handleScoreClick}>
          <Image src={levelImage.scoreButton} alt="View Scores" width={200} height={100} />
        </button>
      );
    }

    // Disable buttons while loading
    if (isLoading) {
      return <div className={styles.loading}>Loading...</div>;
    }

    // Show error if there is one
    if (error) {
      return <div className={styles.error}>{error}</div>;
    }

    switch (completionStatus) {
      case CompletionStatus.Locked:
      case CompletionStatus.Fail:
        return null; // No buttons for locked or failed levels
      case CompletionStatus.InProgress:
        return (
          <button className={styles.playButton} onClick={handlePlayClick}>
            <Image src={levelImage.playButton1} alt="Play Button" width={150} height={100} />
          </button>
        );
      case CompletionStatus.Completed:
        return (
          <>
            <button className={styles.scoreButton} onClick={handleScoreClick}>
              <Image src={levelImage.scoreButton} alt="Score Button" width={200} height={100} />
            </button>
            <button className={styles.playButton} onClick={handlePlayClick}>
              <Image src={levelImage.playButton2} alt="Play Button" width={200} height={100} />
            </button>
          </>
        );
      default:
        return null;
    }
  };

  // render the level node icon based on the completion status
  const getNodeIcon = () => {
    // Removed content type indicator

    if (isInstructor) {
      // For instructor view, always show as available
      return (
        <div className={styles.inProgressNode} title="Level">
          <Image
            src={levelImage.levelBannerUnstarted}
            alt="Level"
            className={styles.levelBanner}
            width={48}
            height={60}
          />
        </div>
      );
    }

    // For student view
    switch (completionStatus) {
      case CompletionStatus.Completed:
        return (
          <div className={styles.completedNode} title="Completed">
            <Image
              src={levelImage.star}
              className={styles.starIcon}
              alt="Completed Icon"
              width={24}
              height={24}
            />
          </div>
        );
      case CompletionStatus.InProgress:
        return (
          <div className={styles.inProgressNode} title="In Progress">
            <Image
              src={levelImage.levelBannerUnstarted}
              alt="In Progress"
              className={styles.levelBanner}
              width={48}
              height={60}
            />
          </div>
        );
      case CompletionStatus.Fail:
        return (
          <div className={styles.failNode} title="Failed">
            <Image
              src={levelImage.bronzeChest}
              alt="Failed"
              className={styles.nodeIcon}
              width={16}
              height={16}
            />
          </div>
        );
      case CompletionStatus.Locked:
        return (
          <div className={styles.lockedNode} title="Locked">
            <Image
              src={levelImage.bronzeChest}
              alt="Locked"
              className={styles.nodeIcon}
              width={16}
              height={16}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      id={`level-${id}`}
      className={styles.levelItem}
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
      }}
    >
      <div className={styles.nodeContainer} onClick={handleNodeClick} ref={nodeRef}>
        {getNodeIcon()}
      </div>

      {isLevelModalOpen && (
        <div
          className={styles.modalWrapper}
          style={{
            position: 'fixed',
            left: `${getModalPosition().left}px`,
            top: `${getModalPosition().top}px`,
            zIndex: 1000,
          }}
        >
          <LevelModal
            isModalOpen={isLevelModalOpen}
            modalPosition={{ left: 0, top: 0 }}
            modalContent={{
              name: modalContent.name,
              description: modalContent.description,
              completionStatus: modalContent.completionStatus,
              point: modalContent.point,
              contentType: modalContent.contentType,
            }}
            onClose={handleLevelModalClose}
            renderButtons={renderButtons}
            isInstructor={isInstructor}
          />
        </div>
      )}

      {/* Leaderboard Modal */}
      {isLeaderboardModalOpen && (
        <LeaderboardModal
          levelId={id}
          levelName={name}
          onClose={() => setIsLeaderboardModalOpen(false)}
          isInstructor={isInstructor}
          contentType={levelData?.contentType}
        />
      )}
    </div>
  );
};

export default LevelItem;
