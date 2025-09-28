import React from 'react';
import styles from '../Profile.module.css';
import CourseCard from './CourseCard';

interface Course {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  progress: number;
}

interface CourseProps {
  courses: Course[];
}

const Course: React.FC<CourseProps> = ({ courses }) => {
  return (
    <section>
      <h2 className={styles.sectionTitle}>
        Courses ({courses.length.toString().padStart(2, '0')})
      </h2>
      <div className={styles.coursesGrid}>
        {courses.map((course) => (
          <CourseCard
            key={course.id}
            title={course.title}
            category={course.category}
            imageUrl={course.imageUrl}
            progress={course.progress}
          />
        ))}
      </div>
    </section>
  );
};

export default Course;
