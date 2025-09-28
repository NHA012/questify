import { sequelize } from '../config/db';
import { ItemTemplate } from '../models/item-template';
import { EffectType } from '@datn242/questify-common';

async function seedItemTemplates() {
  try {
    await sequelize.authenticate();
    console.log('Connection to database established successfully.');

    const itemTemplates = [
      {
        name: 'Double XP Boost',
        effect: EffectType.ExpX2,
        effect_description: 'Experience Gain\n×2',
        description: 'Doubles your experience gain for the next lesson.',
        img: 'https://firebasestorage.googleapis.com/v0/b/questify-a190e.firebasestorage.app/o/images%2Finventory_modal%2Fitem-icon-eyeglass.png?alt=media&token=bff6b605-b810-41f5-9b8d-dd5aed2d3ea4',
        gold: 50,
      },
      {
        name: 'Triple XP Boost',
        effect: EffectType.ExpX3,
        effect_description: 'Experience Gain\n×3',
        description: 'Triples your experience gain for the next lesson.',
        img: 'https://firebasestorage.googleapis.com/v0/b/questify-a190e.firebasestorage.app/o/images%2Finventory_modal%2Fitem-icon-eyeglass.png?alt=media&token=bff6b605-b810-41f5-9b8d-dd5aed2d3ea4',
        gold: 100,
      },
      {
        name: 'Quadruple XP Boost',
        effect: EffectType.ExpX4,
        effect_description: 'Experience Gain\n×4',
        description: 'Quadruples your experience gain for the next lesson.',
        img: 'https://firebasestorage.googleapis.com/v0/b/questify-a190e.firebasestorage.app/o/images%2Finventory_modal%2Fitem-icon-eyeglass.png?alt=media&token=bff6b605-b810-41f5-9b8d-dd5aed2d3ea4',
        gold: 150,
      },
      {
        name: 'Mystery XP Potion',
        effect: EffectType.ExpRandom,
        effect_description: 'Experience Gain\n1-5×',
        description: 'Gives a random XP multiplier (between 1× and 5×) for the next lesson.',
        img: 'https://firebasestorage.googleapis.com/v0/b/questify-a190e.firebasestorage.app/o/images%2Finventory_modal%2Fitem-icon-eyeglass.png?alt=media&token=bff6b605-b810-41f5-9b8d-dd5aed2d3ea4',
        gold: 75,
      },
      {
        name: 'Gold Doubler',
        effect: EffectType.GoldX2,
        effect_description: 'Gold Gain\n×2',
        description: 'Doubles your gold gain for the next lesson.',
        img: 'https://firebasestorage.googleapis.com/v0/b/questify-a190e.firebasestorage.app/o/images%2Finventory_modal%2Fitem-icon-eyeglass.png?alt=media&token=bff6b605-b810-41f5-9b8d-dd5aed2d3ea4',
        gold: 60,
      },
      {
        name: 'Gold Tripler',
        effect: EffectType.GoldX3,
        effect_description: 'Gold Gain\n×3',
        description: 'Triples your gold gain for the next lesson.',
        img: 'https://firebasestorage.googleapis.com/v0/b/questify-a190e.firebasestorage.app/o/images%2Finventory_modal%2Fitem-icon-eyeglass.png?alt=media&token=bff6b605-b810-41f5-9b8d-dd5aed2d3ea4',
        gold: 120,
      },
      {
        name: 'Gold Quadrupler',
        effect: EffectType.GoldX4,
        effect_description: 'Gold Gain\n×4',
        description: 'Quadruples your gold gain for the next lesson.',
        img: 'https://firebasestorage.googleapis.com/v0/b/questify-a190e.firebasestorage.app/o/images%2Finventory_modal%2Fitem-icon-eyeglass.png?alt=media&token=bff6b605-b810-41f5-9b8d-dd5aed2d3ea4',
        gold: 180,
      },
      {
        name: 'Lucky Gold Chest',
        effect: EffectType.GoldRandom,
        effect_description: 'Gold Gain\n1-5×',
        description: 'Gives a random gold multiplier (between 1× and 5×) for the next lesson.',
        img: 'https://firebasestorage.googleapis.com/v0/b/questify-a190e.firebasestorage.app/o/images%2Finventory_modal%2Fitem-icon-eyeglass.png?alt=media&token=bff6b605-b810-41f5-9b8d-dd5aed2d3ea4',
        gold: 90,
      },
    ];

    for (const itemTemplate of itemTemplates) {
      await ItemTemplate.create(itemTemplate);
      console.log(`Item Template '${itemTemplate.name}' seeded successfully.`);
    }

    console.log('All item templates seeded successfully!');
  } catch (error) {
    console.error('Error seeding item templates:', error);
  } finally {
    await sequelize.close();
  }
}

seedItemTemplates();
