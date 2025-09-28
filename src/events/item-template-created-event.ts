import { EffectType } from '../types/effect-type';
import { Subjects } from './subjects';

export interface ItemTemplateCreatedEvent {
  subject: Subjects.ItemTemplateCreated;
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
