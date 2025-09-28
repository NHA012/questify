import React, { useEffect, useState } from 'react';
import ChallengePage from '@/features/challenge/Challenge';
import { useRouter } from 'next/router';

const ChallengePageRoute: React.FC = () => {
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
      <ChallengePage challenge_id={challenge_id as string} />
    </div>
  );
};

export default ChallengePageRoute;
