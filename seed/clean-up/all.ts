import apiService from '../services/api-service';
import { ResourcePrefix } from '@datn242/questify-common';

const api = apiService.instance;

async function seed() {
  try {
    await api.delete(ResourcePrefix.CodeProblem + '/admin/deletion', {
      data: { deleteKey: 'CodeProblemDelete' },
    });
    console.log('All code problem records deleted successfully in Code Problem service');

    await api.delete(ResourcePrefix.CourseManagement + '/admin/deletion', {
      data: { deleteKey: 'CourseMgmtDelete' },
    });
    console.log('All course management records deleted successfully in Course Management service');

    await api.delete(ResourcePrefix.CourseLearning + '/admin/deletion', {
      data: { deleteKey: 'CourseLearningDelete' },
    });
    console.log('All course learning records deleted successfully in Course Learning service');

    await api.delete(ResourcePrefix.Admin + '/admin/deletion', {
      data: { deleteKey: 'AdminDelete' },
    });
    console.log('All admin records deleted successfully in Admin service');

    await api.delete(ResourcePrefix.Auth + '/deletion', {
      data: { deleteKey: 'AuthDelete' },
    });
    console.log('All user records deleted successfully in Auth service');
  } catch (error) {
    console.error('Error deleting data:', error.response?.data || error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

seed();
