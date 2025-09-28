import express, { Request, Response } from 'express';
import { Course } from '../../models/course';
import { ItemTemplate } from '../../models/item-template';
import { CourseItemTemplate } from '../../models/course-item-template';
import {
  ResourcePrefix,
  requireAuth,
  NotFoundError,
  NotAuthorizedError,
} from '@datn242/questify-common';

const router = express.Router();

// Get all item templates associated with a course
router.get(
  ResourcePrefix.CourseManagement + '/:course_id/item-templates',
  requireAuth,
  async (req: Request, res: Response) => {
    const courseId = req.params.course_id;

    const course = await Course.findByPk(courseId);
    if (!course) {
      throw new NotFoundError();
    }

    if (course.teacherId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    // Find all active course-item template associations
    const courseItemTemplates = await CourseItemTemplate.findAll({
      where: { course_id: courseId, isDeleted: false },
    });

    // If no templates are associated, return empty array
    if (courseItemTemplates.length === 0) {
      res.send([]);
      return; // Don't return the Response object, just return from function
    }

    // Extract the item template IDs
    const itemTemplateIds = courseItemTemplates.map((cit) => cit.item_template_id);

    // Fetch the actual item templates
    const itemTemplates = await ItemTemplate.findAll({
      where: {
        id: itemTemplateIds,
        isDeleted: false,
      },
    });

    res.send(itemTemplates);
  },
);

export { router as indexCourseItemTemplateRouter };
