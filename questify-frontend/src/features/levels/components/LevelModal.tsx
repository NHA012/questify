import React, { useEffect, useCallback } from 'react';
import styles from './LevelModal.module.css';
import { CompletionStatus, LevelContent } from '@datn242/questify-common';

interface LevelModalProps {
  isModalOpen: boolean;
  modalPosition: { left: number; top: number };
  modalContent: {
    name: string;
    description: string;
    completionStatus: CompletionStatus;
    point: number;
    contentType?: string; // Added contentType
  };
  onClose: () => void;
  renderButtons: () => React.ReactNode;
  isInstructor?: boolean;
}

const LevelModal: React.FC<LevelModalProps> = ({
  isModalOpen,
  modalPosition,
  modalContent,
  onClose,
  renderButtons,
  isInstructor = false,
}) => {
  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if ((event.target as HTMLElement).closest(`.${styles.modalContent}`) === null) {
        onClose();
      }
    },
    [onClose],
  );

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]);

  if (!isModalOpen) return null;

  // Display status in a more user-friendly way
  const getStatusText = (status: CompletionStatus) => {
    switch (status) {
      case CompletionStatus.Completed:
        return 'Completed';
      case CompletionStatus.InProgress:
        return 'In Progress';
      case CompletionStatus.Fail:
        return 'Failed';
      case CompletionStatus.Locked:
        return 'Locked';
      default:
        return '';
    }
  };

  return (
    <div
      className={styles.levelModal}
      style={{
        position: 'relative',
        left: `${modalPosition.left}px`,
        top: `${modalPosition.top}px`,
      }}
    >
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>{modalContent.name}</h2>
          {!isInstructor && (
            <div className={styles.modalStatus}>
              <span
                className={
                  modalContent.completionStatus === CompletionStatus.Completed
                    ? styles.statusCompleted
                    : modalContent.completionStatus === CompletionStatus.InProgress
                      ? styles.statusInProgress
                      : modalContent.completionStatus === CompletionStatus.Fail
                        ? styles.statusFail
                        : styles.statusLocked
                }
              >
                {getStatusText(modalContent.completionStatus)}
              </span>
            </div>
          )}
        </div>

        {/* Content Type Tag */}
        {modalContent.contentType && (
          <div
            className={`${styles.contentTypeTag} ${
              modalContent.contentType === LevelContent.CodeProblem
                ? styles.codeProblemType
                : styles.challengeType
            }`}
          >
            {modalContent.contentType === LevelContent.CodeProblem ? 'Code Problem' : 'Challenge'}
          </div>
        )}

        <p className={styles.modalDescription}>{modalContent.description}</p>

        {!isInstructor && modalContent.completionStatus === CompletionStatus.Completed && (
          <p className={styles.modalPoints}>Points earned: {modalContent.point}</p>
        )}

        <div className={styles.buttonsContainer}>{renderButtons()}</div>
      </div>
    </div>
  );
};

export default LevelModal;
