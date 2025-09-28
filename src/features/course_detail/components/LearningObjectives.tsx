import React from 'react';
import styles from './LearningObjectives.module.css';

interface CheckboxItemProps {
  text: string;
}

const CheckboxItem: React.FC<CheckboxItemProps> = ({ text }) => {
  return (
    <div className={styles.checkboxItem}>
      <div className={styles.checkCircle} />
      <div className={styles.checkboxText}>{text}</div>
    </div>
  );
};

interface LearningObjectivesProps {
  learningPoints: string[];
}

const LearningObjectives: React.FC<LearningObjectivesProps> = ({ learningPoints }) => {
  const rows = [];
  for (let i = 0; i < learningPoints.length; i += 2) {
    rows.push(learningPoints.slice(i, i + 2));
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>What you will learn in this course</h2>
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className={styles.row}>
          {row.map((point, pointIndex) => (
            <CheckboxItem key={rowIndex * 2 + pointIndex} text={point} />
          ))}
        </div>
      ))}
    </div>
  );
};

export default LearningObjectives;
