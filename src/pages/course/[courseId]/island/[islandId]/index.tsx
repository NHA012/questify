import React, { useEffect, useState } from 'react';
import Levels from '@/features/levels/Levels';
import { useParams, usePathname } from 'next/navigation';

const IslandLevelsRoute: React.FC = () => {
  const params = useParams();
  const pathname = usePathname();
  const [courseId, setCourseId] = useState<string | null>(null);
  const [islandId, setIslandId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params) {
      setCourseId(params.courseId as string);
      setIslandId(params.islandId as string);
      setLoading(false);
      return;
    }

    if (pathname) {
      const pathParts = pathname.split('/');
      // Find indices for course and island in the URL
      const courseIdIndex = pathParts.indexOf('course') + 1;
      const islandIdIndex = pathParts.indexOf('island') + 1;

      if (courseIdIndex > 0 && courseIdIndex < pathParts.length) {
        setCourseId(pathParts[courseIdIndex]);
      }

      if (islandIdIndex > 0 && islandIdIndex < pathParts.length) {
        setIslandId(pathParts[islandIdIndex]);
      }
    }

    setLoading(false);
  }, [params, pathname]);

  if (loading) {
    return <div>Loading levels...</div>;
  }

  if (!courseId || !islandId) {
    return <div>Island not found. Please select a valid course and island.</div>;
  }

  return <Levels courseId={courseId} islandId={islandId} />;
};

export default IslandLevelsRoute;
