import React, { useEffect, useRef, useState } from 'react';
import styles from './CreateCourse.module.css';
import HeaderTab from './HeaderTab/HeaderTab';
import { StackIcon, MonitorPlayIcon } from './HeaderTab/Icons';
import CourseInformation from './CourseInformation';
import ActionBar from './ActionBar';
import CreateHeader from './CreateHeader';
import Curriculum from './Curriculum';
import useRequest from '@/hooks/use-request';
import TeacherIslandPreview from '../islands/teacher/IslandsPreview';
import { CourseStatus } from '@datn242/questify-common';
import { useRouter } from 'next/router';

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

const CreateCourse: React.FC<{ currentCourseId?: string }> = ({ currentCourseId = null }) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('course_info');
  const [isLoading, setIsLoading] = useState(false);
  const [courseId, setCourseId] = useState<string | null>(currentCourseId);
  const [courseData, setCourseData] = useState<CourseData>({
    name: '',
    shortDescription: '',
    description: '',
    category: '',
    price: 0,
    backgroundImage: '',
    thumbnail: '',
    learningObjectives: [],
    requirements: [],
    targetAudience: [],
  });
  const [showPreview, setShowPreview] = useState(false);
  const [error, setError] = useState(null);

  const isNewlyCreatedRef = useRef(false);

  const tabs = [
    { id: 'course_info', label: 'Course Information', icon: <StackIcon /> },
    { id: 'curriculum', label: 'Curriculum', icon: <MonitorPlayIcon /> },
    // { id: 'students', label: 'Students', icon: <StudentsIcon /> },
  ];

  const setCourseIdRef = useRef(setCourseId);

  useEffect(() => {
    if (currentCourseId && currentCourseId !== courseId) {
      setCourseIdRef.current(currentCourseId);
    }
  }, [currentCourseId, courseId]);

  const { doRequest, errors } = useRequest({
    url: '/api/course-mgmt',
    method: 'post',
    body: JSON.stringify(courseData),
    onSuccess: (data) => {
      console.log('Course saved successfully:', data);

      // Set the flag to true to prevent the fetch
      isNewlyCreatedRef.current = true;

      setCourseId(data.id);
      console.log('Course ID:', data.id);

      // Update courseData with response data directly to avoid needing a fetch
      setCourseData((prevData) => ({
        ...prevData,
        name: data.name || prevData.name,
        shortDescription: data.shortDescription || prevData.shortDescription,
        description: data.description || prevData.description,
        category: data.category || prevData.category,
        price: data.price || prevData.price,
        backgroundImage: data.backgroundImage || prevData.backgroundImage,
        thumbnail: data.thumbnail || prevData.thumbnail,
        learningObjectives: data.learningObjectives || prevData.learningObjectives,
        requirements: data.requirements || prevData.requirements,
        targetAudience: data.targetAudience || prevData.targetAudience,
      }));

      if (activeTab === 'course_info') {
        setActiveTab('curriculum');
      }
    },
    onError: () => {
      setError(errors);
    },
  });

  const { doRequest: publishCourseRequest } = useRequest({
    url: `/api/course-mgmt/course/${courseId}`,
    method: 'patch',
    body: JSON.stringify({ status: CourseStatus.Pending }),
    onSuccess: (data) => {
      console.log('Course published successfully:', data);
      setCourseData((prev) => ({ ...prev, status: 'pending' }));
    },
    onError: (error) => {
      setError(error);
    },
  });

  const { doRequest: fetchCourseRequest } = useRequest({
    url: courseId ? `/api/course-mgmt/course/${courseId}` : null,
    method: 'get',
    onSuccess: (data) => {
      console.log('Course data fetched successfully:', data);
      const newCourseData = {
        name: data.name || '',
        shortDescription: data.shortDescription || '',
        description: data.description || '',
        category: data.category || '',
        price: data.price || 0,
        backgroundImage: data.backgroundImage || '',
        thumbnail: data.thumbnail || '',
        learningObjectives: [
          ...(Array.isArray(data.learningObjectives) ? data.learningObjectives : []),
        ],
        requirements: [...(Array.isArray(data.requirements) ? data.requirements : [])],
        targetAudience: [...(Array.isArray(data.targetAudience) ? data.targetAudience : [])],
      };

      setCourseData(newCourseData);
      setCourseId(data.id);
    },
    onError: (err) => {
      console.error('Failed to fetch course data:', err);
      setError(err);
    },
  });

  const fetchCourseRef = useRef(fetchCourseRequest);

  // Updated useEffect to prevent unnecessary fetches for newly created courses
  useEffect(() => {
    if (courseId && !isNewlyCreatedRef.current) {
      // Only fetch if it's not a newly created course
      fetchCourseRef.current();
    }
    // Reset the flag after the effect runs
    isNewlyCreatedRef.current = false;
  }, [courseId]);

  const { doRequest: updateCourseRequest } = useRequest({
    url: `/api/course-mgmt/course/${courseId}`,
    method: 'patch',
    body: JSON.stringify(courseData),
    onSuccess: (data) => {
      console.log('Course updated successfully:', data);
      if (data && data.id) {
        setCourseId(data.id);

        // No need to set isNewlyCreatedRef here since we're updating an existing course

        if (activeTab === 'course_info') {
          setActiveTab('curriculum');
        }
      }
    },
    onError: () => {
      setError(errors);
    },
  });

  const handleSaveNext = async () => {
    const success = await saveCourse();
    if (success && activeTab === 'course_info' && courseId) {
      setActiveTab('curriculum');
    }
  };

  const saveCourse = async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      let result = null;

      if (courseId) {
        // For existing courses
        result = await updateCourseRequest();
        return !!result;
      } else {
        // For new courses
        result = await doRequest();
        return !!result;
      }
    } catch (error) {
      console.error('Failed to save course:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateCourseData = (newData: Partial<CourseData>) => {
    setCourseData((prevData) => ({
      ...prevData,
      ...newData,
    }));
  };

  const handlePublish = async () => {
    if (!courseId) {
      console.error('Cannot publish: No course ID available');
      return;
    }

    await publishCourseRequest();

    if (!error) {
      router.push('/instructor/courses');
    }
  };

  const handlePreview = () => {
    setShowPreview(true);
  };

  const handleBackToEdit = () => {
    setShowPreview(false);
  };

  return (
    <main className="relative font-['Inter'] bg-[#CED1D9] p-[60px] flex flex-col items-end">
      <section className={`${styles.section} w-full`}>
        {!showPreview && (
          <>
            <HeaderTab tabs={tabs} defaultActiveTab={activeTab} onTabChange={setActiveTab} />
            <CreateHeader
              title={tabs.find((tab) => tab.id === activeTab)?.label || ''}
              onSave={saveCourse}
              isLoading={isLoading}
              onPreview={activeTab === 'curriculum' ? handlePreview : undefined}
            />
          </>
        )}

        {showPreview ? (
          <div className={styles.preview_container}>
            <div className={styles.preview_header}>
              <h2>Preview</h2>
              <button className={styles.back_to_edit_button} onClick={handleBackToEdit}>
                Back
              </button>
            </div>
            <TeacherIslandPreview courseId={courseId || ''} />
          </div>
        ) : (
          <>
            {activeTab === 'course_info' && (
              <CourseInformation
                courseData={courseData}
                updateCourseData={updateCourseData}
                courseId={courseId || undefined}
              />
            )}
            {activeTab === 'curriculum' && (
              <Curriculum
                courseId={courseId}
                backgroundImage={courseData.backgroundImage}
                onBackgroundImageChange={(url) => updateCourseData({ backgroundImage: url })}
              />
            )}
            {/* {activeTab === 'students' && <Students />} */}

            {activeTab === 'course_info' && (
              <ActionBar onSaveNext={handleSaveNext} isLoading={isLoading} />
            )}
            {activeTab === 'curriculum' && (
              <ActionBar onSaveNext={handleSaveNext} saveText="Save" isLoading={isLoading} />
            )}
          </>
        )}

        {error}
      </section>

      {activeTab !== 'students' && !showPreview && (
        <button
          className={`${styles.publishButton}`}
          type="button"
          disabled={isLoading}
          onClick={handlePublish}
        >
          Publish Course
        </button>
      )}
    </main>
  );
};

export default CreateCourse;
