import express, { Request, Response } from 'express';
import { Inventory } from '../../models/inventory';
import { InventoryItemTemplate } from '../../models/inventory-item-template';
import { ItemTemplate } from '../../models/item-template';
import { ResourcePrefix, requireAuth, NotFoundError } from '@datn242/questify-common';

const router = express.Router();

router.get(
  ResourcePrefix.CourseLearning + '/:course_id/inventory',
  requireAuth,
  async (req: Request, res: Response) => {
    const courseId = req.params.course_id;
    const userId = req.currentUser!.id;

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

    const inventoryItems = await InventoryItemTemplate.findAll({
      where: {
        inventory_id: inventory.id,
        isDeleted: false,
      },
    });

    const itemTemplateIds = inventoryItems.map((item) => item.item_template_id);

    const itemTemplates = await ItemTemplate.findAll({
      where: {
        id: itemTemplateIds,
        isDeleted: false,
      },
    });

    const itemsWithQuantity = inventoryItems.map((inventoryItem) => {
      const template = itemTemplates.find(
        (template) => template.id === inventoryItem.item_template_id,
      );

      return {
        itemTemplateId: inventoryItem.item_template_id,
        quantity: inventoryItem.quantity,
        itemTemplate: {
          id: template!.id,
          name: template!.name,
          effect: template!.effect,
          effect_description: template!.effect_description,
          description: template!.description,
          gold: template!.gold,
          img: template!.img,
        },
      };
    });

    itemsWithQuantity.sort((a, b) => a.itemTemplate.name.localeCompare(b.itemTemplate.name));

    const response = {
      id: inventory.id,
      userId: inventory.user_id,
      courseId: inventory.course_id,
      gold: inventory.gold,
      items: itemsWithQuantity,
    };

    res.status(200).send(response);
  },
);

export { router as inventoryIndexRouter };
