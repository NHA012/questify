import React, { useRef, useCallback, useState, useEffect } from 'react';
import { levelImage } from '@/assets/images';
import {
  getCourseLeaderboard,
  getIslandLeaderboard,
  formatDateTime,
  LeaderboardEntry,
} from '@/services/progressService';
import styles from './leaderboardModal.module.css';
import { ContentTab } from '@/features/levels/components/LeaderboardComponents';

export enum LeaderboardType {
  COURSE = 'course',
  ISLAND = 'island',
}

interface CommonLeaderboardModalProps {
  id: string;
  name: string;
  type: LeaderboardType;
  onClose: () => void;
}

const CommonLeaderboardModal: React.FC<CommonLeaderboardModalProps> = ({
  id,
  name,
  type,
  onClose,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [leaderboardEntries, setLeaderboardEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch leaderboard data based on type
  useEffect(() => {
    const fetchLeaderboard = async () => {
      if (!id) return;

      try {
        setLoading(true);
        let data: LeaderboardEntry[] = [];

        if (type === LeaderboardType.COURSE) {
          data = await getCourseLeaderboard(id);
        } else if (type === LeaderboardType.ISLAND) {
          data = await getIslandLeaderboard(id);
        }

        setLeaderboardEntries(data);
        setError(null);
      } catch (error) {
        console.error(`Error fetching ${type} leaderboard:`, error);
        setError(`Failed to load ${type} leaderboard data`);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [id, type]);

  // Format date
  const formatDate = (date?: string): string => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      timeZone: 'UTC',
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

  if (loading) {
    return (
      <div id="leaderboard-modal" className={styles.modal}>
        <div className={styles.modalDialog}>
          <div
            ref={modalRef}
            className={styles.modalContent}
            style={{ backgroundImage: `url(${levelImage.leaderboardBackground})` }}
          >
            <h1 className={styles.bigFont}>{name} - Scores</h1>
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
            <h1 className={styles.bigFont}>{name} - Scores</h1>
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
          <h1 className={styles.bigFont}>{name} - Scores</h1>

          <div id="close-modal" className={styles.closeModal} onClick={onClose}>
            <span className={`${styles.glyphicon} ${styles.glyphiconRemove}`}></span>
          </div>

          <ContentTab
            leaderboardEntries={leaderboardEntries}
            userAttempts={[]}
            activeTab="leaderboard"
            formatDate={formatDate}
            formatDateTime={formatDateTime}
            isInstructor={false}
          />
        </div>
      </div>
    </div>
  );
};

export default CommonLeaderboardModal;
