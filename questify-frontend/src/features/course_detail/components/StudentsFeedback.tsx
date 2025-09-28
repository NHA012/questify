import React, { useState, useEffect, useCallback } from 'react';
import styles from './StudentsFeedback.module.css';
import Image from 'next/image';
import { courseDetailImage } from '@/assets/images';
import {
  fetchCourseReviews,
  createReview,
  updateReview,
  deleteReview,
  ReviewWithStudent,
  formatReviewDate,
} from '@/services/reviewService';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { checkCourseEnrollment } from '@/services/progressService';

interface StarRatingProps {
  rating: number;
  editable?: boolean;
  onChange?: (rating: number) => void;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, editable = false, onChange }) => {
  const handleStarClick = (selectedRating: number) => {
    if (editable && onChange) {
      onChange(selectedRating);
    }
  };

  // Ensure rating is a valid number
  const safeRating = isNaN(rating) ? 0 : rating;

  return (
    <div className={styles.stars}>
      {[...Array(5)].map((_, index) => {
        const starValue = index + 1;
        const isSelected = starValue <= safeRating;

        return (
          <div
            key={index}
            onClick={() => handleStarClick(starValue)}
            style={{ cursor: editable ? 'pointer' : 'default' }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={styles.star}
            >
              <path
                d="M8.27569 11.9208L11.4279 13.9179C11.8308 14.1732 12.3311 13.7935 12.2115 13.3232L11.3008 9.74052C11.2752 9.64073 11.2782 9.53573 11.3096 9.4376C11.3409 9.33946 11.3994 9.25218 11.4781 9.18577L14.3049 6.83306C14.6763 6.52392 14.4846 5.90751 14.0074 5.87654L10.3159 5.63696C10.2165 5.62986 10.1211 5.59465 10.0409 5.53545C9.96069 5.47625 9.89896 5.39548 9.86289 5.30255L8.48612 1.83549C8.44869 1.73685 8.38215 1.65194 8.29532 1.59201C8.2085 1.53209 8.1055 1.5 8 1.5C7.89451 1.5 7.79151 1.53209 7.70468 1.59201C7.61786 1.65194 7.55131 1.73685 7.51389 1.83549L6.13712 5.30255C6.10104 5.39548 6.03932 5.47625 5.95912 5.53545C5.87892 5.59465 5.78355 5.62986 5.68412 5.63696L1.99263 5.87654C1.51544 5.90751 1.32373 6.52392 1.69515 6.83306L4.52186 9.18577C4.60063 9.25218 4.65907 9.33946 4.69044 9.4376C4.72181 9.53573 4.72485 9.64073 4.6992 9.74052L3.85459 13.063C3.71111 13.6274 4.31143 14.083 4.79495 13.7767L7.72431 11.9208C7.8067 11.8683 7.90234 11.8405 8 11.8405C8.09767 11.8405 8.19331 11.8683 8.27569 11.9208Z"
                fill={isSelected ? '#82FDF3' : '#E9EAF0'}
              />
            </svg>
          </div>
        );
      })}
    </div>
  );
};

// Review Card Component
interface ReviewCardProps {
  review: ReviewWithStudent;
  isCurrentUserReview: boolean;
  onEdit: (review: ReviewWithStudent) => void;
  onDelete: (reviewId: string) => void;
}

const ReviewCard: React.FC<ReviewCardProps> = ({
  review,
  isCurrentUserReview,
  onEdit,
  onDelete,
}) => {
  return (
    <div className={styles.review}>
      <div className={styles.avatar}>
        <Image
          src={review.student?.image || courseDetailImage.author1Image}
          alt={`${review.student?.name || 'User'}'s avatar`}
          className={styles.avatarImg}
          width={40}
          height={40}
        />
      </div>
      <div className={styles.content}>
        <div className={styles.reviewHeader}>
          <div className={styles.name}>{review.student?.name || 'Anonymous User'}</div>
          <div className={styles.dot}>•</div>
          <div className={styles.time}>{formatReviewDate(review.createdAt)}</div>

          {isCurrentUserReview && (
            <div className={styles.reviewActions}>
              <button className={styles.editButton} onClick={() => onEdit(review)}>
                Edit
              </button>
              <button className={styles.deleteButton} onClick={() => onDelete(review.id)}>
                Delete
              </button>
            </div>
          )}
        </div>
        <StarRating rating={Number(review.rating)} />
        <div className={styles.reviewText}>{review.comment || 'No comment provided.'}</div>
      </div>
    </div>
  );
};

// Review Form Component
interface ReviewFormProps {
  courseId: string;
  existingReview: ReviewWithStudent | null;
  onSubmit: () => void;
  onCancel: () => void;
}

interface APIError {
  response?: {
    data?: {
      errors?: Array<{ message: string }>;
    };
  };
  message: string;
}

const ReviewForm: React.FC<ReviewFormProps> = ({
  courseId,
  existingReview,
  onSubmit,
  onCancel,
}) => {
  // Ensure rating is always a number
  const [rating, setRating] = useState<number>(existingReview ? Number(existingReview.rating) : 5);
  const [comment, setComment] = useState(existingReview ? existingReview.comment || '' : '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRatingChange = (newRating: number) => {
    setRating(Number(newRating));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (existingReview) {
        // Update existing review
        await updateReview(courseId, existingReview.id, { comment, rating });
      } else {
        // Create new review
        await createReview(courseId, { comment, rating });
      }
      onSubmit();
    } catch (err) {
      console.error('Error submitting review:', err);
      const apiError = err as APIError;
      setError(
        apiError.response?.data?.errors?.[0]?.message ||
          'Failed to submit review. Please try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.reviewForm}>
      <h3>{existingReview ? 'Edit Your Review' : 'Write a Review'}</h3>

      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label>Rating</label>
          <div className={styles.ratingSelector}>
            <StarRating rating={rating} editable={true} onChange={handleRatingChange} />
            <span>{typeof rating === 'number' ? rating.toFixed(1) : '5.0'}</span>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>Comment</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            placeholder="Share your experience with this course..."
            className={styles.commentInput}
          />
        </div>

        {error && <div className={styles.errorMessage}>{error}</div>}

        <div className={styles.formActions}>
          <button type="button" className={styles.cancelButton} onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : existingReview ? 'Update Review' : 'Submit Review'}
          </button>
        </div>
      </form>
    </div>
  );
};

// Main StudentsFeedback Component
interface StudentsFeedbackProps {
  courseId: string;
  initialReviews?: ReviewWithStudent[];
  title?: string;
  onReviewsChange?: () => void; // Add callback for notifying parent of review changes
}

const StudentsFeedback: React.FC<StudentsFeedbackProps> = ({
  courseId,
  initialReviews,
  title = 'Students Feedback',
  onReviewsChange,
}) => {
  const { userData: currentUser, loading: userLoading } = useCurrentUser();
  const [reviews, setReviews] = useState<ReviewWithStudent[]>(initialReviews || []);
  const [selectedRating, setSelectedRating] = useState<string>('All Ratings');
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [isEnrolled, setIsEnrolled] = useState<boolean>(false);
  const [userReview, setUserReview] = useState<ReviewWithStudent | null>(null);
  const [showReviewForm, setShowReviewForm] = useState<boolean>(false);
  const [reviewToEdit, setReviewToEdit] = useState<ReviewWithStudent | null>(null);
  const [hasMoreReviews, setHasMoreReviews] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);

  const ratingOptions = [
    'All Ratings',
    '5 Star Rating',
    '4 Star Rating',
    '3 Star Rating',
    '2 Star Rating',
    '1 Star Rating',
  ];

  // Fetch reviews and check enrollment status - use useCallback to memoize
  const loadReviews = useCallback(async () => {
    try {
      setLoading(true);
      const fetchedReviews = await fetchCourseReviews(courseId);
      setReviews(fetchedReviews);

      // Check if the current user has already submitted a review
      if (currentUser?.id) {
        const userReviewFound = fetchedReviews.find(
          (review) => review.studentId === currentUser.id,
        );
        if (userReviewFound) {
          setUserReview(userReviewFound);
        } else {
          setUserReview(null);
        }
      }

      // Simulate pagination - in a real app, this would be handled by the API
      setHasMoreReviews(fetchedReviews.length >= 6);

      // Notify parent component if callback is provided
      if (onReviewsChange) {
        onReviewsChange();
      }
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setLoading(false);
    }
  }, [courseId, currentUser?.id, onReviewsChange]);

  // Memoize the enrollment status check
  const checkEnrollmentStatus = useCallback(async () => {
    if (!currentUser?.id) {
      setIsEnrolled(false);
      return;
    }

    try {
      const progress = await checkCourseEnrollment(courseId, currentUser.id);
      setIsEnrolled(!!progress);
    } catch (error) {
      console.error('Error checking enrollment status:', error);
      setIsEnrolled(false);
    }
  }, [courseId, currentUser?.id]);

  // Initial load of reviews
  useEffect(() => {
    if (!initialReviews) {
      loadReviews();
    } else {
      setLoading(false);

      // Still check for user review in initialReviews
      if (currentUser?.id && initialReviews.length > 0) {
        const userReviewFound = initialReviews.find(
          (review) => review.studentId === currentUser.id,
        );
        if (userReviewFound) {
          setUserReview(userReviewFound);
        }
      }
    }
  }, [courseId, initialReviews, currentUser?.id, loadReviews]);

  // Update reviews when initialReviews change
  useEffect(() => {
    if (initialReviews) {
      setReviews(initialReviews);
    }
  }, [initialReviews]);

  // Check enrollment status when user data changes
  useEffect(() => {
    if (!userLoading && currentUser) {
      checkEnrollmentStatus();
    }
  }, [userLoading, currentUser, checkEnrollmentStatus]);

  const handleRatingSelect = (rating: string) => {
    setSelectedRating(rating);
    setShowDropdown(false);
  };

  const handleLoadMore = () => {
    setLoading(true);
    // In a real implementation, this would fetch the next page of reviews
    // For now, we'll simulate it by showing more reviews after a delay
    setTimeout(() => {
      setPage((prev) => prev + 1);
      // Simulate no more reviews after page 3
      if (page >= 2) {
        setHasMoreReviews(false);
      }
      setLoading(false);
    }, 1000);
  };

  const handleEditReview = (review: ReviewWithStudent) => {
    setReviewToEdit(review);
    setShowReviewForm(true);
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await deleteReview(courseId, reviewId);
        setUserReview(null);
        loadReviews();
      } catch (error) {
        console.error('Error deleting review:', error);
      }
    }
  };

  const handleReviewSubmit = () => {
    setShowReviewForm(false);
    setReviewToEdit(null);
    loadReviews();
  };

  const handleCancelReview = () => {
    setShowReviewForm(false);
    setReviewToEdit(null);
  };

  // Filter reviews based on selected rating
  const filteredReviews =
    selectedRating === 'All Ratings'
      ? reviews
      : reviews.filter((review) => {
          const ratingValue = parseInt(selectedRating.split(' ')[0]);
          return Math.round(Number(review.rating)) === ratingValue;
        });

  return (
    <div className={styles.feedbackContainer}>
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        <div
          className={styles.ratingSelect}
          onClick={() => setShowDropdown(!showDropdown)}
          tabIndex={0}
          role="button"
          aria-haspopup="listbox"
        >
          <span>{selectedRating}</span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13 6L8 11L3 6"
              stroke="#1D2026"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          {showDropdown && (
            <div className={styles.dropdown}>
              {ratingOptions.map((option) => (
                <div
                  key={option}
                  className={styles.dropdownItem}
                  onClick={() => handleRatingSelect(option)}
                >
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Write/Edit Review Section */}
      {isEnrolled && !userLoading && (
        <div className={styles.userReviewSection}>
          {!showReviewForm && !userReview && (
            <button className={styles.writeReviewButton} onClick={() => setShowReviewForm(true)}>
              Write a Review
            </button>
          )}

          {showReviewForm && (
            <ReviewForm
              courseId={courseId}
              existingReview={reviewToEdit}
              onSubmit={handleReviewSubmit}
              onCancel={handleCancelReview}
            />
          )}
        </div>
      )}

      {/* Reviews List */}
      <div className={styles.reviews}>
        {loading && page === 1 ? (
          <div className={styles.loadingIndicator}>Loading reviews...</div>
        ) : filteredReviews.length === 0 ? (
          <div className={styles.noReviews}>No reviews yet for this course.</div>
        ) : (
          filteredReviews.map((review, index) => (
            <React.Fragment key={review.id}>
              <ReviewCard
                review={review}
                isCurrentUserReview={currentUser?.id === review.studentId}
                onEdit={handleEditReview}
                onDelete={handleDeleteReview}
              />
              {index < filteredReviews.length - 1 && <div className={styles.divider} />}
            </React.Fragment>
          ))
        )}
      </div>

      {/* Load More Button */}
      {hasMoreReviews && (
        <div className={styles.loadMore}>
          <button className={styles.loadMoreButton} onClick={handleLoadMore} disabled={loading}>
            <span>{loading ? 'Loading...' : 'Load More'}</span>
            {loading ? (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 3V6"
                  stroke="#00ADB5"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  opacity="0.9"
                  d="M18.3635 5.63574L16.2422 7.75706"
                  stroke="#00ADB5"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  opacity="0.8"
                  d="M21 12H18"
                  stroke="#00ADB5"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  opacity="0.7"
                  d="M18.3635 18.3635L16.2422 16.2422"
                  stroke="#00ADB5"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  opacity="0.6"
                  d="M12 21V18"
                  stroke="#00ADB5"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  opacity="0.5"
                  d="M5.63281 18.3635L7.75413 16.2422"
                  stroke="#00ADB5"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  opacity="0.4"
                  d="M3 12H6"
                  stroke="#00ADB5"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  opacity="0.3"
                  d="M5.63281 5.63574L7.75413 7.75706"
                  stroke="#00ADB5"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <Image
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/defc4b68b70d87b3067165b5aac57b2dce8c8b2522909f5e82fe7ed3cac8a0d1?placeholderIfAbsent=true&apiKey=725d9caf744a44daa4b84cac10f9b01b"
                alt=""
                className={styles.toggleIcon}
                width={50000}
                height={50000}
              />
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default StudentsFeedback;
