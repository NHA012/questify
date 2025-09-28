import { useState, useRef, useEffect } from 'react';
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ChevronDown, ChevronUp, Plus, Edit2 } from 'lucide-react';
import styles from './Section.module.css';
import EditSection from './EditSection';
import CodeProblem from './CodeProblem';
import { TrashIcon } from './Icons';
import Challenge from './Challenge';
import EditLevel from './EditLevel';
import useRequest from '@/hooks/use-request';
import { Island as CourseIsland, Level, ContentType } from '@/types/courses.type';
import { useRouter } from 'next/router';
import { IslandTemplate, IslandBackgroundImage } from '@/types/islands.type';
import { IslandPathType } from '@datn242/questify-common';

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

const ItemType = {
  LEVEL: 'level',
};

const formatContentType = (contentType: ContentType | null): string => {
  if (!contentType) return 'Choose level content';

  switch (contentType) {
    case 'code_problem':
      return 'Code Problem';
    case 'challenge':
      return 'Challenge';
    default:
      return contentType;
  }
};

interface SectionProps {
  courseId: string;
}

const Section: React.FC<SectionProps> = ({ courseId }) => {
  const router = useRouter();
  const [islands, setIslands] = useState<EditableIsland[]>([]);
  const [islandTemplates, setIslandTemplates] = useState<IslandTemplate[]>([]);
  const [backgroundImages, setBackgroundImages] = useState<IslandBackgroundImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(true);
  const [isLoadingBackgrounds, setIsLoadingBackgrounds] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showContentMenu, setShowContentMenu] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCodeProblemModal, setShowCodeProblemModal] = useState(false);
  const [showChallengeModal, setShowChallengeModal] = useState(false);
  const [showEditLevelModal, setShowEditLevelModal] = useState(false);
  const [newLevelIslandId, setNewLevelIslandId] = useState<string | null>(null);
  const [currentIsland, setCurrentIsland] = useState<EditableIsland | null>(null);
  const [currentLevel, setCurrentLevel] = useState<Level | null>(null);
  const [currentLevelsCount, setCurrentLevelsCount] = useState(0);
  const [isLoadingChallenge, setIsLoadingChallenge] = useState(false);

  const { doRequest: fetchIslands, errors: fetchErrors } = useRequest({
    url: `/api/course-mgmt/${courseId}/islands`,
    method: 'get',
    onSuccess: (data) => {
      setIslands(data);
      setIsLoading(false);
      setErrorMessage(null);
    },
    onError: (error) => {
      console.error('Error fetching islands:', error);
      setIsLoading(false);
      setErrorMessage(error?.message || 'Failed to load islands');
    },
  });

  const { doRequest: fetchIslandTemplates, errors: fetchTemplatesErrors } = useRequest({
    url: '/api/course-mgmt/island-templates',
    method: 'get',
    onSuccess: (data) => {
      setIslandTemplates(data);
      setIsLoadingTemplates(false);
      setErrorMessage(null);
    },
    onError: (error) => {
      console.error('Error fetching island templates:', error);
      setIsLoadingTemplates(false);
      setErrorMessage(error?.message || 'Failed to load island templates');
    },
  });

  const { doRequest: fetchBackgroundImages, errors: fetchBackgroundsErrors } = useRequest({
    url: '/api/course-mgmt/island-background-images',
    method: 'get',
    onSuccess: (data) => {
      setBackgroundImages(data);
      setIsLoadingBackgrounds(false);
      setErrorMessage(null);
    },
    onError: (error) => {
      console.error('Error fetching background images:', error);
      setIsLoadingBackgrounds(false);
      setErrorMessage(error?.message || 'Failed to load background images');
    },
  });

  const { doRequest: fetchCodeProblem } = useRequest({
    url: '',
    method: 'get',
    onSuccess: (data) => {
      console.log('Code problem fetched successfully:', data);
      if (currentLevel) {
        // Make sure we handle the structure correctly
        if (data && data.CodeProblem) {
          const formattedCodeProblem = {
            id: data.CodeProblem.id,
            title: data.CodeProblem.title,
            description: data.CodeProblem.description,
            Testcases: data.CodeProblem.Testcases || [{ input: '', output: '', hidden: false }],
          };

          const updatedLevel = { ...currentLevel, CodeProblem: formattedCodeProblem };
          setCurrentLevel(updatedLevel);
        }
      }
      setErrorMessage(null);
    },
    onError: (error) => {
      console.error('Error fetching code problem:', error);
      setErrorMessage(error?.message || 'Failed to fetch code problem');
    },
  });

  const { doRequest: fetchChallenge } = useRequest({
    url: '',
    method: 'get',
    onSuccess: (data) => {
      console.log('Challenge fetched successfully:', data);
      if (data && data.Challenge) {
        router.push(`/instructor/challenge/${data.Challenge.id}`);
      } else {
        const level = data || currentLevel;
        if (level) {
          setShowChallengeModal(true);
        }
      }
      setIsLoadingChallenge(false);
      setErrorMessage(null);
    },
    onError: (error) => {
      console.error('Error fetching challenge:', error);
      setIsLoadingChallenge(false);
      setErrorMessage(error?.message || 'Failed to fetch challenge');
    },
  });

  const { doRequest: updateIsland, errors: updateIslandErrors } = useRequest({
    url: '',
    method: 'patch',
    body: {},
    onSuccess: (data) => {
      console.log('Island updated successfully:', data);
      setErrorMessage(null);
      fetchIslands();
    },
    onError: (error) => {
      console.error('Error updating island:', error);
      setErrorMessage(error?.message || 'Failed to update island');
    },
  });

  const { doRequest: updateLevel, errors: updateLevelErrors } = useRequest({
    url: '',
    method: 'patch',
    body: {},
    onSuccess: (data) => {
      console.log('Level updated successfully:', data);
      setErrorMessage(null);
      fetchIslands();
    },
    onError: (error) => {
      console.error('Error updating level:', error);
      setErrorMessage(error?.message || 'Failed to update level');
    },
  });

  const fetchIslandsRef = useRef(fetchIslands);
  const fetchIslandTemplatesRef = useRef(fetchIslandTemplates);
  const fetchBackgroundImagesRef = useRef(fetchBackgroundImages);

  useEffect(() => {
    fetchIslandsRef.current();
    fetchIslandTemplatesRef.current();
    fetchBackgroundImagesRef.current();
  }, [courseId]);

  const toggleLevel = (islandId: string, levelId: string) => {
    const menuId = `${islandId}-${levelId}`;
    setShowContentMenu((prev) => (prev === menuId ? null : menuId));
  };

  const selectContentType = async (islandId: string, levelId: string, contentType: ContentType) => {
    setIslands((prev) =>
      prev.map((island) => ({
        ...island,
        Levels: island.Levels.map((level) =>
          island.id === islandId && level.id === levelId ? { ...level, contentType } : level,
        ),
      })),
    );
    setShowContentMenu(null);

    await updateLevel({
      url: `/api/course-mgmt/islands/${islandId}/level/${levelId}`,
      method: 'patch',
      body: JSON.stringify({ contentType }),
    });
  };

  const openEditModal = (island: EditableIsland) => {
    setCurrentIsland(island);
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setCurrentIsland(null);
  };

  const openCodeProblemModal = async (island: EditableIsland, level: Level) => {
    setCurrentIsland(island);
    setCurrentLevel(level);

    if (level.contentType === 'code_problem') {
      await fetchCodeProblem({
        url: `/api/code-problem/level/${level.id}`,
        method: 'get',
      });
    } else {
      setCurrentLevel(level);
    }

    setShowCodeProblemModal(true);
  };

  const openChallengeModal = async (island: EditableIsland, level: Level) => {
    setCurrentIsland(island);
    setCurrentLevel(level);

    // Fetch challenge data
    setIsLoadingChallenge(true);
    await fetchChallenge({
      url: `/api/course-mgmt/level/${level.id}/challenge`,
      method: 'get',
    });
  };

  const closeCodeProblemModal = () => {
    setShowCodeProblemModal(false);
    setCurrentLevel(null);
  };

  const closeChallengeModal = () => {
    setShowChallengeModal(false);
    setCurrentLevel(null);
  };

  const openEditLevelModal = (islandId: string) => {
    const island = islands.find((i) => i.id === islandId);
    const currentLevelsCount = island ? island.Levels.length : 0;

    setNewLevelIslandId(islandId);
    setCurrentLevelsCount(currentLevelsCount);
    setShowEditLevelModal(true);
  };

  const closeEditLevelModal = () => {
    setShowEditLevelModal(false);
    setNewLevelIslandId(null);
  };

  const handleSaveIsland = async (updatedIsland: EditableIsland) => {
    const response = await updateIsland({
      url: `/api/course-mgmt/${courseId}/islands/${updatedIsland.id}`,
      body: JSON.stringify(updatedIsland),
    });

    if (response) {
      closeEditModal();
    }
  };

  const handleSaveCodeProblem = async () => {
    if (!currentIsland || !currentLevel) return;

    const updatedLevel: Level = {
      ...currentLevel,
      contentType: 'code_problem' as ContentType,
    };

    const response = await updateLevel({
      url: `/api/course-mgmt/islands/${currentLevel.islandId}/level/${currentLevel.id}`,
      body: JSON.stringify(updatedLevel),
    });

    if (response) {
      closeCodeProblemModal();
      fetchIslands();
    }
  };

  const handleSaveLevel = async (newLevel: Level) => {
    if (!newLevelIslandId) return;

    const levelToSave = {
      ...newLevel,
      islandId: newLevelIslandId,
    };

    try {
      const response = await updateLevel({
        url: `/api/course-mgmt/islands/${newLevelIslandId}/level`,
        method: 'post',
        body: JSON.stringify(levelToSave),
      });

      if (response) {
        closeEditLevelModal();
        // Fetch islands after successful save to refresh data
        fetchIslands();
      }
    } catch (error) {
      console.error('Error saving level:', error);
      setErrorMessage(error?.message || 'Failed to save level');
    }
  };

  const addIsland = async () => {
    const newIsland = {
      name: 'New Island',
      description: 'Description',
      courseId,
      position: 0,
    };

    await updateIsland({
      url: `/api/course-mgmt/${courseId}/islands`,
      method: 'post',
      body: JSON.stringify(newIsland),
    });
  };

  const deleteLevel = async (islandId: string, levelId: string) => {
    await updateLevel({
      url: `/api/course-mgmt/islands/${islandId}/level/${levelId}`,
      method: 'delete',
      body: JSON.stringify({}),
    });
  };

  const deleteIsland = async (islandId: string) => {
    await updateIsland({
      url: `/api/course-mgmt/${courseId}/islands/${islandId}`,
      method: 'delete',
      body: JSON.stringify({}),
    });
  };

  const moveLevel = async (islandId: string, dragIndex: number, hoverIndex: number) => {
    const island = islands.find((i) => i.id === islandId);
    if (!island) return;

    const draggedLevel = island.Levels[dragIndex];
    const updatedLevels = [...island.Levels];
    updatedLevels.splice(dragIndex, 1);
    updatedLevels.splice(hoverIndex, 0, draggedLevel);

    const levelsWithUpdatedPositions = updatedLevels.map((level, index) => ({
      ...level,
      position: index + 1,
    }));

    setIslands((prev) =>
      prev.map((i) => (i.id === islandId ? { ...i, Levels: levelsWithUpdatedPositions } : i)),
    );

    try {
      for (const level of levelsWithUpdatedPositions) {
        await updateLevel({
          url: `/api/course-mgmt/islands/${islandId}/level/${level.id}`,
          method: 'patch',
          body: JSON.stringify({ position: level.position }),
        });
      }
      fetchIslands();
    } catch (error) {
      console.error('Error updating level positions:', error);
      setErrorMessage('Failed to update level positions');
      fetchIslands();
    }
  };

  const IslandComponent = ({ island }) => {
    return (
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTitle}>
            <span className={styles.sectionName}>{island.name}</span>
          </div>
          <div className={styles.sectionActions}>
            <button className={styles.iconButton} onClick={() => openEditLevelModal(island.id)}>
              <Plus size={16} />
            </button>
            <button className={styles.iconButton} onClick={() => openEditModal(island)}>
              <Edit2 size={16} />
            </button>
            <button className={styles.iconButton} onClick={() => deleteIsland(island.id)}>
              <TrashIcon />
            </button>
          </div>
        </div>

        <div className={styles.levels}>
          {island.Levels.map((level, levelIndex) => (
            <LevelComponent
              key={level.id}
              level={level}
              islandId={island.id}
              index={levelIndex}
              moveLevel={moveLevel}
              island={island}
            />
          ))}
        </div>
      </div>
    );
  };

  const LevelComponent = ({ level, islandId, index, moveLevel, island }) => {
    const ref = useRef<HTMLDivElement>(null);

    const [{ isDragging }, drag] = useDrag({
      type: ItemType.LEVEL,
      item: { islandId, index },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    });

    const [{ isOver }, drop] = useDrop({
      accept: ItemType.LEVEL,
      collect: (monitor) => ({
        isOver: monitor.isOver(),
      }),
      hover: (item: { islandId: string; index: number }, monitor) => {
        if (!ref.current) {
          return;
        }

        if (item.islandId !== islandId) {
          return;
        }

        const dragIndex = item.index;
        const hoverIndex = index;

        if (dragIndex === hoverIndex) {
          return;
        }

        const hoverBoundingRect = ref.current.getBoundingClientRect();

        const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

        const clientOffset = monitor.getClientOffset();

        const hoverClientY = clientOffset.y - hoverBoundingRect.top;

        if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
          return;
        }

        if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
          return;
        }

        moveLevel(islandId, dragIndex, hoverIndex);

        item.index = hoverIndex;
      },
    });

    drag(drop(ref));

    const handleEditClick = () => {
      if (level.contentType === 'code_problem') {
        openCodeProblemModal(island, level);
      } else if (level.contentType === 'challenge') {
        openChallengeModal(island, level);
      }
    };

    return (
      <div
        ref={ref}
        className={`${styles.level} ${isDragging ? styles.dragging : ''} ${isOver ? styles.over : ''}`}
        style={{ opacity: isDragging ? 0.5 : 1 }}
      >
        <div className={styles.levelInfo}>
          <span className={styles.hamburger}>≡</span>
          <span className={styles.levelName}>{level.name}</span>
        </div>

        <div className={styles.levelActions}>
          <button
            className={`${styles.contentsButton} ${!level.contentType ? styles.grayButton : ''}`}
            onClick={() => toggleLevel(islandId, level.id)}
          >
            {formatContentType(level.contentType)}{' '}
            {showContentMenu === `${islandId}-${level.id}` ? (
              <ChevronUp size={14} />
            ) : (
              <ChevronDown size={14} />
            )}
          </button>
          <button
            className={styles.iconButton}
            onClick={handleEditClick}
            disabled={isLoadingChallenge}
          >
            <Edit2 size={16} />
          </button>
          <button className={styles.iconButton} onClick={() => deleteLevel(islandId, level.id)}>
            <TrashIcon />
          </button>
        </div>

        {showContentMenu === `${islandId}-${level.id}` && (
          <div className={styles.contentTypeMenu}>
            <button onClick={() => selectContentType(islandId, level.id, 'code_problem')}>
              Code Problem
            </button>
            <button onClick={() => selectContentType(islandId, level.id, 'challenge')}>
              Challenge
            </button>
          </div>
        )}
      </div>
    );
  };

  if (isLoading || isLoadingTemplates || isLoadingBackgrounds) {
    return <div className={styles.loading}>Loading islands and resources...</div>;
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={styles.container}>
        {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}
        {fetchErrors && <div className={styles.errorMessage}>{fetchErrors}</div>}
        {fetchTemplatesErrors && <div className={styles.errorMessage}>{fetchTemplatesErrors}</div>}
        {fetchBackgroundsErrors && (
          <div className={styles.errorMessage}>{fetchBackgroundsErrors}</div>
        )}
        {updateIslandErrors && <div className={styles.errorMessage}>{updateIslandErrors}</div>}
        {updateLevelErrors && <div className={styles.errorMessage}>{updateLevelErrors}</div>}

        {islands.map((island) => (
          <IslandComponent key={island.id} island={island} />
        ))}
        <button className={styles.addSectionsButton} onClick={addIsland}>
          Add Island
        </button>

        {showEditModal && currentIsland && (
          <EditSection
            section={currentIsland}
            onClose={closeEditModal}
            onSave={handleSaveIsland}
            sections={islands}
            islandTemplates={islandTemplates}
            backgroundImages={backgroundImages}
          />
        )}

        {showCodeProblemModal && currentLevel && (
          <CodeProblem
            level={currentLevel}
            onClose={closeCodeProblemModal}
            onSave={handleSaveCodeProblem}
          />
        )}

        {showChallengeModal && currentLevel && (
          <Challenge level={currentLevel} onClose={closeChallengeModal} />
        )}

        {showEditLevelModal && newLevelIslandId && (
          <EditLevel
            sectionId={newLevelIslandId}
            onClose={closeEditLevelModal}
            onSave={handleSaveLevel}
            currentLevelsCount={currentLevelsCount}
          />
        )}

        {isLoadingChallenge && (
          <div className={styles.loadingOverlay}>
            <div className={styles.loadingSpinner}>Loading challenge...</div>
          </div>
        )}
      </div>
    </DndProvider>
  );
};

export default Section;
