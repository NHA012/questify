import React, { useState, useEffect, useCallback } from 'react';
import styles from './CourseSidebar.module.css';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { courseDetailImage } from '@/assets/images';
import { checkCourseEnrollment, enrollInCourse } from '@/services/progressService';
import { CompletionStatus } from '@datn242/questify-common';
import { Course } from '@/services/courseService';
import { useCurrentUser } from '@/hooks/useCurrentUser';

// interface PriceSectionProps {
//   currentPrice: string;
//   originalPrice: string;
//   discountText: string;
//   offerText: string;
// }

// const PriceSection: React.FC<PriceSectionProps> = ({
//   currentPrice,
//   originalPrice,
//   discountText,
//   offerText,
// }) => {
//   return (
//     <div className={styles.priceSection}>
//       <div className={styles.priceHeader}>
//         <div className={styles.priceAmounts}>
//           <div className={styles.currentPrice}>{currentPrice}</div>
//           <div className={styles.originalPrice}>{originalPrice}</div>
//         </div>
//         <div className={styles.discountBadge}>{discountText}</div>
//       </div>
//       <div className={styles.offerTimer}>
//         <Image src={courseDetailImage.alarmIcon} alt="Timer" width="20" height="20" />
//         <div>{offerText}</div>
//       </div>
//     </div>
//   );
// };

interface CourseInfoItemProps {
  icon: string;
  label: string;
  value: string;
}

const CourseInfoItem: React.FC<CourseInfoItemProps> = ({ icon, label, value }) => {
  return (
    <div className={styles.infoRow}>
      <div className={styles.infoLabel}>
        <Image src={icon} alt={label} width="24" height="24" />
        <div className={styles.labelText}>{label}</div>
      </div>
      <div className={styles.infoValue}>{value}</div>
    </div>
  );
};

interface FeatureItemProps {
  icon: string;
  text: string;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ icon, text }) => {
  return (
    <div className={styles.featureItem}>
      <Image src={icon} alt={text} width="24" height="24" />
      <div className={styles.featureText}>{text}</div>
    </div>
  );
};

interface ShareButtonProps {
  icon: string;
  text?: string;
  onClick: () => void;
}

const ShareButton: React.FC<ShareButtonProps> = ({ icon, text, onClick }) => {
  return (
    <button className={text ? styles.shareButtonCopyLink : styles.shareButton} onClick={onClick}>
      <Image src={icon} alt={text || 'Share'} width="24" height="24" />
      {text && (
        <div className={styles.buttonText} style={{ marginLeft: '8px' }}>
          {text}
        </div>
      )}
    </button>
  );
};

interface EnrollmentStatus {
  isEnrolled: boolean;
  progress?: {
    id: string;
    completionStatus: CompletionStatus;
    point: number;
  } | null;
}

interface CourseSidebarProps {
  course: Course;
}

const CourseSidebar: React.FC<CourseSidebarProps> = ({ course }) => {
  const router = useRouter();
  const { userData: currentUser, loading: userLoading } = useCurrentUser();
  const [enrollmentStatus, setEnrollmentStatus] = useState<EnrollmentStatus>({
    isEnrolled: false,
    progress: null,
  });
  const [enrolling, setEnrolling] = useState(false);
  const [enrollmentError, setEnrollmentError] = useState<string | null>(null);

  const courseInfo = [
    // {
    //   icon: courseDetailImage.clock1Icon,
    //   label: 'Course Duration',
    //   value: course.duration || '6 Month',
    // },
    // {
    //   icon: courseDetailImage.barChartIcon,
    //   label: 'Course Level',
    //   value: course.level || 'Beginner and Intermediate',
    // },
    {
      icon: courseDetailImage.usersIcon,
      label: 'Students Enrolled',
      value: course.studentCount.toLocaleString() || '69,419,618',
    },
    // {
    //   icon: courseDetailImage.notebookIcon,
    //   label: 'Language',
    //   value: 'Mandarin',
    // },
    {
      icon: courseDetailImage.notepadIcon,
      label: 'Subtitle Language',
      value: 'English',
    },
  ];

  const features = [
    {
      icon: courseDetailImage.clock2Icon,
      text: 'Lifetime access',
    },
    {
      icon: courseDetailImage.currencyDollarSimpleIcon,
      text: '30-days money-back guarantee',
    },
    {
      icon: courseDetailImage.notebook1Icon,
      text: 'Free exercises file & downloadable resources',
    },
    {
      icon: courseDetailImage.trophyIcon,
      text: 'Shareable certificate of completion',
    },
    {
      icon: courseDetailImage.monitorIcon,
      text: 'Access on mobile, tablet and TV',
    },
    {
      icon: courseDetailImage.notepad1Icon,
      text: 'English subtitles',
    },
    {
      icon: courseDetailImage.stackIcon,
      text: '100% online course',
    },
  ];

  const shareButtons = [
    {
      icon: courseDetailImage.copyIcon,
      text: 'Copy link',
    },
    {
      icon: courseDetailImage.facebookIcon,
    },
    {
      icon: courseDetailImage.twitter2Icon,
    },
    {
      icon: courseDetailImage.envelopeIcon,
    },
    {
      icon: courseDetailImage.whatsappIcon,
    },
  ];

  const checkUserEnrollment = useCallback(async () => {
    if (!currentUser?.id || !course.id) {
      return;
    }

    try {
      const progress = await checkCourseEnrollment(course.id, currentUser.id);
      setEnrollmentStatus({
        isEnrolled: !!progress,
        progress,
      });
    } catch (err) {
      console.error('Error checking enrollment status:', err);
    }
  }, [currentUser, course.id]);

  useEffect(() => {
    if (!userLoading && currentUser) {
      checkUserEnrollment();
    }
  }, [userLoading, currentUser, checkUserEnrollment]);

  const handleViewAsStudent = () => {
    router.push(`/instructor/course/${course.id}/islands`);
  };

  const handleEditCurriculum = () => {
    router.push(`/instructor/course/edit/${course.id}`);
  };

  const handleLearnCourse = () => {
    router.push(`/course/${course.id}/islands`);
  };

  const handleEnroll = async () => {
    if (!currentUser) {
      router.push('/auth/login');
      return;
    }

    if (!course.id) {
      setEnrollmentError('Course ID is missing. Please try again later.');
      return;
    }

    setEnrolling(true);
    setEnrollmentError(null);

    try {
      const result = await enrollInCourse(course.id);
      if (result) {
        setEnrollmentStatus({
          isEnrolled: true,
          progress: result,
        });
        router.push(`/course/${course.id}/islands`);
      } else {
        setEnrollmentError('Failed to enroll in the course. Please try again.');
      }
    } catch (error) {
      console.error('Enrollment error:', error);
      setEnrollmentError('An error occurred during enrollment. Please try again.');
    } finally {
      setEnrolling(false);
    }
  };

  const isTeacher = currentUser && currentUser.id === course.teacherId;

  // const currentPrice = course.price === 0 ? 'FREE' : `$${course.price.toFixed(2)}`;
  // const originalPrice = course.price === 0 ? '' : `$${(course.price * 1.3).toFixed(2)}`;
  // const discountText =
  //   course.price === 0
  //     ? 'FREE'
  //     : `${Math.round((1 - course.price / (course.price * 1.3)) * 100)}% Off`;

  return (
    <div className={styles.sidebar}>
      {/* <PriceSection
        currentPrice={currentPrice}
        originalPrice={originalPrice}
        discountText={discountText}
        offerText="2 days left at this offer!"
      />
      <div className={styles.divider} /> */}
      <div className={styles.courseInfo}>
        {courseInfo.map((info, index) => (
          <CourseInfoItem key={index} icon={info.icon} label={info.label} value={info.value} />
        ))}
      </div>
      <div className={styles.divider} />
      <div className={styles.featuresSection}>
        <h3 className={styles.featuresTitle}>This course includes:</h3>
        <div className={styles.featuresList}>
          {features.map((feature, index) => (
            <FeatureItem key={index} icon={feature.icon} text={feature.text} />
          ))}
        </div>
      </div>
      <div className={styles.divider} />
      <div className={styles.actionButtons}>
        {userLoading ? (
          <div>Loading...</div>
        ) : isTeacher ? (
          <>
            <button className={styles.primaryButton} onClick={handleViewAsStudent}>
              View As Student
            </button>
            <button className={styles.secondaryButton} onClick={handleEditCurriculum}>
              Edit Curriculum
            </button>
          </>
        ) : enrollmentStatus.isEnrolled ? (
          <button className={styles.primaryButton} onClick={handleLearnCourse}>
            Play
          </button>
        ) : enrolling ? (
          <button className={styles.primaryButton} disabled>
            Enrolling...
          </button>
        ) : (
          <button className={styles.primaryButton} onClick={handleEnroll}>
            Enroll Now
          </button>
        )}

        {enrollmentError && <div className={styles.errorMessage}>{enrollmentError}</div>}
      </div>
      <div className={styles.divider} />
      <div className={styles.shareSection}>
        <h3 className={styles.shareTitle}>Share this course:</h3>
        <div className={styles.shareButtons}>
          {shareButtons.map((button, index) => (
            <ShareButton
              key={index}
              icon={button.icon}
              text={button.text}
              onClick={() => console.log(`Clicked ${button.text || 'share button'}`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseSidebar;
