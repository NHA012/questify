import React, { useEffect, useState } from 'react';
import TeacherIslandPreview from '@/features/islands/teacher/IslandsPreview';
import { useParams, usePathname } from 'next/navigation';

const IslandsRoute: React.FC = () => {
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
      const instructorCoursePattern = /\/instructor\/course\/([^\/]+)/;
      const match = pathname.match(instructorCoursePattern);

      if (match && match[1]) {
        setCourseId(match[1]);
        setLoading(false);
        return;
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

  return <TeacherIslandPreview courseId={courseId} />;
};

export default IslandsRoute;
