import { auth } from '@/features/code_problems/firebase/firebase';
import React from 'react';
import { useSignOut } from 'react-firebase-hooks/auth';
import { FiLogOut } from 'react-icons/fi';

const Logout: React.FC = () => {
  const [signOut, ,] = useSignOut(auth);

  const handleLogout = () => {
    signOut();
  };

  const LogoutIcon = FiLogOut as React.ElementType;
  return (
    <button
      className="bg-dark-fill-3 py-1.5 px-3 cursor-pointer rounded text-brand-orange"
      onClick={handleLogout}
    >
      <LogoutIcon />
    </button>
  );
};
export default Logout;
