const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: String, required: true }, // Must match one of the options
  lessonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Quiz', quizSchema);
