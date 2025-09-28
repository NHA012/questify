'use client';
import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import styles from './TeacherCourseCard.module.css';

// PencilIcon component for better maintainability
const PencilIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="flex w-[20px] h-[20px] justify-center items-center relative"
    aria-hidden="true"
  >
    <path
      d="M7.5 16.8759H3.75C3.58424 16.8759 3.42527 16.81 3.30806 16.6928C3.19085 16.5756 3.125 16.4166 3.125 16.2509V12.7598C3.125 12.6777 3.14117 12.5964 3.17258 12.5206C3.20398 12.4448 3.25002 12.3759 3.30806 12.3178L12.6831 2.94282C12.8003 2.82561 12.9592 2.75977 13.125 2.75977C13.2908 2.75977 13.4497 2.82561 13.5669 2.94282L17.0581 6.43394C17.1753 6.55115 17.2411 6.71012 17.2411 6.87588C17.2411 7.04164 17.1753 7.20061 17.0581 7.31782L7.5 16.8759Z"
      stroke="#1D2026"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10.625 5L15 9.375"
      stroke="#1D2026"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16.8743 16.8743H7.4993L3.16406 12.5391"
      stroke="#1D2026"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// TrashIcon component for better maintainability
const TrashIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="flex w-[20px] h-[20px] justify-center items-center relative"
    aria-hidden="true"
  >
    <path
      d="M16.875 4.375L3.125 4.37501"
      stroke="#E34444"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8.125 8.125V13.125"
      stroke="#E34444"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M11.875 8.125V13.125"
      stroke="#E34444"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M15.625 4.375V16.25C15.625 16.4158 15.5592 16.5747 15.4419 16.6919C15.3247 16.8092 15.1658 16.875 15 16.875H5C4.83424 16.875 4.67527 16.8092 4.55806 16.6919C4.44085 16.5747 4.375 16.4158 4.375 16.25V4.375"
      stroke="#E34444"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M13.125 4.375V3.125C13.125 2.79348 12.9933 2.47554 12.7589 2.24112C12.5245 2.0067 12.2065 1.875 11.875 1.875H8.125C7.79348 1.875 7.47554 2.0067 7.24112 2.24112C7.0067 2.47554 6.875 2.79348 6.875 3.125V4.375"
      stroke="#E34444"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Internal InputDesign component
interface InputDesignProps {
  onEdit?: (e: React.MouseEvent) => void; // Updated to accept event parameter
  onDelete?: (e: React.MouseEvent) => void; // Updated to accept event parameter
  className?: string;
}

function InputDesign({ onEdit, onDelete, className = '' }: InputDesignProps) {
  return (
    <div className={`${styles.inputDesignContainer} ${className}`}>
      <button type="button" className={styles.editButton} onClick={onEdit} aria-label="Edit">
        <PencilIcon />
      </button>
      <button type="button" className={styles.deleteButton} onClick={onDelete} aria-label="Delete">
        <TrashIcon />
      </button>
    </div>
  );
}

// TeacherCourseCard component
interface TeacherCourseCardProps {
  image: string;
  category: string;
  title: string;
  rating: number;
  studentCount: number;
  categoryColor: string;
  categoryBg: string;
  price: number;
  courseId: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const TeacherCourseCard: React.FC<TeacherCourseCardProps> = ({
  image,
  category,
  title,
  rating,
  studentCount,
  categoryColor,
  categoryBg,
  price,
  courseId,
  onEdit,
  onDelete,
}) => {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/course/${courseId}`);
  };

  // Handle edit button click without triggering the card click
  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) onEdit();
  };

  // Handle delete button click without triggering the card click
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) onDelete();
  };

  return (
    <article
      className={styles.courseCard}
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleCardClick();
        }
      }}
    >
      <div className={styles.imageWrapper}>
        <Image
          className={styles.courseImage}
          src={image}
          alt={title}
          width={244}
          height={183}
          unoptimized
        />
      </div>
      <div className={styles.courseContent}>
        <div className={styles.courseHeader}>
          <span
            className={styles.categoryTag}
            style={{
              color: categoryColor,
              backgroundColor: categoryBg,
            }}
          >
            {category}
          </span>
          <div className={styles.price}>${price}</div>
        </div>
        <h3 className={styles.courseTitle}>{title}</h3>
      </div>
      <div className={styles.divider}></div>
      <footer className={styles.courseFooter}>
        <div className={styles.rating}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10.3446 14.901L14.2849 17.3974C14.7886 17.7165 15.4139 17.2419 15.2644 16.654L14.126 12.1756C14.0939 12.0509 14.0977 11.9197 14.137 11.797C14.1762 11.6743 14.2492 11.5652 14.3477 11.4822L17.8811 8.54132C18.3453 8.1549 18.1057 7.38439 17.5092 7.34567L12.8949 7.0462C12.7706 7.03732 12.6514 6.99332 12.5511 6.91931C12.4509 6.84531 12.3737 6.74435 12.3286 6.62819L10.6076 2.29436C10.5609 2.17106 10.4777 2.06492 10.3692 1.99002C10.2606 1.91511 10.1319 1.875 10 1.875C9.86813 1.875 9.73938 1.91511 9.63085 1.99002C9.52232 2.06492 9.43914 2.17106 9.39236 2.29436L7.6714 6.62819C7.62631 6.74435 7.54914 6.84531 7.4489 6.91931C7.34865 6.99332 7.22944 7.03732 7.10515 7.0462L2.49078 7.34567C1.89429 7.38439 1.65466 8.1549 2.11894 8.54132L5.65232 11.4822C5.75079 11.5652 5.82383 11.6743 5.86305 11.797C5.90226 11.9197 5.90606 12.0509 5.874 12.1756L4.81824 16.3288C4.63889 17.0343 5.38929 17.6038 5.99369 17.2209L9.65539 14.901C9.75837 14.8354 9.87792 14.8006 10 14.8006C10.1221 14.8006 10.2416 14.8354 10.3446 14.901Z"
              fill="#82FDF3"
            />
          </svg>
          <span className={styles.ratingValue}>{rating.toFixed(1)}</span>
        </div>
        <div className={styles.students}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10 12.5C12.7614 12.5 15 10.2614 15 7.5C15 4.73858 12.7614 2.5 10 2.5C7.23858 2.5 5 4.73858 5 7.5C5 10.2614 7.23858 12.5 10 12.5Z"
              stroke="#564FFD"
              strokeWidth="1.5"
              strokeMiterlimit="10"
            />
            <path
              d="M2.42188 16.8743C3.19028 15.5442 4.29517 14.4398 5.62553 13.672C6.9559 12.9042 8.4649 12.5 10.0009 12.5C11.537 12.5 13.046 12.9043 14.3763 13.6721C15.7067 14.44 16.8116 15.5444 17.5799 16.8744"
              stroke="#564FFD"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className={styles.studentCount}>
            <span className={styles.count}>{studentCount.toLocaleString()}</span>
            <span className={styles.label}>students</span>
          </div>
        </div>
      </footer>
      {/* Divider between footer and action section */}
      <div className={styles.actionDivider}></div>
      {/* New section with edit and delete icons */}
      <div className={styles.actionSection}>
        <InputDesign
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
          className={styles.actionButtons}
        />
      </div>
    </article>
  );
};

export default TeacherCourseCard;
