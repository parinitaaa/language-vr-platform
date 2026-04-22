import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Admin = () => {
  const { token } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);
  
  // New Course State
  const [title, setTitle] = useState('');
  const [language, setLanguage] = useState('');
  const [level, setLevel] = useState('Beginner');
  const [description, setDescription] = useState('');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/courses');
      setCourses(res.data);
    } catch (error) {
      toast.error('Failed to load courses');
    }
  };

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/courses', {
        title, language, level, description
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Course created successfully');
      fetchCourses();
      setTitle(''); setLanguage(''); setLevel('Beginner'); setDescription('');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create course');
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Create Course Form */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Create New Course</h2>
          <form onSubmit={handleCreateCourse} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text" required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary bg-gray-50"
                value={title} onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                <input
                  type="text" required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary bg-gray-50"
                  value={language} onChange={(e) => setLanguage(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary bg-gray-50"
                  value={level} onChange={(e) => setLevel(e.target.value)}
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                required rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary bg-gray-50"
                value={description} onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-primary text-white font-medium py-3 rounded-xl hover:bg-primary-hover transition-colors shadow-sm"
            >
              Create Course
            </button>
          </form>
        </div>

        {/* Existing Courses List */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-6">Manage Courses</h2>
          <div className="space-y-4">
            {courses.map((course: any) => (
              <div key={course._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-gray-900">{course.title}</h3>
                  <p className="text-sm text-gray-500">{course.language} • {course.level}</p>
                </div>
                <button className="text-primary font-medium text-sm hover:underline">Edit (Coming soon)</button>
              </div>
            ))}
            {courses.length === 0 && (
              <p className="text-gray-500 bg-white p-6 rounded-2xl border border-gray-100">No courses available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
