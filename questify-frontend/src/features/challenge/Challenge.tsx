import { useState, useRef, useEffect, useCallback } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Video,
  HelpCircle,
  Lock,
  Unlock,
  Loader,
} from 'lucide-react';
import ContentCard from './ContentCard';
import RewardModal from '@/components/common/RewardModal/RewardModal';
import styles from './Challenge.module.css';
import { Slide, Challenge, SubmissionResponse } from '@/types/courses.type';
import { submitLevel } from '@/services/levelService';
import { SlideType } from '@datn242/questify-common';

const ChallengePage: React.FC<{ challenge_id?: string }> = ({ challenge_id = null }) => {
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [unlockedSlides, setUnlockedSlides] = useState<number[]>([0]);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, boolean>>({});
  const [isRewardModalOpen, setIsRewardModalOpen] = useState(false);
  const [submissionResponse, setSubmissionResponse] = useState<SubmissionResponse | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchChallenge = async () => {
      if (!challenge_id) {
        setLoading(false);
        setError('No challenge ID provided');
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`/api/course-learning/challenge/${challenge_id}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch challenge: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        setChallenge(data);

        if (data.Slides) {
          data.Slides.sort((a: Slide, b: Slide) => a.slideNumber - b.slideNumber);
        }

        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setLoading(false);
      }
    };

    fetchChallenge();
  }, [challenge_id]);

  const isSlideUnlocked = (index: number) => unlockedSlides.includes(index);

  const isLastSlide = challenge?.Slides ? currentCardIndex === challenge.Slides.length - 1 : false;

  const isQuizSlide = challenge?.Slides && challenge.Slides[currentCardIndex]?.type === 'quiz';
  const isQuizAnsweredCorrectly = quizAnswers[currentCardIndex] === true;

  const handleFinalSubmit = useCallback(async () => {
    if (!challenge) return;

    try {
      const data = await submitLevel(challenge.levelId);
      setSubmissionResponse(data);
      setIsRewardModalOpen(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during submission');
    }
  }, [challenge, setSubmissionResponse, setIsRewardModalOpen, setError]);

  useEffect(() => {
    const handleSubmitCourse = () => {
      handleFinalSubmit();
    };

    window.addEventListener('submitCourse', handleSubmitCourse);

    return () => {
      window.removeEventListener('submitCourse', handleSubmitCourse);
    };
  }, [handleFinalSubmit]);

  const canNavigateNext = () => {
    if (!challenge?.Slides) return false;
    if (isLastSlide) return false;
    if (isQuizSlide && !isQuizAnsweredCorrectly) return false;
    return true;
  };

  const handlePrevClick = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
    }
  };

  const handleNextClick = () => {
    if (!canNavigateNext() || !challenge?.Slides) return;

    const nextIndex = currentCardIndex + 1;
    setCurrentCardIndex(nextIndex);

    if (!isSlideUnlocked(nextIndex)) {
      setUnlockedSlides([...unlockedSlides, nextIndex]);
    }
  };

  const handleCardClick = (index: number) => {
    if (isSlideUnlocked(index)) {
      setCurrentCardIndex(index);
    }
  };

  const handleFullScreen = () => {
    if (contentRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        contentRef.current.requestFullscreen();
      }
    }
  };

  const handleQuizResult = (slideIndex: number, isCorrect: boolean) => {
    setQuizAnswers({
      ...quizAnswers,
      [slideIndex]: isCorrect,
    });
  };

  const handleCloseRewardModal = () => {
    setIsRewardModalOpen(false);
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Loader className="h-8 w-8 animate-spin" />
        <p>Loading challenge...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p>Error: {error}</p>
      </div>
    );
  }

  if (!challenge || !challenge.Slides || challenge.Slides.length === 0) {
    return (
      <div className={styles.errorContainer}>
        <p>No challenge data available.</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <div className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <div className={styles.sidebarHeaderIcon}></div>
          <div className={styles.sidebarHeaderText}>
            <h1>{challenge.Level.name}</h1>
            <p>{challenge.Slides.length} slides</p>
          </div>
        </div>
        <div className={styles.slidesContainer}>
          <h2 className={styles.slidesTitle}>Slides</h2>
          <div className={styles.slidesList}>
            {challenge.Slides.map((slide, index) => {
              const isUnlocked = isSlideUnlocked(index);
              const isActive = index === currentCardIndex;

              return (
                <button
                  key={slide.id}
                  className={`${styles.slideButton} ${isActive ? styles.active : ''} ${!isUnlocked ? styles.locked : ''}`}
                  onClick={() => handleCardClick(index)}
                  disabled={!isUnlocked}
                >
                  {slide.type === SlideType.VIDEO && <Video className="h-4 w-4" />}
                  {slide.type === SlideType.QUIZ && <HelpCircle className="h-4 w-4" />}
                  {slide.title}
                  {isUnlocked ? (
                    <Unlock className="h-4 w-4 ml-auto" />
                  ) : (
                    <Lock className="h-4 w-4 ml-auto" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.mainContent} ref={contentRef}>
        <div className={styles.contentArea}>
          {/* Left Navigation Button */}
          <button
            onClick={handlePrevClick}
            className={styles.navButton}
            disabled={currentCardIndex <= 0}
          >
            <ChevronLeft
              className={`h-6 w-6 ${currentCardIndex > 0 ? 'text-white' : 'text-gray-400'}`}
            />
            <span className="sr-only">Previous slide</span>
          </button>

          <div className={styles.cardContainer}>
            <ContentCard
              content={challenge.Slides[currentCardIndex]}
              currentPage={currentCardIndex + 1}
              totalPages={challenge.Slides.length}
              onQuizResult={(isCorrect) => handleQuizResult(currentCardIndex, isCorrect)}
              isLastSlide={isLastSlide}
              onSubmit={isLastSlide ? handleFinalSubmit : undefined}
              challenge={challenge}
            />
          </div>

          <button
            onClick={handleNextClick}
            className={styles.navButton}
            disabled={!canNavigateNext()}
          >
            <ChevronRight
              className={`h-6 w-6 ${canNavigateNext() ? 'text-white' : 'text-gray-400'}`}
            />
            <span className="sr-only">Next slide</span>
          </button>
        </div>

        {/* Bottom Controls */}
        <div className={styles.bottomControls}>
          <button className={styles.fullscreenButton} onClick={handleFullScreen}>
            <Maximize2 />
            <span className="sr-only">Full screen</span>
          </button>
        </div>
      </div>

      {/* Reward Modal - Shown when submitting the course */}
      {isRewardModalOpen && submissionResponse && (
        <RewardModal
          progress={75}
          achievements={[
            {
              id: 'level-complete',
              description: 'Level Complete!',
              rewards: [
                { type: 'xp', amount: submissionResponse.exp, icon: 'xp' },
                { type: 'gems', amount: submissionResponse.gold, icon: 'gems' },
                { type: 'point', amount: submissionResponse.point, icon: 'point' },
              ],
            },
            {
              id: 'bonus',
              description: 'Bonus!',
              rewards: [
                { type: 'xp', amount: submissionResponse.bonusExp, icon: 'xp' },
                { type: 'gems', amount: submissionResponse.bonusGold, icon: 'gems' },
              ],
            },
          ]}
          onClose={handleCloseRewardModal}
          closeOnOutsideClick={false}
        />
      )}
    </div>
  );
};

export default ChallengePage;
