import axios from 'axios';
import { ResourcePrefix, UserStatus } from '@datn242/questify-common';
// import { Problem } from '@/types/problem.type';

const getAllUsers = async () => {
  try {
    const response = await axios.get(ResourcePrefix.Admin + '/users');
    return response.data;
  } catch (error) {
    console.error('Admin SRV | Error fetching users:', error);
    throw error;
  }
};

const getUserById = async (userId: string) => {
  try {
    const response = await axios.get(`${ResourcePrefix.Admin}/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Admin SRV | Error fetching user by ID:', error);
    throw error;
  }
};

const getAllCourses = async () => {
  try {
    const response = await axios.get(ResourcePrefix.Admin + '/courses');
    return response.data;
  } catch (error) {
    console.error('Admin SRV | Error fetching courses:', error);
    throw error;
  }
};

const updateCourseStatus = async (courseId: string, status: string) => {
  try {
    const response = await axios.patch(`${ResourcePrefix.Admin}/courses/${courseId}`, { status });
    return response.data;
  } catch (error) {
    console.error('Admin SRV | Error updating course status:', error);
    throw error;
  }
};

const getAllIslandTemplates = async () => {
  try {
    const response = await axios.get(ResourcePrefix.Admin + '/island-templates');
    return response.data;
  } catch (error) {
    console.error('Admin SRV | Error fetching island templates:', error);
    throw error;
  }
};

const updateUserAccountStatus = async (userId: string, status: UserStatus) => {
  try {
    const response = await axios.patch(`${ResourcePrefix.Admin}/users/${userId}`, { status });
    return response.data;
  } catch (error) {
    console.error('Admin SRV | Error updating user account status:', error);
    throw error;
  }
};

const deleteIslandTemplate = async (templateId: string, reason?: string) => {
  try {
    const response = await axios.delete(`${ResourcePrefix.Admin}/island-templates/${templateId}`, {
      data: { reason },
    });
    return response.data;
  } catch (error) {
    console.error('Admin SRV | Error deleting island template:', error);
    throw error;
  }
};

export {
  getAllUsers,
  getUserById,
  getAllCourses,
  updateCourseStatus,
  updateUserAccountStatus,
  getAllIslandTemplates,
  deleteIslandTemplate,
};
