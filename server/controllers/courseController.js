const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const Progress = require('../models/Progress');
const Lesson = require('../models/Lesson');
const Quiz = require('../models/Quiz');

const getCourses = async (req, res) => {
  try {
    const courses = await Course.find({});
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCourseDetails = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const enrollment = await Enrollment.findOne({ courseId: course._id, userId: req.user._id });
    res.json({ course, isEnrolled: !!enrollment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createCourse = async (req, res) => {
  try {
    const { title, language, level, description } = req.body;
    const course = await Course.create({
      title, language, level, description, createdBy: req.user._id
    });
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const { title, language, level, description } = req.body;
    if (title !== undefined) course.title = title;
    if (language !== undefined) course.language = language;
    if (level !== undefined) course.level = level;
    if (description !== undefined) course.description = description;

    await course.save();
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    // Cascade: delete all lessons + their quizzes
    const lessons = await Lesson.find({ courseId });
    const lessonIds = lessons.map(l => l._id);
    await Quiz.deleteMany({ lessonId: { $in: lessonIds } });
    await Lesson.deleteMany({ courseId });

    // Delete enrollments and progress
    await Enrollment.deleteMany({ courseId });
    await Progress.deleteMany({ courseId });

    await Course.findByIdAndDelete(courseId);
    res.json({ message: 'Course and all related data deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const enrollInCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const userId = req.user._id;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const existingEnrollment = await Enrollment.findOne({ courseId, userId });
    if (existingEnrollment) return res.status(400).json({ message: 'Already enrolled' });

    await Enrollment.create({ courseId, userId });
    await Progress.create({ courseId, userId });

    res.status(201).json({ message: 'Enrolled successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getCourses, createCourse, updateCourse, deleteCourse, enrollInCourse, getCourseDetails };
