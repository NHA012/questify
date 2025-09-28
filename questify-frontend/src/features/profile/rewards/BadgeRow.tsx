import React from 'react';
import styles from '../Profile.module.css';
import TrophyCard from '../components/TrophyCard';

interface BadgeRowProps {
  badgeType: 1 | 2;
}

const BadgeRow: React.FC<BadgeRowProps> = ({ badgeType }) => {
  return (
    <div className={styles.badgeRow}>
      {badgeType === 1 ? (
        <>
          <div>
            <TrophyCard />
          </div>
          <div>
            <TrophyCard />
          </div>
          <div>
            <TrophyCard />
          </div>
        </>
      ) : (
        <>
          <div>
            <TrophyCard />
          </div>
          <div>
            <TrophyCard />
          </div>
          <div>
            <TrophyCard />
          </div>
          <div>
            <TrophyCard />
          </div>
        </>
      )}
    </div>
  );
};

export default BadgeRow;
