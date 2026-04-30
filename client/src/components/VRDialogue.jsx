import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Check, X, Volume2 } from 'lucide-react';

export default function VRDialogue({
  step,           // { npc, options, correct }
  stepIndex,
  totalSteps,
  language,
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
  const [isSpeakingNPC, setIsSpeakingNPC] = useState(false);
  const [isSpeakingTarget, setIsSpeakingTarget] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const recognitionRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    // Preload voices
    const loadVoices = () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.getVoices();
      }
    };
    loadVoices();
    if (window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    // Initialize SpeechRecognition once
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognitionRef.current = recognition;
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const langMap = {
    'Spanish': 'es-ES',
    'French': 'fr-FR',
    'Hindi': 'hi-IN',
    'German': 'de-DE',
    'Italian': 'it-IT',
    'Japanese': 'ja-JP',
    'Portuguese': 'pt-BR',
    'Mandarin': 'zh-CN',
    'Arabic': 'ar-SA',
    'Korean': 'ko-KR'
  };

  const normalize = str => str.toLowerCase().trim()
    .replace(/[áàä]/g, 'a').replace(/[éèë]/g, 'e')
    .replace(/[íìï]/g, 'i').replace(/[óòö]/g, 'o')
    .replace(/[úùü]/g, 'u').replace(/[¿¡.,!?]/g, '');

  const speak = (text, type) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langMap[language] || 'en-US';
    utterance.rate = 0.85;
    utterance.pitch = 1;
    utterance.volume = 1;
    
    if (type === 'npc') setIsSpeakingNPC(true);
    else setIsSpeakingTarget(true);

    utterance.onend = () => {
      setIsSpeakingNPC(false);
      setIsSpeakingTarget(false);
    };
    
    window.speechSynthesis.speak(utterance);
  };

  const handleSelect = (idx) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    const isCorrect = idx === step.correct;
    onAnswer(isCorrect);
    
    if (isCorrect && (window.SpeechRecognition || window.webkitSpeechRecognition)) {
      setIsPronouncing(true);
    }
  };

  const handleStartListening = async () => {
    const recognition = recognitionRef.current;
    if (!recognition) return;

    // Cancel any ongoing speech
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    
    try {
      // Immediate UI update
      setIsListening(true);
      setPronounceFeedback(null);
      setTranscript('');
      setErrorMsg('');
      onPronounceAttempt();
      
      recognition.lang = langMap[language] || 'es-ES';
      
      recognition.onresult = (event) => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        const text = event.results[0][0].transcript;
        setTranscript(text);
        handlePronounceCheck(text);
      };

      recognition.onerror = (event) => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setIsListening(false);
        switch (event.error) {
          case 'not-allowed':
            setErrorMsg("Microphone access denied. Please allow microphone in your browser settings.");
            break;
          case 'no-speech':
            setErrorMsg("No speech detected. Please try again.");
            break;
          default:
            setErrorMsg("Could not process speech. Please try again.");
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      };

      // 5 second safety timeout
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        recognition.stop();
        setErrorMsg("No speech detected. Please try again.");
        setIsListening(false);
      }, 5000);

      recognition.start();
    } catch (err) {
      setErrorMsg("Microphone access denied. Please allow microphone in your browser settings.");
      setIsListening(false);
    }
  };

  const handlePronounceCheck = (heard) => {
    const targetPhrase = step.targetPhrase;
    const isCorrect = normalize(heard) === normalize(targetPhrase);

    if (isCorrect) {
      setPronounceFeedback('correct');
      // Removed 2s delay, immediately proceed or set state for user to see
      setIsPronouncing(false);
      setRetryCount(0);
    } else {
      setPronounceFeedback('incorrect');
      if (retryCount < 1) {
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
              <div className="bg-white/10 rounded-2xl rounded-tl-none px-4 py-3 flex-1 flex items-center justify-between gap-4">
                <p className="text-white font-medium leading-relaxed">{step.npc}</p>
                {window.speechSynthesis && (
                  <button 
                    onClick={() => speak(step.npc, 'npc')}
                    className={`p-2 rounded-full transition-all ${isSpeakingNPC ? 'bg-indigo-500 text-white animate-pulse' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                )}
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
              <div className="flex items-center justify-center gap-3">
                <p className="text-white text-2xl font-serif italic">
                  {step.targetPhrase}
                </p>
                {window.speechSynthesis && (
                  <button 
                    onClick={() => speak(step.targetPhrase, 'target')}
                    className={`p-2.5 rounded-full transition-all ${isSpeakingTarget ? 'bg-indigo-500 text-white animate-pulse' : 'bg-white/10 text-indigo-400 hover:bg-white/20'}`}
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            {pronounceFeedback === 'correct' && (
              <div className="mb-6 p-4 bg-emerald-500/20 border border-emerald-500/40 rounded-xl animate-in zoom-in duration-300">
                <p className="text-emerald-400 font-bold flex items-center justify-center gap-2">
                  <Check className="w-5 h-5" /> Correct! Well done.
                </p>
              </div>
            )}

            {pronounceFeedback === 'incorrect' && (
              <div className="mb-6 p-4 bg-red-500/20 border border-red-500/40 rounded-xl animate-in slide-in-from-top-2">
                <div className="text-left space-y-1">
                  <p className="text-red-400 text-sm"><span className="font-bold">You said:</span> "{transcript || '...'}"</p>
                  <p className="text-gray-300 text-sm"><span className="font-bold">Expected:</span> "{step.targetPhrase}"</p>
                </div>
                {retryCount < 2 && (
                  <button 
                    onClick={handleStartListening}
                    className="mt-3 text-white bg-red-600 hover:bg-red-700 px-4 py-1.5 rounded-lg text-sm font-bold transition-colors"
                  >
                    Try Again
                  </button>
                )}
              </div>
            )}

            {errorMsg && (
              <div className="mb-6 p-3 bg-amber-500/20 border border-amber-500/40 rounded-lg text-amber-200 text-sm">
                {errorMsg}
              </div>
            )}

            <div className="relative inline-block">
              {isListening && (
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full animate-ping" />
              )}
              <button
                onClick={handleStartListening}
                disabled={isListening || (pronounceFeedback === 'correct')}
                className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto transition-all ${isListening ? 'bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.5)]' : 'bg-indigo-600 hover:bg-indigo-700 shadow-lg'} ${(pronounceFeedback === 'correct') ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isListening ? <Mic className="w-8 h-8 text-white animate-pulse" /> : <Mic className="w-8 h-8 text-white" />}
              </button>
            </div>
            
            <p className="text-gray-400 text-sm mt-4 font-medium">
              {isListening ? <span className="text-red-400 animate-pulse">Listening... speak now</span> : 'Click to start recording'}
            </p>

            <button 
              onClick={() => setIsPronouncing(false)}
              className="mt-8 text-gray-500 hover:text-white text-sm font-medium transition-colors"
            >
              Skip →
            </button>
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
