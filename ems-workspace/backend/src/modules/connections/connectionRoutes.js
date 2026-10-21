const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middlewares/authMiddleware');
const {
  sendRequest,
  acceptRequest,
  rejectRequest,
  removeConnection,
  getMyConnections,
  getPendingRequests,
  getSentRequests,
  getAllUsersWithStatus,
} = require('./connectionController');

// All routes require authentication
router.use(authMiddleware);

// Discovery — all users with connection status
router.get('/discover',  getAllUsersWithStatus);

// My accepted connections
router.get('/my',        getMyConnections);

// Pending requests received
router.get('/requests',  getPendingRequests);

// Sent pending requests
router.get('/sent',      getSentRequests);

// Send a connection request
router.post('/send',     sendRequest);

// Accept a connection request
router.put('/accept/:connectionId',  acceptRequest);

// Reject a connection request
router.put('/reject/:connectionId',  rejectRequest);

// Remove connection or cancel sent request
router.delete('/:connectionId',      removeConnection);

module.exports = router;
