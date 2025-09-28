'use client';
import React, { useState, useEffect, useRef } from 'react';
import styles from './SearchControls.module.css';
import FilterSideBar from './FilterSideBar';

interface FilterCountsType {
  categoryCounts: Record<string, number>;
  levelCounts: Record<string, number>;
  durationCounts: Record<string, number>;
  priceCounts: {
    free: number;
    paid: number;
  };
  ratingCounts: Record<number, number>;
}

interface SearchControlsProps {
  onSearchChange: (term: string) => void;
  onSortChange: (option: string) => void;
  onFilterChange: (filters: object) => void;
  searchTerm: string;
  sortOption: string;
  totalCourses: number;
  filterCounts: FilterCountsType;
}

// Filter Section Component
const FilterSection: React.FC<{
  onSearchChange: (term: string) => void;
  searchTerm: string;
  onFilterChange: (filters: object) => void;
  filterCounts: FilterCountsType;
}> = ({ onSearchChange, searchTerm, onFilterChange, filterCounts }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  const filterRef = useRef<HTMLDivElement>(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  };

  const handleClearSearch = () => {
    onSearchChange('');
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleFilterChange = (filters: {
    categories: { [key: string]: boolean };
    rating: number;
    levels: { [key: string]: boolean };
    price: { type: 'free' | 'paid' | null; min: number; max: number };
    durations: { [key: string]: boolean };
    activeCount: number;
  }) => {
    // Pass the full filters object to parent component
    onFilterChange(filters);
    setActiveFiltersCount(filters.activeCount);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setShowFilters(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={styles.filterControls} ref={filterRef}>
      <button
        className={`${styles.filterButton} ${showFilters ? styles.active : ''}`}
        onClick={toggleFilters}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 11.25L12 20.25"
            stroke="#1D2026"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 3.75L12 8.25"
            stroke="#1D2026"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M18.75 18.75L18.7501 20.25"
            stroke="#1D2026"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M18.7501 3.75L18.75 15.75"
            stroke="#1D2026"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M21 15.75H16.5"
            stroke="#1D2026"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M5.25007 15.75L5.25 20.25"
            stroke="#1D2026"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M5.25 3.75L5.25007 12.75"
            stroke="#1D2026"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M3 12.75H7.5"
            stroke="#1D2026"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M14.25 8.25H9.75"
            stroke="#1D2026"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className={styles.filterText}>Filter</span>
        {activeFiltersCount > 0 && <span className={styles.filterCount}>{activeFiltersCount}</span>}
      </button>

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

      {showFilters && (
        <div className={styles.filterDropdown}>
          <FilterSideBar onFilterChange={handleFilterChange} filterCounts={filterCounts} />
        </div>
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

  // Sort options - focus on the ones we need to implement
  const sortOptions = ['Trending', 'Price: Low to High', 'Price: High to Low', 'Highest Rated'];

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

export const SearchControls: React.FC<SearchControlsProps> = ({
  onSearchChange,
  onSortChange,
  onFilterChange,
  searchTerm,
  sortOption,
  filterCounts,
}) => {
  const handleFilterChange = (filters: object) => {
    // This passes all the filters (categories, levels, price, duration, rating) to CourseList
    const { ...actualFilters } = filters;
    onFilterChange(actualFilters);
  };

  return (
    <section className={styles.topActions}>
      <div className={styles.action}>
        <FilterSection
          onSearchChange={onSearchChange}
          searchTerm={searchTerm}
          onFilterChange={handleFilterChange}
          filterCounts={filterCounts}
        />
        <SortSection onSortChange={onSortChange} sortOption={sortOption} />
      </div>
    </section>
  );
};

export default SearchControls;
