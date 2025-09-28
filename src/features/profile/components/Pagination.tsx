import * as React from 'react';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from '../Profile.module.css';
import { arrowLeftPaginationIcon, arrowRightPaginationIcon } from '@/assets/icons';

interface PaginationProps {
  totalPages?: number;
  initialPage?: number;
  onPageChange?: (page: number) => void;
}

function Pagination({ totalPages = 10, initialPage = 1, onPageChange }: PaginationProps) {
  const [currentPage, setCurrentPage] = useState(initialPage);

  // Update internal state when initialPage prop changes
  useEffect(() => {
    setCurrentPage(initialPage);
  }, [initialPage]);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      if (onPageChange) {
        onPageChange(newPage);
      }
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      if (onPageChange) {
        onPageChange(newPage);
      }
    }
  };

  // Format the page number to always have 2 digits
  const formattedPageNumber = currentPage.toString().padStart(2, '0');

  return (
    <nav className={styles.pagination} aria-label="Pagination">
      <button
        className={styles.arrowLeft}
        onClick={handlePrevPage}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        <Image src={arrowLeftPaginationIcon} alt="Previous" height={48} width={48} />
      </button>

      <span className={styles.pageNumberPagination} aria-current="page">
        {formattedPageNumber}
      </span>

      <button
        className={styles.arrowRight}
        onClick={handleNextPage}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        <Image src={arrowRightPaginationIcon} alt="Next" height={48} width={48} />
      </button>
    </nav>
  );
}

export default Pagination;
