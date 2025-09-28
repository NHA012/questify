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
  onStatusChange: (status: string) => void;
  onFilterChange: (filters: object) => void;
  searchTerm: string;
  sortOption: string;
  selectedStatus: string;
  totalCourses: number;
  filterCounts: FilterCountsType;
}

// Filter Section Component
const FilterSection: React.FC<{
  onFilterChange: (filters: object) => void;
  filterCounts: FilterCountsType;
}> = ({ onFilterChange, filterCounts }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  const filterRef = useRef<HTMLDivElement>(null);

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleFilterChange = (filters: {
    categories: { [key: string]: boolean };
    activeCount: number;
  }) => {
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

      {showFilters && (
        <div className={styles.filterDropdown}>
          <FilterSideBar onFilterChange={handleFilterChange} filterCounts={filterCounts} />
        </div>
      )}
    </div>
  );
};

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

  // Admin-specific sort options including status
  const sortOptions = [
    'Latest',
    'Oldest',
    'Title: A to Z',
    'Title: Z to A',
    'Price: Low to High',
    'Price: High to Low',
    'Status: Pending',
    'Status: Approved',
    'Status: Rejected',
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
                className={`${styles.sortOption} ${sortOption === option ? styles.selected : ''} ${
                  option.includes('Status:') ? styles.statusOption : ''
                }`}
                onClick={() => handleSortSelection(option)}
                role="option"
                aria-selected={sortOption === option}
              >
                {option}
                {option.includes('Status:') && (
                  <span
                    className={styles.statusIndicator}
                    data-status={
                      option.includes('Pending')
                        ? 'pending'
                        : option.includes('Approved')
                          ? 'approved'
                          : 'rejected'
                    }
                  ></span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Status Filter Component
const StatusFilter: React.FC<{
  onStatusChange: (status: string) => void;
  selectedStatus: string;
}> = ({ onStatusChange, selectedStatus }) => {
  const [isOpen, setIsOpen] = useState(false);
  const statusRef = useRef<HTMLDivElement>(null);

  // Status options
  const statusOptions = [
    { id: 'all', label: 'All' },
    { id: 'pending', label: 'Pending' },
    { id: 'approved', label: 'Approved' },
    { id: 'rejected', label: 'Rejected' },
  ];

  // Toggle dropdown
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Handle status selection
  const handleStatusSelection = (status: string) => {
    onStatusChange(status);
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (statusRef.current && !statusRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getDisplayStatus = () => {
    const status = statusOptions.find((s) => s.id === selectedStatus);
    return status ? status.label : 'All';
  };

  return (
    <div className={styles.statusFilter} ref={statusRef}>
      <span className={styles.statusLabel}>Status:</span>
      <div className={styles.statusWrapper}>
        <button
          className={`${styles.statusButton} ${isOpen ? styles.active : ''}`}
          onClick={toggleDropdown}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        >
          <span>{getDisplayStatus()}</span>
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
          <div className={styles.statusDropdown} role="listbox">
            {statusOptions.map((option) => (
              <button
                key={option.id}
                className={`${styles.statusOption} ${selectedStatus === option.id ? styles.selected : ''}`}
                onClick={() => handleStatusSelection(option.id)}
                role="option"
                aria-selected={selectedStatus === option.id}
              >
                {option.label}
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

const SearchControls: React.FC<SearchControlsProps> = ({
  onSearchChange,
  onSortChange,
  onStatusChange,
  onFilterChange,
  searchTerm,
  sortOption,
  selectedStatus,
  totalCourses,
  filterCounts,
}) => {
  return (
    <section className={styles.topActions}>
      <div className={styles.action}>
        <FilterSection onFilterChange={onFilterChange} filterCounts={filterCounts} />
        <SearchSection onSearchChange={onSearchChange} searchTerm={searchTerm} />
        <SortSection onSortChange={onSortChange} sortOption={sortOption} />
        <StatusFilter onStatusChange={onStatusChange} selectedStatus={selectedStatus} />
      </div>
      <div className={styles.secondLine}>
        <ResultsCount searchTerm={searchTerm} totalCourses={totalCourses} />
      </div>
    </section>
  );
};

export default SearchControls;
