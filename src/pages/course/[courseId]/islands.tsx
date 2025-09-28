import React, { useEffect, useState } from 'react';
import StudentIslands from '@/features/islands/Islands';
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

  return <StudentIslands courseId={courseId as string} />;
};

export default IslandsRoute;
