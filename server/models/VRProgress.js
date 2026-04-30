const mongoose = require('mongoose');

const vrProgressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  scenarioId: { type: mongoose.Schema.Types.ObjectId, ref: 'VRScenario', required: true },
  completedAt: { type: Date, default: Date.now },
  score: { type: Number, default: 0 },
  pronunciationAttempts: { type: Number, default: 0 }
}, { timestamps: true });

vrProgressSchema.index({ userId: 1, scenarioId: 1 }, { unique: true });

module.exports = mongoose.model('VRProgress', vrProgressSchema);
