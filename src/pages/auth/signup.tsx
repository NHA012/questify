import React from 'react';
import dynamic from 'next/dynamic';

// Import EmailPage with SSR disabled
const SignupPage = dynamic(() => import('@/features/auth/signup/SignupPage'), { ssr: false });

const EmailRoute: React.FC = () => {
  return <SignupPage />;
};

export default EmailRoute;
