const mongoose = require('mongoose');

const dialogueStepSchema = new mongoose.Schema({
  npc: { type: String, required: true },
  options: [{ type: String, required: true }],
  correct: { type: Number, required: true },
  targetPhrase: { type: String, required: true }
}, { _id: false });

const vrScenarioSchema = new mongoose.Schema({
  title: { type: String, required: true },
  setting: { type: String, required: true },
  theme: { type: String, default: '#4F46E5' },
  language: { type: String, required: true },
  level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], required: true },
  dialogue: [dialogueStepSchema]
}, { timestamps: true });

module.exports = mongoose.model('VRScenario', vrScenarioSchema);
