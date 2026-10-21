const express = require('express');
const {
  getStartups,
  recalculateTfidfMatches,
  createStartup,
  updateStartup,
  deleteStartup
} = require('./startupController');
const authMiddleware = require('../../middlewares/authMiddleware');

const router = express.Router();

router.get('/getstartups', getStartups);
router.post('/recalculate', recalculateTfidfMatches);
router.post('/create', authMiddleware, createStartup);
router.put('/update/:id', authMiddleware, updateStartup);
router.delete('/delete/:id', authMiddleware, deleteStartup);

module.exports = router;
