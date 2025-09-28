import React from 'react';
import CourseList from '@/features/admin/CoursesList';

const CourseListRoute: React.FC = () => {
  return <CourseList />;
};

export async function getServerSideProps() {
  return {
    props: {},
  };
}

export default CourseListRoute;
