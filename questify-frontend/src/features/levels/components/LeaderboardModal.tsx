import React, { useRef, useCallback, useState, useEffect } from 'react';
import { levelImage } from '@/assets/images';
import { getLevelLeaderboard, formatDateTime, LeaderboardEntry } from '@/services/progressService';
import styles from './LeaderboardModal.module.css';
import { NavTab, ContentTab } from './LeaderboardComponents';

interface LeaderboardModalProps {
  levelId: string;
  levelName: string;
  onClose: () => void;
  isInstructor?: boolean;
  contentType?: string; // Add content type prop
}

const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  levelId,
  levelName,
  onClose,
  isInstructor = false,
  contentType,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<string>(isInstructor ? 'leaderboard' : 'leaderboard');
  const [leaderboardEntries, setLeaderboardEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch leaderboard data
  useEffect(() => {
    const fetchLeaderboard = async () => {
      if (!levelId) return;

      try {
        setLoading(true);
        const data = await getLevelLeaderboard(levelId);
        setLeaderboardEntries(data);
        setError(null);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
        setError('Failed to load leaderboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [levelId]);

  // Format date
  const formatDate = (date?: string): string => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      timeZone: 'UTC', // Add this line
    });
  };

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    },
    [onClose],
  );

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  // For instructor view, only show leaderboard tab
  const tabs = isInstructor ? ['leaderboard'] : ['leaderboard', 'yourScore'];

  if (loading) {
    return (
      <div id="leaderboard-modal" className={styles.modal}>
        <div className={styles.modalDialog}>
          <div
            ref={modalRef}
            className={styles.modalContent}
            style={{ backgroundImage: `url(${levelImage.leaderboardBackground})` }}
          >
            <h1 className={styles.bigFont}>{levelName} - Scores</h1>
            <div id="close-modal" className={styles.closeModal} onClick={onClose}>
              <span className={`${styles.glyphicon} ${styles.glyphiconRemove}`}></span>
            </div>
            <div className={styles.loading}>Loading leaderboard...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div id="leaderboard-modal" className={styles.modal}>
        <div className={styles.modalDialog}>
          <div
            ref={modalRef}
            className={styles.modalContent}
            style={{ backgroundImage: `url(${levelImage.leaderboardBackground})` }}
          >
            <h1 className={styles.bigFont}>{levelName} - Scores</h1>
            <div id="close-modal" className={styles.closeModal} onClick={onClose}>
              <span className={`${styles.glyphicon} ${styles.glyphiconRemove}`}></span>
            </div>
            <div className={styles.error}>{error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="leaderboard-modal" className={styles.modal}>
      <div className={styles.modalDialog}>
        <div
          ref={modalRef}
          className={styles.modalContent}
          style={{ backgroundImage: `url(${levelImage.leaderboardBackground})` }}
        >
          <h1 className={styles.bigFont}>{levelName} - Scores</h1>

          <div id="close-modal" className={styles.closeModal} onClick={onClose}>
            <span className={`${styles.glyphicon} ${styles.glyphiconRemove}`}></span>
          </div>

          {!isInstructor && (
            <NavTab tabs={tabs} activeTab={activeTab} onTabChange={handleTabChange} />
          )}

          <ContentTab
            leaderboardEntries={leaderboardEntries}
            userAttempts={[]} // Empty array for instructor view
            activeTab={activeTab}
            formatDate={formatDate}
            formatDateTime={formatDateTime}
            isInstructor={isInstructor}
            contentType={contentType}
            levelId={levelId}
          />
        </div>
      </div>
    </div>
  );
};

export default LeaderboardModal;
