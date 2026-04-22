const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true }, // Text content
  videoUrl: { type: String }, // Optional YouTube/Vimeo embed URL
  level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'] },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  order: { type: Number, default: 0 } // For sorting lessons within a course
}, { timestamps: true });

module.exports = mongoose.model('Lesson', lessonSchema);
