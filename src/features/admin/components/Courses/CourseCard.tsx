'use client';
import React from 'react';
import Image from 'next/image';
import styles from './CourseCard.module.css';
interface CourseCardProps {
  image: string;
  title: string;
  price: number;
  status: 'pending' | 'approved' | 'rejected';
  teacherName: string;
  submittedAt: string;
  onPreview: () => void;
  onApprove?: () => void;
  onReject?: () => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  image,
  title,
  price,
  status,
  teacherName,
  submittedAt,
  onPreview,
  onApprove,
  onReject,
}) => {
  // Determine status tag color
  const getStatusStyles = () => {
    switch (status) {
      case 'pending':
        return {
          backgroundColor: '#FFF8E6',
          color: '#F2A10C',
        };
      case 'approved':
        return {
          backgroundColor: '#E6F7F8',
          color: '#00ADB5',
        };
      case 'rejected':
        return {
          backgroundColor: '#FFF0F0',
          color: '#E34444',
        };
      default:
        return {
          backgroundColor: '#F5F5F5',
          color: '#4E5566',
        };
    }
  };

  return (
    <article className={styles.course}>
      <Image src={image} alt={title} className={styles.img} width={312} height={234} />

      <section className={styles.courseInfor}>
        <div className={styles.courseHeader}>
          <span className={styles.categoryBadge} style={getStatusStyles()}>
            {status.toUpperCase()}
          </span>
          <span className={styles.price}>${price.toFixed(2)}</span>
        </div>

        <h2 className={styles.courseTitle}>{title}</h2>
        <p className={styles.courseAuthor}>By: {teacherName}</p>
        <p className={styles.courseSubmitDate}>Submitted: {submittedAt}</p>
      </section>

      <hr className={styles.divider} />

      <div className={styles.actionContainer}>
        {status === 'pending' ? (
          <>
            <button className={styles.previewButton} onClick={onPreview}>
              Preview
            </button>
            <button className={styles.approveButton} onClick={onApprove}>
              Approve
            </button>
            <button className={styles.rejectButton} onClick={onReject}>
              Reject
            </button>
          </>
        ) : (
          <button
            className={styles.previewButton}
            onClick={onPreview}
            style={{ marginLeft: '100px' }}
          >
            Preview
          </button>
        )}
      </div>
    </article>
  );
};

export default CourseCard;
