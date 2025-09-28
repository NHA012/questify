import React, { useState, useEffect } from 'react';
import styles from './Profile.module.css';
import ProfileHeader from './components/ProfileHeader';
import ContentTabs from './components/ContentTabs';
import Course from './courses/Course';
import Setting from './setting/Setting';
import Pagination from './components/Pagination';
import { CourseData, CoursesResponse } from '@/types/profile.type';

interface ProfileProps {
  username: string;
  title: string;
  email: string;
  photoUrl: string;
  userId: string;
  onUserUpdate: () => void;
}

const Profile: React.FC<ProfileProps> = ({
  username,
  title,
  email,
  photoUrl,
  userId,
  onUserUpdate,
}) => {
  const [activeTab, setActiveTab] = useState('courses');
  const [courses, setCourses] = useState<CourseData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const pageSize = 8;

  // Fetch courses when component mounts or page changes
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/course-learning/progress/courses?page=${currentPage}&pageSize=${pageSize}`,
        );
        console.log('Response:', response);

        if (!response.ok) {
          throw new Error(`Error fetching courses: ${response.status}`);
        }

        const data: CoursesResponse = await response.json();
        setCourses(data.courses);

        // Calculate total pages from total items and page size
        const total = Math.ceil(data.total / pageSize);
        setTotalPages(total > 0 ? total : 1);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while fetching courses');
        console.error('Failed to fetch courses:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [currentPage]);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const tabs = [
    { id: 'courses', label: 'Courses' },
    // { id: 'rewards', label: 'Rewards' },
    { id: 'edit_profile', label: 'Edit Profile' },
  ];

  // Transform API data to match the Course component's expected format
  const formattedCourses = courses.map((course) => ({
    id: course.id,
    title: course.name,
    category: course.userCourseStatus.toUpperCase().replace('_', ' '),
    imageUrl: course.thumbnail,
    progress: course.completionRate,
    description: course.description,
    totalLevels: course.totalLevels,
    completedLevels: course.completedLevels,
  }));

  return (
    <main className="relative min-h-screen font-['Inter'] mt-20">
      <div className={styles.headerBackground} />
      <section className={styles.section}>
        <ProfileHeader
          username={username}
          email={email}
          title={title}
          coursesCount={courses.length}
          photoUrl={photoUrl}
          onEditProfile={() => setActiveTab('edit_profile')}
          settingPage={activeTab === 'edit_profile'}
        />

        <div className={styles.lineDivider} />

        <div className={styles.contentSection}>
          <div className={styles.mainContent}>
            <ContentTabs tabs={tabs} defaultActiveTab={activeTab} onTabChange={setActiveTab} />

            {activeTab === 'courses' && (
              <>
                {loading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                ) : error ? (
                  <div className="text-red-500 text-center py-8">
                    {error}
                    <button
                      className="ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                      onClick={() => handlePageChange(currentPage)}
                    >
                      Try Again
                    </button>
                  </div>
                ) : courses.length === 0 ? (
                  <div className="text-center py-16">
                    <p className="text-gray-500 text-lg">No courses found.</p>
                  </div>
                ) : (
                  <Course courses={formattedCourses} />
                )}
              </>
            )}

            {activeTab === 'edit_profile' && (
              <Setting
                username={username}
                photoUrl={photoUrl}
                userId={userId}
                onUserUpdate={onUserUpdate}
              />
            )}

            {activeTab !== 'edit_profile' && courses.length > 0 && (
              <div className="flex justify-center mt-8">
                <Pagination
                  totalPages={totalPages}
                  initialPage={currentPage}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Profile;
