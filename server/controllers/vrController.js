const VRScenario = require('../models/VRScenario');
const VRProgress = require('../models/VRProgress');

const getScenarios = async (req, res) => {
  try {
    const { language } = req.query;
    const filter = language ? { language } : {};
    const scenarios = await VRScenario.find(filter);
    res.json(scenarios);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getLanguages = async (req, res) => {
  try {
    const languages = await VRScenario.distinct('language');
    res.json(languages);
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
    const { scenarioId, score, pronunciationAttempts } = req.body;
    const userId = req.user._id;

    const existing = await VRProgress.findOne({ userId, scenarioId });
    if (existing) {
      // Update score if better
      if (score > existing.score) {
        existing.score = score;
        existing.completedAt = new Date();
      }
      // Always track pronunciation attempts
      existing.pronunciationAttempts = (existing.pronunciationAttempts || 0) + (pronunciationAttempts || 0);
      await existing.save();
      return res.json(existing);
    }

    const progress = await VRProgress.create({
      userId, 
      scenarioId, 
      score, 
      pronunciationAttempts: pronunciationAttempts || 0,
      completedAt: new Date()
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

const createScenario = async (req, res) => {
  try {
    const scenario = new VRScenario(req.body);
    await scenario.save();
    res.status(201).json(scenario);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateScenario = async (req, res) => {
  try {
    const scenario = await VRScenario.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!scenario) return res.status(404).json({ message: 'Scenario not found' });
    res.json(scenario);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteScenario = async (req, res) => {
  try {
    const scenario = await VRScenario.findByIdAndDelete(req.params.id);
    if (!scenario) return res.status(404).json({ message: 'Scenario not found' });
    res.json({ message: 'Scenario deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { 
  getScenarios, 
  getScenarioById, 
  saveProgress, 
  getUserProgress, 
  getLanguages,
  createScenario,
  updateScenario,
  deleteScenario
};
