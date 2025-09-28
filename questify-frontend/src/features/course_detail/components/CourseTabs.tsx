import React from 'react';
import styles from './CourseTabs.module.css';

interface TabProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const Tab: React.FC<TabProps> = ({ label, isActive, onClick }) => {
  return (
    <div
      className={isActive ? styles.tabActive : styles.tab}
      onClick={onClick}
      role="tab"
      aria-selected={isActive}
      tabIndex={0}
    >
      {label}
    </div>
  );
};

const tabs = ['Overview', 'Curriculum', 'Instructor', 'Review'];

interface CourseTabsProps {
  activeTab: number;
  setActiveTab: (index: number) => void;
}

const CourseTabs: React.FC<CourseTabsProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className={styles.tabsContainer} role="tablist">
      {tabs.map((tab, index) => (
        <Tab
          key={tab}
          label={tab}
          isActive={index === activeTab}
          onClick={() => setActiveTab(index)}
        />
      ))}
    </div>
  );
};

export default CourseTabs;
