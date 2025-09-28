'use client';
import React, { useState, useEffect, useRef } from 'react';
import styles from './SearchControls.module.css';

interface SearchControlsProps {
  onSearchChange: (term: string) => void;
  onSortChange: (option: string) => void;
  onStatusChange: (status: string) => void;
  onRoleChange: (role: string) => void;
  searchTerm: string;
  sortOption: string;
  selectedStatus: string;
  selectedRole: string;
  totalUsers: number;
}

// Search Section Component
const SearchSection: React.FC<{
  onSearchChange: (term: string) => void;
  searchTerm: string;
}> = ({ onSearchChange, searchTerm }) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  };

  const handleClearSearch = () => {
    onSearchChange('');
  };

  return (
    <div className={styles.searchBox}>
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M10.875 18.75C15.2242 18.75 18.75 15.2242 18.75 10.875C18.75 6.52576 15.2242 3 10.875 3C6.52576 3 3 6.52576 3 10.875C3 15.2242 6.52576 18.75 10.875 18.75Z"
          stroke="#1D2026"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M16.4414 16.4434L20.9977 20.9997"
          stroke="#1D2026"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <input
        type="text"
        className={styles.searchInput}
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder="Search users..."
      />
      {searchTerm && (
        <button
          className={styles.clearSearch}
          onClick={handleClearSearch}
          aria-label="Clear search"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 4L4 12"
              stroke="#8C94A3"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M4 4L12 12"
              stroke="#8C94A3"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

// Sort Section Component
const SortSection: React.FC<{
  onSortChange: (option: string) => void;
  sortOption: string;
}> = ({ onSortChange, sortOption }) => {
  const [isOpen, setIsOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  // Sort options
  const sortOptions = ['Latest', 'Username: A to Z', 'Username: Z to A'];

  // Toggle dropdown
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Handle sort option selection
  const handleSortSelection = (option: string) => {
    onSortChange(option);
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={styles.sortControls} ref={sortRef}>
      <span className={styles.sortLabel}>Sort by:</span>
      <div className={styles.sortWrapper}>
        <button
          className={`${styles.sortButton} ${isOpen ? styles.active : ''}`}
          onClick={toggleDropdown}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        >
          <span>{sortOption}</span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0)' }}
          >
            <path
              d="M13 6L8 11L3 6"
              stroke="#1D2026"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {isOpen && (
          <div className={styles.sortDropdown} role="listbox">
            {sortOptions.map((option) => (
              <button
                key={option}
                className={`${styles.sortOption} ${sortOption === option ? styles.selected : ''}`}
                onClick={() => handleSortSelection(option)}
                role="option"
                aria-selected={sortOption === option}
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Status Filter Component
const StatusFilter: React.FC<{
  onStatusChange: (status: string) => void;
  selectedStatus: string;
}> = ({ onStatusChange, selectedStatus }) => {
  const [isOpen, setIsOpen] = useState(false);
  const statusRef = useRef<HTMLDivElement>(null);

  // Status options
  const statusOptions = [
    { id: 'all', label: 'All' },
    { id: 'active', label: 'Active' },
    { id: 'suspended', label: 'Suspended' },
  ];

  // Toggle dropdown
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Handle status selection
  const handleStatusSelection = (status: string) => {
    onStatusChange(status);
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (statusRef.current && !statusRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getDisplayStatus = () => {
    const status = statusOptions.find((s) => s.id === selectedStatus);
    return status ? status.label : 'All';
  };

  return (
    <div className={styles.statusFilter} ref={statusRef}>
      <span className={styles.statusLabel}>Status:</span>
      <div className={styles.statusWrapper}>
        <button
          className={`${styles.statusButton} ${isOpen ? styles.active : ''}`}
          onClick={toggleDropdown}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        >
          <span>{getDisplayStatus()}</span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0)' }}
          >
            <path
              d="M13 6L8 11L3 6"
              stroke="#1D2026"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {isOpen && (
          <div className={styles.statusDropdown} role="listbox">
            {statusOptions.map((option) => (
              <button
                key={option.id}
                className={`${styles.statusOption} ${selectedStatus === option.id ? styles.selected : ''}`}
                onClick={() => handleStatusSelection(option.id)}
                role="option"
                aria-selected={selectedStatus === option.id}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Role Filter Component
const RoleFilter: React.FC<{
  onRoleChange: (role: string) => void;
  selectedRole: string;
}> = ({ onRoleChange, selectedRole }) => {
  const [isOpen, setIsOpen] = useState(false);
  const roleRef = useRef<HTMLDivElement>(null);

  // Role options
  const roleOptions = [
    { id: 'all', label: 'All Roles' },
    { id: 'admin', label: 'Admin' },
    { id: 'teacher', label: 'Teacher' },
    { id: 'student', label: 'Student' },
  ];

  // Toggle dropdown
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Handle role selection
  const handleRoleSelection = (role: string) => {
    onRoleChange(role);
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (roleRef.current && !roleRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getDisplayRole = () => {
    const role = roleOptions.find((r) => r.id === selectedRole);
    return role ? role.label : 'All Roles';
  };

  return (
    <div className={styles.roleFilter} ref={roleRef}>
      <span className={styles.roleLabel}>Role:</span>
      <div className={styles.roleWrapper}>
        <button
          className={`${styles.roleButton} ${isOpen ? styles.active : ''}`}
          onClick={toggleDropdown}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        >
          <span>{getDisplayRole()}</span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0)' }}
          >
            <path
              d="M13 6L8 11L3 6"
              stroke="#1D2026"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {isOpen && (
          <div className={styles.roleDropdown} role="listbox">
            {roleOptions.map((option) => (
              <button
                key={option.id}
                className={`${styles.roleOption} ${selectedRole === option.id ? styles.selected : ''}`}
                onClick={() => handleRoleSelection(option.id)}
                role="option"
                aria-selected={selectedRole === option.id}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Results Count Component
const ResultsCount: React.FC<{
  searchTerm?: string;
  totalUsers: number;
}> = ({ searchTerm, totalUsers }) => {
  return (
    <p className={styles.resultsCount}>
      <span className={styles.resultsNumber}>{totalUsers}</span>
      <span className={styles.resultsText}>
        {totalUsers === 1 ? ' user' : ' users'} found
        {searchTerm ? ` for "${searchTerm}"` : ''}
      </span>
    </p>
  );
};

const SearchControls: React.FC<SearchControlsProps> = ({
  onSearchChange,
  onSortChange,
  onStatusChange,
  onRoleChange,
  searchTerm,
  sortOption,
  selectedStatus,
  selectedRole,
  totalUsers,
}) => {
  return (
    <section className={styles.topActions}>
      <div className={styles.action}>
        <SearchSection onSearchChange={onSearchChange} searchTerm={searchTerm} />
        <SortSection onSortChange={onSortChange} sortOption={sortOption} />
        <StatusFilter onStatusChange={onStatusChange} selectedStatus={selectedStatus} />
        <RoleFilter onRoleChange={onRoleChange} selectedRole={selectedRole} />
      </div>
      <div className={styles.secondLine}>
        <ResultsCount searchTerm={searchTerm} totalUsers={totalUsers} />
      </div>
    </section>
  );
};

export default SearchControls;
