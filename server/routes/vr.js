const express = require('express');
const router = express.Router();
const { 
  getScenarios, 
  getScenarioById, 
  saveProgress, 
  getUserProgress, 
  getLanguages,
  createScenario,
  updateScenario,
  deleteScenario
} = require('../controllers/vrController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

router.get('/scenarios', getScenarios);
router.get('/languages', getLanguages);
router.get('/scenarios/:id', getScenarioById);
router.post('/scenarios', authMiddleware, adminMiddleware, createScenario);
router.put('/scenarios/:id', authMiddleware, adminMiddleware, updateScenario);
router.delete('/scenarios/:id', authMiddleware, adminMiddleware, deleteScenario);
router.post('/progress', authMiddleware, saveProgress);
router.get('/progress', authMiddleware, getUserProgress);

module.exports = router;
