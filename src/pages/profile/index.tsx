import React, { useEffect, useState, useCallback, useRef } from 'react';
import Profile from '@/features/profile/Profile';
import useRequest from '@/hooks/use-request';

const ProfileRoute: React.FC = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const fetchedRef = useRef(false);

  const { doRequest } = useRequest({
    url: '/api/users/currentuser',
    method: 'get',
    onSuccess: (data) => {
      setUserData(data.currentUser);
      setLoading(false);
    },
    onError: () => {
      console.error('Failed to fetch user data');
      setLoading(false);
    },
  });

  const fetchUser = useCallback(() => {
    doRequest();
  }, [doRequest]);

  useEffect(() => {
    if (!fetchedRef.current) {
      fetchedRef.current = true;
      fetchUser();
    }
  }, [fetchUser]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="app-container">
      <Profile
        username={userData.userName}
        title="Student"
        email={userData.email}
        photoUrl={
          userData.imageUrl ||
          'https://cdn.builder.io/api/v1/image/assets/TEMP/e2ae3d47698d7bc8594b76e68ec87a40da71fad1'
        }
        userId={userData.id}
        onUserUpdate={fetchUser}
      />
    </div>
  );
};

export default ProfileRoute;
