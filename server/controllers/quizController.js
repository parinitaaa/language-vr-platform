const Quiz = require('../models/Quiz');
const Lesson = require('../models/Lesson');
const Progress = require('../models/Progress');

// ─── Get all quiz questions for a lesson ──────────────────────────────────────
const getQuizzesByLesson = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ lessonId: req.params.lessonId });
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Check if user has already completed the quiz for a lesson ────────────────
const getQuizStatus = async (req, res) => {
  try {
    const { lessonId } = req.params;

    // Get all quiz IDs for this lesson
    const quizzes = await Quiz.find({ lessonId }, '_id');
    if (quizzes.length === 0) return res.json({ completed: false, score: 0, total: 0 });

    const lesson = await Lesson.findById(lessonId);
    if (!lesson) return res.status(404).json({ message: 'Lesson not found' });

    const progress = await Progress.findOne({ courseId: lesson.courseId, userId: req.user._id });
    if (!progress) return res.json({ completed: false, score: 0, total: quizzes.length });

    const quizIds = quizzes.map(q => q._id.toString());
    const answeredScores = progress.quizScores.filter(s => quizIds.includes(s.quizId.toString()));

    // Completed = every question has a recorded score entry
    const completed = answeredScores.length >= quizzes.length;
    const score = answeredScores.filter(s => s.passed).length;

    res.json({ completed, score, total: quizzes.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Single quiz create (kept for backward compat) ────────────────────────────
const createQuiz = async (req, res) => {
  try {
    const { question, options, correctAnswer, lessonId } = req.body;

    const lesson = await Lesson.findById(lessonId);
    if (!lesson) return res.status(404).json({ message: 'Lesson not found' });

    const quiz = await Quiz.create({ question, options, correctAnswer, lessonId });
    res.status(201).json(quiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Bulk create (replace all questions for a lesson) ────────────────────────
const createBulkQuiz = async (req, res) => {
  try {
    const { lessonId, questions } = req.body;

    const lesson = await Lesson.findById(lessonId);
    if (!lesson) return res.status(404).json({ message: 'Lesson not found' });

    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ message: 'At least one question is required' });
    }

    await Quiz.deleteMany({ lessonId });

    const quizDocs = questions.map(q => ({
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer,
      lessonId
    }));

    const savedQuizzes = await Quiz.insertMany(quizDocs);
    res.status(201).json(savedQuizzes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Update a single quiz question ───────────────────────────────────────────
const updateQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Quiz question not found' });

    const { question, options, correctAnswer } = req.body;
    if (question !== undefined) quiz.question = question;
    if (options !== undefined) quiz.options = options;
    if (correctAnswer !== undefined) quiz.correctAnswer = correctAnswer;

    await quiz.save();
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Delete a single quiz question ───────────────────────────────────────────
const deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndDelete(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Quiz question not found' });
    res.json({ message: 'Quiz question deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Submit a single quiz answer ─────────────────────────────────────────────
const submitQuiz = async (req, res) => {
  try {
    const { quizId, selectedOption } = req.body;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    const isCorrect = quiz.correctAnswer === selectedOption;

    const lesson = await Lesson.findById(quiz.lessonId);

    const progress = await Progress.findOne({ courseId: lesson.courseId, userId: req.user._id });
    if (progress) {
      const existingIdx = progress.quizScores.findIndex(q => q.quizId.toString() === quizId);

      if (existingIdx > -1) {
        progress.quizScores[existingIdx].score = isCorrect ? 100 : 0;
        progress.quizScores[existingIdx].passed = isCorrect;
      } else {
        progress.quizScores.push({ quizId, score: isCorrect ? 100 : 0, passed: isCorrect });
      }
      await progress.save();
    }

    res.json({ isCorrect, correctAnswer: quiz.correctAnswer });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getQuizzesByLesson,
  getQuizStatus,
  createQuiz,
  createBulkQuiz,
  updateQuiz,
  deleteQuiz,
  submitQuiz
};
