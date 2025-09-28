import React, { useEffect, useState } from 'react';
import CreateCourse from '@/features/course/CreateCourse';
import { useRouter } from 'next/router';

const CreateCourseRoute: React.FC = () => {
  const router = useRouter();
  const { course_id } = router.query;
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (router.isReady) {
      setIsReady(true);
    }
  }, [router.isReady]);

  if (!isReady) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="app-container">
      <CreateCourse currentCourseId={course_id as string} />
    </div>
  );
};

export default CreateCourseRoute;
