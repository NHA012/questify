import styles from '../CreateCourse.module.css';
import React, { useRef } from 'react';

interface UploadSectionProps {
  photoUrl: React.ReactNode;
  onPhotoChange?: (file: File) => void;
  isUploading?: boolean; // Added isUploading prop
}

const UploadSection: React.FC<UploadSectionProps> = ({
  photoUrl,
  onPhotoChange,
  isUploading = false, // Default value of false
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    if (isUploading) return; // Prevent clicking while uploading
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onPhotoChange && !isUploading) {
      onPhotoChange(file);
    }
  };

  return (
    <div className={styles.contentWrapper}>
      <figure className={styles.imageContainer}>{photoUrl}</figure>
      <div className={styles.uploadWrapper}>
        <button
          className={styles.uploadButton}
          onClick={handleUploadClick}
          disabled={isUploading} // Disable button during upload
        >
          {isUploading ? (
            <span className={styles.buttonText}>Uploading...</span>
          ) : (
            <>
              <span className={styles.buttonText}>Upload Image</span>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="upload-icon"
              >
                <path
                  d="M8.0625 7.68647L12 3.75L15.9375 7.68647"
                  stroke="#00ADB5"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 14.2492V3.75195"
                  stroke="#00ADB5"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M20.25 14.25V19.5C20.25 19.6989 20.171 19.8897 20.0303 20.0303C19.8897 20.171 19.6989 20.25 19.5 20.25H4.5C4.30109 20.25 4.11032 20.171 3.96967 20.0303C3.82902 19.8897 3.75 19.6989 3.75 19.5V14.25"
                  stroke="#00ADB5"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </>
          )}
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
          aria-hidden="true"
          disabled={isUploading} // Disable input during upload
        />
      </div>
    </div>
  );
};

export default UploadSection;
