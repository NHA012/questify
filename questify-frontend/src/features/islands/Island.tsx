import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import style from './Islands.module.css';
import { islandImage } from '@/assets/images';
import { Island } from '@/types/islands.type';

interface StudentIslandProps {
  island: Island;
  completionStatus: 'locked' | 'available' | 'in_progress' | 'completed';
  point: number;
}

const StudentIsland: React.FC<StudentIslandProps> = ({ island, completionStatus, point }) => {
  const router = useRouter();

  const islandImageSrc = island.template?.imageUrl || islandImage.island1;

  const handlePlayButtonClick = () => {
    if (completionStatus !== 'locked') {
      router.push(`/course/${island.courseId}/island/${island.id}`);
    }
  };

  return (
    <div className={style.island}>
      <Image
        src={islandImageSrc}
        alt={island.name}
        className={`${style.island__image} ${completionStatus === 'locked' ? style.locked__island__image : ''}`}
        width={50000}
        height={50000}
      />
      <button
        className={`${style.play__button} ${completionStatus === 'locked' ? style.locked__play__button : ''}`}
        onClick={handlePlayButtonClick}
        disabled={completionStatus === 'locked'}
      >
        <div className={style.island__name}>{island.name}</div>
        {completionStatus !== 'locked' && (
          <>
            <div className={style.island__progress}>{point}</div>
            <Image
              src={islandImage.playButton}
              alt="Play"
              className={style.play__button__image}
              width={80}
              height={46}
            />
          </>
        )}
      </button>
    </div>
  );
};

export default StudentIsland;
