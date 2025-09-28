import { inventoryModalImage } from '@/assets/images';

export enum EffectType {
  Exp = 'exp',
  Gold = 'gold',
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

export const itemTemplates: ItemTemplate[] = [
  // Gold Items (10)
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
