import { inventoryModalImage } from '@/assets/images';

export enum EffectType {
  Exp = 'exp',
  Gold = 'gold',
}

// Basic User interface with just ID
export interface User {
  id: string;
  name?: string;
}

export interface Course {
  id: string;
  name?: string;
}

export interface ItemTemplate {
  id: string;
  name: string;
  effect: EffectType;
  effectDescription: string;
  description: string;
  gold: number;
  img: string;
}
export interface CourseItemTemplate {
  id: string;
  courseId: string;
  itemTemplateId: string;
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

export function convertToComponentFormat(inventory: Inventory): Item[] {
  return inventory.items.map((item) => ({
    id: item.itemTemplateId,
    name: item.itemTemplate.name,
    effect: item.itemTemplate.effect,
    effectDescription: item.itemTemplate.effectDescription,
    description: item.itemTemplate.description,
    gold: item.itemTemplate.gold,
    img: item.itemTemplate.img,
    quantity: item.quantity,
  }));
}

export const itemTemplates: ItemTemplate[] = [
  {
    id: '1',
    name: 'Golden Amulet',
    effect: EffectType.Gold,
    effectDescription: 'Gold Gain\n+5%',
    description: 'Increases gold gain by 5%.',
    gold: 10,
    img: inventoryModalImage.itemEyeglassImage,
  },
  {
    id: '2',
    name: 'Ring of Wealth',
    effect: EffectType.Gold,
    effectDescription: 'Gold Gain\n+10%',
    description: 'Increases gold gain by 10%.',
    gold: 20,
    img: inventoryModalImage.itemEyeglassImage,
  },
  {
    id: '3',
    name: 'Boots of Prosperity',
    effect: EffectType.Gold,
    effectDescription: 'Gold Gain\n+15%',
    description: 'Increases gold gain by 15%.',
    gold: 300,
    img: inventoryModalImage.itemEyeglassImage,
  },
  {
    id: '4',
    name: 'Gloves of Fortune',
    effect: EffectType.Gold,
    effectDescription: 'Gold Gain\n+20%',
    description: 'Increases gold gain by 20%.',
    gold: 40,
    img: inventoryModalImage.itemEyeglassImage,
  },
  {
    id: '5',
    name: 'Helmet of Riches',
    effect: EffectType.Gold,
    effectDescription: 'Gold Gain\n+25%',
    description: 'Increases gold gain by 25%.',
    gold: 50,
    img: inventoryModalImage.itemEyeglassImage,
  },
  {
    id: '6',
    name: 'Armor of Affluence',
    effect: EffectType.Gold,
    effectDescription: 'Gold Gain\n+30%',
    description: 'Increases gold gain by 30%.',
    gold: 60,
    img: inventoryModalImage.itemEyeglassImage,
  },
  {
    id: '7',
    name: 'Sword of Gold',
    effect: EffectType.Gold,
    effectDescription: 'Gold Gain\n+35%',
    description: 'Increases gold gain by 35%.',
    gold: 70,
    img: inventoryModalImage.itemEyeglassImage,
  },
  {
    id: '8',
    name: 'Shield of Treasure',
    effect: EffectType.Gold,
    effectDescription: 'Gold Gain\n+40%',
    description: 'Increases gold gain by 40%.',
    gold: 80,
    img: inventoryModalImage.itemEyeglassImage,
  },
  {
    id: '9',
    name: 'Cloak of Opulence',
    effect: EffectType.Gold,
    effectDescription: 'Gold Gain\n+45%',
    description: 'Increases gold gain by 45%.',
    gold: 90,
    img: inventoryModalImage.itemEyeglassImage,
  },
  {
    id: '10',
    name: 'Midas Touch Gloves',
    effect: EffectType.Gold,
    effectDescription: 'Gold Gain\n+50%',
    description: 'Everything you touch turns to gold, increasing gain by 50%.',
    gold: 100,
    img: inventoryModalImage.itemEyeglassImage,
  },

  // Experience Items (10)
  {
    id: '11',
    name: "Scholar's Robe",
    effect: EffectType.Exp,
    effectDescription: 'Experience Gain\n+20%',
    description: 'Increases experience gain by 20%.',
    gold: 50,
    img: inventoryModalImage.itemEyeglassImage,
  },
  {
    id: '12',
    name: 'Wisdom Pendant',
    effect: EffectType.Exp,
    effectDescription: 'Experience Gain\n+25%',
    description: 'Ancient pendant that boosts learning capabilities by 25%.',
    gold: 60,
    img: inventoryModalImage.itemEyeglassImage,
  },
  {
    id: '13',
    name: "Sage's Hat",
    effect: EffectType.Exp,
    effectDescription: 'Experience Gain\n+30%',
    description: 'A hat worn by the wisest sages, increasing experience by 30%.',
    gold: 70,
    img: inventoryModalImage.itemEyeglassImage,
  },
  {
    id: '14',
    name: 'Knowledge Scroll',
    effect: EffectType.Exp,
    effectDescription: 'Experience Gain\n+35%',
    description: 'Ancient scroll containing forgotten knowledge. Increases experience by 35%.',
    gold: 80,
    img: inventoryModalImage.itemEyeglassImage,
  },
  {
    id: '15',
    name: "Philosopher's Stone",
    effect: EffectType.Exp,
    effectDescription: 'Experience Gain\n+40%',
    description: 'Legendary artifact that accelerates learning by 40%.',
    gold: 90,
    img: inventoryModalImage.itemEyeglassImage,
  },
  {
    id: '16',
    name: 'Enlightenment Candle',
    effect: EffectType.Exp,
    effectDescription: 'Experience Gain\n+45%',
    description: 'When lit, this candle illuminates the mind, boosting experience by 45%.',
    gold: 100,
    img: inventoryModalImage.itemEyeglassImage,
  },
  {
    id: '17',
    name: "Mentor's Quill",
    effect: EffectType.Exp,
    effectDescription: 'Experience Gain\n+50%',
    description: 'A quill that automatically corrects mistakes, increasing experience by 50%.',
    gold: 110,
    img: inventoryModalImage.itemEyeglassImage,
  },
  {
    id: '18',
    name: 'Brain Boost Potion',
    effect: EffectType.Exp,
    effectDescription: 'Experience Gain\n+55%',
    description: 'A fizzy potion that enhances cognitive abilities, increasing experience by 55%.',
    gold: 120,
    img: inventoryModalImage.itemEyeglassImage,
  },
  {
    id: '19',
    name: 'Owl Familiar',
    effect: EffectType.Exp,
    effectDescription: 'Experience Gain\n+60%',
    description: 'This wise companion whispers answers in your ear, boosting experience by 60%.',
    gold: 130,
    img: inventoryModalImage.itemEyeglassImage,
  },
  {
    id: '20',
    name: 'Cosmic Brain',
    effect: EffectType.Exp,
    effectDescription: 'Experience Gain\n+75%',
    description: 'Expands your mind to cosmic proportions, increasing experience by 75%.',
    gold: 150,
    img: inventoryModalImage.itemEyeglassImage,
  },
];

// Sample user
export const sampleUser: User = {
  id: 'user123',
  name: 'John Doe',
};

// Sample course
export const sampleCourse: Course = {
  id: 'course456',
  name: 'Introduction to Game Development',
};

// Sample CourseItemTemplate relationships - 18 items (9 gold and 9 exp) for the course
export const sampleCourseItemTemplates: CourseItemTemplate[] = [
  // 9 Gold items for the course
  ...Array.from({ length: 9 }, (_, i) => ({
    id: `cit_gold_${i + 1}`,
    courseId: sampleCourse.id,
    itemTemplateId: (i + 1).toString(), // IDs 1-9 for gold items
  })),

  // 9 Exp items for the course
  ...Array.from({ length: 9 }, (_, i) => ({
    id: `cit_exp_${i + 11}`,
    courseId: sampleCourse.id,
    itemTemplateId: (i + 11).toString(), // IDs 11-19 for exp items
  })),
];

// Get the list of item template IDs available for this course
const courseItemTemplateIds = sampleCourseItemTemplates.map((cit) => cit.itemTemplateId);

// Filter the item templates to only include those available for this course
const courseItemTemplates = itemTemplates.filter((template) =>
  courseItemTemplateIds.includes(template.id),
);

// Sample inventory (mimicking what would come from API)
// Only contains items that are available for this course via CourseItemTemplate
export const sampleInventory: Inventory = {
  id: 'inv123',
  userId: sampleUser.id,
  courseId: sampleCourse.id,
  gold: 3000,
  items: courseItemTemplates.map((template) => ({
    itemTemplateId: template.id,
    quantity: 0,
    itemTemplate: template,
  })),
};

// For compatibility with existing components
export const sampleItems: Item[] = convertToComponentFormat(sampleInventory);

// Legacy interface for compatibility with current components
export interface UserInventory {
  id: string;
  gold: number;
}

// This maps our new data structure to the old one for backward compatibility
export const userInventory: UserInventory = {
  id: sampleInventory.id,
  gold: sampleInventory.gold,
};
