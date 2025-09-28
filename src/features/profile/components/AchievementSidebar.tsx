import React from 'react';
import Image from 'next/image';
import styles from '../Profile.module.css';
import TrophyCard from './TrophyCard';
import { UserRole } from '@/types/profile.type';
import { lecturesIcon, studentsIcon, starIcon } from '@/assets/icons';

interface AchievementSidebarProps {
  role: UserRole;
  studentsCount: number;
  coursesCount: number;
  starsCount: number;
  reviewsCount: number;
}

const AchievementSidebar: React.FC<AchievementSidebarProps> = ({
  role,
  studentsCount,
  coursesCount,
  starsCount,
  reviewsCount,
}) => {
  return (
    <aside className={styles.achievementSidebar}>
      <h2 className={styles.achievementTitle}>ACHIEVEMENT</h2>
      {role === UserRole.Student ? (
        <div className={styles.trophyContainer}>
          <TrophyCard />
        </div>
      ) : (
        <div className={styles.achievementStats}>
          <div className={styles.achievementStat}>
            <Image src={studentsIcon} alt="" height={24} width={24} />
            <span className="text-sm text-gray-500">{studentsCount} courses</span>
          </div>

          <div className={styles.achievementStat}>
            <Image src={starIcon} alt="" height={24} width={24} />
            <span className="text-sm text-gray-500">
              {starsCount} ({reviewsCount} reviews)
            </span>
          </div>

          <div className={styles.achievementStat}>
            <Image src={lecturesIcon} alt="" height={24} width={24} />
            <span className="text-sm text-gray-500">{coursesCount} courses</span>
          </div>
        </div>
      )}
    </aside>
  );
};

export default AchievementSidebar;
