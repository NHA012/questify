'use client';
import React, { useState } from 'react';
import styles from './UserTable.module.css';
import { UserStatus } from '@datn242/questify-common';
import { User } from '@/features/admin/UserData';
import Dialog from '../Dialog';

export const TableHeader: React.FC = () => {
  return (
    <header className={styles.tableHeader}>
      <div className={styles.headerRow}>
        <div className={styles.idHeader}>ID</div>
        <div className={styles.usernameHeader}>Username</div>
        <div className={styles.emailHeader}>Email</div>
        <div className={styles.roleHeader}>Role</div>
        <div className={styles.statusHeader}>Status</div>
        <div className={styles.actionsHeader}>Actions</div>
      </div>
    </header>
  );
};

// TableRow Component
interface TableRowProps {
  id: string;
  username: string;
  email: string;
  role: string;
  status: string;
  onViewDetails: () => void;
  onChangeStatus: (newStatus: UserStatus.Active | UserStatus.Suspended) => void;
}

export const TableRow: React.FC<TableRowProps> = ({
  id,
  username,
  email,
  role,
  status,
  onViewDetails,
  onChangeStatus,
}) => {
  const [showDialog, setShowDialog] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<
    UserStatus.Active | UserStatus.Suspended | null
  >(null);

  const handleStatusChangeRequest = (newStatus: UserStatus.Active | UserStatus.Suspended) => {
    setPendingStatus(newStatus);
    setShowDialog(true);
  };

  const confirmStatusChange = () => {
    if (pendingStatus) {
      onChangeStatus(pendingStatus);
      setShowDialog(false);
      setPendingStatus(null);
    }
  };

  const cancelStatusChange = () => {
    setShowDialog(false);
    setPendingStatus(null);
  };

  return (
    <div className={styles.tableRow}>
      <div className={styles.rowContent}>
        <div className={styles.idCell}>{id}</div>
        <div className={styles.usernameCell}>{username}</div>
        <div className={styles.emailCell}>{email}</div>
        <div className={styles.roleCell}>{role}</div>
        <div className={styles.statusCell}>{status}</div>
        <div className={styles.actionsCell}>
          <button
            className={styles.actionButton}
            onClick={onViewDetails}
            aria-label="View user details"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8 3.33337C4.66667 3.33337 1.82 5.40004 0 8.00004C1.82 10.6 4.66667 12.6667 8 12.6667C11.3333 12.6667 14.18 10.6 16 8.00004C14.18 5.40004 11.3333 3.33337 8 3.33337Z"
                stroke="#1D2026"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8 10C9.10457 10 10 9.10457 10 8C10 6.89543 9.10457 6 8 6C6.89543 6 6 6.89543 6 8C6 9.10457 6.89543 10 8 10Z"
                stroke="#1D2026"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          {status === 'active' ? (
            <button
              className={styles.actionButton}
              onClick={() => handleStatusChangeRequest(UserStatus.Suspended)}
              aria-label="Suspend user"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2 8H14"
                  stroke="#E53935"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          ) : (
            <button
              className={styles.actionButton}
              onClick={() => handleStatusChangeRequest(UserStatus.Active)}
              aria-label="Activate user"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2.5 8H13.5"
                  stroke="#43A047"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8 2.5V13.5"
                  stroke="#43A047"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      {showDialog && (
        <Dialog
          title={pendingStatus === UserStatus.Suspended ? 'Suspend User' : 'Activate User'}
          message={
            pendingStatus === UserStatus.Suspended
              ? `Are you sure you want to suspend ${username}? They will no longer be able to use their account.`
              : `Are you sure you want to activate ${username}? They will regain access to their account.`
          }
          confirmText={pendingStatus === UserStatus.Suspended ? 'Suspend' : 'Activate'}
          cancelText="Cancel"
          onConfirm={confirmStatusChange}
          onCancel={cancelStatusChange}
        />
      )}
    </div>
  );
};

interface UserTableProps {
  users: User[];
  onViewDetails: (userId: string) => void;
  onChangeStatus: (userId: string, newStatus: UserStatus.Active | UserStatus.Suspended) => void;
}

const UserTable: React.FC<UserTableProps> = ({ users, onViewDetails, onChangeStatus }) => {
  return (
    <div className={styles.tableContainer}>
      <TableHeader />
      <div className={styles.divider} />
      <div className={styles.tableBody}>
        {users.length > 0 ? (
          users.map((user) => (
            <TableRow
              key={user.id}
              id={user.id}
              username={user.userName}
              email={user.gmail}
              role={user.role}
              status={user.status}
              onViewDetails={() => onViewDetails(user.id)}
              onChangeStatus={(newStatus) => onChangeStatus(user.id, newStatus)}
            />
          ))
        ) : (
          <div className={styles.noResults}>
            <p>No users match your criteria. Try adjusting your filters or search term.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserTable;
