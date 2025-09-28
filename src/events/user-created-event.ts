import { UserRole } from '../types/user-roles';
import { UserStatus } from '../types/user-status';
import { Subjects } from './subjects';

export interface UserCreatedEvent {
  subject: Subjects.UserCreated;
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
