import axios from 'axios';
import { ResourcePrefix } from '@datn242/questify-common';

export interface Review {
  id: string;
  studentId: string;
  courseId: string;
  comment?: string;
  rating: number;
  isDeleted: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReviewWithStudent extends Review {
  student?: {
    id: string;
    name: string;
    image: string;
  };
}

// Helper function to get student details
export const fetchStudentById = async (studentId: string) => {
  try {
    const response = await axios.get(`/api/users/${studentId}`);
    return {
      id: response.data.id,
      name: response.data.userName,
      image:
        response.data.imageUrl ||
        'https://cdn.builder.io/api/v1/image/assets/TEMP/8c4eab4588185e2719be34b7d85f67f055c31fea50086c21739e7582db0da9ef?placeholderIfAbsent=true&apiKey=725d9caf744a44daa4b84cac10f9b01b',
    };
  } catch (error) {
    console.error(`Error fetching student with ID ${studentId}:`, error);
    return null;
  }
};

// Get all reviews for a course
export const fetchCourseReviews = async (courseId: string): Promise<ReviewWithStudent[]> => {
  try {
    const response = await axios.get(`${ResourcePrefix.CourseManagement}/${courseId}/reviews`);

    // Filter out deleted reviews
    const activeReviews = response.data.filter((review: Review) => !review.isDeleted);

    // Fetch student details for each review
    const reviewsWithStudents = await Promise.all(
      activeReviews.map(async (review: Review) => {
        const student = await fetchStudentById(review.studentId);
        return {
          ...review,
          student,
          // Convert the date strings to Date objects
          createdAt: new Date(review.createdAt),
          updatedAt: new Date(review.updatedAt),
          deletedAt: review.deletedAt ? new Date(review.deletedAt) : undefined,
          rating: parseFloat(String(review.rating)), // Use String() to convert to string safely
        };
      }),
    );

    return reviewsWithStudents;
  } catch (error) {
    console.error('Error fetching course reviews:', error);
    return [];
  }
};

// Create a new review
export const createReview = async (
  courseId: string,
  reviewData: { comment?: string; rating: number },
): Promise<Review | null> => {
  try {
    const response = await axios.post(
      `${ResourcePrefix.CourseManagement}/${courseId}/reviews`,
      reviewData,
    );
    return response.data;
  } catch (error) {
    console.error('Error creating review:', error);
    throw error;
  }
};

// Update an existing review
export const updateReview = async (
  courseId: string,
  reviewId: string,
  reviewData: { comment?: string; rating?: number },
): Promise<Review | null> => {
  try {
    const response = await axios.patch(
      `${ResourcePrefix.CourseManagement}/${courseId}/reviews/${reviewId}`,
      reviewData,
    );
    return response.data;
  } catch (error) {
    console.error('Error updating review:', error);
    throw error;
  }
};

// Delete a review (soft delete)
export const deleteReview = async (courseId: string, reviewId: string): Promise<Review | null> => {
  try {
    const response = await axios.delete(
      `${ResourcePrefix.CourseManagement}/${courseId}/reviews/${reviewId}`,
    );
    return response.data;
  } catch (error) {
    console.error('Error deleting review:', error);
    throw error;
  }
};

// Calculate rating statistics from reviews
export const calculateRatingStats = (
  reviews: Review[],
): {
  overallRating: number;
  ratingData: Array<{ stars: number; percentage: number }>;
} => {
  if (!reviews || reviews.length === 0) {
    return {
      overallRating: 0,
      ratingData: [
        { stars: 5, percentage: 0 },
        { stars: 4, percentage: 0 },
        { stars: 3, percentage: 0 },
        { stars: 2, percentage: 0 },
        { stars: 1, percentage: 0 },
      ],
    };
  }

  // Count reviews by rating
  const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  let totalRating = 0;
  let validReviews = 0;

  reviews.forEach((review) => {
    // Ensure rating is a valid number
    const ratingValue = parseFloat(String(review.rating));

    if (!isNaN(ratingValue) && ratingValue >= 1 && ratingValue <= 5) {
      const rating = Math.floor(ratingValue);
      ratingCounts[rating as keyof typeof ratingCounts]++;
      totalRating += ratingValue;
      validReviews++;
    }
  });

  const overallRating = validReviews > 0 ? totalRating / validReviews : 0;

  // Calculate percentages
  const ratingData = Object.keys(ratingCounts)
    .map((stars) => parseInt(stars))
    .sort((a, b) => b - a) // Sort in descending order
    .map((stars) => ({
      stars,
      percentage:
        validReviews > 0
          ? Math.round((ratingCounts[stars as keyof typeof ratingCounts] / validReviews) * 100)
          : 0,
    }));

  return {
    overallRating,
    ratingData,
  };
};

// Format the date for review display
export const formatReviewDate = (date: Date): string => {
  const now = new Date();
  const reviewDate = new Date(date);
  const diffTime = Math.abs(now.getTime() - reviewDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 1) {
    return 'Today';
  } else if (diffDays === 1) {
    return 'Today';
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
  } else {
    return reviewDate.toLocaleDateString();
  }
};
