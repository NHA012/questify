import { IslandPathType } from '@datn242/questify-common';

export interface IslandBackgroundImage {
  id: string;
  imageUrl: string;
  isDeleted?: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: null | string;
}

export interface IslandTemplate {
  id: string;
  name: string;
  imageUrl: string;
  isDeleted?: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: null | string;
}

export interface Island {
  id: string;
  name: string;
  description: string;
  position: number;
  backgroundImage: IslandBackgroundImage | string | null;
  courseId: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  islandTemplateId?: string;
  pathType?: IslandPathType;
  islandBackgroundImageId?: string;
  template?: {
    id: string;
    name: string;
    imageUrl: string;
  };
  prerequisites?: Prerequisite[];
}

export interface UserIsland {
  id: string;
  userId: string;
  islandId: string;
  point: number;
  completionStatus: 'locked' | 'available' | 'in_progress' | 'completed';
  finishedDate: string | null;
  createdAt: string;
  updatedAt: string;
  Island: Island;
}

export interface IslandPosition {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface IslandWithPrerequisites extends Island {
  prerequisites: Prerequisite[];
}

export interface Prerequisite {
  id: string;
  name: string;
  PrerequisiteIsland: {
    islandId: string;
    prerequisiteIslandId: string;
  };
}

// Helper function to map background image URL to path type
export const getPathTypeFromBackgroundUrl = (url: string): IslandPathType | null => {
  if (!url) return null;

  if (url.includes('desert_map')) {
    return IslandPathType.DesertPath;
  } else if (url.includes('forest_map')) {
    return IslandPathType.ForestPath;
  } else if (url.includes('mountain_map')) {
    return IslandPathType.IcePath;
  }

  return null;
};

// Helper function to get a friendly name from a path type
export const getPathTypeName = (pathType: IslandPathType | null): string => {
  if (!pathType) return 'Select a path type';

  switch (pathType) {
    case IslandPathType.DesertPath:
      return 'Desert Path';
    case IslandPathType.ForestPath:
      return 'Forest Path';
    case IslandPathType.IcePath:
      return 'Mountain Path';
    default:
      return 'Unknown Path';
  }
};
