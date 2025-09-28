import React from 'react';
import styles from '../Profile.module.css';
import { cupIcon } from '@/assets/icons';
import Link from 'next/link';
import Image from 'next/image';

const TrophyCard: React.FC = () => {
  return (
    <div className={styles.trophyCard}>
      <Link href="/" className="flex items-center justify-center h-20">
        <Image src={cupIcon} alt="LeetClone" height={100} width={100} />
      </Link>
    </div>
  );
};

export default TrophyCard;
