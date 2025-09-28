import { EffectType } from '../types/effect-type';
import { Subjects } from './subjects';

export interface ItemTemplateUpdatedEvent {
  subject: Subjects.ItemTemplateUpdated;
  data: {
    id: string;
    gold: number;
    name: string;
    effect: EffectType;
    effect_description: string;
    img: string;
    description: string;
  };
}
