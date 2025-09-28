import React, { useState, useEffect } from 'react';
import styles from '../Profile.module.css';

interface Tab {
  id: string;
  label: string;
}

interface ContentTabsProps {
  tabs: Tab[];
  defaultActiveTab?: string;
  onTabChange?: (tabId: string) => void;
}

const ContentTabs: React.FC<ContentTabsProps> = ({ tabs, defaultActiveTab, onTabChange }) => {
  const [activeTab, setActiveTab] = useState(defaultActiveTab || tabs[0]?.id);

  useEffect(() => {
    setActiveTab(defaultActiveTab || tabs[0]?.id);
  }, [defaultActiveTab, tabs]);

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    if (onTabChange) {
      onTabChange(tabId);
    }
  };

  return (
    <nav className={styles.tabs}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={activeTab === tab.id ? styles.tabactive : styles.tab}
          onClick={() => handleTabClick(tab.id)}
          aria-selected={activeTab === tab.id}
          role="tab"
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
};

export default ContentTabs;
