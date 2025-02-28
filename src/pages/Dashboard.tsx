import React, { useState } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import WidgetSettings from '../components/dashboard/WidgetSettings';
import AutoReply from '../components/dashboard/AutoReply';
import AdvancedReply from '../components/dashboard/AdvancedReply';
import InstallCode from '../components/dashboard/InstallCode';
import AIMode from '../components/dashboard/AIMode';
import TutorialGuide from '../components/dashboard/TutorialGuide';
import Analytics from '../components/dashboard/Analytics';
import { 
  MessageSquare, 
  Settings, 
  Code, 
  LogOut, 
  Menu, 
  X, 
  ChevronRight,
  MessageCircle,
  User,
  Bot,
  BookOpen,
  BarChart
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const navItems = [
    { path: '/dashboard', label: 'Widget Settings', icon: <Settings className="h-5 w-5" /> },
    { path: '/dashboard/auto-reply', label: 'Auto Reply', icon: <MessageSquare className="h-5 w-5" /> },
    { path: '/dashboard/advanced-reply', label: 'Advanced Reply', icon: <MessageCircle className="h-5 w-5" /> },
    { path: '/dashboard/ai-mode', label: 'AI Mode', icon: <Bot className="h-5 w-5" /> },
    { path: '/dashboard/analytics', label: 'Analytics', icon: <BarChart className="h-5 w-5" /> },
    { path: '/dashboard/install', label: 'Install Code', icon: <Code className="h-5 w-5" /> },
    { path: '/dashboard/tutorial', label: 'Tutorial Guide', icon: <BookOpen className="h-5 w-5" /> },
  ];

  const isActive = (path: string) => {
    if (path === '/dashboard' && location.pathname === '/dashboard') {
      return true;
    }
    return location.pathname.startsWith(path) && path !== '/dashboard';
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-md bg-white shadow-md text-gray-600 hover:text-gray-900 focus:outline-none"
        >
          {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar header */}
          <div className="px-6 py-6 border-b border-gray-200">
            <div className="flex items-center">
              <MessageCircle className="h-8 w-8 text-indigo-600" />
              <h1 className="ml-2 text-xl font-bold text-gray-900">Widget Chat</h1>
            </div>
            <div className="mt-4 flex items-center">
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                <User className="h-4 w-4 text-indigo-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900 truncate max-w-[180px]">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                  isActive(item.path)
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <span className={`mr-3 ${isActive(item.path) ? 'text-indigo-500' : 'text-gray-500'}`}>
                  {item.icon}
                </span>
                {item.label}
                {isActive(item.path) && (
                  <ChevronRight className="ml-auto h-4 w-4 text-indigo-500" />
                )}
              </Link>
            ))}
          </nav>

          {/* Sidebar footer */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleSignOut}
              className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50 hover:text-gray-900 transition-colors"
            >
              <LogOut className="mr-3 h-5 w-5 text-gray-500" />
              Sign out
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<WidgetSettings />} />
            <Route path="/auto-reply" element={<AutoReply />} />
            <Route path="/advanced-reply" element={<AdvancedReply />} />
            <Route path="/ai-mode" element={<AIMode />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/install" element={<InstallCode />} />
            <Route path="/tutorial" element={<TutorialGuide />} />
          </Routes>
        </div>
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-gray-600 bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default Dashboard;