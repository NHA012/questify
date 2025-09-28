import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  requireAuth,
  validateRequest,
  NotFoundError,
  BadRequestError,
  ResourcePrefix,
  requireAdmin,
  CourseStatus,
} from '@datn242/questify-common';
import { Course } from '../../models/course';
// import { AdminCourseActionType } from '../../models/admin-course';
import { User } from '../../models/user';
import { sequelize } from '../../config/db';
import { CourseUpdatedPublisher } from '../../events/publishers/course-updated-publisher';
import { natsWrapper } from '../../nats-wrapper';

const router = express.Router();

router.patch(
  `${ResourcePrefix.Admin}/courses/:course_id`,
  requireAuth,
  requireAdmin,
  [
    body('status')
      .isIn([CourseStatus.Approved, CourseStatus.Rejected])
      .withMessage('Status must be either Approved or Rejected'),
    body('reason')
      .optional({ nullable: true })
      .isString()
      .withMessage('Reason must be a string if provided'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { course_id } = req.params;
    const { status } = req.body;
    const adminId = req.currentUser!.id;

    const course = await Course.findByPk(course_id);

    if (!course) {
      throw new NotFoundError();
    }

    if (course.status !== CourseStatus.Pending) {
      throw new BadRequestError('Only pending courses can be updated');
    }

    const transaction = await sequelize.transaction();

    try {
      course.status = status;
      await course.save({ transaction });

      // let actionType;
      // if (status === CourseStatus.Approved) {
      //   actionType = AdminCourseActionType.Approve;
      // } else {
      //   actionType = AdminCourseActionType.Reject;
      // }

      // const adminAction = await AdminCourse.create(
      //   {
      //     adminId,
      //     courseId: course_id,
      //     reason: reason || '',
      //     actionType,
      //   },
      //   { transaction },
      // );

      // Get admin user for the response
      const admin = await User.findByPk(adminId, {
        attributes: ['id', 'userName', 'gmail'],
        transaction,
      });

      await transaction.commit();

      new CourseUpdatedPublisher(natsWrapper.client).publish({
        id: course.id,
        teacherId: course.teacherId,
        status: course.status!,
        name: course.name,
        description: course.description,
        thumbnail: course.thumbnail,
        isDeleted: course.isDeleted,
      });
      // Construct response without relying on associations
      res.status(200).send({
        ...course.toJSON(),
        adminAction: {
          // ...adminAction. toJSON(),
          admin: admin ? admin.toJSON() : null,
        },
      });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
);

export { router as updateCourseRouter };
