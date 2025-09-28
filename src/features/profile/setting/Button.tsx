import React from 'react';
import styles from '../Profile.module.css';

interface ButtonProps {
  onResetPassword: () => void;
  onSaveChanges: () => void;
  isSaving?: boolean;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  onResetPassword,
  onSaveChanges,
  isSaving = false,
  disabled = false,
}) => {
  return (
    <div className="flex gap-5 justify-end mt-10 max-sm:flex-col">
      <button
        onClick={onResetPassword}
        className={styles.resetButton}
        type="button"
        disabled={disabled || isSaving}
      >
        Reset Password
      </button>
      <button
        onClick={onSaveChanges}
        className={styles.saveButton}
        type="button"
        disabled={disabled || isSaving}
      >
        {isSaving ? 'Saving...' : 'Save changes'}
      </button>
    </div>
  );
};

export default Button;
