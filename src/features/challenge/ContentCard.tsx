import type React from 'react';
import { useState, useEffect } from 'react';
import YouTube from 'react-youtube';
import styles from './ContentCard.module.css';
import { SlideType } from '@datn242/questify-common';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { ArrowLeft } from 'lucide-react';

interface ContentCardProps {
  content: {
    title: string;
    description?: string;
    videoUrl?: string;
    slideNumber?: number;
    type?: SlideType;
    imageUrl?: string;
    answers?: {
      content: string;
      isCorrect: boolean;
    }[];
  };
  currentPage: number;
  totalPages: number;
  onQuizResult?: (isCorrect: boolean) => void;
  isLastSlide?: boolean;
  onSubmit: () => Promise<void> | undefined;
  challenge?: {
    courseId?: string;
    Level?: {
      islandId?: string;
    };
  };
}

const extractYouTubeId = (url: string | null): string | null => {
  if (!url) return null;

  const cleanUrl = url.split('&')[0];
  const match = cleanUrl.match(
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  );

  return match ? match[1] : null;
};

const ContentCard: React.FC<ContentCardProps> = ({
  content,
  currentPage,
  totalPages,
  onQuizResult,
  isLastSlide,
  onSubmit,
  challenge,
}) => {
  const router = useRouter();
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [result, setResult] = useState<boolean | null>(null);

  const isMultiSelect = content.answers?.filter((a) => a.isCorrect).length > 1;

  const handleBackClick = () => {
    if (challenge?.courseId && challenge?.Level?.islandId) {
      router.push(`/course/${challenge.courseId}/island/${challenge.Level.islandId}`);
    } else {
      router.push('/courses');
    }
  };

  useEffect(() => {
    setSelectedAnswers([]);
    setResult(null);
  }, [currentPage]);

  const handleOptionChange = (option: string) => {
    if (isMultiSelect) {
      setSelectedAnswers((prev) =>
        prev.includes(option) ? prev.filter((item) => item !== option) : [...prev, option],
      );
    } else {
      setSelectedAnswers([option]);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const correctAnswers = content.answers
      ?.filter((a) => a.isCorrect)
      .map((a) => a.content)
      .sort();

    const selectedSorted = [...selectedAnswers].sort();

    const isCorrect = JSON.stringify(correctAnswers) === JSON.stringify(selectedSorted);

    setResult(isCorrect);

    if (onQuizResult) {
      onQuizResult(isCorrect);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.backButtonContainer}>
        <button className={styles.backButton} onClick={handleBackClick}>
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>
      </div>
      <div className={styles.header}>
        <h2 className={styles.title}>{content.title}</h2>
        <div className={styles.headerRight}>
          {isLastSlide && (
            <button
              className={`${styles.submitButton} ${content.type === SlideType.QUIZ && !result ? styles.disabledSubmit : ''}`}
              onClick={onSubmit}
              disabled={content.type === SlideType.QUIZ && !result}
            >
              Submit
            </button>
          )}

          <div className={styles.pageIndicator}>
            {currentPage}/{totalPages}
          </div>
        </div>
      </div>
      <hr className={styles.divider} />
      <div className={styles.content}>
        {content.type === SlideType.VIDEO && content.videoUrl && (
          <div className={styles.videoContent}>
            <YouTube
              videoId={extractYouTubeId(content.videoUrl)}
              loading="lazy"
              iframeClassName="w-full h-full"
              className="w-full h-full"
            />
          </div>
        )}
        {content.type === SlideType.PDF_SLIDE && content.imageUrl && (
          <div className={styles.pdfContent}>
            <Image
              src={content.imageUrl}
              alt={content.title}
              className={styles.pdfImage}
              width={500}
              height={350}
              style={{ height: '100%' }}
              priority
            />
          </div>
        )}
        {content.type === SlideType.QUIZ && content.answers && (
          <div className={styles.quizContent}>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <p className={styles.questionText}>{content.description}</p>
                {content.answers.map((answer, idx) => (
                  <div key={idx} className={styles.optionContainer}>
                    <label className={styles.optionLabel}>
                      <input
                        type={isMultiSelect ? 'checkbox' : 'radio'}
                        name="question"
                        value={answer.content}
                        className="mr-2"
                        onChange={() => handleOptionChange(answer.content)}
                        checked={selectedAnswers.includes(answer.content)}
                      />
                      {answer.content}
                    </label>
                  </div>
                ))}
                {result !== null && (
                  <p className={result ? styles.resultCorrect : styles.resultIncorrect}>
                    {result ? 'Correct!' : 'Incorrect!'}
                  </p>
                )}
              </div>
              <button
                type="submit"
                className={styles.submitQuizButton}
                disabled={selectedAnswers.length === 0}
              >
                See Result
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentCard;
