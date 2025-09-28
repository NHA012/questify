import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { Inventory } from '../../models/inventory';
import { InventoryItemTemplate } from '../../models/inventory-item-template';
import { ItemTemplate } from '../../models/item-template';
import { CourseItemTemplate } from '../../models/course-item-template';
import {
  ResourcePrefix,
  requireAuth,
  validateRequest,
  NotFoundError,
  BadRequestError,
} from '@datn242/questify-common';

const router = express.Router();

router.post(
  ResourcePrefix.CourseLearning + '/:course_id/inventory/buy',
  requireAuth,
  [
    body('itemTemplateId').notEmpty().withMessage('Item template ID is required'),
    body('quantity').isInt({ min: 1 }).withMessage('Quantity must be a positive integer'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const courseId = req.params.course_id;
    const userId = req.currentUser!.id;
    const { itemTemplateId, quantity } = req.body;

    const inventory = await Inventory.findOne({
      where: {
        user_id: userId,
        course_id: courseId,
        isDeleted: false,
      },
    });

    if (!inventory) {
      throw new NotFoundError();
    }

    const courseItemTemplate = await CourseItemTemplate.findOne({
      where: {
        course_id: courseId,
        item_template_id: itemTemplateId,
        isDeleted: false,
      },
    });

    if (!courseItemTemplate) {
      throw new BadRequestError('Item is not available for this course');
    }

    const itemTemplate = await ItemTemplate.findOne({
      where: {
        id: itemTemplateId,
        isDeleted: false,
      },
    });

    if (!itemTemplate) {
      throw new NotFoundError();
    }

    const totalCost = itemTemplate.gold * quantity;

    if (inventory.gold < totalCost) {
      throw new BadRequestError('Not enough gold to purchase this item');
    }

    const inventoryItem = await InventoryItemTemplate.findOne({
      where: {
        inventory_id: inventory.id,
        item_template_id: itemTemplateId,
        isDeleted: false,
      },
    });

    if (!inventoryItem) {
      throw new NotFoundError();
    }

    await InventoryItemTemplate.sequelize!.transaction(async (transaction) => {
      await Inventory.update(
        {
          gold: inventory.gold - totalCost,
        },
        {
          where: {
            id: inventory.id,
          },
          transaction,
        },
      );

      await InventoryItemTemplate.update(
        {
          quantity: inventoryItem!.quantity + quantity,
        },
        {
          where: {
            id: inventoryItem!.id,
          },
          transaction,
        },
      );
    });

    const updatedInventory = await Inventory.findByPk(inventory.id);
    const updatedInventoryItem = await InventoryItemTemplate.findByPk(inventoryItem.id);

    res.status(200).send({
      message: 'Item purchased successfully',
      inventory: {
        id: updatedInventory!.id,
        gold: updatedInventory!.gold,
      },
      item: {
        itemTemplateId: updatedInventoryItem!.item_template_id,
        quantity: updatedInventoryItem!.quantity,
      },
    });
  },
);

export { router as inventoryBuyRouter };
