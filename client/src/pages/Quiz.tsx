import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { HelpCircle, Check, X, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

const Quiz = () => {
  const { lessonId } = useParams();
  const [quizzes, setQuizzes] = useState([]);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState('');
  const [feedback, setFeedback] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);
  
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuizzes();
  }, [lessonId]);

  const fetchQuizzes = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/quizzes/lesson/${lessonId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setQuizzes(res.data);
    } catch (error) {
      toast.error('Failed to load quiz');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedOption) return;

    try {
      const currentQuiz: any = quizzes[currentQuizIndex];
      const res = await axios.post('http://localhost:5000/api/quizzes/submit', {
        quizId: currentQuiz._id,
        selectedOption
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setFeedback({
        isCorrect: res.data.isCorrect,
        correctAnswer: res.data.correctAnswer
      });

      if (res.data.isCorrect) {
        setScore(score + 1);
        toast.success('Correct!');
      } else {
        toast.error('Incorrect!');
      }
    } catch (error) {
      toast.error('Error submitting quiz');
    }
  };

  const handleNext = () => {
    if (currentQuizIndex < quizzes.length - 1) {
      setCurrentQuizIndex(currentQuizIndex + 1);
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
          <button 
            onClick={() => navigate(-1)}
            className="bg-primary text-white px-6 py-3 rounded-xl hover:bg-primary-hover font-medium"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (quizCompleted) {
    return (
      <div className="max-w-3xl mx-auto py-20 px-6 text-center">
        <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100">
          <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-12 h-12" />
          </div>
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Quiz Completed!</h2>
          <p className="text-xl text-gray-600 mb-8">You scored {score} out of {quizzes.length}.</p>
          <div className="flex justify-center gap-4">
            <button 
              onClick={() => navigate('/dashboard')}
              className="bg-primary text-white px-8 py-3 rounded-xl hover:bg-primary-hover font-medium shadow-sm transition-transform hover:scale-105"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuiz: any = quizzes[currentQuizIndex];

  return (
    <div className="max-w-3xl mx-auto py-12 px-6">
      <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Progress bar */}
        <div className="h-2 bg-gray-100 w-full">
          <div 
            className="h-full bg-primary transition-all duration-300 ease-out"
            style={{ width: `${((currentQuizIndex) / quizzes.length) * 100}%` }}
          ></div>
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
              let buttonClass = "w-full text-left p-5 rounded-2xl border-2 transition-all font-medium text-lg ";
              
              if (!feedback) {
                // Interactive state
                if (selectedOption === option) {
                  buttonClass += "border-primary bg-indigo-50 text-primary";
                } else {
                  buttonClass += "border-gray-100 hover:border-gray-300 hover:bg-gray-50 text-gray-700";
                }
              } else {
                // Feedback state
                if (option === feedback.correctAnswer) {
                  buttonClass += "border-green-500 bg-green-50 text-green-700";
                } else if (selectedOption === option && !feedback.isCorrect) {
                  buttonClass += "border-red-500 bg-red-50 text-red-700";
                } else {
                  buttonClass += "border-gray-100 text-gray-400 opacity-50";
                }
              }

              return (
                <button
                  key={index}
                  onClick={() => !feedback && setSelectedOption(option)}
                  disabled={!!feedback}
                  className={buttonClass}
                >
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
              <button
                onClick={handleSubmit}
                disabled={!selectedOption}
                className={`py-4 px-10 rounded-xl font-bold text-lg shadow-sm transition-all ${
                  selectedOption 
                    ? 'bg-primary text-white hover:bg-primary-hover hover:shadow-md cursor-pointer' 
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                Submit Answer
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="py-4 px-10 rounded-xl font-bold text-lg bg-gray-900 text-white hover:bg-black shadow-sm transition-all flex items-center gap-2"
              >
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
