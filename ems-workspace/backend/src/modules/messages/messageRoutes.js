const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middlewares/authMiddleware');
const {
  getConversations,
  getMessages,
  sendMessage,
  deleteMessage,
} = require('./messageController');

// All routes require auth
router.use(authMiddleware);

// List all conversations (connected users + last message)
router.get('/conversations', getConversations);

// Get messages in a conversation with a specific user
router.get('/:otherUserId', getMessages);

// Send a message to a connected user
router.post('/send', sendMessage);

// Delete own message
router.delete('/:messageId', deleteMessage);

module.exports = router;
