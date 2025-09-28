import axios from 'axios';
import { ResourcePrefix } from '@datn242/questify-common';
import { SubmissionResponse } from '@/types/courses.type';

export const submitLevel = async (levelId: string): Promise<SubmissionResponse> => {
  try {
    const response = await axios.post(
      ResourcePrefix.CourseLearning + `/level/${levelId}/submission`,
      {},
    );
    return response.data;
  } catch (error) {
    console.error('Error submitting level:', error);
    throw error;
  }
};
