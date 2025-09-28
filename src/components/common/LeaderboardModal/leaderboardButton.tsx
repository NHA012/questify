import React from 'react';
import Image from 'next/image';
import styles from './leaderboardButton.module.css';
import { islandImage } from '@/assets/images';

interface LeaderboardButtonProps {
  onClick: () => void;
}

const LeaderboardButton: React.FC<LeaderboardButtonProps> = ({ onClick }) => {
  return (
    <div className={styles.buttonContainer}>
      <button className={styles.leaderboardButton} onClick={onClick}>
        <Image
          src={islandImage.leaderboardButton}
          alt="Leaderboard"
          width={100}
          height={100}
          className={styles.buttonImage}
          draggable={false}
        />
      </button>
    </div>
  );
};

export default LeaderboardButton;
