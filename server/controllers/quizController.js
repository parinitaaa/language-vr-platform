const Quiz = require('../models/Quiz');
const Lesson = require('../models/Lesson');
const Progress = require('../models/Progress');

const getQuizzesByLesson = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ lessonId: req.params.lessonId });
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createQuiz = async (req, res) => {
  try {
    const { question, options, correctAnswer, lessonId } = req.body;
    
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) return res.status(404).json({ message: 'Lesson not found' });

    const quiz = await Quiz.create({
      question, options, correctAnswer, lessonId
    });
    
    res.status(201).json(quiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const submitQuiz = async (req, res) => {
  try {
    const { quizId, selectedOption } = req.body;
    
    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    const isCorrect = quiz.correctAnswer === selectedOption;
    
    const lesson = await Lesson.findById(quiz.lessonId);
    
    // Update progress
    const progress = await Progress.findOne({ courseId: lesson.courseId, userId: req.user._id });
    if (progress) {
      const existingScoreIndex = progress.quizScores.findIndex(q => q.quizId.toString() === quizId);
      
      if (existingScoreIndex > -1) {
        progress.quizScores[existingScoreIndex].score = isCorrect ? 100 : 0;
        progress.quizScores[existingScoreIndex].passed = isCorrect;
      } else {
        progress.quizScores.push({
          quizId,
          score: isCorrect ? 100 : 0,
          passed: isCorrect
        });
      }
      await progress.save();
    }

    res.json({ isCorrect, correctAnswer: quiz.correctAnswer });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getQuizzesByLesson, createQuiz, submitQuiz };
