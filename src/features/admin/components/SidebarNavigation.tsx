'use client';
import React, { useState } from 'react';
import styles from './SidebarNavigation.module.css';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { stackIcon } from '@/assets/icons';

// NavItem component
interface NavItemProps {
  icon: string;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, isActive, onClick }) => {
  return (
    <button
      className={`${styles.navButton} ${isActive ? styles.activeNavButton : ''}`}
      onClick={onClick}
      aria-current={isActive ? 'page' : undefined}
    >
      <div className={styles.navContent}>
        <span className={styles.iconWrapper}>
          <Image src={icon} alt={`${label} icon`} width={24} height={24} />
        </span>
        <span className={styles.activeLabel}>{label}</span>
      </div>
    </button>
  );
};

interface SidebarNavigationProps {
  activeItem: string;
}

const SidebarNavigation: React.FC<SidebarNavigationProps> = ({ activeItem: initialActiveItem }) => {
  const router = useRouter();
  const [activeItem, setActiveItem] = useState(initialActiveItem);

  const navigationItems = [
    {
      id: 'users',
      label: 'User Managment',
      icon: stackIcon,
    },
    {
      id: 'courses',
      label: 'Course Management',
      icon: stackIcon,
    },
    // {
    //   id: 'island-templates',
    //   label: 'Island Template Management',
    //   icon: stackIcon,
    // },
  ];

  const handleNavItemClick = (id: string) => {
    setActiveItem(id);
    switch (id) {
      case 'courses':
        router.push('/admin/courses');
        break;
      case 'users':
        router.push('/admin/users');
        break;
      case 'island-templates':
        router.push('/admin/island-templates');
        break;
      default:
        break;
    }
  };

  return (
    <nav className={styles.sidebar}>
      <ul className={styles.navList}>
        {navigationItems.map((item) => (
          <li key={item.id} className={styles.navItem}>
            <NavItem
              icon={item.icon}
              label={item.label}
              isActive={activeItem === item.id}
              onClick={() => handleNavItemClick(item.id)}
            />
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default SidebarNavigation;
