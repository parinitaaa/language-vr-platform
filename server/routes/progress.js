const express = require('express');
const router = express.Router();
const { getUserProgress } = require('../controllers/progressController');
const { authMiddleware } = require('../middleware/auth');

router.get('/', authMiddleware, getUserProgress);

module.exports = router;
