import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, CheckCircle, Info, ArrowRight, HelpCircle, FileText, Video } from 'lucide-react';

const TutorialGuide: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <BookOpen className="h-6 w-6 text-indigo-600 mr-2" />
        <h2 className="text-xl font-semibold text-gray-900">Tutorial Guide</h2>
      </div>
      
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
        <div className="flex items-start mb-6">
          <div className="bg-indigo-100 rounded-full p-2 mr-3 flex-shrink-0">
            <Info className="h-5 w-5 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">Getting Started</h3>
            <p className="text-gray-600">
              Welcome to Widget Chat! This guide will help you set up and customize your chat widget in just a few minutes.
            </p>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="border-l-4 border-indigo-500 pl-4 py-1">
            <h4 className="font-medium text-gray-900 mb-2">Step 1: Configure Your Widget</h4>
            <p className="text-gray-600 mb-3">
              Start by customizing your widget appearance in the Widget Settings tab. Set your business name, representative name, brand color, and welcome message.
            </p>
            <button 
              onClick={() => handleNavigation('/dashboard')}
              className="flex items-center text-indigo-600 text-sm font-medium hover:text-indigo-800 transition-colors"
            >
              <span>Go to Widget Settings</span>
              <ArrowRight className="h-4 w-4 ml-1" />
            </button>
          </div>
          
          <div className="border-l-4 border-indigo-500 pl-4 py-1">
            <h4 className="font-medium text-gray-900 mb-2">Step 2: Set Up Auto Replies</h4>
            <p className="text-gray-600 mb-3">
              Create automatic responses for common questions. You can use exact matching, fuzzy matching, regular expressions, or synonyms to trigger these replies.
            </p>
            <button 
              onClick={() => handleNavigation('/dashboard/auto-reply')}
              className="flex items-center text-indigo-600 text-sm font-medium hover:text-indigo-800 transition-colors"
            >
              <span>Go to Auto Reply</span>
              <ArrowRight className="h-4 w-4 ml-1" />
            </button>
          </div>
          
          <div className="border-l-4 border-indigo-500 pl-4 py-1">
            <h4 className="font-medium text-gray-900 mb-2">Step 3: Create Advanced Replies</h4>
            <p className="text-gray-600 mb-3">
              Set up interactive buttons that provide additional information or redirect users to specific pages on your website.
            </p>
            <button 
              onClick={() => handleNavigation('/dashboard/advanced-reply')}
              className="flex items-center text-indigo-600 text-sm font-medium hover:text-indigo-800 transition-colors"
            >
              <span>Go to Advanced Reply</span>
              <ArrowRight className="h-4 w-4 ml-1" />
            </button>
          </div>
          
          <div className="border-l-4 border-indigo-500 pl-4 py-1">
            <h4 className="font-medium text-gray-900 mb-2">Step 4: Enable AI Mode (Optional)</h4>
            <p className="text-gray-600 mb-3">
              For more intelligent responses, enable AI Mode and provide your business context. This will help generate relevant responses for questions that don't match your auto-replies.
            </p>
            <button 
              onClick={() => handleNavigation('/dashboard/ai-mode')}
              className="flex items-center text-indigo-600 text-sm font-medium hover:text-indigo-800 transition-colors"
            >
              <span>Go to AI Mode</span>
              <ArrowRight className="h-4 w-4 ml-1" />
            </button>
          </div>
          
          <div className="border-l-4 border-indigo-500 pl-4 py-1">
            <h4 className="font-medium text-gray-900 mb-2">Step 5: Install the Widget on Your Website</h4>
            <p className="text-gray-600 mb-3">
              Copy the installation code and paste it into your website's HTML before the closing body tag. Your widget will appear immediately.
            </p>
            <button 
              onClick={() => handleNavigation('/dashboard/install')}
              className="flex items-center text-indigo-600 text-sm font-medium hover:text-indigo-800 transition-colors"
            >
              <span>Go to Install Code</span>
              <ArrowRight className="h-4 w-4 ml-1" />
            </button>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-medium mb-6 flex items-center text-gray-900">
          <HelpCircle className="h-5 w-5 mr-2 text-indigo-600" />
          Helpful Resources
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
            <div className="flex items-start">
              <div className="bg-indigo-100 p-2 rounded-md mr-3">
                <FileText className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-800 mb-1">Documentation</h4>
                <p className="text-sm text-gray-600 mb-2">
                  Detailed guides and reference materials for all widget features.
                </p>
                <a href="#" className="text-indigo-600 text-sm font-medium hover:text-indigo-700">
                  Read documentation
                </a>
              </div>
            </div>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
            <div className="flex items-start">
              <div className="bg-indigo-100 p-2 rounded-md mr-3">
                <Video className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-800 mb-1">Video Tutorials</h4>
                <p className="text-sm text-gray-600 mb-2">
                  Step-by-step video guides for setting up and customizing your widget.
                </p>
                <a href="#" className="text-indigo-600 text-sm font-medium hover:text-indigo-700">
                  Watch tutorials
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 bg-indigo-50 border border-indigo-100 rounded-lg p-4">
          <div className="flex items-start">
            <CheckCircle className="h-5 w-5 text-indigo-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-indigo-800 mb-1">Need Help?</h4>
              <p className="text-sm text-indigo-700">
                If you have any questions or need assistance, please contact our support team at support@widgetchat.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorialGuide;