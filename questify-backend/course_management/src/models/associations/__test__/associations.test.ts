import { Course } from '../../course';
import { Island } from '../../island';
import { Level } from '../../level';
import { PrerequisiteIsland } from '../../prerequisiteIsland';
import { Review } from '../../review';
import { UserCourse } from '../../user-course';
import { User } from '../../user';
import { ItemTemplate } from '../../item-template';
import { Inventory } from '../../inventory';
import { CourseItemTemplate } from '../../course-item-template';
import { InventoryItemTemplate } from '../../inventory-item-template';
import { IslandTemplate } from '../../island-template';
import { IslandBackgroundImage } from '../../island-background-image';

it('check course associations', async () => {
  expect(Object.keys(Course.associations)).toEqual([
    'teacher',
    'Islands',
    'Reviews',
    'students',
    'UserCourses',
    'ItemTemplates',
    'CourseItemTemplates',
    'Inventories',
  ]);
});

it('check island associations', async () => {
  expect(Object.keys(Island.associations)).toEqual([
    'Course',
    'Levels',
    'prerequisites',
    'islandsThatArePrerequisites',
    'template',
    'backgroundImage',
  ]);
});

it('check level associations', async () => {
  expect(Object.keys(Level.associations)).toEqual(['Island', 'Challenge']);
});

it('check prerequisite island associations', async () => {
  expect(Object.keys(PrerequisiteIsland.associations)).toEqual(['Island']);
});

it('check review associations', async () => {
  expect(Object.keys(Review.associations)).toEqual(['User', 'Course']);
});

it('check user-course associations', async () => {
  expect(Object.keys(UserCourse.associations)).toEqual(['User', 'Course']);
});

it('check user associations', async () => {
  expect(Object.keys(User.associations)).toEqual([
    'teacherCourses',
    'Reviews',
    'enrolledCourses',
    'UserCourses',
    'Inventories',
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

it('check inventory associations', async () => {
  expect(Object.keys(Inventory.associations)).toEqual([
    'User',
    'Course',
    'ItemTemplates',
    'InventoryItemTemplates',
  ]);
});

it('check course item template associations', async () => {
  expect(Object.keys(CourseItemTemplate.associations)).toEqual(['Course', 'ItemTemplate']);
});

it('check inventory item template associations', async () => {
  expect(Object.keys(InventoryItemTemplate.associations)).toEqual(['Inventory', 'ItemTemplate']);
});

it('check island template associations', async () => {
  expect(Object.keys(IslandTemplate.associations)).toEqual(['islands']);
});

it('check island background image associations', async () => {
  expect(Object.keys(IslandBackgroundImage.associations)).toEqual(['islands']);
});
