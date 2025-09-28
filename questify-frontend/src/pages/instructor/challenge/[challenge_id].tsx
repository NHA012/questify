import React, { useEffect, useState } from 'react';
import ChallengeEditor from '@/features/challenge/instructor/ChallengeEditor';
import { useRouter } from 'next/router';

const ChallengeEditorRoute: React.FC = () => {
  const router = useRouter();
  const { challenge_id } = router.query;
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
      <ChallengeEditor challenge_id={challenge_id as string} />
    </div>
  );
};

export default ChallengeEditorRoute;
