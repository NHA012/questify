import React from 'react';
import LandingPage from '@/features/landingPage/LandingPage';

const Home: React.FC<{ currentUser }> = ({ currentUser }) => {
  return <LandingPage currentUser={currentUser} />;
};

export default Home;
