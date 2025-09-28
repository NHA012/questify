import React from 'react';
import GuestHeader from './GuestHeader';
import UserHeader from './UserHeader';

const Header: React.FC<{ currentUser; setCurrentUser }> = ({ currentUser, setCurrentUser }) => {
  return (
    <>
      {currentUser ? (
        <UserHeader currentUser={currentUser} setCurrentUser={setCurrentUser} />
      ) : (
        <GuestHeader />
      )}
    </>
  );
};

export default Header;
