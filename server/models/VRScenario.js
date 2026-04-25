const mongoose = require('mongoose');

const dialogueStepSchema = new mongoose.Schema({
  npc: { type: String, required: true },
  options: [{ type: String, required: true }],
  correct: { type: Number, required: true }
}, { _id: false });

const vrScenarioSchema = new mongoose.Schema({
  title: { type: String, required: true },
  setting: { type: String, enum: ['coffee-shop', 'airport', 'market'], required: true },
  language: { type: String, required: true },
  level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], required: true },
  dialogue: [dialogueStepSchema]
}, { timestamps: true });

module.exports = mongoose.model('VRScenario', vrScenarioSchema);
