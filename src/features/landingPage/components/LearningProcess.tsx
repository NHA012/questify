'use client';
import React, { useState } from 'react';
import styles from './LearningProcess.module.css';
import { landingPageImage } from '@/assets/images';
import Image from 'next/image';
import { useRouter } from 'next/router';

interface LearningStepBaseProps {
  title: string;
  description: string;
  imageSrc: string;
  icon: string;
}

export const LeftAlignedStep: React.FC<LearningStepBaseProps> = ({
  title,
  description,
  imageSrc,
  icon,
}) => {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/islands');
  };

  return (
    <article className={styles.stepWrapper}>
      <div className={`${styles.stepContent} ${styles.leftAligned}`}>
        <div className={styles.titleWithIcon}>
          <span className={styles.islandTitle}>{title}</span>
          <span className={styles.stepIcon}>
            <Image src={icon} alt="Island icon" width={60} height={60} />
          </span>
        </div>
        <p className={styles.stepDescription}>{description}</p>
        <button onClick={handleGetStarted} className={styles.getStartedButton}>
          Get Started <span className={styles.arrowIcon}>&gt;</span>
        </button>
      </div>
      <figure className={styles.imageWrapper}>
        <Image
          src={imageSrc}
          alt={`${title} learning step`}
          className={styles.stepImage}
          width={590}
          height={290}
        />
      </figure>
    </article>
  );
};

export const RightAlignedStep: React.FC<LearningStepBaseProps> = ({
  title,
  description,
  imageSrc,
  icon,
}) => {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/levels');
  };

  return (
    <article className={styles.stepWrapper}>
      <figure className={styles.imageWrapper}>
        <Image
          src={imageSrc}
          alt={`${title} learning step`}
          className={styles.stepImage}
          width={590}
          height={290}
        />
      </figure>
      <div className={`${styles.stepContent} ${styles.rightAligned}`}>
        <div className={styles.titleWithIcon}>
          <span className={styles.levelTitle}>{title}</span>
          <span className={styles.stepIcon}>
            <Image src={icon} alt="Level icon" width={60} height={60} />
          </span>
        </div>
        <p className={styles.stepDescription}>{description}</p>
        <button onClick={handleGetStarted} className={styles.getStartedButton}>
          Explore <span className={styles.arrowIcon}>&gt;</span>
        </button>
      </div>
    </article>
  );
};

interface ContentType {
  id: string;
  name: string;
  image: string;
}

interface ContentLearningStepProps {
  title: string;
  description: string;
  contentTypes: ContentType[];
  icon: string;
}

export const ContentLearningStep: React.FC<ContentLearningStepProps> = ({
  title,
  description,
  contentTypes,
  icon,
}) => {
  const [selectedContent, setSelectedContent] = useState<string>(contentTypes[0]?.id || '');

  const selectedImage =
    contentTypes.find((type) => type.id === selectedContent)?.image || contentTypes[0]?.image;

  return (
    <article className={styles.contentStepWrapper}>
      <div className={styles.contentTextSection}>
        <div className={styles.titleWithIcon}>
          <span className={styles.contentTitle}>{title}</span>
          <span className={styles.stepIcon}>
            <Image src={icon} alt="Content icon" width={60} height={60} />
          </span>
        </div>
        <p className={styles.stepDescription}>{description}</p>
      </div>

      <div className={styles.contentVisualSection}>
        <figure className={styles.contentImageWrapper}>
          <Image
            src={selectedImage}
            alt={`Content type ${selectedContent}`}
            className={styles.contentStepImage}
            width={590}
            height={290}
          />
        </figure>
        <div className={styles.contentNav} role="tablist">
          {contentTypes.map((type) => (
            <div
              key={type.id}
              className={selectedContent === type.id ? styles.contentTabActive : styles.contentTab}
              onClick={() => setSelectedContent(type.id)}
              role="tab"
              aria-selected={selectedContent === type.id}
              tabIndex={0}
            >
              {type.name}
            </div>
          ))}
        </div>
      </div>
    </article>
  );
};

export const LearningProcessHeader: React.FC = () => {
  return <h1 className={styles.title}>Gamified Learning Process</h1>;
};

const LearningProcess: React.FC = () => {
  const contentTypes: ContentType[] = [
    {
      id: 'slide',
      name: 'Slide',
      image: landingPageImage.slideImage,
    },
    {
      id: 'video',
      name: 'Video',
      image: landingPageImage.videoImage,
    },
    {
      id: 'quiz',
      name: 'Quiz',
      image: landingPageImage.quizImage,
    },
    {
      id: 'challenge',
      name: 'Code Challenge',
      image: landingPageImage.codeImage,
    },
  ];

  return (
    <section className={styles.container}>
      <LearningProcessHeader />
      <div className={styles.stepsContainer}>
        <LeftAlignedStep
          title="Islands"
          description="Start your journey by exploring a list of islands, each representing a unique learning experience. Choose the one that excites you."
          imageSrc={landingPageImage.islandListImage}
          icon={landingPageImage.islandIcon}
        />
        <RightAlignedStep
          title="Levels"
          description="Once on your island, unlock various levels. Each one offers new challenges that help you build knowledge and skills step by step."
          imageSrc={landingPageImage.levelListImage}
          icon={landingPageImage.mapIcon}
        />
        <ContentLearningStep
          title="Contents"
          description="Dive into the diverse content within each level. From quizzes to code challenges, all of them make learning fun and rewarding."
          contentTypes={contentTypes}
          icon={landingPageImage.contentIcon}
        />
      </div>
    </section>
  );
};

export default LearningProcess;
