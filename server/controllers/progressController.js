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

module.exports = { getUserProgress };
