const express = require('express');
const router = express.Router();
const { getCourses, createCourse, enrollInCourse, getCourseDetails } = require('../controllers/courseController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

router.get('/', getCourses);
router.post('/', authMiddleware, adminMiddleware, createCourse);
router.get('/:id', authMiddleware, getCourseDetails);
router.post('/:id/enroll', authMiddleware, enrollInCourse);

module.exports = router;
