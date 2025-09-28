import { useState } from 'react';
import { X } from 'lucide-react';
import styles from './Section.module.css';
import InputField from '@/components/ui/InputField/InputField';
import { Level } from '@/types/courses.type';

interface EditLevelProps {
  sectionId: string;
  onClose: () => void;
  onSave: (newLevel: Level) => void;
  currentLevelsCount?: number;
}

export default function EditLevel({
  sectionId,
  onClose,
  onSave,
  currentLevelsCount = 0,
}: EditLevelProps) {
  const [levelName, setLevelName] = useState('');
  const [levelDescription, setLevelDescription] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = (e) => {
    e.preventDefault(); // Prevent default form submission

    if (isSaving) return; // Prevent multiple clicks

    if (levelName.trim() && levelDescription.trim()) {
      setIsSaving(true);

      const newLevel = {
        name: levelName,
        description: levelDescription,
        islandId: sectionId,
        position: currentLevelsCount + 1,
        id: '',
        contentType: null,
      } as Level;

      onSave(newLevel);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>Add New Level</h2>
          <button className={styles.closeButton} onClick={onClose} type="button">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSave} className={styles.modalContent}>
          <InputField
            label="Name *"
            type="text"
            placeholder="Enter level name"
            value={levelName}
            onChange={(e) => setLevelName(e.target.value)}
            className="mb-9 max-sm:mb-6"
          />

          <InputField
            label="Description *"
            type="text"
            placeholder="Enter level description"
            value={levelDescription}
            onChange={(e) => setLevelDescription(e.target.value)}
            className="mb-9 max-sm:mb-6"
          />

          <div className={styles.modalFooter}>
            <button type="button" className={styles.cancelButton} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={styles.saveButton} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
