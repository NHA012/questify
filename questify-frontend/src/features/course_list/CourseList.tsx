'use client';
import React, { useState, useEffect, useMemo } from 'react';
import styles from './CourseList.module.css';
import SearchControls from './components/SearchControls';
import CourseCard from './components/CourseCard';
import Pagination from './components/Pagination';

import { useCourseData, Course } from './CourseData';
// import { all } from 'axios';

const CourseList: React.FC = () => {
  // State for filters, search, and sort
  const { courses: allCourses } = useCourseData();
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('Trending');
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

  // Current page for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 8;

  useEffect(() => {
    if (allCourses && allCourses.length > 0) {
      setFilteredCourses(allCourses);
    }
  }, [allCourses]);

  // Calculate filter counts from course data
  const filterCounts = useMemo(() => {
    // Count for each category
    const categoryCounts: Record<string, number> = {};
    // Count for each level
    const levelCounts: Record<string, number> = {};
    // Count for each duration
    const durationCounts: Record<string, number> = {};
    // Count for free and paid courses
    let freeCourseCount = 0;
    let paidCourseCount = 0;
    // Count for each rating filter
    const ratingCounts: Record<number, number> = {};

    // Initialize the rating counts
    [4.5, 4, 3.5, 3, 2.5].forEach((rating) => {
      ratingCounts[rating] = 0;
    });

    // Calculate the counts
    allCourses.forEach((course) => {
      // Category counts
      categoryCounts[course.category] = (categoryCounts[course.category] || 0) + 1;

      // Level counts
      levelCounts[course.level] = (levelCounts[course.level] || 0) + 1;

      // Duration counts
      durationCounts[course.duration] = (durationCounts[course.duration] || 0) + 1;

      // Price counts
      if (course.price === 0) {
        freeCourseCount++;
      } else {
        paidCourseCount++;
      }

      // Rating counts (courses that are >= rating value)
      [4.5, 4, 3.5, 3, 2.5].forEach((rating) => {
        if (course.rating >= rating) {
          ratingCounts[rating] = (ratingCounts[rating] || 0) + 1;
        }
      });
    });

    return {
      categoryCounts,
      levelCounts,
      durationCounts,
      priceCounts: {
        free: freeCourseCount,
        paid: paidCourseCount,
      },
      ratingCounts,
    };
  }, [allCourses]);

  // Apply filters, search, and sort when dependencies change
  useEffect(() => {
    if (!allCourses || allCourses.length === 0) return;
    let result = [...allCourses];

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
      result = result.filter((course) => course.title.toLowerCase().includes(searchLower));
    }

    // Apply sort
    switch (sortOption) {
      case 'Price: Low to High':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'Price: High to Low':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'Highest Rated':
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        // Default sort (Trending)
        break;
    }

    setFilteredCourses(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [filters, searchTerm, sortOption, allCourses]);

  // Get current page courses
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Handle filter changes
  const handleFilterChange = (newFilters: object) => {
    setFilters({
      ...filters,
      ...newFilters,
    });
  };

  // Handle search term changes
  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
  };

  // Handle sort option changes
  const handleSortChange = (option: string) => {
    setSortOption(option);
  };

  return (
    <div className="app-container">
      <main className={styles.container}>
        <section className={styles.wrapper}>
          <div className={styles.contentLayout}>
            <div className={styles.mainContent}>
              <SearchControls
                onSearchChange={handleSearchChange}
                onSortChange={handleSortChange}
                onFilterChange={handleFilterChange}
                searchTerm={searchTerm}
                sortOption={sortOption}
                totalCourses={filteredCourses.length}
                filterCounts={filterCounts}
              />

              <section className={styles.courseGrid}>
                {currentCourses.length > 0 ? (
                  currentCourses.map((course) => (
                    <CourseCard
                      key={course.id}
                      image={course.image}
                      category={course.category}
                      title={course.title}
                      rating={course.rating}
                      studentCount={course.studentCount}
                      categoryColor={course.categoryColor}
                      categoryBg={course.categoryBg}
                      price={course.price}
                      courseId={course.id}
                    />
                  ))
                ) : (
                  <div className={styles.noResults}>
                    <p>
                      No courses match your criteria. Try adjusting your filters or search term.
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
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default CourseList;
