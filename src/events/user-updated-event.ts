import { UserRole } from '../types/user-roles';
import { UserStatus } from '../types/user-status';
import { Subjects } from './subjects';

export interface UserUpdatedEvent {
  subject: Subjects.UserUpdated;
  data: {
    id: string;
    role: UserRole;
    status: UserStatus;
    gmail: string;
    userName: string;
    imageUrl?: string;
    exp?: number;
  };
}
