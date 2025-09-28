import React, { useEffect, useRef } from 'react';

import PageHeader from './components/PageHeader';
import Category from './components/Category';
import TopCourse from './components/TopCourse';
import LearningProcess from './components/LearningProcess';

const LandingPage: React.FC<{ currentUser }> = ({ currentUser }) => {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.focus();
    }
  }, []);

  return (
    <div className="app-container">
      <div ref={contentRef} tabIndex={-1}>
        <PageHeader currentUser={currentUser} />
        <Category />
        <TopCourse />
        <LearningProcess />
      </div>
    </div>
  );
};

export default LandingPage;
