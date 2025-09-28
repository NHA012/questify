import React from 'react';
import styles from '../Profile.module.css';
// import { starIcon } from '@/assets/icons';
import { Star } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface CourseCardProps {
  title: string;
  category: string;
  imageUrl: string;
  progress: number;
}

const CourseCard: React.FC<CourseCardProps> = ({ title, category, imageUrl, progress }) => {
  return (
    <article className={styles.courseCard}>
      <Image
        src={imageUrl}
        alt={title}
        className={styles.courseImage}
        width={50000}
        height={50000}
      />
      <div className={styles.categoryBadge}>{category}</div>
      <h3 className={styles.courseTitle}>{title}</h3>
      <div className={styles.divider} />
      <div className={styles.progress}>
        <Link href="/" className="flex items-center justify-center">
          <Star height={24} width={24} color="#00adb5" fill="#00adb5" />
        </Link>
        <div className={styles.progressText}>{progress}%</div>
      </div>
    </article>
  );
};

export default CourseCard;
