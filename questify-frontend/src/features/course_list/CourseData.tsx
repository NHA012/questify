// CourseData.tsx
import { useState, useEffect } from 'react';
import { Course, fetchCourses, fetchInstructorCourses } from '../../services/courseService';

// Export the Course interface for use in other components
export type { Course };

// Custom hook to fetch and manage courses
export const useCourseData = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        setLoading(true);
        const data = await fetchCourses();
        setCourses(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch courses:', err);
        setError('Failed to load courses. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, []);

  return { courses, loading, error };
};

// Provide a function to get a course by ID
export const getCourseById = (id: string, courseList: Course[]): Course | undefined => {
  return courseList.find((course) => course.id === id);
};

// Fallback for testing without API
export const useStaticCourseData = () => {
  return {
    courses: [], // You could move your hardcoded array here as fallback
    loading: false,
    error: null,
  };
};

// Custom hook to fetch and manage instructor courses
export const useCourseInstructorData = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        setLoading(true);
        const data = await fetchInstructorCourses();
        setCourses(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch courses:', err);
        setError('Failed to load courses. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, []);

  return { courses, loading, error };
};
