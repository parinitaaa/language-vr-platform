import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { HelpCircle, Check, X, ArrowRight, Trophy } from 'lucide-react';
import toast from 'react-hot-toast';

// Converts any YouTube URL to embed format
const toEmbedUrl = (url: string): string => {
  if (!url) return '';
  // Already an embed URL
  if (url.includes('youtube.com/embed/') || url.includes('player.vimeo.com')) return url;
  // youtu.be/ID
  const shortMatch = url.match(/youtu\.be\/([^?&]+)/);
  if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;
  // youtube.com/watch?v=ID
  const watchMatch = url.match(/[?&]v=([^?&]+)/);
  if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}`;
  // Vimeo vimeo.com/ID
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  return url;
};

const Quiz = () => {
  const { lessonId } = useParams();
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState('');
  const [feedback, setFeedback] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);

  // Previously-completed state
  const [alreadyCompleted, setAlreadyCompleted] = useState(false);
  const [prevScore, setPrevScore] = useState(0);
  const [prevTotal, setPrevTotal] = useState(0);

  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      await Promise.all([fetchQuizzes(), checkStatus()]);
    };
    init();
  }, [lessonId]);

  const fetchQuizzes = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/quizzes/lesson/${lessonId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setQuizzes(res.data);
    } catch {
      toast.error('Failed to load quiz');
    } finally {
      setLoading(false);
    }
  };

  const checkStatus = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/quizzes/status/${lessonId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.completed) {
        setAlreadyCompleted(true);
        setPrevScore(res.data.score);
        setPrevTotal(res.data.total);
      }
    } catch {
      // non-fatal
    }
  };

  const handleSubmit = async () => {
    if (!selectedOption) return;
    try {
      const currentQuiz: any = quizzes[currentQuizIndex];
      const res = await axios.post('http://localhost:5000/api/quizzes/submit',
        { quizId: currentQuiz._id, selectedOption },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFeedback({ isCorrect: res.data.isCorrect, correctAnswer: res.data.correctAnswer });
      if (res.data.isCorrect) {
        setScore(s => s + 1);
        toast.success('Correct!');
      } else {
        toast.error('Incorrect!');
      }
    } catch {
      toast.error('Error submitting answer');
    }
  };

  const handleNext = () => {
    if (currentQuizIndex < quizzes.length - 1) {
      setCurrentQuizIndex(i => i + 1);
      setSelectedOption('');
      setFeedback(null);
    } else {
      setQuizCompleted(true);
    }
  };

  if (loading) return <div className="p-10 text-center">Loading quiz...</div>;

  if (quizzes.length === 0) {
    return (
      <div className="max-w-3xl mx-auto py-20 px-6 text-center">
        <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100">
          <HelpCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Quizzes Available</h2>
          <p className="text-gray-500 mb-8">This lesson doesn't have any quizzes yet.</p>
          <button onClick={() => navigate(-1)}
            className="bg-primary text-white px-6 py-3 rounded-xl hover:bg-primary-hover font-medium">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // ── Already completed — show read-only result ─────────────────────────────
  if (alreadyCompleted && !quizCompleted) {
    const pct = prevTotal > 0 ? Math.round((prevScore / prevTotal) * 100) : 0;
    const passed = pct >= 50;
    return (
      <div className="max-w-3xl mx-auto py-20 px-6 text-center">
        <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100">
          <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${passed ? 'bg-green-100 text-green-500' : 'bg-red-100 text-red-500'}`}>
            <Trophy className="w-12 h-12" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Quiz Already Completed</h2>
          <p className="text-gray-500 mb-6">You've already submitted this quiz. Here's how you did:</p>
          <div className="inline-flex flex-col items-center bg-gray-50 border border-gray-200 rounded-2xl px-10 py-6 mb-8">
            <span className={`text-5xl font-black mb-1 ${passed ? 'text-green-600' : 'text-red-500'}`}>{pct}%</span>
            <span className="text-gray-500 text-sm">{prevScore} / {prevTotal} correct</span>
            <span className={`mt-2 text-xs font-semibold uppercase tracking-wide px-3 py-1 rounded-full ${passed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
              {passed ? 'Passed ✓' : 'Not passed'}
            </span>
          </div>
          <div className="flex justify-center gap-4">
            <button onClick={() => navigate(-1)}
              className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-200 font-medium transition-colors">
              Back to Lesson
            </button>
            <button onClick={() => navigate('/dashboard')}
              className="bg-primary text-white px-6 py-3 rounded-xl hover:bg-primary-hover font-medium transition-colors shadow-sm">
              Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Quiz finished this session ─────────────────────────────────────────────
  if (quizCompleted) {
    const pct = quizzes.length > 0 ? Math.round((score / quizzes.length) * 100) : 0;
    const passed = pct >= 50;
    return (
      <div className="max-w-3xl mx-auto py-20 px-6 text-center">
        <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100">
          <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${passed ? 'bg-green-100 text-green-500' : 'bg-amber-100 text-amber-500'}`}>
            <Check className="w-12 h-12" />
          </div>
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Quiz Completed!</h2>
          <p className="text-xl text-gray-600 mb-2">You scored <span className="font-bold text-gray-900">{score}</span> out of <span className="font-bold">{quizzes.length}</span>.</p>
          <p className={`text-sm font-semibold mb-8 ${passed ? 'text-green-600' : 'text-amber-600'}`}>
            {passed ? '🎉 Great job — you passed!' : 'Keep practicing to improve your score.'}
          </p>
          <div className="flex justify-center gap-4">
            <button onClick={() => navigate(-1)}
              className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-200 font-medium transition-colors">
              Back to Lesson
            </button>
            <button onClick={() => navigate('/dashboard')}
              className="bg-primary text-white px-8 py-3 rounded-xl hover:bg-primary-hover font-medium shadow-sm transition-all hover:scale-105">
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Active quiz ─────────────────────────────────────────────────────────────
  const currentQuiz: any = quizzes[currentQuizIndex];

  return (
    <div className="max-w-3xl mx-auto py-12 px-6">
      <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Progress bar */}
        <div className="h-2 bg-gray-100 w-full">
          <div
            className="h-full bg-primary transition-all duration-300 ease-out"
            style={{ width: `${(currentQuizIndex / quizzes.length) * 100}%` }}
          />
        </div>

        <div className="p-10 md:p-14">
          <div className="flex justify-between items-center mb-8">
            <span className="text-sm font-bold tracking-wider uppercase text-gray-400">
              Question {currentQuizIndex + 1} of {quizzes.length}
            </span>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-10 leading-tight">
            {currentQuiz.question}
          </h2>

          <div className="space-y-4 mb-10">
            {currentQuiz.options.map((option: string, index: number) => {
              let cls = 'w-full text-left p-5 rounded-2xl border-2 transition-all font-medium text-lg ';
              if (!feedback) {
                cls += selectedOption === option
                  ? 'border-primary bg-indigo-50 text-primary'
                  : 'border-gray-100 hover:border-gray-300 hover:bg-gray-50 text-gray-700';
              } else {
                if (option === feedback.correctAnswer) cls += 'border-green-500 bg-green-50 text-green-700';
                else if (selectedOption === option && !feedback.isCorrect) cls += 'border-red-500 bg-red-50 text-red-700';
                else cls += 'border-gray-100 text-gray-400 opacity-50';
              }
              return (
                <button key={index} onClick={() => !feedback && setSelectedOption(option)}
                  disabled={!!feedback} className={cls}>
                  <div className="flex items-center justify-between">
                    <span>{option}</span>
                    {feedback && option === feedback.correctAnswer && <Check className="w-6 h-6 text-green-500" />}
                    {feedback && !feedback.isCorrect && selectedOption === option && <X className="w-6 h-6 text-red-500" />}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex justify-end">
            {!feedback ? (
              <button onClick={handleSubmit} disabled={!selectedOption}
                className={`py-4 px-10 rounded-xl font-bold text-lg shadow-sm transition-all ${selectedOption ? 'bg-primary text-white hover:bg-primary-hover hover:shadow-md cursor-pointer' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}>
                Submit Answer
              </button>
            ) : (
              <button onClick={handleNext}
                className="py-4 px-10 rounded-xl font-bold text-lg bg-gray-900 text-white hover:bg-black shadow-sm transition-all flex items-center gap-2">
                {currentQuizIndex < quizzes.length - 1 ? 'Next Question' : 'View Results'}
                <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
