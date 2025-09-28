import { X, PlusCircle, FileUp, Loader2 } from 'lucide-react';
import type React from 'react';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Section.module.css';

interface Level {
  id: string;
  name: string;
  contentType?: string;
}

interface ChallengeModalProps {
  level: Level;
  onClose: () => void;
}

export default function Challenge({ level, onClose }: ChallengeModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [fileUploadLoading, setFileUploadLoading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        setFileUploadLoading(true);
        setUploadError(null);

        // Create FormData to send the file
        const formData = new FormData();
        formData.append('pdf', file); // Changed from 'file' to 'pdf' to match API expectations

        const response = await fetch(`/api/course-mgmt/level/${level.id}/pdf`, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Failed to upload PDF: ${response.statusText}`);
        }

        const data = await response.json();

        router.push(`/instructor/challenge/${data.challenge.id}`);
      } catch (error) {
        console.error('Error uploading PDF:', error);
        setUploadError(error instanceof Error ? error.message : 'Failed to upload PDF');
      } finally {
        setFileUploadLoading(false);
      }
    }
  };

  const handleCreateEmpty = async () => {
    try {
      setIsLoading(true);

      const response = await fetch(`/api/course-mgmt/level/${level.id}/challenge`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        throw new Error('Failed to create challenge');
      }

      const data = await response.json();

      router.push(`/instructor/challenge/${data.id}`);
    } catch (error) {
      console.error('Error creating challenge:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>Challenge</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className={styles.modalContent}>
          <div className={styles.optionsContainer}>
            <button
              className={styles.optionButton}
              onClick={handleUploadClick}
              disabled={fileUploadLoading}
            >
              <div className={styles.optionIcon}>
                {fileUploadLoading ? (
                  <Loader2 size={40} color="#00adb5" className={styles.spinner} />
                ) : (
                  <FileUp size={40} color="#00adb5" />
                )}
              </div>
              <div className={styles.optionText}>
                <h3>Upload Slides (PDF)</h3>
                <p>
                  {fileUploadLoading
                    ? 'Uploading PDF file...'
                    : 'Upload a presentation to create a challenge'}
                </p>
                {uploadError && <p style={{ color: '#ff4d4f', marginTop: '8px' }}>{uploadError}</p>}
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf"
                style={{ display: 'none' }}
                disabled={fileUploadLoading}
              />
            </button>

            <button
              className={styles.optionButton}
              onClick={handleCreateEmpty}
              disabled={isLoading || fileUploadLoading}
            >
              <div className={styles.optionIcon}>
                {isLoading ? (
                  <Loader2 size={40} color="#00adb5" className={styles.spinner} />
                ) : (
                  <PlusCircle size={40} color="#00adb5" />
                )}
              </div>
              <div className={styles.optionText}>
                <h3>Create an empty challenge</h3>
                <p>
                  {isLoading
                    ? 'Creating challenge...'
                    : 'Start with a blank challenge and add content later'}
                </p>
              </div>
            </button>
          </div>

          <div className={styles.modalFooter}>
            <button
              className={styles.cancelButton}
              onClick={onClose}
              disabled={isLoading || fileUploadLoading}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
