'use client';
import React from 'react';
import styles from './Pagination.module.css';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  // Handle next and previous page navigation
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  // Create page number buttons
  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    // Function to add a single page button
    const addPageButton = (pageNum: number) => {
      const isActive = pageNum === currentPage;
      return (
        <button
          key={pageNum}
          className={`${styles.pageNumber} ${isActive ? styles.active : ''}`}
          onClick={() => onPageChange(pageNum)}
          disabled={isActive}
          aria-current={isActive ? 'page' : undefined}
        >
          {pageNum.toString().padStart(2, '0')}
        </button>
      );
    };

    // Logic for handling different number of pages
    if (totalPages <= maxVisiblePages) {
      // Show all pages if there are 5 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(addPageButton(i));
      }
    } else {
      // Always show first page
      pageNumbers.push(addPageButton(1));

      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      // Adjust if we're near the beginning
      if (currentPage <= 3) {
        endPage = 4;
      }

      // Adjust if we're near the end
      if (currentPage >= totalPages - 2) {
        startPage = totalPages - 3;
      }

      // Add ellipsis if needed
      if (startPage > 2) {
        pageNumbers.push(
          <span key="ellipsis-start" className={styles.ellipsis}>
            ...
          </span>,
        );
      }

      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(addPageButton(i));
      }

      // Add ellipsis if needed
      if (endPage < totalPages - 1) {
        pageNumbers.push(
          <span key="ellipsis-end" className={styles.ellipsis}>
            ...
          </span>,
        );
      }

      // Always show last page
      pageNumbers.push(addPageButton(totalPages));
    }

    return pageNumbers;
  };

  return (
    <nav className={styles.pagination} aria-label="Course pagination">
      <button
        className={`${styles.paginationArrow} ${currentPage === 1 ? styles.disabled : ''}`}
        aria-label="Previous page"
        onClick={goToPreviousPage}
        disabled={currentPage === 1}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M20.25 12H3.75"
            stroke={currentPage === 1 ? '#ccc' : '#00ADB5'}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M10.5 5.25L3.75 12L10.5 18.75"
            stroke={currentPage === 1 ? '#ccc' : '#00ADB5'}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <div className={styles.paginationNumbers}>{renderPageNumbers()}</div>

      <button
        className={`${styles.paginationArrow} ${currentPage === totalPages ? styles.disabled : styles.highlighted}`}
        aria-label="Next page"
        onClick={goToNextPage}
        disabled={currentPage === totalPages}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3.75 12H20.25"
            stroke={currentPage === totalPages ? '#ccc' : '#00ADB5'}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M13.5 5.25L20.25 12L13.5 18.75"
            stroke={currentPage === totalPages ? '#ccc' : '#00ADB5'}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </nav>
  );
};

export default Pagination;
