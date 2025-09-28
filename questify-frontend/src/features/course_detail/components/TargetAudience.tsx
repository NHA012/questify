import React from 'react';
import styles from './TargetAudience.module.css';

// Internal ArrowIcon component
const ArrowIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M3.75 12H20.25"
      stroke="#00ADB5"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M13.5 5.25L20.25 12L13.5 18.75"
      stroke="#00ADB5"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Internal TargetItem component
const TargetItem: React.FC<{ text: string }> = ({ text }) => (
  <div className={styles.targetItem}>
    <ArrowIcon className={styles.arrowIcon} />
    <div className={styles.targetText}>{text}</div>
  </div>
);

// Main TargetAudience component that takes an array of audience items
interface TargetAudienceProps {
  targetAudience: string[];
}

const TargetAudience: React.FC<TargetAudienceProps> = ({ targetAudience }) => {
  return (
    <div className={styles.courseSection}>
      <h2 className={styles.sectionTitle}>Who this course is for:</h2>
      <div className={styles.targetList}>
        {targetAudience.map((text, index) => (
          <TargetItem key={index} text={text} />
        ))}
      </div>
    </div>
  );
};

export default TargetAudience;
