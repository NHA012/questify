import { ResourcePrefix } from '@datn242/questify-common';
import buildClient from '@/api/build-client';

const getUserProfile = async () => {
  try {
    const client = buildClient({ req: undefined });
    const { data } = await client.get(ResourcePrefix.Auth + '/currentuser');
    return data;
  } catch (error) {
    console.error('Failed to fetch user profile:', error);
    throw error;
  }
};

export { getUserProfile };
