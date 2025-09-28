import React, { useRef, useState, useEffect } from 'react';
import style from './Islands.module.css';
import { islandImage } from '@/assets/images';
import useRequest from '@/hooks/use-request';
import { UserIsland, IslandPosition } from '@/types/islands.type';
import { fetchCourseById, Course } from '@/services/courseService';
import {
  getUserIslandsForCourse,
  getIslandsWithPrerequisites,
  mapIslandConnections,
  groupIslandsByPosition,
  hasPrerequisites,
} from '@/services/progressService';
import StudentIsland from './Island';
import Inventory from '@/components/common/InventoryModal/Inventory';
import CommonLeaderboardModal, {
  LeaderboardType,
} from '@/components/common/LeaderboardModal/leaderboardModal';
import LeaderboardButton from '@/components/common/LeaderboardModal/leaderboardButton';
import HeaderCourseDetail from '@/components/ui/Header/HeaderCourseDetail';
import Image from 'next/image';
import { useRouter } from 'next/router';

interface DraggableDivElement extends HTMLDivElement {
  isDragging?: boolean;
  startX?: number;
  startY?: number;
  scrollLeftStart?: number;
  scrollTopStart?: number;
}

interface StudentIslandsProps {
  courseId: string;
}

interface CourseInfo {
  id: string;
  name: string;
  islandCount: number;
}

interface CurrentUser {
  id: string;
  email: string;
  name?: string;
}

const StudentIslands: React.FC<StudentIslandsProps> = ({ courseId }) => {
  const router = useRouter();
  // State declarations
  const [userIslands, setUserIslands] = useState<UserIsland[]>([]);
  const [islandConnections, setIslandConnections] = useState<Record<string, string[]>>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [hoveredIsland, setHoveredIsland] = useState<string | null>(null);
  const [islandPositions, setIslandPositions] = useState<Record<string, IslandPosition>>({});
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [courseInfo, setCourseInfo] = useState<CourseInfo | null>(null);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [course, setCourse] = useState<Course | null>(null);

  // Refs
  const dragContainerRef = useRef<DraggableDivElement>(null);
  const islandRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const containerRef = useRef<HTMLDivElement>(null);

  const [isCourseLeaderboardOpen, setIsCourseLeaderboardOpen] = useState<boolean>(false);

  const handleToggleCourseLeaderboard = () => {
    setIsCourseLeaderboardOpen(!isCourseLeaderboardOpen);
  };

  const onBackClick = () => {
    router.push(`/course/${courseId}`);
  };

  const { doRequest: fetchCurrentUser } = useRequest({
    url: '/api/users/currentuser',
    method: 'get',
    onSuccess: (data) => {
      setCurrentUser(data.currentUser);
    },
    onError: (error) => {
      console.error('Error fetching current user:', error);
    },
  });

  const { doRequest: fetchCourseInfo } = useRequest({
    url: `/api/course-mgmt/course/${courseId}`,
    method: 'get',
    onSuccess: (data) => {
      setCourseInfo(data);
    },
    onError: (error) => {
      console.error('Error fetching course information:', error);
    },
  });

  const fetchUserIslandsData = async () => {
    try {
      setIsLoading(true);

      // First, get islands with prerequisites to ensure we have this data
      await fetchIslandPrerequisites();

      // Then get user islands
      const islands = await getUserIslandsForCourse(courseId);
      setUserIslands(islands);
      setErrorMessage(null);

      setIsLoading(false);
    } catch (error: unknown) {
      console.error('Error fetching user islands:', error);
      setIsLoading(false);
      setErrorMessage(error instanceof Error ? error.message : 'Failed to load islands');
    }
  };

  const fetchIslandPrerequisites = async () => {
    try {
      const islandsWithPrereqs = await getIslandsWithPrerequisites(courseId);
      // Store the connections in state
      const connections = mapIslandConnections(islandsWithPrereqs);
      setIslandConnections(connections);
      return islandsWithPrereqs; // Return in case we need this data elsewhere
    } catch (error: unknown) {
      console.error('Error fetching island prerequisites:', error);
      return [];
    }
  };

  const fetchCourseData = async () => {
    if (!courseId) return;

    try {
      const courseData = await fetchCourseById(courseId);
      if (courseData) {
        setCourse(courseData);
      }
    } catch (error) {
      console.error('Error fetching course data:', error);
    }
  };

  // Main effect for data loading
  useEffect(() => {
    const loadAllData = async () => {
      if (courseId) {
        fetchCurrentUser();
        fetchCourseInfo();
        await fetchUserIslandsData();
        await fetchCourseData();
      }
    };

    loadAllData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  // Effect for updating island positions
  useEffect(() => {
    const updateIslandPositions = () => {
      const newPositions: Record<string, IslandPosition> = {};

      userIslands.forEach((userIsland) => {
        const element = islandRefs.current[userIsland.islandId];
        if (element) {
          const rect = element.getBoundingClientRect();
          const container = dragContainerRef.current?.getBoundingClientRect();

          if (container) {
            newPositions[userIsland.islandId] = {
              id: userIsland.islandId,
              x: rect.x - container.x + dragContainerRef.current!.scrollLeft,
              y: rect.y - container.y + dragContainerRef.current!.scrollTop,
              width: rect.width,
              height: rect.height,
            };
          }
        }
      });

      setIslandPositions(newPositions);
    };

    if (userIslands.length > 0 && Object.keys(islandRefs.current).length > 0) {
      setTimeout(updateIslandPositions, 100);
    }

    const container = dragContainerRef.current;
    if (container) {
      container.addEventListener('scroll', updateIslandPositions);
      window.addEventListener('resize', updateIslandPositions);
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', updateIslandPositions);
        window.removeEventListener('resize', updateIslandPositions);
      }
    };
  }, [userIslands]);

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
    };
  }, []);

  const toggleFullScreen = () => {
    if (!isFullScreen) {
      if (containerRef.current?.requestFullscreen) {
        containerRef.current.requestFullscreen().catch((err) => {
          console.error(`Error attempting to enable full-screen mode: ${err.message}`);
        });
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch((err) => {
          console.error(`Error attempting to exit full-screen mode: ${err.message}`);
        });
      }
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    const container = dragContainerRef.current;
    if (container) {
      container.isDragging = true;
      container.startX = e.pageX - container.offsetLeft;
      container.startY = e.pageY - container.offsetTop;
      container.scrollLeftStart = container.scrollLeft;
      container.scrollTopStart = container.scrollTop;
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = dragContainerRef.current;
    if (container && container.isDragging) {
      const x = e.pageX - container.offsetLeft;
      const y = e.pageY - container.offsetTop;

      const walkX = (container.startX! - x) * 2;
      const walkY = (container.startY! - y) * 2;

      container.scrollLeft = container.scrollLeftStart! + walkX;
      container.scrollTop = container.scrollTopStart! + walkY;
    }
  };

  const handleMouseUp = () => {
    const container = dragContainerRef.current;
    if (container) {
      container.isDragging = false;
    }
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    const container = dragContainerRef.current;
    if (container && e.touches.length === 1) {
      container.isDragging = true;
      container.startX = e.touches[0].pageX - container.offsetLeft;
      container.startY = e.touches[0].pageY - container.offsetTop;
      container.scrollLeftStart = container.scrollLeft;
      container.scrollTopStart = container.scrollTop;
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const container = dragContainerRef.current;
    if (container && container.isDragging && e.touches.length === 1) {
      e.preventDefault();
      const x = e.touches[0].pageX - container.offsetLeft;
      const y = e.touches[0].pageY - container.offsetTop;

      const walkX = (container.startX! - x) * 2;
      const walkY = (container.startY! - y) * 2;

      container.scrollLeft = container.scrollLeftStart! + walkX;
      container.scrollTop = container.scrollTopStart! + walkY;
    }
  };

  const handleTouchEnd = () => {
    const container = dragContainerRef.current;
    if (container) {
      container.isDragging = false;
    }
  };

  const handleIslandHover = (islandId: string | null) => {
    setHoveredIsland(islandId);
  };

  const renderConnectorLines = () => {
    if (!hoveredIsland || !islandConnections[hoveredIsland]) return null;

    const prerequisites = islandConnections[hoveredIsland] || [];

    return (
      <svg className={style.connector_lines}>
        {prerequisites.map((prereqId) => {
          const currentPos = islandPositions[hoveredIsland];
          const prereqPos = islandPositions[prereqId];

          if (!currentPos || !prereqPos) return null;

          const startX = prereqPos.x + prereqPos.width / 2;
          const startY = prereqPos.y + prereqPos.height / 2;
          const endX = currentPos.x + currentPos.width / 2;
          const endY = currentPos.y + currentPos.height / 2;

          return (
            <line
              key={`${prereqId}-${hoveredIsland}`}
              x1={startX}
              y1={startY}
              x2={endX}
              y2={endY}
              stroke="white"
              strokeWidth="3"
              strokeDasharray="8,4"
              strokeOpacity="1"
              className={style.connector_line}
            />
          );
        })}
      </svg>
    );
  };

  const checkHasPrerequisites = (islandId: string) => {
    return hasPrerequisites(islandId, islandConnections);
  };

  const setIslandRef = (id: string) => (element: HTMLDivElement | null) => {
    islandRefs.current[id] = element;
  };

  if (isLoading) {
    return <div className={style.loading}>Loading islands...</div>;
  }

  if (errorMessage) {
    return <div className={style.error}>{errorMessage}</div>;
  }

  const groupedIslandsByPosition = groupIslandsByPosition(userIslands);

  return (
    <div className="app-container">
      <HeaderCourseDetail name={courseInfo?.name} islandCount={courseInfo?.islandCount} />
      <div
        ref={containerRef}
        className={`${style.preview_container} ${isFullScreen ? style.fullscreen : ''}`}
      >
        <button
          className={style.fullscreen_button}
          onClick={toggleFullScreen}
          aria-label={isFullScreen ? 'Exit Full Screen' : 'Enter Full Screen'}
        >
          {isFullScreen ? (
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"></path>
            </svg>
          ) : (
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
            </svg>
          )}
        </button>

        <div
          className={style.background__container}
          style={{
            backgroundImage: `url(${course?.backgroundImage || islandImage.background})`,
            overflow: 'auto',
            cursor: hoveredIsland ? 'default' : 'grab',
            position: 'relative',
          }}
          ref={dragContainerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {renderConnectorLines()}

          <div
            className={style.islands__grid}
            style={{
              minWidth: '150%',
              minHeight: '150%',
              position: 'relative',
              zIndex: 1,
            }}
          >
            {Object.keys(groupedIslandsByPosition).map((position) => (
              <div key={position} className={style.island__column}>
                {groupedIslandsByPosition[Number(position)].map((userIsland) => (
                  <div
                    key={userIsland.islandId}
                    ref={setIslandRef(userIsland.islandId)}
                    className={`${style.island_container} ${
                      checkHasPrerequisites(userIsland.islandId)
                        ? style.island_with_prerequisites
                        : ''
                    }`}
                    onMouseEnter={() => handleIslandHover(userIsland.islandId)}
                    onMouseLeave={() => handleIslandHover(null)}
                  >
                    <StudentIsland
                      island={userIsland.Island}
                      completionStatus={userIsland.completionStatus}
                      point={userIsland.point}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className={style.buttonContainer}>
          <button className={style.backButton} onClick={onBackClick}>
            <Image
              src={islandImage.backButton}
              alt="Back"
              width={100}
              height={100}
              className={style.buttonImage}
              draggable={false}
            />
          </button>
        </div>

        {currentUser && <Inventory courseId={courseId} userId={currentUser.id} />}

        <LeaderboardButton onClick={handleToggleCourseLeaderboard} />

        {isCourseLeaderboardOpen && courseInfo && (
          <CommonLeaderboardModal
            id={courseId}
            name={courseInfo.name || 'Course'}
            type={LeaderboardType.COURSE}
            onClose={() => setIsCourseLeaderboardOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

export default StudentIslands;
