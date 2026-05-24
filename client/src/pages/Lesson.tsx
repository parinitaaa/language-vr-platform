import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { PlayCircle, CheckCircle, List } from 'lucide-react';
import toast from 'react-hot-toast';

// Normalise any YouTube / Vimeo URL to a proper embed URL
const toEmbedUrl = (url: string): string => {
  if (!url) return '';
  if (url.includes('youtube.com/embed/') || url.includes('player.vimeo.com')) return url;
  const shortMatch = url.match(/youtu\.be\/([^?&]+)/);
  if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;
  const watchMatch = url.match(/[?&]v=([^?&]+)/);
  if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}`;
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  return url;
};

const Lesson = () => {
  const { id: courseId } = useParams();
  const [lessons, setLessons] = useState([]);
  const [activeLesson, setActiveLesson] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { token } = useContext(AuthContext);

  const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  // Time tracking
  useEffect(() => {
    const startTime = Date.now();

    const saveTime = async () => {
      const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
      if (elapsedSeconds < 1) return;

      try {
        // We use navigator.sendBeacon for more reliability on page close, 
        // but it doesn't support headers easily. 
        // Standard axios is fine for component unmount/lesson switch.
        await axios.post(`${API}/progress/time`, 
          { courseId, seconds: elapsedSeconds },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (err) {
        console.error('Failed to save time:', err);
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        saveTime();
      }
    };

    window.addEventListener('beforeunload', saveTime);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      saveTime();
      window.removeEventListener('beforeunload', saveTime);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [courseId, activeLesson?._id, token]);

  useEffect(() => {
    fetchLessons();
  }, [courseId]);

  const fetchLessons = async () => {
    try {
      const res = await axios.get(`${API}/lessons/course/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLessons(res.data);
      if (res.data.length > 0) {
        loadLessonDetails(res.data[0]._id);
      } else {
        setLoading(false);
      }
    } catch (error) {
      toast.error('Failed to load lessons. Are you enrolled?');
      setLoading(false);
    }
  };

  const loadLessonDetails = async (lessonId: string) => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/lessons/${lessonId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setActiveLesson(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !lessons.length) return <div className="p-10 text-center">Loading course content...</div>;

  return (
    <div className="max-w-7xl mx-auto py-8 px-6 flex flex-col md:flex-row gap-8">
      {/* Sidebar with Lesson List */}
      <div className="w-full md:w-1/3 lg:w-1/4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-8">
          <div className="p-6 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
            <List className="text-primary w-5 h-5" />
            <h3 className="font-bold text-gray-900">Course Content</h3>
          </div>
          <div className="flex flex-col">
            {lessons.map((lesson: any, index) => (
              <button
                key={lesson._id}
                onClick={() => loadLessonDetails(lesson._id)}
                className={`p-4 text-left border-b border-gray-50 transition-colors flex items-start gap-3 hover:bg-indigo-50 ${
                  activeLesson?._id === lesson._id ? 'bg-indigo-50 border-l-4 border-l-primary' : ''
                }`}
              >
                <div className="mt-1">
                  <PlayCircle className={`w-4 h-4 ${activeLesson?._id === lesson._id ? 'text-primary' : 'text-gray-400'}`} />
                </div>
                <div>
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Lesson {index + 1}</span>
                  <span className={`font-medium ${activeLesson?._id === lesson._id ? 'text-primary' : 'text-gray-700'}`}>
                    {lesson.title}
                  </span>
                </div>
              </button>
            ))}
            {lessons.length === 0 && (
              <div className="p-6 text-gray-500 text-center">No lessons available yet.</div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="w-full md:w-2/3 lg:w-3/4">
        {activeLesson ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {activeLesson.videoUrl && (
              <div className="aspect-video w-full bg-gray-900">
                <iframe
                  width="100%"
                  height="100%"
                  src={toEmbedUrl(activeLesson.videoUrl)}
                  title={activeLesson.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              </div>
            )}
            
            <div className="p-8 md:p-12">
              <h1 className="text-3xl font-bold text-gray-900 mb-6">{activeLesson.title}</h1>
              
              <div className="prose max-w-none text-gray-700 leading-relaxed mb-12">
                {activeLesson.content.split('\n').map((paragraph: string, i: number) => (
                  <p key={i} className="mb-4">{paragraph}</p>
                ))}
              </div>
              
              <div className="border-t border-gray-100 pt-8 mt-8 flex justify-between items-center">
                <p className="text-gray-500 font-medium">Ready to test your knowledge?</p>
                <Link 
                  to={`/quiz/${activeLesson._id}`}
                  className="bg-primary text-white font-medium py-3 px-6 rounded-xl hover:bg-primary-hover transition-colors shadow-sm flex items-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  Take Quiz
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center h-full flex flex-col items-center justify-center">
            <h2 className="text-2xl font-bold text-gray-400 mb-2">Select a lesson to begin</h2>
            <p className="text-gray-500">Choose a lesson from the menu to view its content.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Lesson;
