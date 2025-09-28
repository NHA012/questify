import axios from 'axios';
import { ResourcePrefix /*, UserStatus */ } from '@datn242/questify-common';
// import { Problem } from '@/types/problem.type';

export const showCourseProgress = async (userId: string, currentPage: number, pageSize: number) => {
  try {
    const response = await axios.get(ResourcePrefix.CourseLearning + `/progress/courses`, {
      params: {
        page: currentPage,
        pageSize: pageSize,
        userId: userId,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Course Learning SRV | Error fetching users:', error);
    throw error;
  }
};
