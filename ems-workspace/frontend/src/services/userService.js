import { fetchUserProfile, updateUserProfileApi, discoverUsersApi } from './apiClient';

export const userService = {
  getProfile: async (userId) => {
    return await fetchUserProfile(userId);
  },
  updateProfile: async (profileData) => {
    return await updateUserProfileApi(profileData);
  },
  discoverUsers: async () => {
    return await discoverUsersApi();
  }
};

export default userService;
