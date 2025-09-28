import React, { useState, useEffect } from 'react';
import styles from '../CreateCourse.module.css';

function HeaderTab({ tabs, defaultActiveTab, onTabChange }) {
  const [activeTab, setActiveTab] = useState(defaultActiveTab || tabs[0]?.id);

  useEffect(() => {
    setActiveTab(defaultActiveTab || tabs[0]?.id);
  }, [defaultActiveTab, tabs]);

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    if (onTabChange) {
      onTabChange(tabId);
    }
  };

  return (
    <nav className={styles.tabNavigation}>
      {tabs.map((tab) => (
        <div
          key={tab.id}
          className={`${activeTab === tab.id ? styles.activeTab : styles.inactiveTab} ${styles.tabCursor}`}
          onClick={() => handleTabClick(tab.id)}
        >
          <div className={styles.tabContent}>
            {React.cloneElement(tab.icon, { isActive: activeTab === tab.id })}
            <h2 className={activeTab === tab.id ? styles.tabTitle : styles.inactiveTabTitle}>
              {tab.label}
            </h2>
          </div>
        </div>
      ))}
    </nav>
  );
}

export default HeaderTab;
