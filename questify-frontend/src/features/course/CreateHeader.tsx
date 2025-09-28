import React from 'react';
import styles from './CreateCourse.module.css';

interface CreateHeaderProps {
  title: string;
  onSave?: () => Promise<boolean>;
  isLoading?: boolean;
  onPreview?: () => void;
}

const CreateHeader: React.FC<CreateHeaderProps> = ({
  title,
  onSave,
  isLoading = false,
  onPreview,
}: CreateHeaderProps) => {
  const handleSave = async () => {
    if (onSave) {
      await onSave();
    }
  };

  const handlePreview = () => {
    if (onPreview) {
      onPreview();
    }
  };

  return (
    <header className={styles.header}>
      <h1 className={styles.headerTitle}>{title}</h1>
      {title !== 'Students' && (
        <div className={styles.buttonContainer}>
          <button className={styles.saveButtonHeader} onClick={handleSave} disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save'}
          </button>
          <button className={styles.previewButton} onClick={handlePreview}>
            Preview
          </button>
        </div>
      )}
    </header>
  );
};

export default CreateHeader;
