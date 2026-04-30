const Progress = require('../models/Progress');
const Course = require('../models/Course');
const Lesson = require('../models/Lesson');

const getUserProgress = async (req, res) => {
  try {
    const progressList = await Progress.find({ userId: req.user._id }).populate('courseId', 'title level');
    
    // Calculate progress percentage for each course
    const detailedProgress = await Promise.all(progressList.map(async (prog) => {
      const totalLessons = await Lesson.countDocuments({ courseId: prog.courseId._id });
      const completedCount = prog.completedLessons.length;
      const progressPercentage = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
      
      return {
        ...prog._doc,
        totalLessons,
        progressPercentage
      };
    }));

    res.json(detailedProgress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateTimeSpent = async (req, res) => {
  try {
    const { courseId, seconds } = req.body;
    const userId = req.user._id;

    let progress = await Progress.findOne({ userId, courseId });
    if (!progress) {
      progress = new Progress({
        userId,
        courseId,
        completedLessons: [],
        quizScores: [],
        timeSpent: seconds
      });
    } else {
      progress.timeSpent = (progress.timeSpent || 0) + seconds;
    }

    await progress.save();
    res.json({ message: 'Time updated', timeSpent: progress.timeSpent });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getUserProgress, updateTimeSpent };
