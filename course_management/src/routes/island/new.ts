import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { Course } from '../../models/course';
import { Island } from '../../models/island';
import { PrerequisiteIsland } from '../../models/prerequisiteIsland';
import { Op } from 'sequelize';
import { sequelize } from '../../config/db';
import { detectCycle, recalculatePositions } from '../../services/island';
import {
  validateRequest,
  requireAuth,
  BadRequestError,
  ResourcePrefix,
  IslandPathType,
} from '@datn242/questify-common';
import { IslandCreatedPublisher } from '../../events/publishers/island-created-publisher';
import { PrerequisiteIslandCreatedPublisher } from '../../events/publishers/prerequisite-island-created-publisher';
import { natsWrapper } from '../../nats-wrapper';

const router = express.Router();

router.post(
  ResourcePrefix.CourseManagement + '/:course_id/islands',
  requireAuth,
  [
    body('name').notEmpty().withMessage('Island name is required'),
    body('description').optional(),
    body('islandTemplateId')
      .optional()
      .isUUID()
      .withMessage('Island template ID must be a valid UUID'),
    body('pathType')
      .optional()
      .isIn(Object.values(IslandPathType))
      .withMessage('Path type must be a valid type'),
    body('islandBackgroundImageId')
      .optional()
      .isUUID()
      .withMessage('Island background image ID must be a valid UUID'),
    body('prerequisiteIslandIds')
      .optional()
      .isArray()
      .withMessage('Prerequisite island IDs must be an array'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const courseId = req.params.course_id;
    const {
      name,
      description,
      prerequisiteIslandIds,
      islandTemplateId,
      pathType,
      islandBackgroundImageId,
    } = req.body;

    try {
      const result = await sequelize.transaction(async (transaction) => {
        const course = await Course.findByPk(courseId, { transaction });
        if (!course) {
          throw new BadRequestError('Course not found');
        }

        const island = await Island.create(
          {
            name,
            description,
            position: 0,
            courseId,
            islandTemplateId: islandTemplateId || null,
            pathType: pathType || null,
            islandBackgroundImageId: islandBackgroundImageId || null,
          },
          { transaction },
        );

        // Explicitly type the array to fix the implicit 'any[]' type error
        const createdPrerequisites: PrerequisiteIsland[] = [];

        if (prerequisiteIslandIds && prerequisiteIslandIds.length > 0) {
          const prereqIslands = await Island.findAll({
            where: {
              id: { [Op.in]: prerequisiteIslandIds },
              courseId,
            },
            transaction,
          });

          if (prereqIslands.length !== prerequisiteIslandIds.length) {
            throw new BadRequestError(
              'One or more prerequisite islands do not exist or do not belong to this course',
            );
          }

          const prereqPromises = prerequisiteIslandIds.map(async (prereqId: string) => {
            const prereq = await PrerequisiteIsland.create(
              {
                islandId: island.id,
                prerequisiteIslandId: prereqId,
              },
              { transaction },
            );
            createdPrerequisites.push(prereq);
            return prereq;
          });

          await Promise.all(prereqPromises);

          if (await detectCycle(island.id)) {
            throw new BadRequestError(
              'Adding these prerequisites would create a cycle in the island dependencies',
            );
          }
        }

        await recalculatePositions(courseId, transaction);

        const islandWithAssociations = await Island.findByPk(island.id, {
          transaction,
          include: [{ association: 'template' }, { association: 'backgroundImage' }],
        });

        return {
          island: islandWithAssociations || island,
          prerequisites: createdPrerequisites,
        };
      });

      // Publish the island created event
      new IslandCreatedPublisher(natsWrapper.client).publish({
        id: result.island.id,
        courseId: result.island.courseId,
        name: result.island.name,
        description: result.island.description,
        position: result.island.position,
      });

      // Publish prerequisite island created events
      if (result.prerequisites && result.prerequisites.length > 0) {
        console.log(`Publishing ${result.prerequisites.length} prerequisite events`);

        for (const prereq of result.prerequisites) {
          new PrerequisiteIslandCreatedPublisher(natsWrapper.client).publish({
            islandId: prereq.islandId,
            prerequisiteIslandId: prereq.prerequisiteIslandId,
          });
        }
      }

      res.status(201).send(result.island);
    } catch (error) {
      if (error instanceof BadRequestError) {
        throw error;
      }
      console.error('Error creating island:', error);
      throw new BadRequestError('Failed to create island');
    }
  },
);

export { router as createIslandRouter };
