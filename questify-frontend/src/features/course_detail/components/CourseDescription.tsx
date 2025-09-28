import React, { useState } from 'react';
import styles from './CourseDescription.module.css';
import Image from 'next/image';

interface CourseDescriptionProps {
  title: string;
  content: string;
}

const CourseDescription: React.FC<CourseDescriptionProps> = ({ title, content = '' }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  const safeContent = typeof content === 'string' ? content : '';

  const createParagraphs = () => {
    if (isExpanded) {
      return safeContent.split(/\n\s*\n/).map((paragraph, index) => (
        <p key={index} className={styles.paragraph}>
          {paragraph}
        </p>
      ));
    } else {
      const truncatedContent =
        safeContent.length > 500 ? `${safeContent.slice(0, 500)}...` : safeContent;

      return <p className={styles.content}>{truncatedContent}</p>;
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{title}</h2>
      <div className={styles.contentWrapper}>{createParagraphs()}</div>
      <button className={styles.toggleContainer} onClick={toggleExpansion}>
        <span>{isExpanded ? 'Show less' : 'Show more'}</span>
        <Image
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/defc4b68b70d87b3067165b5aac57b2dce8c8b2522909f5e82fe7ed3cac8a0d1?placeholderIfAbsent=true&apiKey=725d9caf744a44daa4b84cac10f9b01b"
          alt=""
          className={isExpanded ? styles.toggleIcon : styles.toggleIconRotated}
          width={50000}
          height={50000}
        />
      </button>
    </div>
  );
};

export default CourseDescription;
