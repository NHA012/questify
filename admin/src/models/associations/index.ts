import defineUserAssociations from './user.associations';
import defineCourseAssociations from './course.associations';
import defineIslandTemplateAssociations from './island-template.associations';
import defineAdminUserAssociations from './admin-user.associations';
import defineAdminCourseAssociations from './admin-course.associations';
import defineAdminIslandTemplateAssociations from './admin-island-template.associations';

export const defineAssociations = () => {
  defineUserAssociations();
  defineCourseAssociations();
  defineIslandTemplateAssociations();
  defineAdminUserAssociations();
  defineAdminCourseAssociations();
  defineAdminIslandTemplateAssociations();
};

defineAssociations();
