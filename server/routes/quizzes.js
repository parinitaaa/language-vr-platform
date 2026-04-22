const express = require('express');
const router = express.Router();
const { getQuizzesByLesson, submitQuiz, createQuiz } = require('../controllers/quizController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

router.get('/lesson/:lessonId', authMiddleware, getQuizzesByLesson);
router.post('/submit', authMiddleware, submitQuiz);
router.post('/', authMiddleware, adminMiddleware, createQuiz);

module.exports = router;
