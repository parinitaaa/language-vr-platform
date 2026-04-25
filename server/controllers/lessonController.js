const Lesson = require('../models/Lesson');
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const Progress = require('../models/Progress');
const Quiz = require('../models/Quiz');

const getLessonsByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    // Check enrollment (admins bypass)
    const enrollment = await Enrollment.findOne({ courseId, userId: req.user._id });
    if (!enrollment && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not enrolled in this course' });
    }

    const lessons = await Lesson.find({ courseId }).sort({ order: 1 });
    res.json(lessons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getLessonById = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) return res.status(404).json({ message: 'Lesson not found' });

    // Mark as completed when viewed
    const progress = await Progress.findOne({ courseId: lesson.courseId, userId: req.user._id });
    if (progress && !progress.completedLessons.includes(lesson._id)) {
      progress.completedLessons.push(lesson._id);
      await progress.save();
    }

    res.json(lesson);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createLesson = async (req, res) => {
  try {
    const { title, content, videoUrl, thumbnailUrl, level, courseId, order } = req.body;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const lesson = await Lesson.create({
      title, content, videoUrl, thumbnailUrl, level, courseId, order
    });

    res.status(201).json(lesson);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) return res.status(404).json({ message: 'Lesson not found' });

    const { title, content, videoUrl, thumbnailUrl, level } = req.body;
    if (title !== undefined) lesson.title = title;
    if (content !== undefined) lesson.content = content;
    if (videoUrl !== undefined) lesson.videoUrl = videoUrl;
    if (thumbnailUrl !== undefined) lesson.thumbnailUrl = thumbnailUrl;
    if (level !== undefined) lesson.level = level;

    await lesson.save();
    res.json(lesson);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) return res.status(404).json({ message: 'Lesson not found' });

    // Cascade: delete quizzes for this lesson
    await Quiz.deleteMany({ lessonId: lesson._id });

    // Remove from progress completedLessons
    await Progress.updateMany(
      { courseId: lesson.courseId },
      { $pull: { completedLessons: lesson._id } }
    );

    await Lesson.findByIdAndDelete(req.params.id);
    res.json({ message: 'Lesson and its quiz deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getLessonsByCourse, createLesson, updateLesson, deleteLesson, getLessonById };
