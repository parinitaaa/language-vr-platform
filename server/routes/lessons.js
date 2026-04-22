const express = require('express');
const router = express.Router();
const { getLessonsByCourse, createLesson, getLessonById } = require('../controllers/lessonController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

router.get('/course/:courseId', authMiddleware, getLessonsByCourse);
router.get('/:id', authMiddleware, getLessonById);
router.post('/', authMiddleware, adminMiddleware, createLesson);

module.exports = router;
