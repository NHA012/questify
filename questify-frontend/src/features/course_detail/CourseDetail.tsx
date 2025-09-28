import React, { useState, useEffect } from 'react';
import styles from './CourseDetail.module.css';
import CourseHeader from './components/CourseHeader';
import CourseVideo from './components/CourseVideo';
import CourseTabs from './components/CourseTabs';
import CourseDescription from './components/CourseDescription';
import LearningObjectives from './components/LearningObjectives';
import TargetAudience from './components/TargetAudience';
import CourseRequirements from './components/CourseRequirements';
import Curriculum from './components/Curriculum';
import Instructors from './components/Instructors';
import CourseRating from './components/CourseRating';
import StudentsFeedback from './components/StudentsFeedback';
import CourseSidebar from './components/CourseSidebar';
import { courseDetailImage } from '@/assets/images';
import {
  fetchCourseWithTeacher,
  TeacherData,
  Course,
  fetchIslandsForCourse,
  Island,
} from '@/services/courseService';
import {
  fetchCourseReviews,
  calculateRatingStats,
  ReviewWithStudent,
} from '@/services/reviewService';

interface CourseDetailProps {
  courseId: string;
}

const CourseDetail: React.FC<CourseDetailProps> = ({ courseId }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [course, setCourse] = useState<Course | null>(null);
  const [teacher, setTeacher] = useState<TeacherData | null>(null);
  const [islands, setIslands] = useState<Island[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<ReviewWithStudent[]>([]);
  const [ratingStats, setRatingStats] = useState<{
    overallRating: number;
    ratingData: Array<{ stars: number; percentage: number }>;
  }>({
    overallRating: 0,
    ratingData: [
      { stars: 5, percentage: 0 },
      { stars: 4, percentage: 0 },
      { stars: 3, percentage: 0 },
      { stars: 2, percentage: 0 },
      { stars: 1, percentage: 0 },
    ],
  });
  const [reviewCount, setReviewCount] = useState(0);

  useEffect(() => {
    const loadCourseData = async () => {
      try {
        // Load course and teacher data
        const { course: courseData, teacher: teacherData } = await fetchCourseWithTeacher(courseId);
        setCourse(courseData);
        setTeacher(teacherData);

        // Load islands for the course
        if (courseData) {
          const islandsData = await fetchIslandsForCourse(courseData.id);
          setIslands(islandsData);
        }

        // Load reviews and calculate rating stats
        const reviewsData = await fetchCourseReviews(courseId);
        setReviews(reviewsData);
        setReviewCount(reviewsData.length); // Set the actual review count
        const stats = calculateRatingStats(reviewsData);
        setRatingStats(stats);
      } catch (error) {
        console.error('Error loading course data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      loadCourseData();
    }
  }, [courseId]);

  if (loading) {
    return <div>Loading course...</div>;
  }

  if (!course) {
    return <div>Course not found</div>;
  }

  const breadcrumbItems = ['Home', course.category || ''];
  const title = course.title;
  const subtitle = course.shortDescription;
  const rating = ratingStats.overallRating; // Use calculated rating
  const videoSrc = course.image || courseDetailImage.trailerImage;
  const descriptionContent = course.description;
  const learningPoints = course.learningObjectives || [
    'Learning Objectives 1',
    'Learning Objectives 2',
    'Learning Objectives 3',
    'Learning Objectives 4',
    'Learning Objectives 5',
    'Learning Objectives 6',
  ];
  const targetAudience = course.targetAudience || [
    'Target Audience 1',
    'Target Audience 2',
    'Target Audience 3',
    'Target Audience 4',
  ];
  const requirements = course.requirements || [
    'Course Requirements 1',
    'Course Requirements 2',
    'Course Requirements 3',
    'Course Requirements 4',
  ];
  const creators = [
    { name: teacher?.name || 'Unknown', avatar: teacher?.image || courseDetailImage.author1Image },
  ];
  const instructors = [
    {
      image: teacher?.image || courseDetailImage.author1Image,
      name: teacher?.name || 'Unknown',
      title: teacher?.title || 'Instructor',
      stats: teacher?.stats || { rating: '4.5', students: '1,000', courses: '1' },
      description: teacher?.description || 'Instructor at Questify platform',
    },
  ];

  const getRandomType = () => {
    const possibleTypes = ['video', 'quiz', 'text'];
    return possibleTypes[Math.floor(Math.random() * possibleTypes.length)];
  };

  const curriculumData = {
    title: 'Course Curriculum',
    stats: [
      { type: 'sections', text: `${islands.length} sections` },
      {
        type: 'lectures',
        text: `${islands.reduce((total, island) => total + (island.Levels?.length || 0), 0)} lectures`,
      },
      { type: 'duration', text: '10h 30m' },
    ],
    sections: islands.map((island) => ({
      id: island.id,
      title: island.name || 'Section Title',
      stats: [
        { type: 'lectures', text: `${island.Levels?.length || 0} lectures` },
        { type: 'duration', text: '1h 20m' },
      ],
      levels:
        island.Levels?.map((level) => ({
          id: level.id,
          title: level.name,
          duration: '10:30',
          isPreview: false,
          type: getRandomType(),
        })) || [],
    })),
  };

  // Handle review update
  const handleReviewsUpdate = async () => {
    try {
      // Reload reviews and recalculate stats
      const updatedReviews = await fetchCourseReviews(courseId);
      setReviews(updatedReviews);
      setReviewCount(updatedReviews.length); // Update review count
      const stats = calculateRatingStats(updatedReviews);
      setRatingStats(stats);
    } catch (error) {
      console.error('Error updating reviews:', error);
    }
  };

  return (
    <div className="app-container">
      <div className={styles.courseDetail}>
        <div className={styles.mainContent}>
          {activeTab === 0 && (
            <>
              <CourseHeader
                breadcrumbItems={breadcrumbItems}
                title={title}
                subtitle={subtitle}
                creators={creators}
                rating={rating}
                ratingCount={reviewCount} // Use the actual review count instead of student count
              />
              <CourseVideo backgroundImageSrc={videoSrc} />
              <CourseTabs activeTab={activeTab} setActiveTab={setActiveTab} />
              <CourseDescription title="Description" content={descriptionContent} />
              <LearningObjectives learningPoints={learningPoints} />
              <TargetAudience targetAudience={targetAudience} />
              <CourseRequirements requirements={requirements} />
              <Curriculum curriculumData={curriculumData} />
              <Instructors instructors={instructors} />
              <CourseRating
                courseId={courseId}
                overallRating={ratingStats.overallRating}
                ratingData={ratingStats.ratingData}
              />
              <StudentsFeedback
                courseId={courseId}
                initialReviews={reviews}
                onReviewsChange={handleReviewsUpdate} // Add handler for review changes
              />
            </>
          )}

          {activeTab === 1 && (
            <>
              <CourseHeader
                breadcrumbItems={breadcrumbItems}
                title={title}
                subtitle={subtitle}
                creators={creators}
                rating={rating}
                ratingCount={reviewCount} // Use the actual review count
              />
              <CourseVideo backgroundImageSrc={videoSrc} />
              <CourseTabs activeTab={activeTab} setActiveTab={setActiveTab} />
              <Curriculum curriculumData={curriculumData} />
            </>
          )}

          {activeTab === 2 && (
            <>
              <CourseHeader
                breadcrumbItems={breadcrumbItems}
                title={title}
                subtitle={subtitle}
                creators={creators}
                rating={rating}
                ratingCount={reviewCount} // Use the actual review count
              />
              <CourseVideo backgroundImageSrc={videoSrc} />
              <CourseTabs activeTab={activeTab} setActiveTab={setActiveTab} />
              <Instructors instructors={instructors} />
            </>
          )}

          {activeTab === 3 && (
            <>
              <CourseHeader
                breadcrumbItems={breadcrumbItems}
                title={title}
                subtitle={subtitle}
                creators={creators}
                rating={rating}
                ratingCount={reviewCount} // Use the actual review count
              />
              <CourseVideo backgroundImageSrc={videoSrc} />
              <CourseTabs activeTab={activeTab} setActiveTab={setActiveTab} />
              <CourseRating
                courseId={courseId}
                overallRating={ratingStats.overallRating}
                ratingData={ratingStats.ratingData}
              />
              <StudentsFeedback
                courseId={courseId}
                initialReviews={reviews}
                onReviewsChange={handleReviewsUpdate} // Add handler for review changes
              />
            </>
          )}
        </div>
        <CourseSidebar course={course} />
      </div>
    </div>
  );
};

export default CourseDetail;
