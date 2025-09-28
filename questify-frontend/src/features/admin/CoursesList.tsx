'use client';
import React, { useState, useEffect, useMemo } from 'react';
import styles from './CoursesList.module.css';
import SearchControls from './components/Courses/SearchControls';
import CourseCard from './components/Courses/CourseCard';
import Pagination from './components/Pagination';
import SidebarNavigation from './components/SidebarNavigation';
import { useRouter } from 'next/navigation';
// import { courseData /*, Course */ } from './CourseData';
import { getAllCourses, updateCourseStatus } from '@/services/admin.srv';
import { CourseStatus } from '@datn242/questify-common';
import { User } from './UserData';

type FilterUpdate = Partial<{
  categories: Record<string, boolean>;
  rating: number;
  levels: Record<string, boolean>;
  price: {
    type?: 'free' | 'paid' | null;
    min?: number;
    max?: number;
  };
  durations: Record<string, boolean>;
}>;

export interface Course {
  id: string;
  thumbnail: string;
  category: string;
  name: string;
  rating: number;
  studentCount: number;
  categoryColor: string;
  categoryBg: string;
  price: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  duration: string;
  createdAt: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  teacherId: string; // Reference to User.id (UUID)
  teacher?: User; // For eager loading
}

const CourseList: React.FC = () => {
  const router = useRouter();

  // State for filters, search, and sort
  // const [filteredCourses, setFilteredCourses] = useState<Course[]>(courseData);
  // const [courses, setCourses] = useState<Course[]>(courseData);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('Latest');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [filters, setFilters] = useState({
    categories: {} as Record<string, boolean>,
    rating: 0,
    levels: {} as Record<string, boolean>,
    price: {
      type: null as 'free' | 'paid' | null,
      min: 0,
      max: 200,
    },
    durations: {} as Record<string, boolean>,
  });
  const [loading, setLoading] = useState(true);

  // Current page for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 8;

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await getAllCourses();
        console.log('response', response);

        // Ensure we have the expected data structure with required fields
        if (response) {
          setCourses(response);
        } else {
          console.error('Invalid users data received:', response);
        }
      } catch (err) {
        console.error('Failed to fetch users:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Calculate filter counts
  const filterCounts = useMemo(() => {
    // Status counts
    const statusCounts = {
      pending: courses.filter((course) => course.status === 'pending').length,
      approved: courses.filter((course) => course.status === 'approved').length,
      rejected: courses.filter((course) => course.status === 'rejected').length,
    };

    // Category counts
    const categoryCounts: Record<string, number> = {};
    courses.forEach((course) => {
      categoryCounts[course.category] = (categoryCounts[course.category] || 0) + 1;
    });

    // Level counts
    const levelCounts: Record<string, number> = {};
    courses.forEach((course) => {
      levelCounts[course.level] = (levelCounts[course.level] || 0) + 1;
    });

    // Duration counts
    const durationCounts: Record<string, number> = {};
    courses.forEach((course) => {
      durationCounts[course.duration] = (durationCounts[course.duration] || 0) + 1;
    });

    // Price counts
    const freeCourseCount = courses.filter((course) => course.price === 0).length;
    const paidCourseCount = courses.filter((course) => course.price > 0).length;

    // Rating counts
    const ratingCounts: Record<number, number> = {};
    [4.5, 4, 3.5, 3, 2.5].forEach((rating) => {
      ratingCounts[rating] = courses.filter((course) => course.rating >= rating).length;
    });

    return {
      statusCounts,
      categoryCounts,
      levelCounts,
      durationCounts,
      priceCounts: {
        free: freeCourseCount,
        paid: paidCourseCount,
      },
      ratingCounts,
    };
  }, [courses]);

  // Apply filters, search, and sort when dependencies change
  useEffect(() => {
    let result = [...courses];

    // Apply status filter
    if (selectedStatus !== 'all') {
      result = result.filter((course) => course.status === selectedStatus);
    }

    // Apply category filter
    const activeCategories = Object.entries(filters.categories)
      .filter(([_, isActive]) => isActive)
      .map(([category]) => category);

    if (activeCategories.length > 0) {
      result = result.filter((course) => activeCategories.includes(course.category));
    }

    // Apply rating filter
    if (filters.rating > 0) {
      result = result.filter((course) => course.rating >= filters.rating);
    }

    // Apply level filter
    const activeLevels = Object.entries(filters.levels)
      .filter(([_, isActive]) => isActive)
      .map(([level]) => level);

    if (activeLevels.length > 0) {
      result = result.filter((course) => activeLevels.includes(course.level));
    }

    // Apply price filter
    if (filters.price.type === 'free') {
      result = result.filter((course) => course.price === 0);
    } else if (filters.price.type === 'paid') {
      result = result.filter(
        (course) =>
          course.price > 0 &&
          course.price >= filters.price.min &&
          course.price <= filters.price.max,
      );
    }

    // Apply duration filter
    const activeDurations = Object.entries(filters.durations)
      .filter(([_, isActive]) => isActive)
      .map(([duration]) => duration);

    if (activeDurations.length > 0) {
      result = result.filter((course) => activeDurations.includes(course.duration));
    }

    // Apply search
    if (searchTerm.trim() !== '') {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter((course) => course.name.toLowerCase().includes(searchLower));
    }

    // Apply sort
    switch (sortOption) {
      case 'Oldest':
        result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'Title: A to Z':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'Title: Z to A':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'Price: Low to High':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'Price: High to Low':
        result.sort((a, b) => b.price - a.price);
        break;
      default:
        // Default sort (Latest)
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }

    setFilteredCourses(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, sortOption, selectedStatus, filters, courses]);

  // Get current page courses
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Handler functions
  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
  };

  const handleSortChange = (option: string) => {
    setSortOption(option);
  };

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
  };

  const handleFilterChange = (newFilters: FilterUpdate) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...newFilters,
      price: newFilters.price ? { ...prevFilters.price, ...newFilters.price } : prevFilters.price,
    }));
  };

  // Handle course approval
  const handleApproveCourse = async (courseId: string) => {
    await updateCourseStatus(courseId, CourseStatus.Approved);
    setCourses(
      courses.map((course) =>
        course.id === courseId ? { ...course, status: 'approved' } : course,
      ),
    );
  };

  // Handle course rejection
  const handleRejectCourse = async (courseId: string) => {
    await updateCourseStatus(courseId, CourseStatus.Rejected);
    setCourses(
      courses.map((course) =>
        course.id === courseId ? { ...course, status: 'rejected' } : course,
      ),
    );
  };

  // Handle view course details
  const handleViewCourse = (courseId: string) => {
    router.push(`/course/${courseId}`);
  };

  return (
    <div className="app-container">
      <div className={styles.pageLayout}>
        <SidebarNavigation activeItem="courses" />
        <main className={styles.container}>
          <section className={styles.wrapper}>
            <div className={styles.contentLayout}>
              <div className={styles.mainContent}>
                <SearchControls
                  onSearchChange={handleSearchChange}
                  onSortChange={handleSortChange}
                  onStatusChange={handleStatusChange}
                  onFilterChange={handleFilterChange}
                  searchTerm={searchTerm}
                  sortOption={sortOption}
                  selectedStatus={selectedStatus}
                  totalCourses={filteredCourses.length}
                  filterCounts={filterCounts}
                />

                {loading ? (
                  <div className={styles.loadingContainer}>
                    <p>Loading courses...</p>
                  </div>
                ) : (
                  <>
                    <section className={styles.courseGrid}>
                      {currentCourses.length > 0 ? (
                        currentCourses.map((course) => (
                          <CourseCard
                            key={course.id}
                            image={
                              course.thumbnail ||
                              'https://cdn.builder.io/api/v1/image/assets/TEMP/dfb32da73c8310560baa7041ffee9d62e89ca8f3'
                            }
                            title={course.name}
                            price={course.price}
                            status={course.status}
                            teacherName={course.teacher?.userName || 'Unknown Teacher'}
                            submittedAt={new Date(course.createdAt).toLocaleDateString('en-US', {
                              timeZone: 'UTC',
                            })}
                            onPreview={() => handleViewCourse(course.id)}
                            onApprove={
                              course.status === 'pending'
                                ? () => handleApproveCourse(course.id)
                                : undefined
                            }
                            onReject={
                              course.status === 'pending'
                                ? () => handleRejectCourse(course.id)
                                : undefined
                            }
                          />
                        ))
                      ) : (
                        <div className={styles.noResults}>
                          <p>
                            No courses match your criteria. Try adjusting your filters or search
                            term.
                          </p>
                        </div>
                      )}
                    </section>

                    {filteredCourses.length > coursesPerPage && (
                      <Pagination
                        currentPage={currentPage}
                        totalPages={Math.ceil(filteredCourses.length / coursesPerPage)}
                        onPageChange={paginate}
                      />
                    )}
                  </>
                )}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default CourseList;
