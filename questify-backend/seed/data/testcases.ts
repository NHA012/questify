import apiService from '../services/api-service';
import { ResourcePrefix } from '@datn242/questify-common';

const api = apiService.instance;

async function seed() {
  try {
    await api.post(ResourcePrefix.Auth + '/signin', {
      email: 'teacher1@example.com',
      password: '12345aB@',
    });
    console.log('Teacher sign in successful');

    const codeProblemResponse = await api.get(
      ResourcePrefix.CodeProblem + '/df04a27b-ecc4-4dbf-a655-1e3a84dd085a',
    );

    const codeProblemId = codeProblemResponse.data.id;
    console.log('Code problem fetched successfully:', codeProblemId);

    // Make sure we have a valid ID before proceeding
    if (!codeProblemId) {
      throw new Error('Failed to get a valid code problem ID');
    }

    const testcaseResponse = await api.post(
      ResourcePrefix.CodeProblem + `/${codeProblemId}/testcases`,
      {
        testcases: [
          {
            input: 'nums = [2,7,11,15], target = 9',
            output: '[0,1]',
            hidden: false,
          },
          {
            input: 'nums = [3,2,4], target = 6',
            output: '[1,2]',
            hidden: false,
          },
          {
            input: 'nums = [3,3], target = 6',
            output: '[0,1]',
            hidden: true,
          },
        ],
      },
    );
    console.log('Testcase seeded successfully:', testcaseResponse.data);

    await api.post(ResourcePrefix.Auth + '/signout', {});
    console.log('Teacher sign out successful');
  } catch (error) {
    console.error('Error seeding data:', error.response?.data || error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

seed();
