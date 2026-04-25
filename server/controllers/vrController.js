const VRScenario = require('../models/VRScenario');
const VRProgress = require('../models/VRProgress');

const getScenarios = async (req, res) => {
  try {
    const scenarios = await VRScenario.find({}, '-dialogue');
    res.json(scenarios);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getScenarioById = async (req, res) => {
  try {
    const scenario = await VRScenario.findById(req.params.id);
    if (!scenario) return res.status(404).json({ message: 'Scenario not found' });
    res.json(scenario);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const saveProgress = async (req, res) => {
  try {
    const { scenarioId, score } = req.body;
    const userId = req.user._id;

    const existing = await VRProgress.findOne({ userId, scenarioId });
    if (existing) {
      // Update score if better
      if (score > existing.score) {
        existing.score = score;
        existing.completedAt = new Date();
        await existing.save();
      }
      return res.json(existing);
    }

    const progress = await VRProgress.create({
      userId, scenarioId, score, completedAt: new Date()
    });
    res.status(201).json(progress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserProgress = async (req, res) => {
  try {
    const progress = await VRProgress.find({ userId: req.user._id })
      .populate('scenarioId', 'title setting language level');
    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getScenarios, getScenarioById, saveProgress, getUserProgress };
