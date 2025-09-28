import axios from 'axios';
import { ResourcePrefix, EffectType as CommonEffectType } from '@datn242/questify-common';

export enum EffectType {
  Exp = 'exp',
  Gold = 'gold',
}

export interface ItemTemplate {
  id: string;
  name: string;
  effect: EffectType;
  effect_description: string;
  description: string;
  gold: number;
  img: string;
}

export interface InventoryItem {
  itemTemplateId: string;
  quantity: number;
  itemTemplate: ItemTemplate;
}

export interface Inventory {
  id: string;
  userId: string;
  courseId: string;
  gold: number;
  items: InventoryItem[];
}

export interface Item {
  id: string;
  name: string;
  effect: EffectType;
  effectDescription: string;
  description: string;
  gold: number;
  img: string;
  quantity: number;
}

export interface UserInventory {
  id: string;
  gold: number;
}

interface InventoryItemResponse {
  itemTemplateId: string;
  quantity: number;
  itemTemplate: {
    id: string;
    name: string;
    effect: CommonEffectType;
    effectDescription: string;
    description: string;
    gold: number;
    img: string;
  };
}

export interface UserCourseInfo {
  id: string;
  userId: string;
  courseId: string;
  point: number;
  completionStatus: string;
  nextLevelEffect?: string;
  finishedDate?: string;
}

const mapEffectType = (effectType: CommonEffectType): EffectType => {
  if (effectType.toLowerCase().startsWith('exp')) {
    return EffectType.Exp;
  }
  return EffectType.Gold;
};

export const convertToComponentFormat = (inventory: Inventory): Item[] => {
  if (!inventory || !inventory.items) return [];

  return inventory.items.map((item) => ({
    id: item.itemTemplateId,
    name: item.itemTemplate.name,
    effect: item.itemTemplate.effect,
    effectDescription: item.itemTemplate.effect_description,
    description: item.itemTemplate.description,
    gold: item.itemTemplate.gold,
    img: item.itemTemplate.img,
    quantity: item.quantity,
  }));
};

export const fetchInventory = async (courseId: string): Promise<Inventory | null> => {
  try {
    const response = await axios.get(`${ResourcePrefix.CourseLearning}/${courseId}/inventory`);

    const inventoryData = response.data;

    const transformedItems = inventoryData.items.map((item: InventoryItemResponse) => ({
      ...item,
      itemTemplate: {
        ...item.itemTemplate,
        effect: mapEffectType(item.itemTemplate.effect as CommonEffectType),
      },
    }));

    return {
      ...inventoryData,
      items: transformedItems,
    };
  } catch (error) {
    console.error(`Error fetching inventory for course ${courseId}:`, error);
    return null;
  }
};

export const buyItem = async (
  courseId: string,
  itemTemplateId: string,
  quantity: number = 1,
): Promise<{ success: boolean; message: string; inventory?: Inventory }> => {
  try {
    const response = await axios.post(
      `${ResourcePrefix.CourseLearning}/${courseId}/inventory/buy`,
      { itemTemplateId, quantity },
    );

    const updatedInventory = await fetchInventory(courseId);

    return {
      success: true,
      message: response.data.message || 'Item purchased successfully',
      inventory: updatedInventory || undefined,
    };
  } catch (error) {
    console.error('Error buying item:', error);
    let errorMessage = 'Failed to purchase item';

    if (error.response && error.response.data && error.response.data.errors) {
      errorMessage = error.response.data.errors[0].message || errorMessage;
    }

    return {
      success: false,
      message: errorMessage,
    };
  }
};

export const useItem = async (
  courseId: string,
  itemTemplateId: string,
  quantity: number = 1,
): Promise<{ success: boolean; message: string; inventory?: Inventory }> => {
  try {
    const response = await axios.post(
      `${ResourcePrefix.CourseLearning}/${courseId}/inventory/use`,
      { itemTemplateId, quantity },
    );

    const updatedInventory = await fetchInventory(courseId);

    return {
      success: true,
      message: response.data.message || 'Item used successfully',
      inventory: updatedInventory || undefined,
    };
  } catch (error) {
    console.error('Error using item:', error);
    let errorMessage = 'Failed to use item';

    if (error.response && error.response.data && error.response.data.errors) {
      errorMessage = error.response.data.errors[0].message || errorMessage;
    }

    return {
      success: false,
      message: errorMessage,
    };
  }
};

export const getCompatibleInventory = (inventory: Inventory): UserInventory => {
  return {
    id: inventory.id,
    gold: inventory.gold,
  };
};

export const getItemsByEffect = (inventory: Inventory, effectType: EffectType): Item[] => {
  const allItems = convertToComponentFormat(inventory);
  return allItems.filter((item) => item.effect === effectType);
};

export const getTotalItemCount = (inventory: Inventory): number => {
  return inventory.items.reduce((total, item) => total + item.quantity, 0);
};

export const canAffordItem = (
  inventory: Inventory,
  itemPrice: number,
  quantity: number = 1,
): boolean => {
  return inventory.gold >= itemPrice * quantity;
};

export const fetchUserCourse = async (courseId: string): Promise<UserCourseInfo | null> => {
  try {
    const response = await axios.get(`${ResourcePrefix.CourseLearning}/${courseId}/user-course`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching user course for course ${courseId}:`, error);
    return null;
  }
};

export const getEffectDescription = (effectType: string | undefined): string => {
  if (!effectType) return '';

  switch (effectType) {
    case 'expX2':
      return 'Double Bonus Experience (×2)';
    case 'expX3':
      return 'Triple Bonus Experience (×3)';
    case 'expX4':
      return 'Quadruple Bonus Experience (×4)';
    case 'goldX2':
      return 'Double Bonus Gem (×2)';
    case 'goldX3':
      return 'Triple Bonus Gem (×3)';
    case 'goldX4':
      return 'Quadruple Bonus Gem (×4)';
    case 'goldRandom':
      return 'Get Random Gem';
    case 'expRandom':
      return 'Get Random Experience';
    default:
      return 'Unknown Effect';
  }
};
