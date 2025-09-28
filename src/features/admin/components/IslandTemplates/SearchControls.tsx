'use client';
import React, { useState, useEffect, useRef } from 'react';
import styles from './SearchControls.module.css';

interface SearchControlsProps {
  onSearchChange: (term: string) => void;
  onSortChange: (option: string) => void;
  searchTerm: string;
  sortOption: string;
  totalTemplates: number;
  onOpenModal?: () => void;
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
        placeholder="Search island templates..."
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

  // Sort options
  const sortOptions = ['Latest', 'Oldest', 'Name: A to Z', 'Name: Z to A'];

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

// Results Count Component
const ResultsCount: React.FC<{
  searchTerm?: string;
  totalTemplates: number;
}> = ({ searchTerm, totalTemplates }) => {
  return (
    <p className={styles.resultsCount}>
      <span className={styles.resultsNumber}>{totalTemplates}</span>
      <span className={styles.resultsText}>
        {totalTemplates === 1 ? ' template' : ' templates'} found
        {searchTerm ? ` for "${searchTerm}"` : ''}
      </span>
    </p>
  );
};

interface CreateIslandTemplateButtonProps {
  onOpenModal?: () => void;
}

const CreateIslandTemplateButton: React.FC<CreateIslandTemplateButtonProps> = ({ onOpenModal }) => {
  return (
    <button className={styles.createIslandTemplateButton} onClick={onOpenModal}>
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
      <span>New Island Template</span>
    </button>
  );
};

const SearchControls: React.FC<SearchControlsProps> = ({
  onSearchChange,
  onSortChange,
  searchTerm,
  sortOption,
  totalTemplates,
  onOpenModal,
}) => {
  return (
    <section className={styles.topActions}>
      <div className={styles.action}>
        <SearchSection onSearchChange={onSearchChange} searchTerm={searchTerm} />
        <SortSection onSortChange={onSortChange} sortOption={sortOption} />
        <CreateIslandTemplateButton onOpenModal={onOpenModal} />
      </div>
      <div className={styles.secondLine}>
        <ResultsCount searchTerm={searchTerm} totalTemplates={totalTemplates} />
      </div>
    </section>
  );
};

export default SearchControls;
