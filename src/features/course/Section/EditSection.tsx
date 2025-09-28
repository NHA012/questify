import type React from 'react';
import { useEffect, useState } from 'react';
import { ChevronUp, ChevronDown, X } from 'lucide-react';
import styles from './Section.module.css';
import InputField from '@/components/ui/InputField/InputField';
import { Island as CourseIsland } from '@/types/courses.type';
import {
  IslandTemplate,
  IslandBackgroundImage,
  getPathTypeFromBackgroundUrl,
  getPathTypeName,
} from '@/types/islands.type';
import { IslandPathType } from '@datn242/questify-common';
import Image from 'next/image';

// Create a merged interface that includes properties from both types
interface EditableIsland extends CourseIsland {
  islandTemplateId?: string;
  pathType?: IslandPathType;
  islandBackgroundImageId?: string;
  template?: {
    id: string;
    name: string;
    imageUrl: string;
  };
  isDeleted?: boolean;
}

interface EditSectionModalProps {
  section: EditableIsland;
  onClose: () => void;
  onSave: (section: EditableIsland) => void;
  sections?: EditableIsland[];
  islandTemplates: IslandTemplate[];
  backgroundImages: IslandBackgroundImage[];
}

export default function EditSection({
  section,
  onClose,
  onSave,
  sections,
  islandTemplates,
  backgroundImages,
}: EditSectionModalProps) {
  const [editFormData, setEditFormData] = useState<Partial<EditableIsland>>({
    name: section.name,
    description: section.description || '',
    prerequisites: section.prerequisites || [],
    prerequisiteIslandIds: section.prerequisites?.map((p) => p.id) || [],
    islandTemplateId: section.islandTemplateId || null,
    pathType: section.pathType || null,
    islandBackgroundImageId: section.islandBackgroundImageId || null,
  });

  const [showIslandDropdown, setShowIslandDropdown] = useState(false);
  const [showMapPathDropdown, setShowMapPathDropdown] = useState(false);
  const [showPrerequisiteDropdown, setShowPrerequisiteDropdown] = useState(false);

  // Find the selected template and background image
  const selectedTemplate = islandTemplates.find((t) => t.id === editFormData.islandTemplateId);
  const selectedBackground = backgroundImages.find(
    (b) => b.id === editFormData.islandBackgroundImageId,
  );

  useEffect(() => {
    setEditFormData({
      ...section,
      prerequisiteIslandIds: section.prerequisites?.map((p) => p.id) || [],
    });
  }, [section]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setEditFormData((prev) => ({ ...prev, name: value }));
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setEditFormData((prev) => ({ ...prev, description: value }));
  };

  const togglePrerequisite = (id: string) => {
    setEditFormData((prev) => {
      const currentPrereqIds = prev.prerequisiteIslandIds || [];
      const exists = currentPrereqIds.includes(id);

      if (exists) {
        const updatedIds = currentPrereqIds.filter((pid) => pid !== id);

        return {
          ...prev,
          prerequisiteIslandIds: updatedIds,
        };
      } else {
        const sectionToAdd = sections?.find((s) => s.id === id);
        if (sectionToAdd) {
          return {
            ...prev,
            prerequisiteIslandIds: [...currentPrereqIds, id],
          };
        }
        return prev;
      }
    });
  };

  const selectIslandTemplate = (templateId: string) => {
    setEditFormData((prev) => ({
      ...prev,
      islandTemplateId: templateId,
    }));
    setShowIslandDropdown(false);
  };

  const selectBackgroundImage = (backgroundId: string) => {
    // Find the background image
    const background = backgroundImages.find((b) => b.id === backgroundId);

    // Determine path type based on the background image URL
    let pathType = null;
    if (background) {
      pathType = getPathTypeFromBackgroundUrl(background.imageUrl);
    }

    setEditFormData((prev) => ({
      ...prev,
      islandBackgroundImageId: backgroundId,
      pathType: pathType,
    }));

    setShowMapPathDropdown(false);
  };

  const saveChanges = () => {
    const updatedSection: EditableIsland = {
      ...section,
      ...editFormData,
      prerequisiteIslandIds: editFormData.prerequisiteIslandIds,
    } as EditableIsland;

    onSave(updatedSection);
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>Edit Island</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className={styles.modalContent}>
          <InputField
            label="Name"
            type="name"
            placeholder={editFormData.name || 'Enter island name'}
            value={editFormData.name || ''}
            onChange={handleNameChange}
            className="mb-9 max-sm:mb-6"
          />

          <InputField
            label="Description"
            type="description"
            placeholder={editFormData.description || 'Enter island description'}
            value={editFormData.description || ''}
            onChange={handleDescriptionChange}
            className="mb-9 max-sm:mb-6"
          />

          <div className={styles.formGroup}>
            <label>Prerequisites</label>
            <div className={styles.dropdownContainer}>
              <button
                className={styles.dropdownButton}
                onClick={() => setShowPrerequisiteDropdown(!showPrerequisiteDropdown)}
              >
                {editFormData.prerequisiteIslandIds?.length
                  ? sections
                      ?.filter((s) => editFormData.prerequisiteIslandIds?.includes(s.id))
                      .map((s) => s.name)
                      .join(', ')
                  : 'None'}
                {showPrerequisiteDropdown ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>

              {showPrerequisiteDropdown && (
                <div className={styles.dropdownMenu}>
                  {(sections || [])
                    .filter((s) => s.id !== section.id)
                    .map((s) => {
                      const selected = editFormData.prerequisiteIslandIds?.includes(s.id);
                      return (
                        <div
                          key={s.id}
                          className={`${styles.dropdownItem} ${selected ? styles.selected : ''}`}
                          onClick={() => togglePrerequisite(s.id)}
                        >
                          {s.name} {selected ? '(Selected)' : ''}
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Island Template</label>
            <div className={styles.dropdownContainer}>
              <button
                className={styles.dropdownButton}
                onClick={() => setShowIslandDropdown(!showIslandDropdown)}
              >
                {selectedTemplate ? selectedTemplate.name : 'Select Island Template'}
                {showIslandDropdown ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>

              {showIslandDropdown && (
                <div className={styles.islandOptions}>
                  <div className={styles.islandGrid}>
                    {islandTemplates.map((template) => (
                      <div
                        key={template.id}
                        className={`${styles.islandOption} ${
                          editFormData.islandTemplateId === template.id ? styles.selected : ''
                        }`}
                        onClick={() => selectIslandTemplate(template.id)}
                      >
                        <Image
                          src={template.imageUrl}
                          alt={template.name}
                          className={styles.islandImage}
                          width={100}
                          height={100}
                        />
                        <div className={styles.islandOptionName}>{template.name}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Map Background</label>
            <div className={styles.dropdownContainer}>
              <button
                className={styles.dropdownButton}
                onClick={() => setShowMapPathDropdown(!showMapPathDropdown)}
              >
                {selectedBackground
                  ? getPathTypeName(editFormData.pathType as IslandPathType)
                  : 'Select Map Background'}
                {showMapPathDropdown ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>

              {showMapPathDropdown && (
                <div className={styles.islandOptions}>
                  <div className={styles.islandGrid}>
                    {backgroundImages.map((background) => (
                      <div
                        key={background.id}
                        className={`${styles.mapPathOption} ${
                          editFormData.islandBackgroundImageId === background.id
                            ? styles.selected
                            : ''
                        }`}
                        onClick={() => selectBackgroundImage(background.id)}
                      >
                        <Image
                          src={background.imageUrl}
                          alt={getPathTypeName(
                            getPathTypeFromBackgroundUrl(background.imageUrl) as IslandPathType,
                          )}
                          className={styles.islandImage}
                          width={100}
                          height={100}
                        />
                        {/* <div className={styles.mapPathOptionName}>
                          {getPathTypeName(
                            getPathTypeFromBackgroundUrl(background.imageUrl) as IslandPathType,
                          )}
                        </div> */}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className={styles.modalFooter}>
            <button className={styles.cancelButton} onClick={onClose}>
              Cancel
            </button>
            <button className={styles.saveButton} onClick={saveChanges}>
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
