const express = require('express');
const { getUserProfile, updateUserProfile, getAllUsers } = require('./userController');
const authMiddleware = require('../../middlewares/authMiddleware');

const router = express.Router();

router.get('/all', getAllUsers);
router.get('/profile/:id?', authMiddleware, getUserProfile);
router.put('/profile', authMiddleware, updateUserProfile);

module.exports = router;
