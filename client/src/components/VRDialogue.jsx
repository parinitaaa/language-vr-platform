import React, { useState } from 'react';
import { Mic, MicOff, Check, X, Volume2 } from 'lucide-react';

export default function VRDialogue({
  step,           // { npc, options, correct }
  stepIndex,
  totalSteps,
  onAnswer,       // (isCorrect) => void
  onNext,         // () => void
  onPronounceAttempt, // () => void
  completed,      // bool
  score,
  onFinish        // () => void
}) {
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [isPronouncing, setIsPronouncing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [pronounceFeedback, setPronounceFeedback] = useState(null); // 'correct', 'incorrect'
  const [retryCount, setRetryCount] = useState(0);
  const [isListening, setIsListening] = useState(false);

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  const handleSelect = (idx) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    const isCorrect = idx === step.correct;
    onAnswer(isCorrect);
    
    if (isCorrect && SpeechRecognition) {
      setIsPronouncing(true);
    }
  };

  const handleStartListening = () => {
    if (!recognition) return;
    setIsListening(true);
    setPronounceFeedback(null);
    setTranscript('');
    onPronounceAttempt();
    
    recognition.lang = 'en-US'; // Default, can be adjusted if scenario has lang
    recognition.start();

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      setTranscript(text);
      handlePronounceCheck(text);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };
  };

  const handlePronounceCheck = (text) => {
    const expected = step.options[step.correct].toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g,"").trim();
    const actual = text.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g,"").trim();

    if (actual === expected) {
      setPronounceFeedback('correct');
      setIsPronouncing(false);
    } else {
      setPronounceFeedback('incorrect');
      if (retryCount >= 1) {
        // Auto-proceed after 1 retry
        setTimeout(() => setIsPronouncing(false), 2000);
      } else {
        setRetryCount(prev => prev + 1);
      }
    }
  };

  const handleNext = () => {
    setSelected(null);
    setAnswered(false);
    setIsPronouncing(false);
    setTranscript('');
    setPronounceFeedback(null);
    setRetryCount(0);
    onNext();
  };

  const optionClass = (idx) => {
    const base = 'w-full text-left px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ';
    if (!answered) {
      return base + (selected === idx
        ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
        : 'border-white/20 bg-white/10 text-white hover:bg-white/20 hover:border-white/40');
    }
    if (idx === step.correct) return base + 'border-emerald-400 bg-emerald-500/20 text-emerald-200';
    if (idx === selected && idx !== step.correct) return base + 'border-red-400 bg-red-500/20 text-red-200';
    return base + 'border-white/10 bg-white/5 text-white/40 opacity-50';
  };

  // ── Completion screen ───────────────────────────────────────────────────
  if (completed) {
    const pct = totalSteps > 0 ? Math.round((score / totalSteps) * 100) : 0;
    const passed = pct >= 67;
    return (
      <div className="absolute inset-x-0 bottom-0 flex justify-center pb-8 px-4 pointer-events-none">
        <div className="bg-gray-900/95 backdrop-blur-md border border-white/10 rounded-2xl p-8 max-w-lg w-full shadow-2xl pointer-events-auto text-center">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl ${passed ? 'bg-emerald-500/20' : 'bg-amber-500/20'}`}>
            {passed ? '🎉' : '💪'}
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Scenario Complete!</h3>
          <p className="text-gray-400 mb-1">You answered <span className="text-white font-semibold">{score}</span> of <span className="text-white font-semibold">{totalSteps}</span> correctly.</p>
          <div className={`text-3xl font-black mb-6 ${passed ? 'text-emerald-400' : 'text-amber-400'}`}>{pct}%</div>
          <button
            onClick={onFinish}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-colors shadow-lg"
          >
            Back to VR Hub
          </button>
        </div>
      </div>
    );
  }

  // ── Active dialogue ─────────────────────────────────────────────────────
  return (
    <div className="absolute inset-x-0 bottom-0 flex justify-center pb-6 px-4 pointer-events-none">
      <div className="bg-gray-900/90 backdrop-blur-md border border-white/10 rounded-2xl p-6 max-w-xl w-full shadow-2xl pointer-events-auto">
        {/* Progress */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
            Step {stepIndex + 1} / {totalSteps}
          </span>
          <div className="flex gap-1">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div key={i} className={`h-1.5 w-6 rounded-full transition-colors ${i < stepIndex ? 'bg-emerald-500' : i === stepIndex ? 'bg-indigo-400' : 'bg-white/20'}`} />
            ))}
          </div>
        </div>

        {/* NPC bubble */}
        {!isPronouncing ? (
          <>
            <div className="flex items-start gap-3 mb-5">
              <div className="w-9 h-9 rounded-full bg-indigo-500/30 border border-indigo-400/40 flex items-center justify-center text-lg flex-shrink-0 mt-0.5">
                🤖
              </div>
              <div className="bg-white/10 rounded-2xl rounded-tl-none px-4 py-3 flex-1">
                <p className="text-white font-medium leading-relaxed">{step.npc}</p>
              </div>
            </div>

            {/* Feedback banner */}
            {answered && (
              <div className={`mb-4 px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 ${selected === step.correct ? 'bg-emerald-500/20 border border-emerald-400/30 text-emerald-300' : 'bg-red-500/20 border border-red-400/30 text-red-300'}`}>
                {selected === step.correct
                  ? '✓ ¡Correcto! Well done.'
                  : `✗ The correct answer was: "${step.options[step.correct]}"`}
              </div>
            )}

            {/* Options */}
            <div className="space-y-2 mb-4">
              {step.options.map((opt, idx) => (
                <button key={idx} onClick={() => handleSelect(idx)} disabled={answered} className={optionClass(idx)}>
                  <span className="inline-flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    {opt}
                  </span>
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="py-4 text-center">
            <h3 className="text-indigo-300 font-bold mb-2 uppercase text-xs tracking-widest">Pronunciation Practice</h3>
            <p className="text-white text-xl font-bold mb-6">"Now say it out loud"</p>
            
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
              <p className="text-gray-400 text-sm mb-2">Target Phrase:</p>
              <p className="text-white text-2xl font-serif italic flex items-center justify-center gap-2">
                <Volume2 className="w-5 h-5 text-indigo-400" />
                {step.options[step.correct]}
              </p>
            </div>

            {transcript && (
              <div className="mb-6 animate-in fade-in slide-in-from-bottom-2">
                <p className="text-gray-500 text-xs mb-1 uppercase font-bold">You said:</p>
                <p className={`text-lg font-medium ${pronounceFeedback === 'correct' ? 'text-emerald-400' : 'text-red-400'}`}>
                  {transcript}
                </p>
              </div>
            )}

            {pronounceFeedback === 'incorrect' && retryCount === 1 && (
              <div className="mb-4 text-red-300 text-sm bg-red-500/10 py-2 rounded-lg border border-red-500/20">
                ❌ Not quite. Let's try one more time!
              </div>
            )}

            <button
              onClick={handleStartListening}
              disabled={isListening}
              className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto transition-all ${isListening ? 'bg-red-500 animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.5)]' : 'bg-indigo-600 hover:bg-indigo-700 shadow-lg'}`}
            >
              {isListening ? <MicOff className="w-8 h-8 text-white" /> : <Mic className="w-8 h-8 text-white" />}
            </button>
            <p className="text-gray-400 text-sm mt-4">
              {isListening ? 'Listening...' : 'Click to start recording'}
            </p>
          </div>
        )}

        {/* Next button */}
        {answered && !isPronouncing && (
          <button
            onClick={handleNext}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl transition-colors shadow-md"
          >
            {stepIndex < totalSteps - 1 ? 'Continue →' : 'Finish Scenario'}
          </button>
        )}
      </div>
    </div>
  );
}
