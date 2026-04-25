const express = require('express');
const router = express.Router();
const {
  getCourses, createCourse, updateCourse, deleteCourse, enrollInCourse, getCourseDetails
} = require('../controllers/courseController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

router.get('/', getCourses);
router.post('/', authMiddleware, adminMiddleware, createCourse);
router.get('/:id', authMiddleware, getCourseDetails);
router.put('/:id', authMiddleware, adminMiddleware, updateCourse);
router.delete('/:id', authMiddleware, adminMiddleware, deleteCourse);
router.post('/:id/enroll', authMiddleware, enrollInCourse);

module.exports = router;
