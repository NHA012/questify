// ItemTemplateService.tsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { ResourcePrefix, EffectType } from '@datn242/questify-common';

// Export interfaces for use in other components
export interface ItemTemplate {
  id: string;
  name: string;
  effect: EffectType;
  effectDescription: string;
  description: string;
  gold: number;
  img: string;
}

// Create simplified effect type for UI filtering
export enum SimpleEffectType {
  Exp = 'exp',
  Gold = 'gold',
}

// Re-export the original EffectType
export { EffectType };

// Item Template API response interface
interface ItemTemplateDTO {
  id: string;
  name: string;
  effect: EffectType;
  effect_description: string;
  description: string;
  gold: number;
  img: string;
}

/**
 * Transform backend item template data to frontend format
 */
const transformItemTemplateData = (itemDTO: ItemTemplateDTO): ItemTemplate => {
  return {
    id: itemDTO.id,
    name: itemDTO.name,
    effect: itemDTO.effect,
    effectDescription: itemDTO.effect_description,
    description: itemDTO.description,
    gold: itemDTO.gold,
    img: itemDTO.img,
  };
};

/**
 * Fetches all available item templates
 */
export const fetchItemTemplates = async (): Promise<ItemTemplate[]> => {
  try {
    const response = await axios.get(`${ResourcePrefix.CourseManagement}/templates/all`);
    return response.data.map(transformItemTemplateData);
  } catch (error) {
    console.error('Error fetching item templates:', error);
    // Return empty array instead of throwing to prevent UI crashes
    return [];
  }
};

/**
 * Fetches item templates associated with a specific course
 */
export const fetchCourseItemTemplates = async (courseId: string): Promise<ItemTemplate[]> => {
  try {
    const response = await axios.get(
      `${ResourcePrefix.CourseManagement}/${courseId}/item-templates`,
    );
    return response.data.map(transformItemTemplateData);
  } catch (error) {
    console.error(`Error fetching item templates for course ${courseId}:`, error);
    // Return empty array instead of throwing
    return [];
  }
};

/**
 * Updates the item templates associated with a course
 */
export const updateCourseItemTemplates = async (
  courseId: string,
  itemTemplateIds: string[],
): Promise<boolean> => {
  try {
    await axios.put(`${ResourcePrefix.CourseManagement}/${courseId}/item-templates`, {
      itemTemplateIds,
    });
    return true;
  } catch (error) {
    console.error(`Error updating item templates for course ${courseId}:`, error);
    return false;
  }
};

// Custom hook to fetch and manage all available item templates
export const useItemTemplateData = () => {
  const [itemTemplates, setItemTemplates] = useState<ItemTemplate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadItemTemplates = async () => {
      try {
        setLoading(true);
        const data = await fetchItemTemplates();
        setItemTemplates(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch item templates:', err);
        setError('Failed to load item templates. Please try again later.');
        setItemTemplates([]);
      } finally {
        setLoading(false);
      }
    };

    loadItemTemplates();
  }, []);

  return { itemTemplates, loading, error };
};

// Custom hook to fetch and manage course-specific item templates
export const useCourseItemTemplateData = (courseId: string) => {
  const [courseItemTemplates, setCourseItemTemplates] = useState<ItemTemplate[]>([]);
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCourseItemTemplates = async () => {
      if (!courseId) return;

      try {
        setLoading(true);
        const data = await fetchCourseItemTemplates(courseId);
        setCourseItemTemplates(data);
        setSelectedItemIds(data.map((item) => item.id));
        setError(null);
      } catch (err) {
        console.error(`Failed to fetch item templates for course ${courseId}:`, err);
        setError('Failed to load course item templates. Please try again later.');
        setCourseItemTemplates([]);
        setSelectedItemIds([]);
      } finally {
        setLoading(false);
      }
    };

    loadCourseItemTemplates();
  }, [courseId]);

  // Function to update course item templates
  const updateSelectedItems = async (itemIds: string[]) => {
    if (!courseId) return false;

    try {
      setLoading(true);
      const success = await updateCourseItemTemplates(courseId, itemIds);

      if (success) {
        setSelectedItemIds(itemIds);
        // Refresh the course item templates
        const updatedTemplates = await fetchCourseItemTemplates(courseId);
        setCourseItemTemplates(updatedTemplates);
      }

      return success;
    } catch (err) {
      console.error(`Failed to update item templates for course ${courseId}:`, err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    courseItemTemplates,
    selectedItemIds,
    loading,
    error,
    updateSelectedItems,
  };
};

/**
 * Get the simple effect type (Gold/Exp) from the detailed EffectType
 */
export const getSimpleEffectType = (effect: EffectType): SimpleEffectType => {
  if (effect.includes('gold')) {
    return SimpleEffectType.Gold;
  } else {
    return SimpleEffectType.Exp;
  }
};

/**
 * Filter item templates by simple effect type (Gold/Exp) or show all
 */
export const filterItemTemplatesByEffect = (
  items: ItemTemplate[],
  effectType: SimpleEffectType | 'all',
): ItemTemplate[] => {
  if (effectType === 'all') return items;

  return items.filter((item) => getSimpleEffectType(item.effect) === effectType);
};

// Helper function to filter item templates by search term
export const filterItemTemplatesBySearch = (
  items: ItemTemplate[],
  searchTerm: string,
): ItemTemplate[] => {
  if (!searchTerm) return items;

  const lowercaseSearch = searchTerm.toLowerCase();
  return items.filter(
    (item) =>
      item.name.toLowerCase().includes(lowercaseSearch) ||
      item.description.toLowerCase().includes(lowercaseSearch),
  );
};

// Fallback for testing without API - empty data instead of hardcoded
export const useStaticItemTemplateData = () => {
  return {
    itemTemplates: [],
    loading: false,
    error: null,
  };
};
