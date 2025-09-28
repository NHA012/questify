import React from 'react';
import UserList from '@/features/admin/UsersList';

const UserListRoute: React.FC = () => {
  return <UserList />;
};

export async function getServerSideProps() {
  return {
    props: {},
  };
}

export default UserListRoute;
