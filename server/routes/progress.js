const express = require('express');
const router = express.Router();
const { getUserProgress, updateTimeSpent } = require('../controllers/progressController');
const { authMiddleware } = require('../middleware/auth');

router.get('/', authMiddleware, getUserProgress);
router.post('/time', authMiddleware, updateTimeSpent);

module.exports = router;
