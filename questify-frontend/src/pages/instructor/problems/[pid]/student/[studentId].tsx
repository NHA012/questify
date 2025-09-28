import Topbar from '@/features/code_problems/components/Topbar/Topbar';
import InstructorWorkspace from '@/features/code_problems/components/Workspace/InstructorWorkspace';
import useHasMounted from '@/hooks/useHasMounted';
import React from 'react';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

const InstructorSubmissionRoute: React.FC = () => {
  const router = useRouter();
  const { pid, studentId } = router.query;
  const [isReady, setIsReady] = useState(false);
  const hasMounted = useHasMounted();

  useEffect(() => {
    if (router.isReady) {
      setIsReady(true);
    }
  }, [router.isReady]);

  if (!hasMounted) return null;

  if (!isReady) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div>
      <Topbar problemPage />
      <InstructorWorkspace pid={pid as string} studentId={studentId as string} />
    </div>
  );
};

export default InstructorSubmissionRoute;
