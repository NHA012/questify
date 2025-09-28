import React, { useState, useEffect } from 'react';
import styles from './TeacherCourses.module.css';
import TeacherSearchControls from './components/TeacherSearchControls';
import TeacherCourseCard from './components/TeacherCourseCard';
import Pagination from './components/Pagination';
import { useRouter } from 'next/navigation';

import { useCourseInstructorData, Course } from './CourseData';

const TeacherCourses: React.FC = () => {
  const router = useRouter();
  const { courses: allCourses } = useCourseInstructorData();
  // State for search, sort, and category
  const [filteredCourses, setFilteredCourses] = useState<Course[]>();
  const [courses, setCourses] = useState<Course[]>();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('Latest');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');

  // Current page for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 8;

  useEffect(() => {
    if (allCourses && allCourses.length > 0) {
      setCourses(allCourses);
    }
  }, [allCourses]);

  // Apply search, sort, and category filter when dependencies change
  useEffect(() => {
    if (!courses || courses.length === 0) return;

    let result = [...courses];

    // Apply category filter (if not "All Categories")
    if (selectedCategory !== 'All Categories') {
      result = result.filter((course) => course.category === selectedCategory);
    }

    // Apply search
    if (searchTerm.trim() !== '') {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter((course) => course.title.toLowerCase().includes(searchLower));
    }

    // Apply sort
    switch (sortOption) {
      case 'Title: A to Z':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'Title: Z to A':
        result.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case 'Price: Low to High':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'Price: High to Low':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'Students: Most to Least':
        result.sort((a, b) => b.studentCount - a.studentCount);
        break;
      case 'Rating: Highest First':
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        // Default sort (Latest)
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }

    setFilteredCourses(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, sortOption, selectedCategory, courses]);

  // Get current page courses
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses?.slice(indexOfFirstCourse, indexOfLastCourse) || [];

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Handle search term changes
  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
  };

  // Handle sort option changes
  const handleSortChange = (option: string) => {
    setSortOption(option);
  };

  // Handle category changes
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  // Handle edit course
  const handleEditCourse = (courseId: string) => {
    router.push(`/instructor/course/edit/${courseId}`);
  };

  // Handle delete course
  const handleDeleteCourse = (courseId: string) => {
    // Show confirmation dialog
    if (window.confirm('Are you sure you want to delete this course?')) {
      // Filter out the deleted course
      const updatedCourses = courses.filter((course) => course.id !== courseId);
      setCourses(updatedCourses);
    }
  };

  return (
    <div className="app-container">
      <div className={styles.pageLayout}>
        {/* <SidebarNavigation /> */}
        <main className={styles.container}>
          <section className={styles.wrapper}>
            <div className={styles.contentLayout}>
              <div className={styles.mainContent}>
                <TeacherSearchControls
                  onSearchChange={handleSearchChange}
                  onSortChange={handleSortChange}
                  onCategoryChange={handleCategoryChange}
                  searchTerm={searchTerm}
                  sortOption={sortOption}
                  selectedCategory={selectedCategory}
                  totalCourses={filteredCourses?.length || 0}
                />

                <section className={styles.courseGrid}>
                  {currentCourses.length > 0 ? (
                    currentCourses.map((course) => (
                      <TeacherCourseCard
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
                        onEdit={() => handleEditCourse(course.id)}
                        onDelete={() => handleDeleteCourse(course.id)}
                      />
                    ))
                  ) : (
                    <div className={styles.noResults}>
                      <p>There are currently no courses.</p>
                    </div>
                  )}
                </section>

                {(filteredCourses?.length || 0) > coursesPerPage && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={Math.ceil((filteredCourses?.length || 0) / coursesPerPage)}
                    onPageChange={paginate}
                  />
                )}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default TeacherCourses;
