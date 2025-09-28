import React, { useEffect, useState } from 'react';
import CourseDetail from '@/features/course_detail/CourseDetail';
import { useParams, usePathname } from 'next/navigation';

const CourseDetailRoute: React.FC = () => {
  const params = useParams();
  const pathname = usePathname();
  const [courseId, setCourseId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params && params.courseId) {
      setCourseId(params.courseId as string);
      setLoading(false);
      return;
    }

    if (pathname) {
      const pathParts = pathname.split('/');
      const id = pathParts[pathParts.length - 1];

      if (id && id.length > 0 && id !== 'course') {
        setCourseId(id);
      }
    }

    setLoading(false);
  }, [params, pathname]);

  if (loading) {
    return <div>Loading course...</div>;
  }

  if (!courseId) {
    return <div>Course not found. Please select a valid course.</div>;
  }

  return <CourseDetail courseId={courseId} />;
};

export default CourseDetailRoute;
