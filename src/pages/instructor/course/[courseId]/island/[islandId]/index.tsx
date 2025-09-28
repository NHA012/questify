import React, { useEffect, useState } from 'react';
import Levels from '@/features/levels/Levels'; // You might need a specific TeacherLevels component here
import { useParams, usePathname } from 'next/navigation';

const InstructorIslandLevelsRoute: React.FC = () => {
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
      // Updated regex pattern to match /instructor/course/[courseId]/island/[islandId]
      const instructorCoursePattern = /\/instructor\/course\/([^\/]+)\/island\/([^\/]+)/;
      const match = pathname.match(instructorCoursePattern);

      if (match && match[1] && match[2]) {
        setCourseId(match[1]);
        setIslandId(match[2]);
        setLoading(false);
        return;
      }

      // Fallback to the original split method if regex doesn't match
      const pathParts = pathname.split('/');

      // Find indices for course and island in the URL, accounting for the instructor prefix
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

  // You might need to pass an "isInstructor" prop if the Levels component needs to know the context
  return <Levels courseId={courseId} islandId={islandId} isInstructor={true} />;
};

export default InstructorIslandLevelsRoute;
