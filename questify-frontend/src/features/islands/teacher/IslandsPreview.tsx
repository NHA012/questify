import React, { useRef, useState, useEffect } from 'react';
import style from '../Islands.module.css';
import { islandImage } from '@/assets/images';
import useRequest from '@/hooks/use-request';
import { Island } from '@/types/islands.type';
import TeacherIsland from './IslandPreview';
import CommonLeaderboardModal, {
  LeaderboardType,
} from '@/components/common/LeaderboardModal/leaderboardModal';
import LeaderboardButton from '@/components/common/LeaderboardModal/leaderboardButton';

interface DraggableDivElement extends HTMLDivElement {
  isDragging?: boolean;
  startX?: number;
  startY?: number;
  scrollLeftStart?: number;
  scrollTopStart?: number;
}

interface TeacherIslandPreviewProps {
  courseId: string;
}

interface IslandPosition {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface CourseInfo {
  id: string;
  name: string;
  islandCount: number;
}

const TeacherIslandPreview: React.FC<TeacherIslandPreviewProps> = ({ courseId }) => {
  const [islands, setIslands] = useState<Island[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [hoveredIsland, setHoveredIsland] = useState<string | null>(null);
  const [islandPositions, setIslandPositions] = useState<Record<string, IslandPosition>>({});
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [courseBackgroundImage, setCourseBackgroundImage] = useState<string>(
    islandImage.background,
  );
  const [courseInfo, setCourseInfo] = useState<CourseInfo | null>(null);

  const dragContainerRef = useRef<DraggableDivElement>(null);
  const islandRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const containerRef = useRef<HTMLDivElement>(null);

  const [isCourseLeaderboardOpen, setIsCourseLeaderboardOpen] = useState<boolean>(false);

  const handleToggleCourseLeaderboard = () => {
    setIsCourseLeaderboardOpen(!isCourseLeaderboardOpen);
  };

  const { doRequest: fetchIslands } = useRequest({
    url: `/api/course-mgmt/${courseId}/islands`,
    method: 'get',
    onSuccess: (data) => {
      setIslands(data);
      console.log(data);
      setIsLoading(false);
      setErrorMessage(null);
    },
    onError: (error) => {
      console.error('Error fetching islands:', error);
      setIsLoading(false);
      setErrorMessage(error?.message || 'Failed to load islands');
    },
  });

  const { doRequest: fetchCourseInfo } = useRequest({
    url: `/api/course-mgmt/course/${courseId}`,
    method: 'get',
    onSuccess: (data) => {
      if (data && data.backgroundImage) {
        setCourseBackgroundImage(data.backgroundImage);
      }
      setCourseInfo(data);
    },
    onError: (error) => {
      console.error('Error fetching course information:', error);
    },
  });

  const fetchIslandsRef = useRef(fetchIslands);
  const fetchCourseInfoRef = useRef(fetchCourseInfo);

  useEffect(() => {
    fetchIslandsRef.current();
    fetchCourseInfoRef.current();
  }, [courseId]);

  // Calculate and update island positions
  useEffect(() => {
    const updateIslandPositions = () => {
      const newPositions: Record<string, IslandPosition> = {};

      islands.forEach((island) => {
        const element = islandRefs.current[island.id];
        if (element) {
          const rect = element.getBoundingClientRect();
          const container = dragContainerRef.current?.getBoundingClientRect();

          if (container) {
            newPositions[island.id] = {
              id: island.id,
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

    // Update positions after rendering
    if (islands.length > 0 && Object.keys(islandRefs.current).length > 0) {
      setTimeout(updateIslandPositions, 100);
    }

    // Update positions on scroll or resize
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
  }, [islands]);

  // Handle fullscreen changes
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
    if (!hoveredIsland) return null;

    const currentIsland = islands.find((island) => island.id === hoveredIsland);
    if (!currentIsland || !currentIsland.prerequisites || !currentIsland.prerequisites.length)
      return null;

    return (
      <svg className={style.connector_lines}>
        {currentIsland.prerequisites.map((prereq) => {
          const currentPos = islandPositions[currentIsland.id];
          const prereqPos = islandPositions[prereq.id];

          if (!currentPos || !prereqPos) return null;

          // Calculate the middle points of islands for line connection
          const startX = prereqPos.x + prereqPos.width / 2;
          const startY = prereqPos.y + prereqPos.height / 2;
          const endX = currentPos.x + currentPos.width / 2;
          const endY = currentPos.y + currentPos.height / 2;

          return (
            <line
              key={`${prereq.id}-${currentIsland.id}`}
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

  const hasPrerequisites = (islandId: string) => {
    const island = islands.find((i) => i.id === islandId);
    return island?.prerequisites && island.prerequisites.length > 0;
  };

  // Create a ref callback for island elements
  const setIslandRef = (id: string) => (element: HTMLDivElement | null) => {
    islandRefs.current[id] = element;
  };

  if (isLoading) {
    return <div className={style.loading}>Loading islands...</div>;
  }

  if (errorMessage) {
    return <div className={style.error}>{errorMessage}</div>;
  }

  const groupedIslandsByPosition = islands.reduce((acc: { [key: number]: Island[] }, island) => {
    const position = island.position || 0;
    if (!acc[position]) {
      acc[position] = [];
    }
    acc[position].push(island);
    return acc;
  }, {});

  const getIslandBackgroundImage = () => {
    return courseBackgroundImage || islandImage.background;
  };

  return (
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
          backgroundImage: `url(${getIslandBackgroundImage()})`,
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
              {groupedIslandsByPosition[Number(position)].map((island) => (
                <div
                  key={island.id}
                  ref={setIslandRef(island.id)}
                  className={`${style.island_container} ${hasPrerequisites(island.id) ? style.island_with_prerequisites : ''}`}
                  onMouseEnter={() => handleIslandHover(island.id)}
                  onMouseLeave={() => handleIslandHover(null)}
                >
                  <TeacherIsland island={island} />
                </div>
              ))}
            </div>
          ))}
        </div>

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

export default TeacherIslandPreview;
