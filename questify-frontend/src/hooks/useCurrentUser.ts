import { useState, useEffect, useCallback, useRef } from 'react';
import useRequest from '@/hooks/use-request';

interface User {
  id: string;
  email: string;
  name?: string;
  userName?: string;
  imageUrl?: string;
  role?: string;
}

export const useCurrentUser = () => {
  const [userData, setUserData] = useState<User | null>(null);
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

  return { userData, loading, fetchUser };
};
