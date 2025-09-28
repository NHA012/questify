import axios from 'axios';
import { ResourcePrefix, CourseCategory } from '@datn242/questify-common';

// Interface matching your backend Course model structure
export interface CourseDTO {
  id: string;
  name: string;
  shortDescription?: string;
  description?: string;
  category?: string;
  price?: number;
  backgroundImage?: string;
  thumbnail?: string;
  learningObjectives?: string[];
  requirements?: string[];
  targetAudience?: string[];
  status?: string;
  teacherId: string;
}

export interface Course {
  id: string;
  image: string;
  category: string;
  title: string;
  rating: number;
  studentCount: number;
  categoryColor: string;
  categoryBg: string;
  price: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  duration: string;
  createdAt: string;
  description: string;
  shortDescription: string;
  teacherId: string;
  backgroundImage: string;
  learningObjectives?: string[];
  requirements?: string[];
  targetAudience?: string[];
  status?: string;
}

export interface TeacherData {
  id: string;
  name: string;
  image?: string;
  title?: string;
  stats: {
    rating: string;
    students: string;
    courses: string;
  };
  description?: string;
}

export interface Level {
  id: string;
  name: string;
  position: number;
}

export interface Island {
  id: string;
  name: string;
  position: number;
  courseId: string;
  Levels: Level[];
  prerequisites: { id: string; name: string }[];
}

const categoryColorMap: Record<CourseCategory | string, { color: string; bg: string }> = {
  [CourseCategory.ITSoftware]: { color: '#882929', bg: '#fff0f0' },
  [CourseCategory.Design]: { color: '#993d20', bg: '#c9f1ff' },
  [CourseCategory.Marketing]: { color: '#342f98', bg: '#ebebff' },
  [CourseCategory.Business]: { color: '#2a6b8c', bg: '#e6f7ff' },
  [CourseCategory.FinanceAccounting]: { color: '#344f2a', bg: '#eaffd6' },
  [CourseCategory.OfficeProductivity]: { color: '#6b2a8c', bg: '#f3e6ff' },
  [CourseCategory.PersonalDevelopment]: { color: '#8c2a6b', bg: '#ffe6f7' },
  [CourseCategory.Lifestyle]: { color: '#8c6b2a', bg: '#fff7e6' },
  [CourseCategory.PhotographyVideo]: { color: '#2a8c6b', bg: '#e6fff7' },
  [CourseCategory.HealthFitness]: { color: '#bf4040', bg: '#ffe0e0' },
  [CourseCategory.Music]: { color: '#404dbf', bg: '#e0e5ff' },
  default: { color: '#342f98', bg: '#ebebff' },
};

const levels = ['Beginner', 'Intermediate', 'Advanced', 'All Levels'] as const;
const durations = ['0-1 Hour', '1-3 Hours', '3-6 Hours', '6-17 Hours', '17+ Hours'] as const;

/**
 * Transforms backend course data to frontend format
 */
const transformCourseData = (courseDTO: CourseDTO): Course => {
  const categorySettings = categoryColorMap[courseDTO.category || ''] || categoryColorMap.default;

  return {
    id: courseDTO.id || '',
    image:
      courseDTO.thumbnail ||
      'https://cdn.builder.io/api/v1/image/assets/TEMP/dfb32da73c8310560baa7041ffee9d62e89ca8f3',
    category: courseDTO.category || 'Development',
    title: courseDTO.name,
    rating: parseFloat((3.5 + Math.random() * 1.5).toFixed(1)),
    studentCount: Math.floor(Math.random() * 500000),
    categoryColor: categorySettings.color,
    categoryBg: categorySettings.bg,
    price: courseDTO.price || 0,
    level: levels[Math.floor(Math.random() * levels.length)],
    duration: durations[Math.floor(Math.random() * durations.length)],
    createdAt: new Date().toISOString().split('T')[0],
    description: courseDTO.description || '',
    shortDescription: courseDTO.shortDescription || '',
    teacherId: courseDTO.teacherId,
    backgroundImage: courseDTO.backgroundImage || '',
    learningObjectives: courseDTO.learningObjectives || [],
    requirements: courseDTO.requirements || [],
    targetAudience: courseDTO.targetAudience || [],
    status: courseDTO.status,
  };
};

/**
 * Fetches courses from the API and transforms them to the frontend format
 */
export const fetchCourses = async (): Promise<Course[]> => {
  try {
    const response = await axios.get(ResourcePrefix.CourseManagement);
    return response.data.map(transformCourseData);
  } catch (error) {
    console.error('Error fetching courses:', error);
    throw error;
  }
};

/**
 * Fetches a single course by ID
 */
export const fetchCourseById = async (id: string): Promise<Course | null> => {
  try {
    const response = await axios.get(`${ResourcePrefix.CourseManagement}/course/${id}`);
    return transformCourseData(response.data);
  } catch (error) {
    console.error(`Error fetching course with ID ${id}:`, error);
    return null;
  }
};

/**
 * Fetches instructor courses
 */
export const fetchInstructorCourses = async (): Promise<Course[]> => {
  try {
    const response = await axios.get(`${ResourcePrefix.CourseManagement}/instructor`);
    return response.data.map(transformCourseData);
  } catch (error) {
    console.error('Error fetching courses:', error);
    throw error;
  }
};

/**
 * Fetches teacher by ID
 */
export const fetchTeacherById = async (teacherId: string): Promise<TeacherData | null> => {
  try {
    const response = await axios.get(`/api/users/${teacherId}`);
    return {
      id: response.data.id,
      name: response.data.userName,
      image:
        response.data.imageUrl ||
        'https://cdn.builder.io/api/v1/image/assets/TEMP/8c4eab4588185e2719be34b7d85f67f055c31fea50086c21739e7582db0da9ef?placeholderIfAbsent=true&apiKey=725d9caf744a44daa4b84cac10f9b01b',
      title: `Teacher at Questify`,
      stats: {
        rating: '4.5',
        students: '1,000+',
        courses: '1',
      },
      description: 'Instructor at Questify platform',
    };
  } catch (error) {
    console.error(`Error fetching teacher with ID ${teacherId}:`, error);
    return null;
  }
};

/**
 * Fetches course with teacher data
 */
export const fetchCourseWithTeacher = async (
  id: string,
): Promise<{ course: Course | null; teacher: TeacherData | null }> => {
  try {
    const course = await fetchCourseById(id);
    if (!course) {
      return { course: null, teacher: null };
    }
    const teacher = await fetchTeacherById(course.teacherId);
    return { course, teacher };
  } catch (error) {
    console.error(`Error fetching course with teacher:`, error);
    return { course: null, teacher: null };
  }
};

/**
 * Fetches islands for a course, including their levels
 */
export const fetchIslandsForCourse = async (courseId: string): Promise<Island[]> => {
  try {
    const response = await axios.get(`/api/course-mgmt/${courseId}/curriculum`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching islands for course ${courseId}:`, error);
    throw error;
  }
};
