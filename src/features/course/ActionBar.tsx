import * as React from 'react';
import styles from './CreateCourse.module.css';

interface ActionBarProps {
  onCancel?: () => void;
  onSaveNext?: () => void;
  cancelText?: string;
  saveText?: string;
  isLoading?: boolean;
}

function ActionBar({
  onCancel,
  onSaveNext,
  cancelText = 'Cancel',
  saveText = 'Next',
  isLoading = false,
}: ActionBarProps) {
  return (
    <section className={styles.actionBarContainer}>
      <button
        className={styles.cancelButton}
        onClick={onCancel}
        type="button"
        aria-label={cancelText}
        disabled={isLoading}
      >
        {cancelText}
      </button>
      <button
        className={styles.saveButton}
        onClick={onSaveNext}
        type="button"
        aria-label={saveText}
        disabled={isLoading}
      >
        {isLoading ? (saveText === 'Next' ? 'Saving...' : 'Saving...') : saveText}
      </button>
    </section>
  );
}

export default ActionBar;
