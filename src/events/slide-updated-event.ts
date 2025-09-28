import { Subjects } from './subjects';
import { SlideType } from '../types/slide-type';

interface Answer {
  content: string;
  isCorrect: boolean;
}

export interface SlideUpdatedEvent {
  subject: Subjects.SlideUpdated;
  data: {
    id: string;
    title?: string;
    description?: string;
    slideNumber: number;
    type: SlideType;
    imageUrl?: string;
    videoUrl?: string;
    answers?: Answer[];
    challengeId: string;
    isDeleted: boolean;
  };
}
