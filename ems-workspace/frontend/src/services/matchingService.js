import { calculateMlMatch, fetchMatches } from './apiClient';

export const matchingService = {
  getMatches: async () => {
    return await fetchMatches();
  },
  calculateMlMatch: async (userPayload) => {
    return await calculateMlMatch(userPayload);
  }
};

export default matchingService;
