import express, { Request, Response } from 'express';
import { BadRequestError, ResourcePrefix, validateRequest } from '@datn242/questify-common';
import { User } from '../../models/user';
import { UserCourse } from '../../models/user-course';
import { query } from 'express-validator';

const router = express.Router();

router.get(
  ResourcePrefix.CourseLearning + '/progress/all',
  [
    query('student-id')
      .exists()
      .withMessage('student-id is required')
      .isUUID()
      .withMessage('student-id must be a valid UUID'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const student_id = req.query['student-id'] as string;

    const student = await User.findByPk(student_id);
    if (!student) {
      throw new BadRequestError('Student not found');
    }

    const progresses = await UserCourse.findAll({
      where: {
        userId: student.id,
      },
    });

    res.send({ progresses });
  },
);

export { router as showAllProgressRouter };
