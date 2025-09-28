import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import { LogOut, LayoutDashboard, User, Shield } from 'lucide-react';
import styles from './Header.module.css';
import useRequest from '@/hooks/use-request';
import Router from 'next/router';
import Image from 'next/image';
import { UserRole, UserPayload } from '@/types/profile.type';
import buildClient from '@/api/build-client';

interface LevelInfo {
  level: number;
  currentExp: number;
  expToNextLevel: number;
}

interface CurrentUserWithLevel extends UserPayload {
  levelInfo?: LevelInfo;
}

const AvatarDropdown: React.FC<{
  currentUser: CurrentUserWithLevel;
  setCurrentUser: (user: CurrentUserWithLevel) => void;
  fetchUserProfile: () => Promise<void>;
}> = ({ currentUser, setCurrentUser, fetchUserProfile }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const getInitials = () => {
    if (!currentUser.userName || currentUser.userName.length === 0) return 'U';
    return currentUser.userName.charAt(0).toUpperCase();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const { doRequest: signOutRequest } = useRequest({
    url: '/api/users/signout',
    method: 'post',
    body: {},
    onSuccess: () => Router.push('/'),
    onError: () => {},
  });

  // Function to refresh the current user data
  const refreshCurrentUser = async () => {
    try {
      const client = buildClient({ req: undefined });
      const { data } = await client.get('/api/users/currentuser');
      if (setCurrentUser) {
        setCurrentUser(data.currentUser);
      }
      return data.currentUser;
    } catch (error) {
      console.error('Failed to refresh current user:', error);
      return null;
    }
  };

  const { doRequest: updateRoleRequest } = useRequest({
    url: `/api/users/${currentUser.id}`,
    method: 'patch',
    body: { role: UserRole.Teacher },
    onSuccess: async () => {
      const updatedUser = await refreshCurrentUser();
      if (updatedUser) {
        router.push('/instructor/courses');
      }
    },
    onError: (err) => {
      console.error('Failed to update role:', err);
    },
  });

  const onSignout = async (event) => {
    event.preventDefault();
    await signOutRequest();
    setIsOpen(false);
  };

  const handleTeachClick = async () => {
    if (currentUser.role === UserRole.Student) {
      await updateRoleRequest();
    } else {
      router.push('/instructor/courses');
    }
    setIsOpen(false);
  };

  const handleAvatarClick = async () => {
    if (fetchUserProfile) {
      await fetchUserProfile();
    }
    console.log('Current user:', currentUser);
    setIsOpen(!isOpen);
  };

  return (
    <div className={styles.dropdown} ref={dropdownRef} style={{ position: 'relative' }}>
      {/* Avatar Button */}
      <div
        className={styles.avatarContainer}
        onClick={handleAvatarClick}
        role="button"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {currentUser.imageUrl ? (
          <Image
            src={currentUser.imageUrl}
            alt={currentUser.userName}
            className={styles.avatarImageContainer}
            width={40}
            height={40}
          />
        ) : (
          <div className={styles.avatarFallback}>{getInitials()}</div>
        )}
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className={`${styles.dropdownContent} ${styles.fadeIn}`} role="menu">
          <div className={styles.userInfo}>
            <p className={styles.username}>{currentUser.userName}</p>

            {currentUser.levelInfo && (
              <div className={styles.levelInfoContainer}>
                <div className={styles.levelHeader}>
                  <p className={styles.levelText}>Level {currentUser.levelInfo.level}</p>
                  <p className={styles.expText}>
                    {currentUser.levelInfo.currentExp}/{currentUser.levelInfo.expToNextLevel} XP
                  </p>
                </div>
                <div className={styles.progressBarContainer}>
                  <div
                    className={styles.progressBarFill}
                    style={{
                      width: `${(currentUser.levelInfo.currentExp / currentUser.levelInfo.expToNextLevel) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            )}

            <p className={styles.userRole}>{currentUser.role}</p>
          </div>

          <div className={styles.separator} />

          <div className={styles.menuItem} role="menuitem" onClick={handleTeachClick}>
            <LayoutDashboard className={styles.menuItemIcon} />
            <span>{currentUser.role === UserRole.Student ? 'Teach' : 'Instruction Dashboard'}</span>
          </div>

          <div
            className={styles.menuItem}
            role="menuitem"
            onClick={() => {
              router.push('/profile');
              setIsOpen(false);
            }}
          >
            <User className={styles.menuItemIcon} />
            <span>Profile</span>
          </div>

          {currentUser.role === UserRole.Admin && (
            <div
              className={styles.menuItem}
              role="menuitem"
              onClick={() => {
                router.push('/admin/users');
                setIsOpen(false);
              }}
            >
              <Shield className={styles.menuItemIcon} />
              <span>Administrator</span>
            </div>
          )}

          <div className={styles.separator} />

          <div
            className={`${styles.menuItem} ${styles.destructive}`}
            role="menuitem"
            onClick={onSignout}
          >
            <LogOut className={styles.menuItemIcon} />
            <span>Sign out</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AvatarDropdown;
