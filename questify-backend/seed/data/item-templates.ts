import apiService from '../services/api-service';
import { ResourcePrefix, EffectType } from '@datn242/questify-common';

const api = apiService.instance;

const itemTemplates = [
  {
    gold: 50,
    name: 'Double XP Boost',
    effect: EffectType.ExpX2,
    effect_description: 'Experience Gain\n×2',
    img: 'https://firebasestorage.googleapis.com/v0/b/questify-a190e.firebasestorage.app/o/images%2Finventory_modal%2Fitem-icon-eyeglass.png?alt=media&token=bff6b605-b810-41f5-9b8d-dd5aed2d3ea4',
    description: 'Doubles your experience gain for the next lesson.',
  },
  {
    gold: 100,
    name: 'Triple XP Boost',
    effect: EffectType.ExpX3,
    effect_description: 'Experience Gain\n×3',
    img: 'https://firebasestorage.googleapis.com/v0/b/questify-a190e.firebasestorage.app/o/images%2Finventory_modal%2Fitem-icon-eyeglass.png?alt=media&token=bff6b605-b810-41f5-9b8d-dd5aed2d3ea4',
    description: 'Triples your experience gain for the next lesson.',
  },
  {
    gold: 150,
    name: 'Quadruple XP Boost',
    effect: EffectType.ExpX4,
    effect_description: 'Experience Gain\n×4',
    img: 'https://firebasestorage.googleapis.com/v0/b/questify-a190e.firebasestorage.app/o/images%2Finventory_modal%2Fitem-icon-eyeglass.png?alt=media&token=bff6b605-b810-41f5-9b8d-dd5aed2d3ea4',
    description: 'Quadruples your experience gain for the next lesson.',
  },
  {
    gold: 75,
    name: 'Mystery XP Potion',
    effect: EffectType.ExpRandom,
    effect_description: 'Experience Gain\n1-5×',
    img: 'https://firebasestorage.googleapis.com/v0/b/questify-a190e.firebasestorage.app/o/images%2Finventory_modal%2Fitem-icon-eyeglass.png?alt=media&token=bff6b605-b810-41f5-9b8d-dd5aed2d3ea4',
    description: 'Gives a random XP multiplier (between 1× and 5×) for the next lesson.',
  },
  {
    gold: 60,
    name: 'GemDoubler',
    effect: EffectType.GoldX2,
    effect_description: 'Bonus Gem Gain\n×2',
    img: 'https://firebasestorage.googleapis.com/v0/b/questify-a190e.firebasestorage.app/o/images%2Finventory_modal%2Fitem-icon-eyeglass.png?alt=media&token=bff6b605-b810-41f5-9b8d-dd5aed2d3ea4',
    description: 'Doubles your bonus gem gain for the next lesson.',
  },
  {
    gold: 120,
    name: 'GemTripler',
    effect: EffectType.GoldX3,
    effect_description: 'Bonus Gem Gain\n×3',
    img: 'https://firebasestorage.googleapis.com/v0/b/questify-a190e.firebasestorage.app/o/images%2Finventory_modal%2Fitem-icon-eyeglass.png?alt=media&token=bff6b605-b810-41f5-9b8d-dd5aed2d3ea4',
    description: 'Triples your bonus gem gain for the next lesson.',
  },
  {
    gold: 180,
    name: 'GemQuadrupler',
    effect: EffectType.GoldX4,
    effect_description: 'Bonus Gem Gain\n×4',
    img: 'https://firebasestorage.googleapis.com/v0/b/questify-a190e.firebasestorage.app/o/images%2Finventory_modal%2Fitem-icon-eyeglass.png?alt=media&token=bff6b605-b810-41f5-9b8d-dd5aed2d3ea4',
    description: 'Quadruples your bonus gem gain for the next lesson.',
  },
  {
    gold: 90,
    name: 'Lucky GemChest',
    effect: EffectType.GoldRandom,
    effect_description: 'Bonus Gem Gain\n1-5×',
    img: 'https://firebasestorage.googleapis.com/v0/b/questify-a190e.firebasestorage.app/o/images%2Finventory_modal%2Fitem-icon-eyeglass.png?alt=media&token=bff6b605-b810-41f5-9b8d-dd5aed2d3ea4',
    description: 'Gives a random bonus gem multiplier (between 1× and 5×) for the next lesson.',
  },
];

async function seedWithAuth() {
  try {
    // Sign in as admin or admin - using admin credentials from your example
    console.log('Signing in as admin...');
    try {
      await api.post(ResourcePrefix.Auth + '/signin', {
        email: 'admin@example.com',
        password: '12345aB@',
      });
      console.log('Sign in successful');
    } catch (signInError) {
      console.error('Sign in failed:', signInError.response?.data || signInError.message);
    }

    try {
      const currentUser = await api.get(ResourcePrefix.Auth + '/currentuser');
      console.log('Authenticated as:', currentUser.data.currentUser.email);
    } catch (authCheckError) {
      console.error(
        'Authentication check failed:',
        authCheckError.response?.data || authCheckError.message,
      );
      return;
    }

    console.log('Starting to seed item templates...');

    for (const item of itemTemplates) {
      try {
        const response = await api.post(ResourcePrefix.CourseManagement + '/item-templates', item);
        console.log(`Created item template: ${item.name} with ID: ${response.data.id}`);

        // Add a small delay between requests
        await new Promise((resolve) => setTimeout(resolve, 300));
      } catch (error) {
        console.error(
          `Error creating item template ${item.name}:`,
          error.response?.data || error.message,
        );
        if (error.response?.status === 404) {
          console.error(
            'Check if ResourcePrefix.ItemTemplateManagement is correct and the route is implemented',
          );
        }
      }
    }

    console.log('Item template seeding completed');

    // Sign out
    try {
      await api.post(ResourcePrefix.Auth + '/signout', {});
      console.log('Signed out successfully');
    } catch (signOutError) {
      console.error('Error during sign out:', signOutError.response?.data || signOutError.message);
    }
  } catch (error) {
    console.error(
      'Unexpected error during seeding process:',
      error.response?.data || error.message,
    );
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

seedWithAuth();
