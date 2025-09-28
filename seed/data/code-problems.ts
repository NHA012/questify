import apiService from '../services/api-service';
import { ResourcePrefix, LevelContent, CourseCategory } from '@datn242/questify-common';

const api = apiService.instance;

async function seed() {
  try {
    await api.post(ResourcePrefix.Auth + '/signin', {
      email: 'teacher1@example.com',
      password: '12345aB@',
    });
    console.log('Teacher sign in successful');

    const courseResponse = await api.post(ResourcePrefix.CourseManagement, {
      name: 'Course 1',
      description: 'Description for Course 1',
      backgroundImage:
        'https://cdn.builder.io/api/v1/image/assets/TEMP/8fc28dc360c1fe027a04509249c2d9399cd7e5b2',
      category: CourseCategory.ITSoftware,
      price: 100,
      learningObjectives: ['Objective 1', 'Objective 2'],
      requirements: ['Requirement 1', 'Requirement 2'],
      targetAudience: ['Audience 1', 'Audience 2'],
    });

    const course = courseResponse.data;
    console.log('Course seeded successfully:', course.id);

    const island1Response = await api.post(
      ResourcePrefix.CourseManagement + `/${course.id}/islands`,
      {
        name: 'Island 1',
        description: 'Description for Island 1',
      },
    );
    const island1 = island1Response.data;
    console.log('Island 1 seeded successfully:', island1.id);

    const levelResponse = await api.post(
      ResourcePrefix.CourseManagement + `/islands/${island1.id}/level`,
      {
        name: 'Level 1',
        position: 1,
        description: 'Description for Level 1',
        contentType: LevelContent.CodeProblem,
      },
    );
    const level = levelResponse.data;
    console.log('Level seeded successfully:', level.id);

    const codeProblemResponse = await api.post(ResourcePrefix.CodeProblem, {
      id: 'df04a27b-ecc4-4dbf-a655-1e3a84dd085a',
      level_id: level.id,
      title: 'Two Sum',
      starterCode: `function main(nums, target) {
  // Your code here
}`,
      description: `
# Description for Code Problem 1

Given an array of integers \`nums\` and an integer \`target\`, return *indices of the two numbers such that they add up to \`target\`*.

You may assume that each input would have **exactly one solution**, and you may not use the same element twice.

You can return the answer in any order.

## Example 1:

**Input:** nums = [2,7,11,15], target = 9
**Output:** [0,1]
**Explanation:** Because nums[0] + nums[1] == 9, we return [0, 1].

## Example 2:

**Input:** nums = [3,2,4], target = 6
**Output:** [1,2]
**Explanation:** Because nums[1] + nums[2] == 6, we return [1, 2].

## Example 3:

**Input:** nums = [3,3], target = 6
**Output:** [0,1]

## Constraints:

* 2 ≤ nums.length ≤ 10
* -10 ≤ nums[i] ≤ 10
* -10 ≤ target ≤ 10
* Only one valid answer exists.
  `,
    });
    const codeProblem = codeProblemResponse.data;
    console.log('Code Problem seeded successfully:', codeProblem.id);

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
