export enum UserRole {
  Student = 'student',
  Teacher = 'teacher',
  Admin = 'admin',
}

export interface TabItem {
  label: string;
  isActive?: boolean;
}

export interface FormData {
  username: string;
  title: string;
}

export interface UserPayload {
  id: string;
  email: string;
  userName: string;
  role: UserRole;
  imageUrl?: string;
}

export interface CourseData {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  completionRate: number;
  userCourseStatus: string;
  totalLevels: number;
  completedLevels: number;
}

export interface CoursesResponse {
  courses: CourseData[];
  total: number;
  page: number;
  pageSize: number;
}
