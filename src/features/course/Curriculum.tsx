import React, { useState, useEffect } from 'react';
import ImageHolder from './ImageHolder/ImageHolder';
import { islandImage } from '@/assets/images';
import Image from 'next/image';
import Section from './Section/Section';
import ItemTemplateSelection from './ItemTemplateSelection/ItemTemplateSelection';
import { useCourseItemTemplateData } from '@/services/ItemTemplateService';
import { uploadImage } from '@/assets/firebase/uploadImage';
import useRequest from '@/hooks/use-request';

interface CurriculumProps {
  courseId: string | null;
  backgroundImage?: string;
  onBackgroundImageChange?: (url: string) => void;
}

const Curriculum: React.FC<CurriculumProps> = ({
  courseId,
  backgroundImage,
  onBackgroundImageChange,
}) => {
  const {
    selectedItemIds,
    loading: templateLoading,
    error: templateError,
    updateSelectedItems,
  } = useCourseItemTemplateData(courseId || '');

  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [backgroundImageUrl, setBackgroundImageUrl] = useState<string | null>(
    backgroundImage || null,
  );

  // Update the local state when the prop changes
  useEffect(() => {
    if (backgroundImage) {
      setBackgroundImageUrl(backgroundImage);
    }
  }, [backgroundImage]);

  // Update course background image
  const { doRequest: updateCourseRequest } = useRequest({
    url: courseId ? `/api/course-mgmt/course/${courseId}` : null,
    method: 'patch',
    body: {},
    onSuccess: (data) => {
      console.log('Course background updated successfully:', data);
    },
    onError: (err) => {
      console.error('Failed to update course background:', err);
      setUploadError('Failed to save the background image');
    },
  });

  const handleImageChange = async (file: File) => {
    if (!courseId) {
      // We should never reach this point as the upload button is disabled when courseId is null
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      // Upload to Firebase
      const downloadURL = await uploadImage(file, {
        folderPath: `courses/${courseId}/background`,
      });

      // Update course with background image
      await updateCourseRequest({
        backgroundImage: downloadURL,
      });

      // Update local state
      setBackgroundImageUrl(downloadURL);

      // Notify parent component
      if (onBackgroundImageChange) {
        onBackgroundImageChange(downloadURL);
      }

      console.log('Course background uploaded successfully:', downloadURL);
    } catch (err) {
      console.error('Upload failed:', err);
      setUploadError('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleItemTemplatesSelected = async (selectedItems: string[]) => {
    if (!courseId) {
      return;
    }

    // Call the API to update the selected templates
    const success = await updateSelectedItems(selectedItems);
    if (success) {
      console.log('Item templates updated successfully!');
    } else {
      console.error('Failed to update item templates.');
    }
  };

  // Prepare the image component
  const backgroundImageComponent = backgroundImageUrl ? (
    <Image src={backgroundImageUrl} alt="Course Background" width={50000} height={50000} />
  ) : (
    <Image src={islandImage.background} alt="Course Background" width={50000} height={50000} />
  );

  // Custom handleImageChange wrapper to disable uploads when courseId is null
  const handleImageChangeWrapper = (file: File) => {
    if (!courseId) {
      setUploadError('Please save the course first before uploading a background image.');
      return;
    }
    handleImageChange(file);
  };

  return (
    <div>
      {uploadError && <div className="text-red-500 mb-4">{uploadError}</div>}

      {courseId ? (
        <>
          <ImageHolder
            onImageChange={handleImageChangeWrapper}
            title="Course Background Theme"
            picture={backgroundImageComponent}
            isUploading={isUploading}
          />

          <Section courseId={courseId} />

          {templateLoading ? (
            <div>Loading item templates...</div>
          ) : templateError ? (
            <div>Error loading item templates: {templateError}</div>
          ) : (
            <ItemTemplateSelection
              courseId={courseId}
              onItemsSelected={handleItemTemplatesSelected}
              initialSelectedItems={selectedItemIds}
            />
          )}
        </>
      ) : (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 mb-4 rounded">
          Please save the course first to enable background image upload and island creation.
        </div>
      )}
    </div>
  );
};

export default Curriculum;
