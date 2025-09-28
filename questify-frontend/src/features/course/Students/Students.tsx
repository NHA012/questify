import React from 'react';
import Student from './Student';
import Pagination from '@/features/profile/components/Pagination';

const Students: React.FC = () => {
  return (
    <div>
      <Student name="Student 1" className="rounded-t-[20px]" />
      <Student name="Student 2" />
      <Student name="Student 3" />
      <Student name="Student 4" />
      <Student name="Student 5" className="rounded-b-[20px]" />
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Pagination />
      </div>
    </div>
  );
};

export default Students;
