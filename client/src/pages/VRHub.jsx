import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const API = 'http://localhost:5000/api';

const SETTING_META = {
  'coffee-shop': { emoji: '☕', label: 'Coffee Shop', gradient: 'from-amber-900/80 to-amber-700/60', border: 'border-amber-700/40', badge: 'bg-amber-700/30 text-amber-300' },
  airport: { emoji: '✈️', label: 'Airport', gradient: 'from-blue-900/80 to-blue-700/60', border: 'border-blue-700/40', badge: 'bg-blue-700/30 text-blue-300' },
  market: { emoji: '🛒', label: 'Market', gradient: 'from-green-900/80 to-green-700/60', border: 'border-green-700/40', badge: 'bg-green-700/30 text-green-300' }
};

const LEVEL_CLS = {
  Beginner: 'bg-green-100 text-green-700',
  Intermediate: 'bg-yellow-100 text-yellow-700',
  Advanced: 'bg-red-100 text-red-700'
};

export default function VRHub() {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [scenarios, setScenarios] = useState([]);
  const [completedIds, setCompletedIds] = useState(new Set());
  const [scores, setScores] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [scenRes, progRes] = await Promise.all([
          axios.get(`${API}/vr/scenarios`),
          token
            ? axios.get(`${API}/vr/progress`, { headers: { Authorization: `Bearer ${token}` } })
            : Promise.resolve({ data: [] })
        ]);
        setScenarios(scenRes.data);
        const ids = new Set();
        const sc = {};
        progRes.data.forEach(p => {
          if (p.scenarioId) {
            ids.add(p.scenarioId._id || p.scenarioId);
            sc[p.scenarioId._id || p.scenarioId] = p.score;
          }
        });
        setCompletedIds(ids);
        setScores(sc);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [token]);

  const completedCount = completedIds.size;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-950 via-purple-950 to-gray-950 border-b border-white/5">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(18)].map((_, i) => (
            <div key={i} className="absolute rounded-full opacity-10 bg-indigo-400"
              style={{
                width: Math.random() * 6 + 2,
                height: Math.random() * 6 + 2,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `pulse ${2 + Math.random() * 3}s infinite`
              }} />
          ))}
        </div>
        <div className="relative max-w-5xl mx-auto px-6 py-16 text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-400/20 rounded-full px-4 py-1.5 text-indigo-300 text-sm font-medium mb-6">
            🥽 Immersive Language Practice
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-white via-indigo-200 to-purple-300 bg-clip-text text-transparent">
            VR Practice Hub
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto mb-8">
            Step into real-world scenarios and practice your Spanish in 3D environments. No headset required.
          </p>
          {/* Progress summary */}
          <div className="inline-flex items-center gap-6 bg-white/5 border border-white/10 rounded-2xl px-6 py-4">
            <div className="text-center">
              <div className="text-2xl font-black text-indigo-400">{completedCount}</div>
              <div className="text-xs text-gray-500 mt-0.5">Completed</div>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="text-center">
              <div className="text-2xl font-black text-gray-300">{scenarios.length}</div>
              <div className="text-xs text-gray-500 mt-0.5">Available</div>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="text-center">
              <div className="text-2xl font-black text-emerald-400">
                {scenarios.length > 0 ? Math.round((completedCount / scenarios.length) * 100) : 0}%
              </div>
              <div className="text-xs text-gray-500 mt-0.5">Progress</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scenarios grid */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        <h2 className="text-xl font-bold text-gray-200 mb-6">Choose a Scenario</h2>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 bg-white/5 rounded-2xl animate-pulse border border-white/5" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {scenarios.map(scenario => {
              const meta = SETTING_META[scenario.setting] || SETTING_META['coffee-shop'];
              const done = completedIds.has(scenario._id);
              const sc = scores[scenario._id];

              return (
                <div
                  key={scenario._id}
                  className={`relative group rounded-2xl border overflow-hidden bg-gradient-to-br ${meta.gradient} ${meta.border} hover:scale-[1.02] transition-all duration-300 shadow-xl`}
                >
                  {/* Done badge */}
                  {done && (
                    <div className="absolute top-3 right-3 bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1 z-10">
                      ✓ Done {sc !== undefined ? `· ${sc}/${scenario.dialogue?.length ?? '?'}` : ''}
                    </div>
                  )}

                  <div className="p-6">
                    {/* Icon */}
                    <div className="text-5xl mb-4">{meta.emoji}</div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${meta.badge}`}>{meta.label}</span>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${LEVEL_CLS[scenario.level] || 'bg-gray-200 text-gray-700'}`}>{scenario.level}</span>
                    </div>

                    {/* Title & language */}
                    <h3 className="text-lg font-bold text-white mb-1">{scenario.title}</h3>
                    <p className="text-sm text-gray-400 mb-1">{scenario.language}</p>
                    <p className="text-xs text-gray-500 mb-6">{scenario.dialogue?.length ?? 0} dialogue steps</p>

                    {/* Enter button */}
                    <Link
                      to={`/vr/${scenario._id}`}
                      className="block w-full text-center bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm"
                    >
                      {done ? '🔄 Replay Scenario' : '▶ Enter VR'}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!loading && scenarios.length === 0 && (
          <div className="text-center text-gray-500 py-20">
            <p className="text-4xl mb-4">🥽</p>
            <p className="text-lg">No scenarios available yet.</p>
            <p className="text-sm mt-2">Run <code className="bg-white/5 px-2 py-0.5 rounded">node seedVR.js</code> in the server directory.</p>
          </div>
        )}
      </div>
    </div>
  );
}
