import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { Course } from '../../models/course';
import {
  NotAuthorizedError,
  NotFoundError,
  BadRequestError,
  requireAuth,
  validateRequest,
  ResourcePrefix,
  IslandPathType,
} from '@datn242/questify-common';
import { Island } from '../../models/island';
import { PrerequisiteIsland } from '../../models/prerequisiteIsland';
import { Op } from 'sequelize';
import { sequelize } from '../../config/db';
import { detectCycle, recalculatePositions } from '../../services/island';
import { IslandUpdatedPublisher } from '../../events/publishers/island-updated-publisher';
import { PrerequisiteIslandCreatedPublisher } from '../../events/publishers/prerequisite-island-created-publisher';
import { PrerequisiteIslandDeletedPublisher } from '../../events/publishers/prerequisite-island-deleted-publisher';
import { natsWrapper } from '../../nats-wrapper';

const router = express.Router();

router.patch(
  ResourcePrefix.CourseManagement + '/:course_id/islands/:island_id',
  requireAuth,
  [
    body('name').optional().notEmpty().withMessage('Island name is required'),
    body('position')
      .optional()
      .notEmpty()
      .withMessage('Position is required')
      .isNumeric()
      .withMessage('Position must be a number'),
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
    const { course_id, island_id } = req.params;

    try {
      const result = await sequelize.transaction(async (transaction) => {
        const course = await Course.findByPk(course_id, { transaction });

        if (!course) {
          throw new NotFoundError();
        }

        if (course.teacherId !== req.currentUser!.id) {
          throw new NotAuthorizedError();
        }

        const island = await Island.findOne({
          where: {
            id: island_id,
            courseId: course_id,
          },
          transaction,
        });

        if (!island) {
          throw new NotFoundError();
        }

        const updateFields: Partial<Island> = {};
        const {
          name,
          description,
          position,
          islandTemplateId,
          pathType,
          islandBackgroundImageId,
          prerequisiteIslandIds,
        } = req.body;

        if (name !== undefined) updateFields.name = name;
        if (description !== undefined) updateFields.description = description;
        if (position !== undefined) updateFields.position = position;
        if (islandTemplateId !== undefined) updateFields.islandTemplateId = islandTemplateId;
        if (pathType !== undefined) updateFields.pathType = pathType;
        if (islandBackgroundImageId !== undefined)
          updateFields.islandBackgroundImageId = islandBackgroundImageId;

        island.set(updateFields);
        await island.save({ transaction });

        // Track old and new prerequisite changes for event publishing
        let oldPrereqs: PrerequisiteIsland[] = [];
        const newPrereqs: PrerequisiteIsland[] = [];

        if (prerequisiteIslandIds !== undefined) {
          // Store old prerequisites for event publishing and potential rollback
          oldPrereqs = await PrerequisiteIsland.findAll({
            where: { islandId: island_id },
            transaction,
          });

          // Delete all existing prerequisites
          await PrerequisiteIsland.destroy({
            where: { islandId: island_id },
            transaction,
          });

          if (prerequisiteIslandIds.length > 0) {
            const prereqIslands = await Island.findAll({
              where: {
                id: { [Op.in]: prerequisiteIslandIds },
                courseId: course_id,
              },
              transaction,
            });

            if (prereqIslands.length !== prerequisiteIslandIds.length) {
              throw new BadRequestError(
                'One or more prerequisite islands do not exist or do not belong to this course',
              );
            }

            const prereqPromises = prerequisiteIslandIds.map(async (prereqId: string) => {
              const newPrereq = await PrerequisiteIsland.create(
                {
                  islandId: island_id,
                  prerequisiteIslandId: prereqId,
                },
                { transaction },
              );
              newPrereqs.push(newPrereq);
              return newPrereq;
            });

            await Promise.all(prereqPromises);

            if (await detectCycle(island_id, transaction)) {
              // Delete the new prerequisites
              await PrerequisiteIsland.destroy({
                where: { islandId: island_id },
                transaction,
              });

              // Restore the old prerequisites if there was a cycle
              if (oldPrereqs.length > 0) {
                const restorePromises = oldPrereqs.map((oldPrereq) =>
                  PrerequisiteIsland.create(
                    {
                      islandId: oldPrereq.islandId,
                      prerequisiteIslandId: oldPrereq.prerequisiteIslandId,
                    },
                    { transaction },
                  ),
                );
                await Promise.all(restorePromises);
              }

              throw new BadRequestError(
                'Adding these prerequisites would create a cycle in the island dependencies',
              );
            }
          }
        }

        await recalculatePositions(course_id, transaction);

        const islandWithAssociations = await Island.findByPk(island.id, {
          transaction,
          include: [{ association: 'template' }, { association: 'backgroundImage' }],
        });

        return {
          island: islandWithAssociations || island,
          oldPrereqs,
          newPrereqs,
        };
      });

      // Publish the island updated event - NOT including the template, path, or background image IDs
      new IslandUpdatedPublisher(natsWrapper.client).publish({
        id: result.island.id,
        courseId: result.island.courseId,
        name: result.island.name,
        description: result.island.description,
        position: result.island.position,
        isDeleted: result.island.isDeleted,
      });

      // Handle prerequisite changes if there were any
      if (req.body.prerequisiteIslandIds !== undefined) {
        // First, publish a delete event for all old prerequisites
        new PrerequisiteIslandDeletedPublisher(natsWrapper.client).publish({
          islandId: island_id,
          // No prerequisiteIslandId means delete all for this islandId
        });

        // Then publish create events for all new prerequisites
        if (result.newPrereqs && result.newPrereqs.length > 0) {
          console.log(`Publishing ${result.newPrereqs.length} prerequisite created events`);

          for (const prereq of result.newPrereqs) {
            new PrerequisiteIslandCreatedPublisher(natsWrapper.client).publish({
              islandId: prereq.islandId,
              prerequisiteIslandId: prereq.prerequisiteIslandId,
            });
          }
        }
      }

      res.send(result.island);
    } catch (error) {
      if (
        error instanceof NotFoundError ||
        error instanceof NotAuthorizedError ||
        error instanceof BadRequestError
      ) {
        throw error;
      }
      console.error('Error updating island:', error);
      throw new BadRequestError('Failed to update island');
    }
  },
);

export { router as updateIslandRouter };
