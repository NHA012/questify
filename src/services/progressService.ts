import axios from 'axios';
import { ResourcePrefix, CompletionStatus, IslandPathType } from '@datn242/questify-common';
import {
  Island as IslandType,
  UserIsland,
  IslandWithPrerequisites,
  Prerequisite,
  IslandBackgroundImage,
} from '@/types/islands.type';
import { DotPosition, mapTemplates } from '@/features/levels/data/MapTemplate';
import { levelImage } from '@/assets/images';

// Progress interfaces
export interface CourseProgress {
  id: string;
  userId: string;
  courseId: string;
  point: number;
  completionStatus: CompletionStatus;
  finishedDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IslandProgress {
  id: string;
  userId: string;
  islandId: string;
  point: number;
  completionStatus: CompletionStatus;
  finishedDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface LevelProgress {
  id: string;
  userId: string;
  levelId: string;
  point: number;
  completionStatus: CompletionStatus;
  finishedDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserLevelData {
  id: string;
  userId: string;
  levelId: string;
  point: number;
  completionStatus: CompletionStatus;
  finishedDate?: string;
  createdAt?: string;
  updatedAt?: string;
  Level?: {
    id: string;
    name: string;
    description?: string;
    position: number;
    islandId: string;
  };
}

export interface IslandTemplate {
  id: string;
  name: string;
  imageUrl: string;
  isDeleted?: boolean;
}

export interface FullIsland extends IslandType {
  id: string;
  name: string;
  description: string;
  position: number;
  courseId: string;
  islandTemplateId?: string;
  pathType?: IslandPathType;
  islandBackgroundImageId?: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  template?: IslandTemplate;
  backgroundImage: IslandBackgroundImage | string;
  prerequisites?: Prerequisite[];
}

export interface CourseRoadmap {
  userIslands: UserIsland[];
}

// Attempt interface for level attempts
export interface AttemptData {
  id: string;
  userId: string;
  levelId: string;
  answer?: string;
  point?: number;
  createdAt: string;
  updatedAt?: string;
}

// Helper function to get background image URL from various formats
export const getBackgroundImageUrl = (
  backgroundImage: IslandBackgroundImage | string | null,
): string => {
  if (!backgroundImage) return '';

  if (typeof backgroundImage === 'object' && backgroundImage.imageUrl) {
    return backgroundImage.imageUrl;
  }

  if (typeof backgroundImage === 'string') {
    return backgroundImage;
  }

  return '';
};

// Helper function to get default background based on path type
export const getDefaultBackgroundByPathType = (pathType?: string): string => {
  switch (pathType) {
    case IslandPathType.ForestPath:
      return levelImage.forestBackground;
    case IslandPathType.IcePath:
      return levelImage.mountainBackground;
    case IslandPathType.DesertPath:
    default:
      return levelImage.desertBackground;
  }
};

// Course progress related functions
export const checkCourseEnrollment = async (
  courseId: string,
  userId: string,
): Promise<CourseProgress | null> => {
  try {
    const response = await axios.get(
      `${ResourcePrefix.CourseLearning}/progress?student-id=${userId}&course-id=${courseId}`,
    );

    return response.data.progress;
  } catch (error) {
    console.error(`Error checking enrollment for course ${courseId}:`, error);
    return null;
  }
};

export const getUserCourseEnrollments = async (userId: string): Promise<CourseProgress[]> => {
  try {
    const response = await axios.get(
      `${ResourcePrefix.CourseLearning}/progress/all?student-id=${userId}`,
    );
    return response.data.progresses || [];
  } catch (error) {
    console.error('Error fetching user course enrollments:', error);
    return [];
  }
};

export const enrollInCourse = async (courseId: string): Promise<CourseProgress | null> => {
  try {
    const response = await axios.post(`${ResourcePrefix.CourseManagement}/${courseId}/enrollment`);
    return response.data;
  } catch (error) {
    console.error(`Error enrolling in course ${courseId}:`, error);
    return null;
  }
};

/**
 * Fetches all user islands for a specific course
 */
export const getUserIslandsForCourse = async (courseId: string): Promise<UserIsland[]> => {
  try {
    // First get user islands from course_learning service
    const response = await axios.get<{ userIslands: UserIsland[] }>(
      `${ResourcePrefix.CourseLearning}/roadmap/courses/${courseId}`,
    );

    const userIslands = response.data.userIslands || [];

    // If there are no islands, return empty array
    if (userIslands.length === 0) {
      return [];
    }

    // Get islands with full data from course_management service
    const islandsWithDetails = await getIslandsWithPrerequisites(courseId);

    // Create a map for quick lookup
    const islandDetailsMap: Record<string, Partial<IslandWithPrerequisites>> = {};

    islandsWithDetails.forEach((island) => {
      islandDetailsMap[island.id] = island;
    });

    // Enhance user islands with template and background data
    const enhancedUserIslands = userIslands.map((userIsland) => {
      const islandDetails = islandDetailsMap[userIsland.islandId];

      if (islandDetails) {
        return {
          ...userIsland,
          Island: {
            ...userIsland.Island,
            template: islandDetails.template,
            backgroundImage: islandDetails.backgroundImage,
            prerequisites: Array.isArray(islandDetails.prerequisites)
              ? islandDetails.prerequisites
              : [],
          },
        };
      }

      return userIsland;
    });

    return enhancedUserIslands;
  } catch (error) {
    console.error(`Error fetching user islands for course ${courseId}:`, error);
    return [];
  }
};

/**
 * Fetches a single island by ID with all related data
 */
export const getIslandById = async (
  courseId: string,
  islandId: string,
): Promise<FullIsland | null> => {
  try {
    const response = await axios.get<FullIsland>(
      `${ResourcePrefix.CourseManagement}/${courseId}/islands/${islandId}`,
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching island ${islandId}:`, error);
    return null;
  }
};

/**
 * Fetches all islands for a course with their prerequisites
 */
export const getIslandsWithPrerequisites = async (
  courseId: string,
): Promise<IslandWithPrerequisites[]> => {
  try {
    const response = await axios.get<IslandWithPrerequisites[]>(
      `${ResourcePrefix.CourseManagement}/${courseId}/islands`,
    );
    return response.data || [];
  } catch (error) {
    console.error(`Error fetching islands for course ${courseId}:`, error);
    return [];
  }
};

/**
 * Maps island prerequisites into a connections object
 */
export const mapIslandConnections = (
  islands: IslandWithPrerequisites[],
): Record<string, string[]> => {
  const connections: Record<string, string[]> = {};

  islands.forEach((island) => {
    if (
      island &&
      island.prerequisites &&
      Array.isArray(island.prerequisites) &&
      island.prerequisites.length > 0
    ) {
      connections[island.id] = island.prerequisites
        .filter((prereq) => prereq && typeof prereq.id === 'string')
        .map((prereq) => prereq.id);
    }
  });

  return connections;
};

/**
 * Groups islands by their position
 */
export const groupIslandsByPosition = (islands: UserIsland[]): Record<number, UserIsland[]> => {
  return islands.reduce((acc: Record<number, UserIsland[]>, island) => {
    const position = island.Island.position || 0;
    if (!acc[position]) {
      acc[position] = [];
    }
    acc[position].push(island);
    return acc;
  }, {});
};

/**
 * Determines if an island has prerequisites
 */
export const hasPrerequisites = (
  islandId: string,
  connections: Record<string, string[]>,
): boolean => {
  return Boolean(connections[islandId] && connections[islandId].length > 0);
};

// Island progress related functions
export const getIslandProgress = async (
  islandId: string,
  userId: string,
): Promise<IslandProgress | null> => {
  try {
    const response = await axios.get(
      `${ResourcePrefix.CourseLearning}/progress?student-id=${userId}&island-id=${islandId}`,
    );
    return response.data.progress;
  } catch (error) {
    console.error(`Error checking progress for island ${islandId}:`, error);
    return null;
  }
};

/**
 * Maps IslandPathType to MapTemplate id for dot positions
 */
export const getTemplateIdByPathType = (pathType?: string): string => {
  switch (pathType) {
    case IslandPathType.DesertPath:
      return 'map-desert-001';
    case IslandPathType.ForestPath:
      return 'map-forest-003';
    case IslandPathType.IcePath:
      return 'map-mountain-002';
    default:
      return 'map-desert-001';
  }
};

/**
 * Get full island data with its background image information and dot positions
 */
export const getIslandDetails = async (
  courseId: string,
  islandId: string,
): Promise<{ island: FullIsland; dotPositions: DotPosition[]; backgroundImageUrl: string }> => {
  try {
    // Get island data
    const island = await getIslandById(courseId, islandId);
    if (!island) {
      throw new Error(`Island not found: ${islandId}`);
    }

    // Get the map template based on island's path type
    const templateId = getTemplateIdByPathType(island.pathType);

    // Get the dot positions from the template
    const mapTemplate = mapTemplates.find((t) => t.id === templateId);
    const dotPositions = mapTemplate?.dotPositions || [];

    // Get the background image URL
    let backgroundImageUrl = getBackgroundImageUrl(island.backgroundImage);
    if (!backgroundImageUrl) {
      backgroundImageUrl = getDefaultBackgroundByPathType(island.pathType);
    }

    return { island, dotPositions, backgroundImageUrl };
  } catch (error) {
    console.error(`Error fetching island details: ${error}`);
    // Return default values if error
    return {
      island: {} as FullIsland,
      dotPositions: [],
      backgroundImageUrl: levelImage.desertBackground,
    };
  }
};

// Level progress related functions
export const getLevelProgress = async (
  levelId: string,
  userId: string,
): Promise<LevelProgress | null> => {
  try {
    const response = await axios.get(
      `${ResourcePrefix.CourseLearning}/progress?student-id=${userId}&level-id=${levelId}`,
    );
    return response.data.progress;
  } catch (error) {
    console.error(`Error checking progress for level ${levelId}:`, error);
    return null;
  }
};

// Get all levels for a specific island
export const getUserLevelsForIsland = async (islandId: string): Promise<UserLevelData[]> => {
  try {
    const response = await axios.get(
      `${ResourcePrefix.CourseLearning}/roadmap/islands/${islandId}`,
    );
    return response.data.userLevels || [];
  } catch (error) {
    console.error(`Error fetching levels for island ${islandId}:`, error);
    return [];
  }
};

// Leaderboard entry interface
export interface LeaderboardEntry {
  rank: number;
  studentId: string;
  studentName: string;
  points: number;
  completionTime?: number;
}

// Get leaderboard data for a level
export const getLevelLeaderboard = async (levelId: string): Promise<LeaderboardEntry[]> => {
  try {
    const response = await axios.get(
      `${ResourcePrefix.CourseLearning}/levels/${levelId}/leaderboard`,
    );
    return response.data || [];
  } catch (error) {
    console.error(`Error fetching leaderboard for level ${levelId}:`, error);
    return [];
  }
};

// Get leaderboard data for an island
export const getIslandLeaderboard = async (islandId: string): Promise<LeaderboardEntry[]> => {
  try {
    const response = await axios.get(
      `${ResourcePrefix.CourseLearning}/islands/${islandId}/leaderboard`,
    );
    return response.data || [];
  } catch (error) {
    console.error(`Error fetching leaderboard for island ${islandId}:`, error);
    return [];
  }
};

// Get leaderboard data for a course
export const getCourseLeaderboard = async (courseId: string): Promise<LeaderboardEntry[]> => {
  try {
    const response = await axios.get(
      `${ResourcePrefix.CourseLearning}/courses/${courseId}/leaderboard`,
    );
    return response.data || [];
  } catch (error) {
    console.error(`Error fetching leaderboard for course ${courseId}:`, error);
    return [];
  }
};

// Get attempts for a level
export const getUserLevelAttempts = async (
  levelId: string,
  userId: string,
): Promise<AttemptData[]> => {
  try {
    // Endpoint doesn't exist yet - we'll need to implement it on the backend
    // For now, returning empty array
    // Would be something like: `/api/course-learning/attempts?level-id=${levelId}&user-id=${userId}`
    console.warn(`Attempts API not implemented yet ${userId}`);
    return [];
  } catch (error) {
    console.error(`Error fetching attempts for level ${levelId}:`, error);
    return [];
  }
};

// Helper function to format datetime for display
export function formatDateTime(date?: string | Date): string {
  if (!date) return 'N/A';
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateObj);
}
