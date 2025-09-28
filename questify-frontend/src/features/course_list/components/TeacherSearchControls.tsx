'use client';
import React, { useState, useEffect, useRef } from 'react';
import styles from './TeacherSearchControls.module.css';
import { useRouter } from 'next/navigation';

interface TeacherSearchControlsProps {
  onSearchChange: (term: string) => void;
  onSortChange: (option: string) => void;
  onCategoryChange?: (category: string) => void;
  searchTerm: string;
  sortOption: string;
  selectedCategory?: string;
  totalCourses: number;
}

// Search Section Component
const SearchSection: React.FC<{
  onSearchChange: (term: string) => void;
  searchTerm: string;
}> = ({ onSearchChange, searchTerm }) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  };

  const handleClearSearch = () => {
    onSearchChange('');
  };

  return (
    <div className={styles.searchBox}>
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M10.875 18.75C15.2242 18.75 18.75 15.2242 18.75 10.875C18.75 6.52576 15.2242 3 10.875 3C6.52576 3 3 6.52576 3 10.875C3 15.2242 6.52576 18.75 10.875 18.75Z"
          stroke="#1D2026"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M16.4414 16.4434L20.9977 20.9997"
          stroke="#1D2026"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <input
        type="text"
        className={styles.searchInput}
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder="Search courses..."
      />
      {searchTerm && (
        <button
          className={styles.clearSearch}
          onClick={handleClearSearch}
          aria-label="Clear search"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 4L4 12"
              stroke="#8C94A3"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M4 4L12 12"
              stroke="#8C94A3"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

// Sort Section Component
const SortSection: React.FC<{
  onSortChange: (option: string) => void;
  sortOption: string;
}> = ({ onSortChange, sortOption }) => {
  const [isOpen, setIsOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  // Updated sort options to match TeacherCourses.tsx
  const sortOptions = [
    'Latest',
    'Title: A to Z',
    'Title: Z to A',
    'Price: Low to High',
    'Price: High to Low',
    'Students: Most to Least',
    'Rating: Highest First',
  ];

  // Toggle dropdown
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Handle sort option selection
  const handleSortSelection = (option: string) => {
    onSortChange(option);
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={styles.sortControls} ref={sortRef}>
      <span className={styles.sortLabel}>Sort by:</span>
      <div className={styles.sortWrapper}>
        <button
          className={`${styles.sortButton} ${isOpen ? styles.active : ''}`}
          onClick={toggleDropdown}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        >
          <span>{sortOption}</span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0)' }}
          >
            <path
              d="M13 6L8 11L3 6"
              stroke="#1D2026"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {isOpen && (
          <div className={styles.sortDropdown} role="listbox">
            {sortOptions.map((option) => (
              <button
                key={option}
                className={`${styles.sortOption} ${sortOption === option ? styles.selected : ''}`}
                onClick={() => handleSortSelection(option)}
                role="option"
                aria-selected={sortOption === option}
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Category Dropdown Component
const CategorySection: React.FC<{
  onCategoryChange: (category: string) => void;
  selectedCategory: string;
}> = ({ onCategoryChange, selectedCategory }) => {
  const [isOpen, setIsOpen] = useState(false);
  const categoryRef = useRef<HTMLDivElement>(null);

  // All available categories
  const categories = [
    'All Categories',
    'Business',
    'Design',
    'Development',
    'Finance & Accounting',
    'Health & Fitness',
    'IT & Software',
    'Lifestyle',
    'Marketing',
    'Music',
    'Office Productivity',
    'Personal Development',
    'Photography & Video',
  ];

  // Toggle dropdown
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Handle category selection
  const handleCategorySelection = (category: string) => {
    onCategoryChange(category);
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={styles.categoryControls} ref={categoryRef}>
      <span className={styles.categoryLabel}>Category:</span>
      <div className={styles.categoryWrapper}>
        <button
          className={`${styles.categoryButton} ${isOpen ? styles.active : ''}`}
          onClick={toggleDropdown}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        >
          <span>{selectedCategory}</span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0)' }}
          >
            <path
              d="M13 6L8 11L3 6"
              stroke="#1D2026"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {isOpen && (
          <div className={styles.categoryDropdown} role="listbox">
            {categories.map((category) => (
              <button
                key={category}
                className={`${styles.categoryOption} ${selectedCategory === category ? styles.selected : ''}`}
                onClick={() => handleCategorySelection(category)}
                role="option"
                aria-selected={selectedCategory === category}
              >
                {category}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Results Count Component
const ResultsCount: React.FC<{
  searchTerm?: string;
  totalCourses: number;
}> = ({ searchTerm, totalCourses }) => {
  return (
    <p className={styles.resultsfindforuiuxdesign}>
      <span className={styles.resultsNumber}>{totalCourses}</span>
      <span className={styles.resultsText}>
        {totalCourses === 1 ? ' course' : ' courses'} found
        {searchTerm ? ` for "${searchTerm}"` : ''}
      </span>
    </p>
  );
};

// Create New Course Button Component
const CreateCourseButton: React.FC = () => {
  const router = useRouter();

  const handleCreateCourse = () => {
    router.push('/instructor/course/create');
  };

  return (
    <button className={styles.createCourseButton} onClick={handleCreateCourse}>
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M10 4.16699V15.8337"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M4.16699 10H15.8337"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span>New Course</span>
    </button>
  );
};

export const TeacherSearchControls: React.FC<TeacherSearchControlsProps> = ({
  onSearchChange,
  onSortChange,
  onCategoryChange,
  searchTerm,
  sortOption,
  selectedCategory = 'All Categories',
  totalCourses,
}) => {
  return (
    <section className={styles.topActions}>
      <div className={styles.action}>
        <SearchSection onSearchChange={onSearchChange} searchTerm={searchTerm} />
        <SortSection onSortChange={onSortChange} sortOption={sortOption} />
        <CategorySection
          onCategoryChange={onCategoryChange || (() => {})}
          selectedCategory={selectedCategory}
        />
        <CreateCourseButton />
      </div>
      <div className={styles.filter2ndLne}>
        <ResultsCount searchTerm={searchTerm} totalCourses={totalCourses} />
      </div>
    </section>
  );
};

export default TeacherSearchControls;
