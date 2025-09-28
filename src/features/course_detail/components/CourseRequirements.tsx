import React from 'react';
import styles from './CourseRequirements.module.css';

const RequirementItem: React.FC<{ text: string }> = ({ text }) => {
  return (
    <div className={styles.item}>
      <span className={styles.bullet}>•</span> {text}
    </div>
  );
};

interface CourseRequirementsProps {
  requirements: string[];
}

const CourseRequirements: React.FC<CourseRequirementsProps> = ({ requirements }) => {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Course requirements</h2>
      <div className={styles.list}>
        {requirements.map((requirement, index) => (
          <RequirementItem key={index} text={requirement} />
        ))}
      </div>
    </div>
  );
};

export default CourseRequirements;
