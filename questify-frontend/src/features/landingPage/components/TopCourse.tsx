import React from 'react';
import styles from './TopCourse.module.css';
import Image from 'next/image';
import { landingPageImage } from '@/assets/images';
import { useCourseData } from '../../course_list/CourseData';
import { useRouter } from 'next/navigation';
import { CourseCardProps } from '../../course_list/components/CourseCard';

// interface CourseCardProps {
//   image: string;
//   category: string;
//   categoryColor: string;
//   categoryTextColor: string;
//   price: number;
//   title: string;
//   rating: number;
//   students: number;
// }

const CourseCard: React.FC<CourseCardProps> = ({
  image,
  category,
  title,
  rating,
  studentCount,
  categoryColor,
  categoryBg,
  price,
  courseId,
}) => {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/course/${courseId}`);
  };

  return (
    <div className={styles.courseCard} onClick={handleCardClick} role="button" tabIndex={0}>
      <div className={styles.imageWrapper}>
        <Image className={styles.courseImage} src={image} alt={title} width={244} height={183} />
      </div>
      <div className={styles.courseContent}>
        <div className={styles.courseHeader}>
          <div
            className={styles.categoryTag}
            style={{
              backgroundColor: categoryColor,
              color: categoryBg,
            }}
          >
            {category}
          </div>
          <div className={styles.price}>${price}</div>
        </div>
        <div className={styles.courseTitle}>{title}</div>
      </div>
      <div className={styles.divider}></div>
      <div className={styles.courseFooter}>
        <div className={styles.rating}>
          <Image src={landingPageImage.starIcon} alt="Rating" width={16} height={16} />
          <span>{rating.toFixed(1)}</span>
        </div>
        <div className={styles.students}>
          <span className={styles.studentCount}>{studentCount.toLocaleString()}</span>
          <span className={styles.studentText}> students</span>
        </div>
      </div>
    </div>
  );
};

const TopCourse: React.FC = () => {
  // Course data
  // const courses = [
  //   {
  //     id: 1,
  //     image: landingPageImage.courseImage,
  //     category: 'Design',
  //     categoryColor: '#FFEEE8',
  //     categoryTextColor: '#993D20',
  //     price: 57,
  //     title: 'Machine Learning A-Z™: Hands-On Python & R In Data...',
  //     rating: 5.0,
  //     students: 265700,
  //   },
  //   {
  //     id: 2,
  //     image: landingPageImage.course1Image,
  //     category: 'Developments',
  //     categoryColor: '#EBEBFF',
  //     categoryTextColor: '#342F98',
  //     price: 57,
  //     title: 'The Complete 2021 Web Development Bootcamp',
  //     rating: 5.0,
  //     students: 265700,
  //   },
  //   {
  //     id: 3,
  //     image: landingPageImage.course2Image,
  //     category: 'Business',
  //     categoryColor: '#E1F7E3',
  //     categoryTextColor: '#15711F',
  //     price: 57,
  //     title: 'Learn Python Programming Masterclass',
  //     rating: 5.0,
  //     students: 265700,
  //   },
  //   {
  //     id: 4,
  //     image: landingPageImage.course3Image,
  //     category: 'Marketing',
  //     categoryColor: '#EBEBFF',
  //     categoryTextColor: '#342F98',
  //     price: 57,
  //     title: 'The Complete Digital Marketing Course - 12 Courses in 1',
  //     rating: 5.0,
  //     students: 265700,
  //   },
  //   {
  //     id: 5,
  //     image: landingPageImage.course4Image,
  //     category: 'IT & Software',
  //     categoryColor: '#FFF0F0',
  //     categoryTextColor: '#882929',
  //     price: 57,
  //     title: 'Reiki Level I, II and Master/Teacher Program',
  //     rating: 5.0,
  //     students: 265700,
  //   },
  //   {
  //     id: 6,
  //     image: landingPageImage.course5Image,
  //     category: 'Music',
  //     categoryColor: '#FFF2E5',
  //     categoryTextColor: '#65390C',
  //     price: 57,
  //     title: 'The Complete Foundation Stock Trading Course',
  //     rating: 5.0,
  //     students: 265700,
  //   },
  //   {
  //     id: 7,
  //     image: landingPageImage.course6Image,
  //     category: 'Marketing',
  //     categoryColor: '#EBEBFF',
  //     categoryTextColor: '#342F98',
  //     price: 57,
  //     title: 'Beginner to Pro in Excel: Financial Modeling and Valuati...',
  //     rating: 5.0,
  //     students: 265700,
  //   },
  //   {
  //     id: 8,
  //     image: landingPageImage.course7Image,
  //     category: 'Health & Fitness',
  //     categoryColor: '#E1F7E3',
  //     categoryTextColor: '#15711F',
  //     price: 57,
  //     title: 'The Python Mega Course: Build 10 Real World Applications',
  //     rating: 5.0,
  //     students: 265700,
  //   },
  //   {
  //     id: 9,
  //     image: landingPageImage.course8Image,
  //     category: 'Design',
  //     categoryColor: '#FFEEE8',
  //     categoryTextColor: '#993D20',
  //     price: 57,
  //     title: 'Copywriting - Become a Freelance Copywriter, your ow...',
  //     rating: 5.0,
  //     students: 265700,
  //   },
  //   {
  //     id: 10,
  //     image: landingPageImage.course9Image,
  //     category: 'Lifestyle',
  //     categoryColor: '#FFF2E5',
  //     categoryTextColor: '#65390C',
  //     price: 57,
  //     title: 'Google Analytics Certification - Learn How To Pass The Exam',
  //     rating: 5.0,
  //     students: 265700,
  //   },
  // ];
  const { courses } = useCourseData();
  const topTenCourses = [...courses].sort((a, b) => b.studentCount - a.studentCount).slice(0, 10);
  const coursesPerRow = 5;

  const rows = Array.from(
    { length: Math.ceil(topTenCourses.length / coursesPerRow) },
    (_, rowIndex) => topTenCourses.slice(rowIndex * coursesPerRow, (rowIndex + 1) * coursesPerRow),
  );

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Best selling courses</h1>
      <div className={styles.courseGrid}>
        {rows.map((row, rowIndex) => (
          <div key={`row-${rowIndex}`} className={styles.courseRow}>
            {row.map((course) => (
              <CourseCard
                key={course.id}
                image={course.image}
                category={course.category}
                title={course.title}
                rating={course.rating}
                studentCount={course.studentCount}
                categoryColor={course.categoryColor}
                categoryBg={course.categoryBg}
                price={course.price}
                courseId={course.id}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopCourse;
