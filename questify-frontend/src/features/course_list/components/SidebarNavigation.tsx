'use client';
import React, { useState } from 'react';
import styles from './SidebarNavigation.module.css';
import Image from 'next/image';
import { chartBarIcon, creditCardIcon, gearIcon, stackIcon } from '@/assets/icons';

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

// SidebarNavigation component
const SidebarNavigation: React.FC = () => {
  const [activeItem, setActiveItem] = useState('courses');

  const navigationItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: chartBarIcon,
    },
    {
      id: 'courses',
      label: 'My Courses',
      icon: stackIcon,
    },
    {
      id: 'earning',
      label: 'Earning',
      icon: creditCardIcon,
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: gearIcon,
    },
  ];

  const handleNavItemClick = (id: string) => {
    setActiveItem(id);
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
