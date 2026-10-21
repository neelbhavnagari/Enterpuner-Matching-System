import { fetchMatches, createStartupApi, updateStartupApi, deleteStartupApi } from './apiClient';

export const listingService = {
  getListings: async () => {
    return await fetchMatches();
  },
  createListing: async (listingData) => {
    return await createStartupApi(listingData);
  },
  updateListing: async (id, listingData) => {
    return await updateStartupApi(id, listingData);
  },
  deleteListing: async (id) => {
    return await deleteStartupApi(id);
  }
};

export default listingService;
