import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { ItemTemplate } from '../../models/item-template';
import {
  validateRequest,
  requireAuth,
  ResourcePrefix,
  EffectType,
  NotFoundError,
} from '@datn242/questify-common';
import { ItemTemplateUpdatedPublisher } from '../../events/publishers/item-template-updated-publisher';
import { natsWrapper } from '../../nats-wrapper';

const router = express.Router();

router.put(
  ResourcePrefix.CourseManagement + '/item-templates' + '/:id',
  requireAuth,
  [
    body('name').optional().notEmpty().withMessage('Name cannot be empty'),
    body('effect')
      .optional()
      .isIn(Object.values(EffectType))
      .withMessage('Valid effect type is required'),
    body('effect_description')
      .optional()
      .notEmpty()
      .withMessage('Effect description cannot be empty'),
    body('img').optional().notEmpty().withMessage('Image URL cannot be empty'),
    body('description').optional().notEmpty().withMessage('Description cannot be empty'),
    body('gold').optional().isInt({ min: 0 }).withMessage('Gold must be a positive number'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { name, effect, effect_description, img, description, gold } = req.body;

    const itemTemplate = await ItemTemplate.findByPk(req.params.id);

    if (!itemTemplate) {
      throw new NotFoundError();
    }

    if (name !== undefined) itemTemplate.name = name;
    if (effect !== undefined) itemTemplate.effect = effect;
    if (effect_description !== undefined) itemTemplate.effect_description = effect_description;
    if (img !== undefined) itemTemplate.img = img;
    if (description !== undefined) itemTemplate.description = description;
    if (gold !== undefined) itemTemplate.gold = gold;

    await itemTemplate.save();

    new ItemTemplateUpdatedPublisher(natsWrapper.client).publish({
      id: itemTemplate.id,
      gold: itemTemplate.gold,
      name: itemTemplate.name,
      effect: itemTemplate.effect,
      effect_description: itemTemplate.effect_description,
      img: itemTemplate.img,
      description: itemTemplate.description,
    });

    res.status(200).send(itemTemplate);
  },
);

export { router as updateItemTemplateRouter };
