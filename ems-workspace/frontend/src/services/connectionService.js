import {
  getMyConnectionsApi,
  getPendingRequestsApi,
  getSentRequestsApi,
  sendConnectionRequestApi,
  acceptConnectionApi,
  rejectConnectionApi,
  removeConnectionApi
} from './apiClient';

export const connectionService = {
  getMyConnections: async () => {
    return await getMyConnectionsApi();
  },
  getPendingRequests: async () => {
    return await getPendingRequestsApi();
  },
  getSentRequests: async () => {
    return await getSentRequestsApi();
  },
  sendRequest: async (receiverId, message = '') => {
    return await sendConnectionRequestApi(receiverId, message);
  },
  acceptRequest: async (connectionId) => {
    return await acceptConnectionApi(connectionId);
  },
  rejectRequest: async (connectionId) => {
    return await rejectConnectionApi(connectionId);
  },
  removeConnection: async (connectionId) => {
    return await removeConnectionApi(connectionId);
  }
};

export default connectionService;
