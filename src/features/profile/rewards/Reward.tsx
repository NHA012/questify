import React from 'react';
import styles from '../Profile.module.css';
import BadgeRow from './BadgeRow';
import PaginationReward from './PaginationReward';

const BadgesSection: React.FC = () => {
  return (
    <section className={styles.badgesSection}>
      <h2 className={styles.badgesTitle}>Badges (07)</h2>
      <div>
        <div className={styles.courseSection}>
          <h3 className={styles.courseTitle}>
            Machine Learning A-Z™: Hands-On Python & R In Data Science
          </h3>
          <PaginationReward />
        </div>
        <BadgeRow badgeType={1} />
        <div className={styles.courseSection}>
          <h3 className={styles.courseTitle}>
            Machine Learning A-Z™: Hands-On Python & R In Data Science
          </h3>
          <PaginationReward />
        </div>
        <BadgeRow badgeType={2} />
      </div>
    </section>
  );
};

export default BadgesSection;
