import type React from 'react';
import { useState, useRef, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Video,
  HelpCircle,
  GripVertical,
  Trash2,
  Edit2,
  AlertCircle,
  ArrowLeft,
  FileText,
} from 'lucide-react';
import styles from './ChallengeEditor.module.css';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import YouTube from 'react-youtube';
import { SlideType } from '@datn242/questify-common';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { Slide } from '@/types/courses.type';

const ItemTypes = {
  SLIDE: 'slide',
};
const extractYouTubeId = (url: string): string | null => {
  if (!url) return null;

  // Match patterns like:
  // - https://www.youtube.com/watch?v=VIDEO_ID
  // - https://youtu.be/VIDEO_ID
  // - https://youtube.com/shorts/VIDEO_ID
  // - https://www.youtube.com/embed/VIDEO_ID

  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);

  return match && match[2].length === 11 ? match[2] : null;
};

const SlideItem = ({
  slide,
  index,
  isActive,
  moveSlide,
  onClick,
  onTitleEdit,
  editingTitleId,
  onTitleChange,
  onTitleSave,
}: {
  slide: Slide;
  index: number;
  isActive: boolean;
  moveSlide: (dragIndex: number, hoverIndex: number) => void;
  onClick: () => void;
  onTitleEdit: (id: string) => void;
  editingTitleId: string | null;
  onTitleChange: (title: string) => void;
  onTitleSave: () => void;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isEditing = editingTitleId === slide.id;

  // Set up drag source
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.SLIDE,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  // Set up drop target
  const [, drop] = useDrop({
    accept: ItemTypes.SLIDE,
    hover: (item: { index: number }, monitor) => {
      if (!ref.current) {
        return;
      }

      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      // Get vertical middle
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the top
      const hoverClientY = clientOffset!.y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      moveSlide(dragIndex, hoverIndex);

      item.index = hoverIndex;
    },
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      className={`${styles.slideItem} ${isActive ? styles.activeSlide : ''} ${isDragging ? styles.dragging : ''}`}
      onClick={onClick}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <div className={styles.slideNumber}>{slide.slideNumber}</div>

      {isEditing ? (
        <div className={styles.slideTitleEdit} onClick={(e) => e.stopPropagation()}>
          <input
            type="text"
            value={slide.title}
            onChange={(e) => onTitleChange(e.target.value)}
            className={styles.slideTitleInput}
            autoFocus
            onBlur={onTitleSave}
          />
        </div>
      ) : (
        <div className={styles.slideTitleContainer}>
          <div className={styles.slideTitle}>{slide.title}</div>
          <button
            className={styles.slideTitleEditButton}
            onClick={(e) => {
              e.stopPropagation();
              onTitleEdit(slide.id);
            }}
          >
            <Edit2 size={14} />
          </button>
        </div>
      )}

      <div className={styles.dragHandle}>
        <GripVertical size={16} />
      </div>
    </div>
  );
};

interface EditorChallenge {
  id: string;
  levelId: string;
  Slides: Slide[];
  courseId?: string;
}

const ChallengeEditor: React.FC<{ challenge_id?: string }> = ({ challenge_id = null }) => {
  const router = useRouter();
  const [challenge, setChallenge] = useState<EditorChallenge | null>(null);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [showAddMenu, setShowAddMenu] = useState<boolean>(false);
  const [addMenuPosition, setAddMenuPosition] = useState<number | null>(null);
  const [editingTitleId, setEditingTitleId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [tempQuestionText, setTempQuestionText] = useState<string>('');
  const [validationError, setValidationError] = useState<number | null>(null);

  useEffect(() => {
    if (slides[currentSlideIndex]) {
      setTempQuestionText(slides[currentSlideIndex].description || '');
    }
    // Clear validation error when changing slides
    setValidationError(null);
  }, [currentSlideIndex, slides]);

  // Fetch challenge data when component mounts or challenge_id changes
  useEffect(() => {
    const fetchChallenge = async () => {
      if (!challenge_id) return;

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/course-mgmt/challenge/${challenge_id}`);

        if (!response.ok) {
          router.push('/404');
          return;
        }

        const data: EditorChallenge = await response.json();
        console.log('Challenge data loaded:', data);
        setChallenge(data);

        // Sort slides by slideNumber
        const sortedSlides = [...data.Slides].sort((a, b) => a.slideNumber - b.slideNumber);
        setSlides(sortedSlides);

        if (sortedSlides.length > 0) {
          setCurrentSlideIndex(0);
        }
      } catch (err) {
        console.error('Failed to fetch challenge:', err);
        setError('Failed to load challenge data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchChallenge();
  }, [challenge_id, router]);

  // API call to create a new slide
  const createSlide = async (
    newSlide: Omit<Slide, 'id' | 'createdAt' | 'updatedAt' | 'isDeleted'>,
  ) => {
    if (!challenge_id) return null;

    try {
      const response = await fetch(`/api/course-mgmt/challenge/${challenge_id}/slide`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSlide),
      });

      if (!response.ok) {
        throw new Error(`Error creating slide: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (err) {
      console.error('Failed to create slide:', err);
      setError('Failed to create slide. Please try again.');
      return null;
    }
  };

  const updateSlideAPI = async (slideId: string, updateData: Partial<Slide>) => {
    if (!challenge_id) return null;

    try {
      const response = await fetch(`/api/course-mgmt/challenge/${challenge_id}/slide/${slideId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error(`Error updating slide: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (err) {
      console.error('Failed to update slide:', err);
      setError('Failed to update slide. Please try again.');
      return null;
    }
  };

  const addSlide = async (type: SlideType) => {
    if (!challenge || !challenge_id) return;

    const insertIndex = slides.length;
    const slideNumber = insertIndex + 1;

    let slideTitle = 'Video';
    if (type === SlideType.QUIZ) {
      slideTitle = 'Quiz';
    } else if (type === SlideType.PDF_SLIDE) {
      slideTitle = 'Slide';
    }

    const newSlideData = {
      title: slideTitle,
      description: type === SlideType.QUIZ ? 'Enter your question here...' : '',
      slideNumber,
      type,
      imageUrl: type === SlideType.PDF_SLIDE ? '' : null,
      videoUrl: type === SlideType.VIDEO ? '' : null,
      answers:
        type === SlideType.QUIZ
          ? [
              { content: 'Answer 1', isCorrect: true },
              { content: 'Answer 2', isCorrect: false },
              { content: 'Answer 3', isCorrect: false },
            ]
          : null,
      challengeId: challenge.id,
    };

    // Call API to create the new slide
    const createdSlide = await createSlide(newSlideData);

    if (createdSlide) {
      // Create a temporary version for the UI until we get the response
      const tempNewSlide: Slide = {
        ...newSlideData,
        id: createdSlide.id,
        isDeleted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Insert the slide at the specified index
      const newSlides = [...slides];
      newSlides.splice(insertIndex, 0, tempNewSlide);

      // Update slide numbers for slides after the insertion point
      for (let i = insertIndex + 1; i < newSlides.length; i++) {
        const slideToUpdate = newSlides[i];
        newSlides[i] = { ...slideToUpdate, slideNumber: i + 1 };

        // Update slide numbers in the database
        updateSlideAPI(slideToUpdate.id, { slideNumber: i + 1 });
      }

      setSlides(newSlides);
      setCurrentSlideIndex(insertIndex);
    }

    setShowAddMenu(false);
    setAddMenuPosition(null);
  };

  const updateSlide = async (updatedSlide: Slide) => {
    // Update the slide in the local state immediately for UI responsiveness
    setSlides(slides.map((slide) => (slide.id === updatedSlide.id ? updatedSlide : slide)));

    // Then update in the API
    await updateSlideAPI(updatedSlide.id, {
      title: updatedSlide.title,
      description: updatedSlide.description,
      videoUrl: updatedSlide.videoUrl,
      imageUrl: updatedSlide.imageUrl,
      answers: updatedSlide.answers,
      slideNumber: updatedSlide.slideNumber,
    });
  };

  const selectAnswer = (answerIndex: number) => {
    if (
      !slides[currentSlideIndex] ||
      slides[currentSlideIndex].type !== SlideType.QUIZ ||
      !slides[currentSlideIndex].answers
    )
      return;

    const updatedSlide = { ...slides[currentSlideIndex] };
    if (!updatedSlide.answers) return;

    // Check if this is the only correct answer currently
    const isThisTheOnlyCorrectAnswer =
      updatedSlide.answers[answerIndex].isCorrect &&
      updatedSlide.answers.filter((a) => a.isCorrect).length === 1;

    // If this is the only correct answer and user is trying to uncheck it, prevent that
    if (isThisTheOnlyCorrectAnswer) {
      // Set validation error state to show message on this answer
      setValidationError(answerIndex);
      return; // Don't allow unchecking if it's the only correct answer
    }

    // Clear validation error when selecting a valid answer
    setValidationError(null);

    // Toggle the correct state of the clicked answer
    updatedSlide.answers = updatedSlide.answers.map((answer, idx) => ({
      ...answer,
      isCorrect: idx === answerIndex ? !answer.isCorrect : answer.isCorrect,
    }));

    updateSlide(updatedSlide);
  };

  const updateQuestion = () => {
    if (!slides[currentSlideIndex]) return;

    const updatedSlide = { ...slides[currentSlideIndex] };
    if (updatedSlide.description !== tempQuestionText) {
      updatedSlide.description = tempQuestionText;
      updateSlide(updatedSlide);
    }
  };

  const updateVideoUrl = (url: string) => {
    if (!slides[currentSlideIndex] || slides[currentSlideIndex].type !== SlideType.VIDEO) return;

    const updatedSlide = { ...slides[currentSlideIndex] };
    updatedSlide.videoUrl = url;
    updateSlide(updatedSlide);
  };

  const updateAnswerText = (answerIndex: number, text: string) => {
    if (!slides[currentSlideIndex] || slides[currentSlideIndex].type !== SlideType.QUIZ) return;

    const updatedSlide = { ...slides[currentSlideIndex] };
    if (!updatedSlide.answers) return;

    updatedSlide.answers[answerIndex].content = text;
    updateSlide(updatedSlide);
  };

  const goToNextSlide = () => {
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    }
  };

  const goToPrevSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  };

  const moveSlide = async (dragIndex: number, hoverIndex: number) => {
    const draggedSlide = slides[dragIndex];
    const newSlides = [...slides];
    newSlides.splice(dragIndex, 1);
    newSlides.splice(hoverIndex, 0, draggedSlide);

    // Update slide numbers and prepare API updates
    const slidesToUpdate = [];

    for (let i = 0; i < newSlides.length; i++) {
      const newSlideNumber = i + 1;

      // Only update if the slide number has changed
      if (newSlides[i].slideNumber !== newSlideNumber) {
        newSlides[i].slideNumber = newSlideNumber;
        slidesToUpdate.push({
          id: newSlides[i].id,
          slideNumber: newSlideNumber,
        });
      }
    }

    // Update UI immediately for responsiveness
    setSlides(newSlides);

    // Update current slide index if the current slide was moved
    if (currentSlideIndex === dragIndex) {
      setCurrentSlideIndex(hoverIndex);
    }
    // Or if slides were reordered around the current slide
    else if (
      (dragIndex < currentSlideIndex && hoverIndex >= currentSlideIndex) ||
      (dragIndex > currentSlideIndex && hoverIndex <= currentSlideIndex)
    ) {
      // Adjust the current slide index based on the direction of the move
      const adjustment = dragIndex < currentSlideIndex ? -1 : 1;
      setCurrentSlideIndex(currentSlideIndex + adjustment);
    }

    // Make API calls to update slide numbers
    for (const slideUpdate of slidesToUpdate) {
      await updateSlideAPI(slideUpdate.id, { slideNumber: slideUpdate.slideNumber });
    }
  };

  const deleteSlide = async (index: number) => {
    if (!challenge_id || !slides[index]) return;

    const slideToDelete = slides[index];
    const slideId = slideToDelete.id;

    try {
      const response = await fetch(`/api/course-mgmt/challenge/${challenge_id}/slide/${slideId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error deleting slide: ${response.status}`);
      }

      const newSlides = [...slides];
      newSlides.splice(index, 1);

      for (let i = 0; i < newSlides.length; i++) {
        if (newSlides[i].slideNumber !== i + 1) {
          newSlides[i].slideNumber = i + 1;
          await updateSlideAPI(newSlides[i].id, { slideNumber: i + 1 });
        }
      }

      setSlides(newSlides);

      // Adjust current slide index if needed
      if (index === currentSlideIndex) {
        // If we're deleting the current slide, move to the previous one
        // or stay at 0 if we're at the beginning
        setCurrentSlideIndex(Math.max(0, currentSlideIndex - 1));
      } else if (index < currentSlideIndex) {
        // If we're deleting a slide before the current one, adjust the index
        setCurrentSlideIndex(currentSlideIndex - 1);
      }
    } catch (err) {
      console.error('Failed to delete slide:', err);
      setError('Failed to delete slide. Please try again.');
    }
  };

  const removeAnswer = (answerIndex: number) => {
    if (!slides[currentSlideIndex] || slides[currentSlideIndex].type !== SlideType.QUIZ) return;

    const updatedSlide = { ...slides[currentSlideIndex] };
    if (!updatedSlide.answers || updatedSlide.answers.length <= 2) return;

    // Check if we're removing the only correct answer
    const isRemovingTheOnlyCorrectAnswer =
      updatedSlide.answers[answerIndex].isCorrect &&
      updatedSlide.answers.filter((a) => a.isCorrect).length === 1;

    // If removing the only correct answer, make another answer correct
    if (isRemovingTheOnlyCorrectAnswer) {
      // Find next answer index that's not the one being removed
      const nextAnswerIndex = answerIndex === 0 ? 1 : 0;
      updatedSlide.answers[nextAnswerIndex].isCorrect = true;
    }

    updatedSlide.answers = updatedSlide.answers.filter((_, i) => i !== answerIndex);
    updateSlide(updatedSlide);
  };

  const addAnswer = () => {
    if (!slides[currentSlideIndex] || slides[currentSlideIndex].type !== SlideType.QUIZ) return;

    const updatedSlide = { ...slides[currentSlideIndex] };
    if (!updatedSlide.answers) return;

    updatedSlide.answers = [
      ...updatedSlide.answers,
      { content: `Answer ${updatedSlide.answers.length + 1}`, isCorrect: false },
    ];

    updateSlide(updatedSlide);
  };

  // Start editing a slide title
  const startEditingTitle = (slideId: string) => {
    const slide = slides.find((s) => s.id === slideId);
    if (slide) {
      setEditingTitleId(slideId);
    }
  };

  // Update the temporary title as user types
  const updateTempTitle = (title: string) => {
    // Also update the slide title in real-time
    if (editingTitleId) {
      const updatedSlides = slides.map((slide) =>
        slide.id === editingTitleId ? { ...slide, title } : slide,
      );
      setSlides(updatedSlides);
    }
  };

  // Save the edited title
  const saveTitle = async () => {
    if (editingTitleId) {
      const slideToUpdate = slides.find((slide) => slide.id === editingTitleId);
      if (slideToUpdate) {
        await updateSlideAPI(slideToUpdate.id, { title: slideToUpdate.title });
      }
    }

    setEditingTitleId(null);
  };

  const currentSlide = slides[currentSlideIndex];

  if (loading) {
    return <div className={styles.loading}>Loading challenge data...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  const handleBackClick = () => {
    if (challenge?.courseId) {
      router.push(`/instructor/course/edit/${challenge.courseId}`);
    } else {
      router.push('/instructor/courses');
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={styles.container}>
        <div className={styles.backButtonContainer}>
          <button className={styles.backButton} onClick={handleBackClick}>
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>
        </div>
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          <div className={styles.sidebar}>
            <div className={styles.slidesList}>
              {slides.length > 0 ? (
                <div className={styles.slidesListInner}>
                  {slides.map((slide, index) => (
                    <SlideItem
                      key={slide.id}
                      slide={slide}
                      index={index}
                      isActive={index === currentSlideIndex}
                      moveSlide={moveSlide}
                      onClick={() => setCurrentSlideIndex(index)}
                      onTitleEdit={startEditingTitle}
                      editingTitleId={editingTitleId}
                      onTitleChange={updateTempTitle}
                      onTitleSave={saveTitle}
                    />
                  ))}
                </div>
              ) : (
                <div className={styles.emptyState}>
                  No slides yet. Click the + button to add content.
                </div>
              )}
            </div>

            <div className={styles.addButtonContainer}>
              <button
                className={styles.addButton}
                onClick={() => {
                  setAddMenuPosition(null);
                  setShowAddMenu(!showAddMenu);
                }}
              >
                <Plus size={20} />
              </button>

              {showAddMenu && (
                <div
                  className={styles.addMenu}
                  style={{
                    position: 'absolute',
                    bottom: addMenuPosition !== null ? 'auto' : '60px',
                    top: addMenuPosition !== null ? `${addMenuPosition * 50 + 60}px` : 'auto',
                    left: '16px',
                    right: '16px',
                    zIndex: 20,
                  }}
                >
                  <button className={styles.addMenuItem} onClick={() => addSlide(SlideType.VIDEO)}>
                    <Video size={16} />
                    <span>Add Video</span>
                  </button>
                  <button className={styles.addMenuItem} onClick={() => addSlide(SlideType.QUIZ)}>
                    <HelpCircle size={16} />
                    <span>Add Quiz</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className={styles.content}>
            <div className={styles.slideContent}>
              {slides.length === 0 ? (
                <div className={styles.emptyStateContent}>
                  <h2>No content yet</h2>
                  <p>Click the + button on the left to add video or quiz content.</p>
                </div>
              ) : currentSlide?.type === SlideType.QUIZ ? (
                <div className={styles.quizContent}>
                  <div className={styles.questionContainer}>
                    <textarea
                      className={styles.questionInput}
                      value={tempQuestionText}
                      onChange={(e) => setTempQuestionText(e.target.value)}
                      onBlur={updateQuestion}
                      placeholder="Enter your question here..."
                    />
                  </div>

                  <div className={styles.answersContainer}>
                    {currentSlide.answers?.map((answer, index) => (
                      <div key={index} className={styles.answerOption}>
                        <input
                          type="checkbox"
                          id={`answer-${index}`}
                          name={`quiz-answer-${index}`}
                          checked={answer.isCorrect}
                          onChange={() => selectAnswer(index)}
                          className={styles.checkboxInput}
                        />
                        <div className={styles.answerContentWrapper}>
                          <input
                            type="text"
                            value={answer.content}
                            onChange={(e) => updateAnswerText(index, e.target.value)}
                            className={styles.answerInput}
                          />
                          {validationError === index && (
                            <div className={styles.validationError}>
                              <AlertCircle size={14} />
                              <span>At least one answer must be marked as correct</span>
                            </div>
                          )}
                        </div>
                        <button
                          className={styles.removeAnswerButton}
                          onClick={() => removeAnswer(index)}
                          disabled={currentSlide.answers?.length <= 2}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}

                    <div className={styles.answerActions}>
                      <button className={styles.addAnswerButton} onClick={addAnswer}>
                        <Plus size={16} />
                        <span>Add Answer</span>
                      </button>
                    </div>

                    <div className={styles.selectCorrectLabel}>SELECT THE CORRECT ANSWER</div>
                  </div>
                </div>
              ) : currentSlide?.type === SlideType.VIDEO ? (
                <div className={styles.videoContent}>
                  <div className={styles.videoInputContainer}>
                    <label htmlFor="video-url">Video URL (YouTube)</label>
                    <input
                      id="video-url"
                      type="text"
                      value={currentSlide.videoUrl || ''}
                      onChange={(e) => updateVideoUrl(e.target.value)}
                      placeholder="Enter YouTube video URL"
                      className={styles.videoInput}
                    />
                  </div>

                  {currentSlide.videoUrl ? (
                    <div className={styles.videoPreview}>
                      <h3>Video Preview</h3>
                      <div className={styles.youtubeContainer}>
                        <YouTube
                          videoId={extractYouTubeId(currentSlide.videoUrl) || ''}
                          loading="lazy"
                          iframeClassName={styles.youtubeIframe}
                          className={styles.youtubePlayer}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className={styles.videoPreview}>
                      <h3>Video Preview</h3>
                      <div className={styles.videoPlaceholder}>
                        Enter a valid YouTube URL to see the preview
                      </div>
                    </div>
                  )}
                </div>
              ) : currentSlide?.type === SlideType.PDF_SLIDE ? (
                <div className={styles.pdfContent}>
                  {currentSlide.imageUrl ? (
                    <div className={styles.pdfPreview}>
                      <h3>PDF Slide</h3>
                      <div className={styles.imageContainer}>
                        <Image
                          src={currentSlide.imageUrl}
                          alt="PDF Slide"
                          className={styles.pdfImage}
                          layout="fill"
                          objectFit="contain"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className={styles.pdfPreview}>
                      <h3>PDF Slide</h3>
                      <div className={styles.pdfPlaceholder}>
                        <FileText size={40} />
                        <p>No PDF image has been assigned to this slide</p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className={styles.emptySlideContent}>
                  <h2>Empty Slide</h2>
                  <p>This slide has no content yet.</p>
                </div>
              )}
            </div>

            <div className={styles.navigationControls}>
              <button
                className={styles.navButton}
                onClick={goToPrevSlide}
                disabled={currentSlideIndex === 0 || slides.length === 0}
              >
                <ChevronLeft size={24} />
              </button>

              {/* Added slide counter here */}
              <div className={styles.slideCounter}>
                {slides.length > 0 ? `${currentSlideIndex + 1} / ${slides.length}` : '0 / 0'}
              </div>

              {slides.length > 0 && (
                <button
                  className={styles.deleteButton}
                  onClick={() => deleteSlide(currentSlideIndex)}
                  title="Delete current slide"
                >
                  <Trash2 size={20} />
                </button>
              )}
              <button
                className={styles.navButton}
                onClick={goToNextSlide}
                disabled={currentSlideIndex === slides.length - 1 || slides.length === 0}
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

export default ChallengeEditor;
