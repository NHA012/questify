import defineCourseAssociations from './course.associations';
import defineIslandAssociations from './island.associations';
import defineLevelAssociations from './level.associations';
import definePrerequisiteIslandAssociations from './prerequisiteIsland.associations';
import defineReviewAssociations from './review.associations';
import defineUserCourseAssociations from './user-course.associations';
import defineUserAssociations from './user.associations';
import defineItemTemplateAssociations from './item-template.associations';
import defineInventoryAssociations from './inventory.associations';
import defineCourseItemTemplateAssociations from './course-item-template.associations';
import defineInventoryItemTemplateAssociations from './inventory-item-template.associations';
import defineChallengeAssociations from './challenge.associations';
import defineSlideAssociations from './slide.associations';
import defineIslandTemplateAssociations from './island-template.associations';
import defineIslandBackgroundImageAssociations from './island-background-image';

export const defineAssociations = () => {
  defineCourseAssociations();
  defineIslandAssociations();
  defineIslandTemplateAssociations();
  defineIslandBackgroundImageAssociations();
  defineUserAssociations();
  defineLevelAssociations();
  definePrerequisiteIslandAssociations();
  defineReviewAssociations();
  defineUserCourseAssociations();
  defineItemTemplateAssociations();
  defineInventoryAssociations();
  defineCourseItemTemplateAssociations();
  defineInventoryItemTemplateAssociations();
  defineChallengeAssociations();
  defineSlideAssociations();
};

defineAssociations();
