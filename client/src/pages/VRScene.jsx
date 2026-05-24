import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import VRSceneRenderer from '../components/VRSceneRenderer';
import VRDialogue from '../components/VRDialogue';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function VRScene() {
  const { scenarioId } = useParams();
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [scenario, setScenario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [stepIndex, setStepIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [pronunciationAttempts, setPronunciationAttempts] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    axios.get(`${API}/vr/scenarios/${scenarioId}`)
      .then(r => setScenario(r.data))
      .catch(() => setError('Failed to load scenario'))
      .finally(() => setLoading(false));
  }, [scenarioId]);

  const handleAnswer = (isCorrect) => {
    if (isCorrect) setScore(s => s + 1);
  };

  const handleNext = () => {
    if (stepIndex < scenario.dialogue.length - 1) {
      setStepIndex(i => i + 1);
    } else {
      setCompleted(true);
      saveProgress();
    }
  };

  const saveProgress = async () => {
    if (!token) return;
    setSaving(true);
    try {
      await axios.post(`${API}/vr/progress`,
        { scenarioId, score, pronunciationAttempts },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (e) {
      console.warn('Progress save failed:', e);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading VR environment…</p>
        </div>
      </div>
    );
  }

  if (error || !scenario) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <p className="text-2xl mb-4">⚠️ {error || 'Scenario not found'}</p>
          <button onClick={() => navigate('/vr')} className="bg-indigo-600 px-6 py-2 rounded-xl font-medium">Back to Hub</button>
        </div>
      </div>
    );
  }

  const currentStep = scenario.dialogue[stepIndex];

  return (
    <div className="relative w-full bg-gray-900" style={{ height: 'calc(100vh - 68px)' }}>
      {/* Top bar */}
      <div className="absolute top-0 inset-x-0 z-20 flex items-center justify-between px-4 pt-3 pointer-events-none">
        <button
          onClick={() => navigate('/vr')}
          className="pointer-events-auto bg-black/50 backdrop-blur-sm text-white text-sm px-3 py-1.5 rounded-lg hover:bg-black/70 transition-colors flex items-center gap-1.5"
        >
          ← Exit
        </button>
        <div className="bg-black/50 backdrop-blur-sm text-white text-sm px-4 py-1.5 rounded-lg font-semibold">
          {scenario.title}
          <span className="ml-2 text-gray-400 font-normal text-xs">{scenario.language} · {scenario.level}</span>
        </div>
        <div className="bg-black/50 backdrop-blur-sm text-white text-sm px-3 py-1.5 rounded-lg">
          Score: <span className="font-bold text-emerald-400">{score}</span>
        </div>
      </div>

      {/* 3D scene */}
      <VRSceneRenderer setting={scenario.setting} theme={scenario.theme} title={scenario.title} />

      {/* Dialogue overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <VRDialogue
          step={currentStep}
          stepIndex={stepIndex}
          totalSteps={scenario.dialogue.length}
          language={scenario.language}
          onAnswer={handleAnswer}
          onNext={handleNext}
          onPronounceAttempt={() => setPronunciationAttempts(a => a + 1)}
          completed={completed}
          score={score}
          onFinish={() => navigate('/vr')}
        />
      </div>
    </div>
  );
}
