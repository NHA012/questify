import React, { useEffect, useState } from 'react';
import ImageHolder from './ImageHolder/ImageHolder';
import InputField from '@/components/ui/InputField/InputField';
import SelectField from '@/components/ui/SelectField/SelectField';
import ListField from '@/components/ui/ListField/ListField';
import { CourseCategory } from '@datn242/questify-common';
import { uploadImage } from '@/assets/firebase/uploadImage';
import Image from 'next/image';

interface CourseData {
  name: string;
  shortDescription?: string;
  description: string;
  category: string;
  price: number;
  backgroundImage?: string;
  thumbnail?: string;
  learningObjectives: string[];
  requirements: string[];
  targetAudience: string[];
}

interface CourseInformationProps {
  courseData: CourseData;
  updateCourseData: (data: Partial<CourseData>) => void;
  courseId?: string;
}

const CourseInformation: React.FC<CourseInformationProps> = ({
  courseData,
  updateCourseData,
  courseId,
}) => {
  const categoryOptions = Object.values(CourseCategory).map((value) => ({
    value,
    label: value,
  }));

  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    const errors: { [key: string]: string } = {};
    if (!courseData.name || courseData.name.trim() === '') {
      errors.name = 'Name is required';
    }

    if (!courseData.category || courseData.category.trim() === '') {
      errors.category = 'Category is required';
    }
    setFormErrors(errors);
  }, [courseData.name, courseData.category]);

  const handleImageChange = async (file: File) => {
    setIsUploading(true);
    setUploadError(null);

    try {
      const downloadURL = await uploadImage(file, {
        folderPath: `courses/${courseId || 'new'}/thumbnail`,
      });

      updateCourseData({ thumbnail: downloadURL });
      console.log('Course thumbnail uploaded successfully:', downloadURL);
    } catch (err) {
      console.error('Upload failed:', err);
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to upload image. Please try again.';
      setUploadError(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  // Create image component based on thumbnail URL if it exists
  const imageComponent = courseData.thumbnail ? (
    <Image src={courseData.thumbnail} alt="Course Thumbnail" width={50000} height={50000} />
  ) : undefined;

  return (
    <div>
      <InputField
        label="Name"
        type="name"
        placeholder="Your course name"
        className="mb-9 max-sm:mb-6"
        characterLimit={80}
        value={courseData.name}
        onChange={(e) => updateCourseData({ name: e.target.value })}
        error={formErrors.name}
      />

      <InputField
        label="Short Description"
        type="shortDescription"
        placeholder="Enter your course short description"
        className="mb-9 max-sm:mb-6"
        characterLimit={80}
        value={courseData.shortDescription}
        onChange={(e) => updateCourseData({ shortDescription: e.target.value })}
        error={formErrors.shortDescription}
      />

      <InputField
        label="Course Descriptions"
        type="description"
        placeholder="Enter your course description"
        className="mb-9 max-sm:mb-6"
        value={courseData.description}
        onChange={(e) => updateCourseData({ description: e.target.value })}
      />

      <SelectField
        label="Course Category"
        placeholder="Select..."
        options={categoryOptions}
        className="mb-9 max-sm:mb-6 flex-1"
        value={courseData.category}
        onChange={(value) => updateCourseData({ category: value })}
        error={formErrors.category}
      />

      <InputField
        label="Price"
        type="price"
        placeholder="Enter your course price"
        className="mb-9 max-sm:mb-6 flex-1"
        value={`${courseData.price}`}
        onChange={(e) => updateCourseData({ price: +e.target.value })}
      />

      {uploadError && <div className="text-red-500 mb-4">{uploadError}</div>}

      <ImageHolder
        onImageChange={handleImageChange}
        isUploading={isUploading}
        picture={imageComponent}
        title="Course Thumbnail"
      />

      <ListField
        label="What will students learn in your course?"
        description="You should enter learning objectives or outcomes that learners can expect to achieve after completing your course."
        examples={[
          'Example: Define the roles and responsibilities of a project manager',
          'Example: Estimate project timelines and budgets',
          'Example: Identify and manage project risks',
          'Example: Complete a case study to manage a project from conception to completion',
        ]}
        className="mt-9"
        characterLimit={120}
        items={courseData.learningObjectives || []}
        onChange={(items) => updateCourseData({ learningObjectives: items })}
      />

      <ListField
        label="Course requirements or prerequisites"
        description="List the required skills, experience, tools or equipment learners should have prior to taking your course. If there are no requirements, use this space as an opportunity to lower the barrier for beginners."
        examples={[
          'Example: No programming experience needed. You will learn everything you need to know',
        ]}
        className="mt-9"
        characterLimit={120}
        items={courseData.requirements || []}
        onChange={(items) => updateCourseData({ requirements: items })}
      />

      <ListField
        label="Target Audience "
        description="Write a clear description of the intended learners for your course who will find your course content valuable. This will help you attract the right learners to your course."
        examples={['Example: Beginner Python developers curious about data science']}
        className="mt-9"
        characterLimit={120}
        items={courseData.targetAudience || []}
        onChange={(items) => updateCourseData({ targetAudience: items })}
      />
    </div>
  );
};

export default CourseInformation;
