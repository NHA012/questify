import React from 'react';
import styles from './activeEffectNotification.module.css';

interface ActiveEffectNotificationProps {
  effectType: string;
  effectDescription: string;
}

const ActiveEffectNotification: React.FC<ActiveEffectNotificationProps> = ({
  effectType,
  effectDescription,
}) => {
  return (
    <div className={styles.activeEffectContainer}>
      <div className={styles.activeEffectBadge}>
        <div className={styles.activeEffectIcon}>{effectType.startsWith('exp') ? '✨' : '💰'}</div>
        <div className={styles.activeEffectText}>
          <span className={styles.activeEffectTitle}>Active Effect</span>
          <span className={styles.activeEffectDescription}>{effectDescription}</span>
          <span className={styles.activeEffectHint}>
            Will be applied to your next completed level
          </span>
        </div>
      </div>
    </div>
  );
};

export default ActiveEffectNotification;
