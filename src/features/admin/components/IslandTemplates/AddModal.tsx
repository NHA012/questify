'use client';

import React, { useState, useRef } from 'react';
import styles from './AddModal.module.css';

// CloseIcon Component
interface CloseIconProps {
  onClick?: () => void;
}

const CloseIcon: React.FC<CloseIconProps> = ({ onClick }) => {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: '18px', height: '18px', cursor: 'pointer' }}
      onClick={onClick}
    >
      <path
        d="M14.0625 3.9375L3.9375 14.0625"
        stroke="#8C94A3"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.0625 14.0625L3.9375 3.9375"
        stroke="#8C94A3"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

// ImagePlaceholderIcon Component
const ImagePlaceholderIcon: React.FC = () => {
  return (
    <svg
      width="124"
      height="124"
      viewBox="0 0 124 124"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: '124px', height: '124px' }}
    >
      <path
        opacity="0.2"
        d="M15.5078 81.3749L39.8927 56.99C40.2525 56.6302 40.6797 56.3448 41.1498 56.15C41.62 55.9553 42.1239 55.8551 42.6327 55.8551C43.1416 55.8551 43.6455 55.9553 44.1156 56.15C44.5858 56.3448 45.013 56.6302 45.3728 56.99L67.0177 78.635C67.3775 78.9948 67.8047 79.2802 68.2748 79.4749C68.745 79.6697 69.2489 79.7699 69.7577 79.7699C70.2666 79.7699 70.7705 79.6697 71.2406 79.4749C71.7108 79.2802 72.138 78.9948 72.4978 78.635L82.5177 68.615C82.8775 68.2552 83.3047 67.9698 83.7748 67.775C84.245 67.5803 84.7489 67.4801 85.2577 67.4801C85.7666 67.4801 86.2705 67.5803 86.7406 67.775C87.2108 67.9698 87.638 68.2552 87.9978 68.615L108.508 89.125L108.508 27.125C108.508 26.0973 108.1 25.1117 107.373 24.385C106.646 23.6583 105.661 23.25 104.633 23.25H19.3828C18.3551 23.25 17.3695 23.6583 16.6428 24.385C15.9161 25.1117 15.5078 26.0973 15.5078 27.125V81.3749Z"
        fill="#B7BAC7"
      />
      <path
        d="M104.633 23.25H19.3828C17.2427 23.25 15.5078 24.9849 15.5078 27.125V96.875C15.5078 99.0151 17.2427 100.75 19.3828 100.75H104.633C106.773 100.75 108.508 99.0151 108.508 96.875V27.125C108.508 24.9849 106.773 23.25 104.633 23.25Z"
        stroke="#B7BAC7"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.5078 81.3753L39.8927 56.9904C40.2525 56.6306 40.6797 56.3452 41.1498 56.1504C41.62 55.9557 42.1239 55.8555 42.6327 55.8555C43.1416 55.8555 43.6455 55.9557 44.1156 56.1504C44.5858 56.3452 45.013 56.6306 45.3728 56.9904L67.0177 78.6354C67.3775 78.9952 67.8047 79.2806 68.2748 79.4754C68.745 79.6701 69.2489 79.7703 69.7577 79.7703C70.2666 79.7703 70.7705 79.6701 71.2406 79.4754C71.7108 79.2806 72.1379 78.9952 72.4978 78.6354L82.5177 68.6154C82.8775 68.2556 83.3047 67.9702 83.7748 67.7754C84.245 67.5807 84.7489 67.4805 85.2577 67.4805C85.7666 67.4805 86.2705 67.5807 86.7406 67.7754C87.2108 67.9702 87.6379 68.2556 87.9978 68.6154L108.508 89.1254"
        stroke="#B7BAC7"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M75.5703 54.25C78.7805 54.25 81.3828 51.6477 81.3828 48.4375C81.3828 45.2273 78.7805 42.625 75.5703 42.625C72.3602 42.625 69.7578 45.2273 69.7578 48.4375C69.7578 51.6477 72.3602 54.25 75.5703 54.25Z"
        fill="#B7BAC7"
      />
    </svg>
  );
};

// UploadIcon Component
const UploadIcon: React.FC = () => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: '24px', height: '24px' }}
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
  );
};

// InputDesignHeader Component
interface InputDesignHeaderProps {
  onClose?: () => void;
}

const InputDesignHeader: React.FC<InputDesignHeaderProps> = ({ onClose }) => {
  return (
    <header className={styles.header}>
      <h2 className={styles.headerTitle}>Adding New Island Template</h2>
      <CloseIcon onClick={onClose} />
    </header>
  );
};

// NameInput Component
interface NameInputProps {
  onChange?: (value: string) => void;
}

const NameInput: React.FC<NameInputProps> = ({ onChange }) => {
  const [name, setName] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <div className={styles.nameInputContainer}>
      <label htmlFor="template-name" className={styles.inputLabel}>
        Name
      </label>
      <div className={styles.inputWrapper}>
        <input
          id="template-name"
          type="text"
          className={styles.textInput}
          placeholder="Enter the Island Template name"
          value={name}
          onChange={handleChange}
        />
      </div>
    </div>
  );
};

// ImageUpload Component
interface ImageUploadProps {
  onImageUpload?: (file: File) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageUpload }) => {
  //const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      //setSelectedImage(file);
      if (onImageUpload) {
        onImageUpload(file);
      }
    }
  };

  return (
    <div className={styles.imageUploadContainer}>
      <h3 className={styles.imageLabel}>Island Image</h3>
      <div className={styles.imageUploadContent}>
        <figure className={styles.imagePlaceholder}>
          <ImagePlaceholderIcon />
        </figure>
        <div className={styles.guidelinesContainer}>
          <p className={styles.guidelines}>
            Upload your Island image here.
            <span className={styles.boldText}> Important guidelines:</span>
            1200x800 pixels or 12:8 Ratio. Supported format:
            <span className={styles.boldText}> .jpg, .jpe, .pn or .svg</span>
          </p>
          <button
            className={styles.uploadButton}
            onClick={handleUploadClick}
            aria-label="Upload image"
          >
            <span className={styles.uploadButtonText}>Upload image</span>
            <UploadIcon />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            accept=".jpg,.jpeg,.png,.svg"
            onChange={handleFileChange}
          />
        </div>
      </div>
    </div>
  );
};

// ActionButtons Component
interface ActionButtonsProps {
  onCancel?: () => void;
  onSave?: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ onCancel, onSave }) => {
  return (
    <div className={styles.actionButtonsContainer}>
      <button className={styles.cancelButton} onClick={onCancel} aria-label="Cancel">
        Cancel
      </button>
      <button className={styles.saveButton} onClick={onSave} aria-label="Save Changes">
        Save Changes
      </button>
    </div>
  );
};

// InputDesign Component
interface InputDesignProps {
  onClose?: () => void;
  onSave?: (data: { name: string; image: File | null }) => void;
}

const InputDesign: React.FC<InputDesignProps> = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    image: null as File | null,
  });

  const handleNameChange = (name: string) => {
    setFormData((prev) => ({ ...prev, name }));
  };

  const handleImageUpload = (image: File) => {
    setFormData((prev) => ({ ...prev, image }));
  };

  const handleSave = () => {
    if (onSave) {
      onSave(formData);
    }
  };

  return (
    <section className={styles.container}>
      <InputDesignHeader onClose={onClose} />
      <div className={styles.formContent}>
        <NameInput onChange={handleNameChange} />
        <ImageUpload onImageUpload={handleImageUpload} />
        <ActionButtons onCancel={onClose} onSave={handleSave} />
      </div>
    </section>
  );
};

// Main AddModal Component
interface AddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { name: string; image: File | null }) => void;
}

const AddModal: React.FC<AddModalProps> = ({ isOpen, onClose, onSave }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
        <InputDesign onClose={onClose} onSave={onSave} />
      </div>
    </div>
  );
};

export default AddModal;
