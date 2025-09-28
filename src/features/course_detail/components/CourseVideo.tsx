import React from 'react';
import styles from './CourseVideo.module.css';
import Image from 'next/image';

interface VideoPlayerProps {
  backgroundImageSrc: string;
}

const CourseVideo: React.FC<VideoPlayerProps> = ({ backgroundImageSrc }) => {
  return (
    <div className={styles.videoContainer}>
      <Image
        loading="lazy"
        src={backgroundImageSrc}
        className={styles.backgroundImage}
        alt="Video thumbnail"
        width={1000} // Choose an appropriate base size
        height={600} // Choose an appropriate base size
        style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
      />
    </div>
  );
};

export default CourseVideo;
