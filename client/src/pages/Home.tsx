import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, BookOpen, Award } from 'lucide-react';

const Home = () => {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <div className="w-full bg-primary py-20 px-6 text-center text-white">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight">Master a New Language</h1>
        <p className="text-xl md:text-2xl mb-10 max-w-2xl mx-auto opacity-90">Immerse yourself in interactive lessons, engaging quizzes, and track your progress in real-time.</p>
        <Link to="/courses" className="bg-white text-primary font-bold py-4 px-8 rounded-full shadow-lg hover:bg-gray-100 transition-transform transform hover:scale-105 inline-block text-lg">
          Explore Courses
        </Link>
      </div>

      {/* Features Section */}
      <div className="py-20 px-6 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition-shadow">
          <div className="bg-indigo-100 p-4 rounded-full text-primary mb-6">
            <Globe className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-bold mb-4">Learn Anywhere</h3>
          <p className="text-gray-600">Access our platform from any device and learn at your own pace, wherever you are.</p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition-shadow">
          <div className="bg-emerald-100 p-4 rounded-full text-secondary mb-6">
            <BookOpen className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-bold mb-4">Interactive Lessons</h3>
          <p className="text-gray-600">Engage with multimedia content including videos, audio, and interactive exercises.</p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition-shadow">
          <div className="bg-amber-100 p-4 rounded-full text-amber-600 mb-6">
            <Award className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-bold mb-4">Track Progress</h3>
          <p className="text-gray-600">Take quizzes, earn scores, and watch your language skills grow with detailed analytics.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
