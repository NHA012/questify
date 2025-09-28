import React from 'react';
import Image from 'next/image';
import style from '../Islands.module.css';
import { useRouter } from 'next/router';
import { islandImage } from '@/assets/images';
import { Island } from '@/types/islands.type';

interface TeacherIslandProps {
  island: Island;
}

const TeacherIsland: React.FC<TeacherIslandProps> = ({ island }) => {
  const router = useRouter();

  const islandImageSrc = island.template?.imageUrl || islandImage.island1;

  const handlePlayButtonClick = () => {
    router.push(`/instructor/course/${island.courseId}/island/${island.id}`);
  };

  return (
    <div className={style.island}>
      <Image
        src={islandImageSrc}
        alt={island.name}
        className={style.island__image}
        width={50000}
        height={50000}
      />
      <button className={`${style.play__button}`} onClick={handlePlayButtonClick}>
        <div className={style.island__name}>{island.name}</div>
        <Image
          src={islandImage.playButton}
          alt="View"
          className={style.play__button__image}
          width={50000}
          height={50000}
        />
      </button>
    </div>
  );
};

export default TeacherIsland;
