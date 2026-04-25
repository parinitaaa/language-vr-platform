const express = require('express');
const router = express.Router();
const { getScenarios, getScenarioById, saveProgress, getUserProgress } = require('../controllers/vrController');
const { authMiddleware } = require('../middleware/auth');

router.get('/scenarios', getScenarios);
router.get('/scenarios/:id', getScenarioById);
router.post('/progress', authMiddleware, saveProgress);
router.get('/progress', authMiddleware, getUserProgress);

module.exports = router;
