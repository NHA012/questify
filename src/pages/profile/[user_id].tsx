import React, { useEffect, useState } from 'react';
import ViewedProfile from '@/features/profile/ViewedProfile';
import { useRouter } from 'next/router';

const ViewedProfileRoute: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);
  // const fetchedRef = useRef(false);
  const { user_id } = router.query;

  useEffect(() => {
    if (user_id) {
      setLoading(false);
    } else {
      console.log("No userId available, can't make API call");
    }
  }, [user_id]);

  useEffect(() => {
    if (router.isReady) {
      setIsReady(true);
    }
  }, [router.isReady]);

  if (!isReady || loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="app-container">
      <ViewedProfile user_id={user_id as string} />
    </div>
  );
};

export default ViewedProfileRoute;
