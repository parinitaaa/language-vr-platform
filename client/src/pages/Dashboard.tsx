import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { BookOpen, CheckCircle, Clock } from 'lucide-react';

const Dashboard = () => {
  const [progressData, setProgressData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token, user } = useContext(AuthContext);

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/progress', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProgressData(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-10 text-center">Loading dashboard...</div>;

  return (
    <div className="max-w-6xl mx-auto py-12 px-6">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
        <p className="text-gray-600 mt-2">Here's your learning progress.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {progressData.length === 0 ? (
          <div className="col-span-full text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-gray-700 mb-4">You haven't enrolled in any courses yet.</h3>
            <Link to="/courses" className="bg-primary text-white font-medium py-3 px-8 rounded-xl hover:bg-primary-hover transition-colors inline-block shadow-sm">
              Browse Courses
            </Link>
          </div>
        ) : (
          progressData.map((progress: any) => (
            <div key={progress._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
              <div className="p-6 border-b border-gray-100">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-xl font-bold text-gray-900">{progress.courseId.title}</h2>
                  <span className="bg-indigo-100 text-primary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                    {progress.courseId.level}
                  </span>
                </div>
                
                <div className="mt-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium text-gray-700">Course Progress</span>
                    <span className="font-bold text-primary">{progress.progressPercentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-primary h-2.5 rounded-full" 
                      style={{ width: `${progress.progressPercentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <div className="p-6 bg-gray-50 flex-grow grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1 p-3 bg-white rounded-xl border border-gray-100">
                  <span className="flex items-center gap-1 text-sm text-gray-500"><BookOpen className="w-4 h-4" /> Lessons</span>
                  <span className="font-bold text-gray-900">{progress.completedLessons.length} / {progress.totalLessons}</span>
                </div>
                <div className="flex flex-col gap-1 p-3 bg-white rounded-xl border border-gray-100">
                  <span className="flex items-center gap-1 text-sm text-gray-500"><CheckCircle className="w-4 h-4" /> Quizzes</span>
                  <span className="font-bold text-gray-900">{progress.quizScores.filter((q:any) => q.passed).length} Passed</span>
                </div>
              </div>

              <div className="p-6 border-t border-gray-100">
                <Link 
                  to={`/lesson/${progress.courseId._id}`} 
                  className="block w-full text-center bg-gray-900 text-white font-medium py-3 rounded-xl hover:bg-gray-800 transition-colors shadow-sm"
                >
                  Continue Learning
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;
