import React, { useState } from 'react';
import styles from './Instructors.module.css';
import { Users, PlayCircle } from 'lucide-react';
import Image from 'next/image';

interface StatItemProps {
  icon: React.ReactNode;
  value: string;
  label: string;
}

const StatItem: React.FC<StatItemProps> = ({ icon, value, label }) => (
  <div className={styles.statItem}>
    <div className={styles.statIcon}>{icon}</div>
    <div className={styles.statValue}>
      <span>{value}</span>
      <span style={{ fontWeight: 400, lineHeight: '22px', color: 'rgba(78,85,102,1)' }}>
        {' '}
        {label}
      </span>
    </div>
  </div>
);

interface InstructorCardProps {
  image: string;
  name: string;
  title: string;
  stats: {
    rating: string;
    students: string;
    courses: string;
  };
  description: string;
}

const InstructorCard: React.FC<InstructorCardProps> = ({
  image,
  name,
  title,
  stats,
  description,
}) => {
  const [expanded, setExpanded] = useState(false);

  const toggleReadMore = () => {
    setExpanded(!expanded);
  };

  const renderDescription = () => {
    const maxLength = 150;

    if (description.length <= maxLength || expanded) {
      return (
        <>
          {description}
          {description.length > maxLength && (
            <span className={styles.readMore} onClick={toggleReadMore}>
              READ LESS
            </span>
          )}
        </>
      );
    } else {
      const truncatedText = description.substring(0, maxLength).trim() + '...';
      return (
        <>
          {truncatedText}
          <span className={styles.readMore} onClick={toggleReadMore}>
            READ MORE
          </span>
        </>
      );
    }
  };

  return (
    <div className={styles.instructorCard}>
      <Image
        loading="lazy"
        src={image}
        alt={`Portrait of ${name}`}
        className={styles.instructorImage}
        width={50000}
        height={50000}
      />
      <div className={styles.instructorInfo}>
        <div className={styles.instructorDetails}>
          <div className={styles.instructorName}>{name}</div>
          <div className={styles.instructorTitle}>{title}</div>
        </div>
        <div className={styles.instructorStats}>
          <StatItem
            icon={
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12.4135 17.8812L17.1419 20.8769C17.7463 21.2598 18.4967 20.6903 18.3173 19.9847L16.9512 14.6108C16.9127 14.4611 16.9173 14.3036 16.9643 14.1564C17.0114 14.0092 17.0991 13.8783 17.2172 13.7787L21.4573 10.2496C22.0144 9.78588 21.7269 8.86126 21.0111 8.81481L15.4738 8.45544C15.3247 8.44479 15.1816 8.39198 15.0613 8.30317C14.941 8.21437 14.8484 8.09321 14.7943 7.95382L12.7292 2.75323C12.673 2.60528 12.5732 2.4779 12.443 2.38802C12.3127 2.29814 12.1582 2.25 12 2.25C11.8418 2.25 11.6873 2.29814 11.557 2.38802C11.4268 2.4779 11.327 2.60528 11.2708 2.75323L9.20568 7.95382C9.15157 8.09321 9.05897 8.21437 8.93868 8.30317C8.81838 8.39198 8.67533 8.44479 8.52618 8.45544L2.98894 8.81481C2.27315 8.86126 1.9856 9.78588 2.54272 10.2496L6.78278 13.7787C6.90095 13.8783 6.9886 14.0092 7.03566 14.1564C7.08272 14.3036 7.08727 14.4611 7.0488 14.6108L5.78188 19.5945C5.56667 20.4412 6.46715 21.1246 7.19243 20.6651L11.5865 17.8812C11.71 17.8025 11.8535 17.7607 12 17.7607C12.1465 17.7607 12.29 17.8025 12.4135 17.8812Z"
                  fill="#82FDF3"
                />
              </svg>
            }
            value={stats.rating}
            label="Course rating"
          />
          <StatItem
            icon={<Users size={20} color="#00ADB5" />}
            value={stats.students}
            label="Students"
          />
          <StatItem
            icon={<PlayCircle size={20} color="#00ADB5" />}
            value={stats.courses}
            label="Courses"
          />
        </div>
        <div className={styles.instructorDescription}>
          <div className={styles.descriptionText}>{renderDescription()}</div>
        </div>
      </div>
    </div>
  );
};

export interface Instructor {
  image: string;
  name: string;
  title: string;
  stats: {
    rating: string;
    students: string;
    courses: string;
  };
  description: string;
}

interface InstructorsProps {
  instructors: Instructor[];
}

const Instructors: React.FC<InstructorsProps> = ({ instructors }) => {
  return (
    <div className={styles.courseInstructors}>
      <h2 className={styles.title}>
        Course instructor{' '}
        {/* <span style={{ fontWeight: 400 }}>({instructors.length.toString().padStart(2, '0')})</span> */}
      </h2>
      {instructors.map((instructor, index) => (
        <InstructorCard key={index} {...instructor} />
      ))}
    </div>
  );
};

export default Instructors;
