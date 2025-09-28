'use client';
import React, { useState, useEffect } from 'react';
import styles from './UsersList.module.css';
import SearchControls from './components/Users/SearchControls';
import Pagination from './components/Pagination';
import SidebarNavigation from './components/SidebarNavigation';
import UserTable from './components/Users/UserTable';
import { User } from './UserData';
// import { userData } from './UserData';
import { UserStatus } from '@datn242/questify-common';
import { useRouter } from 'next/navigation';
import { getAllUsers } from '@/services/admin.srv';
import { updateUserAccountStatus } from '@/services/admin.srv';
import { toast } from 'react-toastify';

const UserList: React.FC = () => {
  const router = useRouter();

  // State for filters, search, and sort
  // const [filteredUsers, setFilteredUsers] = useState<User[]>(userData);
  // const [users, setUsers] = useState<User[]>(userData);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('Latest');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedRole, setSelectedRole] = useState('all');
  const [loading, setLoading] = useState(true);

  // Current page for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 15;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await getAllUsers();

        // Ensure we have the expected data structure with required fields
        if (response) {
          setUsers(response);
        } else {
          console.error('Invalid users data received:', response);
        }
      } catch (err) {
        console.error('Failed to fetch users:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Apply filters, search, and sort when dependencies change
  useEffect(() => {
    let result = [...users];

    // Apply status filter
    if (selectedStatus !== 'all') {
      result = result.filter((user) => user.status === selectedStatus);
    }

    // Apply role filter
    if (selectedRole !== 'all') {
      result = result.filter((user) => user.role === selectedRole);
    }

    // Apply search
    if (searchTerm.trim() !== '') {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(
        (user) =>
          user.userName.toLowerCase().includes(searchLower) ||
          user.gmail.toLowerCase().includes(searchLower),
      );
    }

    // Apply sort
    switch (sortOption) {
      case 'Username: A to Z':
        result.sort((a, b) => a.userName.localeCompare(b.userName));
        break;
      case 'Username: Z to A':
        result.sort((a, b) => b.userName.localeCompare(a.userName));
        break;
      default:
        // Default sort by ID
        result.sort((a, b) => a.id.localeCompare(b.id));
        break;
    }

    setFilteredUsers(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, sortOption, selectedStatus, selectedRole, users]);

  // Get current page users
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Handler functions
  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
  };

  const handleSortChange = (option: string) => {
    setSortOption(option);
  };

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
  };

  const handleRoleChange = (role: string) => {
    setSelectedRole(role);
  };

  // Handle user status change
  const handleChangeStatus = async (
    userId: string,
    newStatus: UserStatus.Active | UserStatus.Suspended,
  ) => {
    try {
      await updateUserAccountStatus(userId, newStatus);
      setUsers(users.map((user) => (user.id === userId ? { ...user, status: newStatus } : user)));

      // Show success notification
      const actionText = newStatus === UserStatus.Active ? 'activated' : 'suspended';
      toast.success(`User has been ${actionText} successfully`);
    } catch (error) {
      let errorMessage = 'An error occurred while updating user status';

      // Check for axios error response format
      if (error.response && error.response.data && error.response.data.errors) {
        // Extract first error message from the errors array
        const firstError = error.response.data.errors[0];
        errorMessage = firstError.message || errorMessage;
      } else if (error.message) {
        errorMessage = error.message;
      }
      toast.error(`Failed to update user status: ${errorMessage}`);
      console.error('Error updating user status:', error);
    }
  };

  // Handle user details view
  const handleViewUserDetails = (userId: string) => {
    router.push(`/profile/${userId}`);
  };

  return (
    <div className="app-container">
      <div className={styles.pageLayout}>
        <SidebarNavigation activeItem="users" />
        <main className={styles.container}>
          <section className={styles.wrapper}>
            <div className={styles.contentLayout}>
              <div className={styles.mainContent}>
                <SearchControls
                  onSearchChange={handleSearchChange}
                  onSortChange={handleSortChange}
                  onStatusChange={handleStatusChange}
                  onRoleChange={handleRoleChange}
                  searchTerm={searchTerm}
                  sortOption={sortOption}
                  selectedStatus={selectedStatus}
                  selectedRole={selectedRole}
                  totalUsers={filteredUsers.length}
                />

                {loading ? (
                  <div className={styles.loadingContainer}>
                    <p>Loading courses...</p>
                  </div>
                ) : (
                  <>
                    <section className={styles.card}>
                      <UserTable
                        users={currentUsers}
                        onViewDetails={handleViewUserDetails}
                        onChangeStatus={handleChangeStatus}
                      />

                      {filteredUsers.length > usersPerPage && (
                        <div className="pagination-container">
                          <Pagination
                            currentPage={currentPage}
                            totalPages={Math.ceil(filteredUsers.length / usersPerPage)}
                            onPageChange={paginate}
                          />
                        </div>
                      )}
                    </section>
                  </>
                )}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default UserList;
