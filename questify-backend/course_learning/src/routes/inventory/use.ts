import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { Inventory } from '../../models/inventory';
import { InventoryItemTemplate } from '../../models/inventory-item-template';
import { ItemTemplate } from '../../models/item-template';
import { User } from '../../models/user';
import {
  ResourcePrefix,
  requireAuth,
  validateRequest,
  NotFoundError,
  BadRequestError,
  EffectType,
} from '@datn242/questify-common';
import {
  randomGoldItem,
  randomExpItem,
  multipleExpForNextLevel,
  multipleGoldForNextLevel,
} from '../../services/item-effect.service';
import { natsWrapper } from '../../nats-wrapper';
import { UserUpdatedPublisher } from '../../events/publishers/user-updated-publisher';

const router = express.Router();

router.post(
  ResourcePrefix.CourseLearning + '/:course_id/inventory/use',
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

    if (inventoryItem.quantity < quantity) {
      throw new BadRequestError('Not enough items to use');
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

    // Apply the effect based on the item's effect type
    let goldAdded = 0;
    let expAdded = 0;

    await InventoryItemTemplate.sequelize!.transaction(async (transaction) => {
      await InventoryItemTemplate.update(
        {
          quantity: inventoryItem.quantity - quantity,
        },
        {
          where: {
            id: inventoryItem.id,
          },
          transaction,
        },
      );

      // Apply the effect for each quantity of the item
      for (let i = 0; i < quantity; i++) {
        switch (itemTemplate.effect) {
          case EffectType.GoldRandom: {
            const goldAmount = randomGoldItem();
            goldAdded += goldAmount;
            await Inventory.increment(
              { gold: goldAmount },
              {
                where: { id: inventory.id },
                transaction,
              },
            );
            break;
          }

          case EffectType.ExpRandom: {
            const expAmount = randomExpItem();
            expAdded += expAmount;

            // Find the user to update exp
            const user = await User.findByPk(userId);
            if (user) {
              const currentExp = user.exp || 0;
              await user.update({ exp: currentExp + expAmount }, { transaction });

              // Publish user updated event
              new UserUpdatedPublisher(natsWrapper.client).publish({
                id: user.id,
                role: user.role,
                status: user.status,
                gmail: user.gmail,
                userName: user.userName,
                exp: currentExp + expAmount,
              });
            }
            break;
          }

          case EffectType.ExpX2:
          case EffectType.ExpX3:
          case EffectType.ExpX4: {
            await multipleExpForNextLevel(itemTemplate.effect, courseId, userId);
            break;
          }

          case EffectType.GoldX2:
          case EffectType.GoldX3:
          case EffectType.GoldX4: {
            await multipleGoldForNextLevel(itemTemplate.effect, courseId, userId);
            break;
          }

          default: {
            console.warn(`Unhandled effect type: ${itemTemplate.effect}`);
            break;
          }
        }
      }
    });

    const updatedInventory = await Inventory.findByPk(inventory.id);
    const updatedInventoryItem = await InventoryItemTemplate.findByPk(inventoryItem.id);

    let responseMessage = `Item ${itemTemplate.name} used successfully`;
    if (goldAdded > 0) {
      responseMessage += `. Added ${goldAdded} gold`;
    }
    if (expAdded > 0) {
      responseMessage += `. Added ${expAdded} experience points`;
    }

    res.status(200).send({
      message: responseMessage,
      inventory: {
        id: updatedInventory!.id,
        gold: updatedInventory!.gold,
      },
      item: {
        itemTemplateId: updatedInventoryItem!.item_template_id,
        quantity: updatedInventoryItem!.quantity,
      },
      effect: {
        type: itemTemplate.effect,
        description: itemTemplate.effect_description,
        goldAdded: goldAdded > 0 ? goldAdded : undefined,
        expAdded: expAdded > 0 ? expAdded : undefined,
      },
    });
  },
);

export { router as inventoryUseRouter };
