import { Attempt } from '../../attempt';
import { Challenge } from '../../challenge';
import { CourseItemTemplate } from '../../course-item-template';
import { Course } from '../../course';
import { Feedback } from '../../feedback';
import { Hint } from '../../hint';
import { InventoryItemTemplate } from '../../inventory-item-template';
import { Inventory } from '../../inventory';
import { Island } from '../../island';
import { ItemTemplate } from '../../item-template';
import { Level } from '../../level';
import { PrerequisiteIsland } from '../../prerequisite-island';
import { Review } from '../../review';
import { Reward } from '../../reward';
import { Slide } from '../../slide';
import { StudentReward } from '../../student-reward';
import { UserCourse } from '../../user-course';
import { UserIsland } from '../../user-island';
import { UserLevel } from '../../user-level';
import { User } from '../../user';

it('check attempt associations', async () => {
  expect(Object.keys(Attempt.associations)).toEqual(['Level', 'User', 'Feedback']);
});

it('check challenge associations', async () => {
  expect(Object.keys(Challenge.associations)).toEqual(['Level', 'Slides']);
});

it('check course item template associations', async () => {
  expect(Object.keys(CourseItemTemplate.associations)).toEqual(['Course', 'ItemTemplate']);
});

it('check course associations', async () => {
  expect(Object.keys(Course.associations)).toEqual([
    'User',
    'Islands',
    'Reviews',
    'Rewards',
    'ItemTemplates',
    'CourseItemTemplates',
    'Inventories',
    'UserCourses',
  ]);
});

it('check feedback associations', async () => {
  expect(Object.keys(Feedback.associations)).toEqual(['User', 'Attempt']);
});

it('check hint associations', async () => {
  expect(Object.keys(Hint.associations)).toEqual(['Level']);
});

it('check inventory item template associations', async () => {
  expect(Object.keys(InventoryItemTemplate.associations)).toEqual(['Inventory', 'ItemTemplate']);
});

it('check inventory associations', async () => {
  expect(Object.keys(Inventory.associations)).toEqual([
    'User',
    'Course',
    'ItemTemplates',
    'InventoryItemTemplates',
  ]);
});

it('check island associations', async () => {
  expect(Object.keys(Island.associations)).toEqual([
    'Course',
    'Levels',
    'prerequisites',
    'islandsThatArePrerequisites',
    'Rewards',
    'users',
    'UserIslands',
  ]);
});

it('check item template associations', async () => {
  expect(Object.keys(ItemTemplate.associations)).toEqual([
    'Courses',
    'Inventories',
    'CourseItemTemplates',
    'InventoryItemTemplates',
  ]);
});

it('check level associations', async () => {
  expect(Object.keys(Level.associations)).toEqual([
    'Island',
    'Rewards',
    'Hints',
    'Attempts',
    'Challenge',
    'users',
    'UserLevels',
  ]);
});

it('check prerequisite island associations', async () => {
  expect(Object.keys(PrerequisiteIsland.associations)).toEqual(['Island']);
});

it('check review associations', async () => {
  expect(Object.keys(Review.associations)).toEqual(['User', 'Course']);
});

it('check reward associations', async () => {
  expect(Object.keys(Reward.associations)).toEqual(['Course', 'Island', 'Level', 'users']);
});

it('check slide associations', async () => {
  expect(Object.keys(Slide.associations)).toEqual(['Challenge']);
});

it('check student reward associations', async () => {
  expect(Object.keys(StudentReward.associations)).toEqual([]);
});

it('check user course associations', async () => {
  expect(Object.keys(UserCourse.associations)).toEqual(['User', 'Course']);
});

it('check user island associations', async () => {
  expect(Object.keys(UserIsland.associations)).toEqual(['User', 'Island']);
});

it('check user level associations', async () => {
  expect(Object.keys(UserLevel.associations)).toEqual(['User', 'Level']);
});

it('check user associations', async () => {
  expect(Object.keys(User.associations)).toEqual([
    'Courses',
    'Feedbacks',
    'Reviews',
    'Attempts',
    'Inventories',
    'rewards',
    'courses',
    'UserCourses',
    'islands',
    'UserIslands',
    'levels',
    'UserLevels',
  ]);
});
