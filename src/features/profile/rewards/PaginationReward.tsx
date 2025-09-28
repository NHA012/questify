import * as React from 'react';
import { useState } from 'react';
import Image from 'next/image';
import styles from '../Profile.module.css';
import { arrowLeftIcon, arrowRightIcon } from '@/assets/icons';

interface PaginationRewardProps {
  totalPages?: number;
  initialPage?: number;
  onPageChange?: (page: number) => void;
}

function PaginationReward({
  totalPages = 10,
  initialPage = 1,
  onPageChange,
}: PaginationRewardProps) {
  const [currentPage, setCurrentPage] = useState(initialPage);

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
    <nav className={styles.paginationContainer} aria-label="Pagination">
      <button
        className={styles.arrowLeft}
        onClick={handlePrevPage}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        <Image src={arrowLeftIcon} alt="LeetClone" height={30} width={30} />
      </button>

      <span className={styles.pageNumber} aria-current="page">
        {formattedPageNumber}
      </span>

      <button
        className={styles.arrowRight}
        onClick={handleNextPage}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        <Image src={arrowRightIcon} alt="LeetClone" height={30} width={30} />
      </button>
    </nav>
  );
}

export default PaginationReward;
