// src/routes/item-templates/new.ts
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { ItemTemplate } from '../../models/item-template';
import { validateRequest, requireAuth, ResourcePrefix, EffectType } from '@datn242/questify-common';
import { ItemTemplateCreatedPublisher } from '../../events/publishers/item-template-created-publisher';
import { natsWrapper } from '../../nats-wrapper';

const router = express.Router();

router.post(
  ResourcePrefix.CourseManagement + '/item-templates',
  requireAuth,
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('effect').isIn(Object.values(EffectType)).withMessage('Valid effect type is required'),
    body('effect_description').notEmpty().withMessage('Effect description is required'),
    body('img').notEmpty().withMessage('Image URL is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('gold').isInt({ min: 0 }).withMessage('Gold must be a positive number'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { name, effect, effect_description, img, description, gold } = req.body;

    const itemTemplate = ItemTemplate.build({
      name,
      effect,
      effect_description,
      img,
      description,
      gold,
    });

    await itemTemplate.save();

    new ItemTemplateCreatedPublisher(natsWrapper.client).publish({
      id: itemTemplate.id,
      gold: itemTemplate.gold,
      name: itemTemplate.name,
      effect: itemTemplate.effect,
      effect_description: itemTemplate.effect_description,
      img: itemTemplate.img,
      description: itemTemplate.description,
    });

    res.status(201).send(itemTemplate);
  },
);

export { router as createItemTemplateRouter };
