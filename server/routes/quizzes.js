const express = require('express');
const router = express.Router();
const {
  getQuizzesByLesson,
  getQuizStatus,
  submitQuiz,
  createQuiz,
  createBulkQuiz,
  updateQuiz,
  deleteQuiz
} = require('../controllers/quizController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

router.get('/lesson/:lessonId', authMiddleware, getQuizzesByLesson);
router.get('/status/:lessonId', authMiddleware, getQuizStatus);
router.post('/submit', authMiddleware, submitQuiz);
router.post('/bulk', authMiddleware, adminMiddleware, createBulkQuiz);
router.post('/', authMiddleware, adminMiddleware, createQuiz);
router.put('/:id', authMiddleware, adminMiddleware, updateQuiz);
router.delete('/:id', authMiddleware, adminMiddleware, deleteQuiz);

module.exports = router;
