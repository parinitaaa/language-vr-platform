import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { BookOpen, LogOut, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md py-4 px-6 md:px-12 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold text-primary flex items-center gap-2">
        <BookOpen className="w-8 h-8" />
        <span>LangVR</span>
      </Link>
      
      <div className="flex items-center gap-6">
        <Link to="/courses" className="text-gray-600 hover:text-primary transition-colors font-medium">Courses</Link>
        {user ? (
          <>
            <Link to="/dashboard" className="text-gray-600 hover:text-primary transition-colors font-medium">Dashboard</Link>
            <Link to="/vr" className="text-gray-600 hover:text-primary transition-colors font-medium flex items-center gap-1">
              🥽 VR Practice
            </Link>
            {user.role === 'admin' && (
              <Link to="/admin" className="text-gray-600 hover:text-primary transition-colors font-medium">Admin</Link>
            )}
            <div className="flex items-center gap-4 border-l pl-4 border-gray-200">
              <span className="flex items-center gap-2 text-sm text-gray-700 bg-gray-100 py-1 px-3 rounded-full">
                <User className="w-4 h-4" />
                {user.name}
              </span>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-1 text-red-500 hover:text-red-700 transition-colors text-sm font-medium"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </>
        ) : (
          <div className="flex gap-3">
            <Link to="/login" className="px-4 py-2 text-primary font-medium hover:bg-indigo-50 rounded-lg transition-colors">Login</Link>
            <Link to="/register" className="px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary-hover transition-colors shadow-sm">Register</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
