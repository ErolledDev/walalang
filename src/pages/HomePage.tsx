import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, CheckCircle, ArrowRight, Code, Settings, MessageCircle, Bot, Sparkles, Zap, Layers } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const HomePage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      {/* Header/Navigation */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <MessageCircle className="h-8 w-8 text-indigo-600" />
            <h1 className="ml-2 text-xl font-bold text-gray-900">Widget Chat</h1>
          </div>
          <div>
            {user ? (
              <Link 
                to="/dashboard" 
                className="btn-primary"
              >
                Dashboard
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            ) : (
              <div className="flex space-x-4">
                <Link 
                  to="/login" 
                  className="btn-secondary"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="btn-primary"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
                Smart chat widget with <span className="text-indigo-600">AI-powered</span> responses
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Add a beautiful, customizable chat widget to your website in minutes. Engage with your visitors using intelligent auto-replies and AI-powered conversations.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                {user ? (
                  <Link 
                    to="/dashboard" 
                    className="btn-primary text-base px-6 py-3"
                  >
                    Go to Dashboard
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Link>
                ) : (
                  <>
                    <Link 
                      to="/register" 
                      className="btn-primary text-base px-6 py-3"
                    >
                      Start for Free
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </Link>
                    <Link 
                      to="/login" 
                      className="btn-secondary text-base px-6 py-3"
                    >
                      Login to Account
                    </Link>
                  </>
                )}
              </div>
            </div>
            <div className="relative animate-fade-in">
              <div className="bg-white rounded-2xl shadow-soft p-6 border border-gray-100">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center">
                    <MessageSquare className="h-5 w-5 text-white" />
                  </div>
                  <div className="ml-3">
                    <h3 className="font-semibold text-gray-900">Widget Chat</h3>
                    <p className="text-xs text-gray-500">Online now</p>
                  </div>
                </div>
                <div className="space-y-3 mb-4">
                  <div className="bg-gray-100 rounded-lg p-3 max-w-xs">
                    <p className="text-sm text-gray-800">Hi there! How can I help you today?</p>
                  </div>
                  <div className="bg-indigo-100 rounded-lg p-3 max-w-xs ml-auto">
                    <p className="text-sm text-indigo-800">Do you offer AI-powered responses?</p>
                  </div>
                  <div className="bg-gray-100 rounded-lg p-3 max-w-xs">
                    <p className="text-sm text-gray-800">Yes! Our AI mode can generate intelligent responses based on your business context and customer questions.</p>
                  </div>
                  <div className="bg-indigo-100 rounded-lg p-3 max-w-xs ml-auto">
                    <p className="text-sm text-indigo-800">That sounds amazing!</p>
                  </div>
                </div>
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Type your message..." 
                    className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-indigo-600 text-white p-1.5 rounded-full">
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-indigo-100 rounded-full z-[-1]"></div>
              <div className="absolute -top-6 -left-6 w-16 h-16 bg-indigo-200 rounded-full z-[-1]"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Powerful Features</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to engage with your website visitors and provide excellent customer support.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card p-6 transition-all duration-200 hover:shadow-md">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <MessageSquare className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart Auto Replies</h3>
              <p className="text-gray-600">
                Set up automatic responses to common questions with multiple matching options including exact, fuzzy, regex, and synonym matching.
              </p>
            </div>
            
            <div className="card p-6 transition-all duration-200 hover:shadow-md">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <Bot className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI-Powered Mode</h3>
              <p className="text-gray-600">
                Enable AI responses for questions that don't match your auto-replies. Customize the AI with your business context for relevant answers.
              </p>
            </div>
            
            <div className="card p-6 transition-all duration-200 hover:shadow-md">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <Layers className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Advanced Replies</h3>
              <p className="text-gray-600">
                Create interactive buttons that provide additional information or redirect users to specific pages on your website.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* AI Mode Highlight Section */}
      <section className="py-16 bg-gradient-to-r from-indigo-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center mb-4">
                <Sparkles className="h-6 w-6 text-indigo-600 mr-2" />
                <h2 className="text-3xl font-bold text-gray-900">AI-Powered Conversations</h2>
              </div>
              <p className="text-lg text-gray-600 mb-6">
                Our AI mode takes your chat widget to the next level by providing intelligent, context-aware responses to your visitors' questions.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-gray-700">Customize AI with your business context for relevant responses</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-gray-700">Choose from multiple AI models including GPT-3.5, GPT-4, and Claude</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-gray-700">Fallback to AI when no auto-reply matches a visitor's question</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-gray-700">Provide instant, helpful responses even when you're not available</span>
                </li>
              </ul>
              {!user && (
                <Link 
                  to="/register" 
                  className="btn-primary inline-flex"
                >
                  Try AI Mode
                  <Zap className="h-4 w-4 ml-2" />
                </Link>
              )}
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                  <Bot className="h-5 w-5 text-indigo-600" />
                </div>
                <div className="ml-3">
                  <h3 className="font-semibold text-gray-900">AI Assistant</h3>
                  <p className="text-xs text-gray-500">Powered by advanced AI</p>
                </div>
              </div>
              
              <div className="space-y-3 mb-4">
                <div className="bg-indigo-100 rounded-lg p-3 max-w-xs ml-auto">
                  <p className="text-sm text-indigo-800">Do you offer international shipping?</p>
                </div>
                <div className="bg-gray-100 rounded-lg p-3 max-w-xs">
                  <p className="text-sm text-gray-800">Yes, we do offer international shipping to most countries! Shipping costs vary depending on the destination and order size. You can see the exact shipping cost at checkout. Is there a specific country you're asking about?</p>
                  <p className="text-xs text-gray-500 mt-1">AI-generated response</p>
                </div>
                
                <div className="bg-indigo-100 rounded-lg p-3 max-w-xs ml-auto">
                  <p className="text-sm text-indigo-800">What's your return policy?</p>
                </div>
                <div className="bg-gray-100 rounded-lg p-3 max-w-xs">
                  <p className="text-sm text-gray-800">You can return any item within 30 days for a full refund. Just keep the original packaging. Would you like me to explain the return process in more detail?</p>
                  <p className="text-xs text-gray-500 mt-1">AI-generated response</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Installation Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Simple Installation</h2>
              <p className="text-lg text-gray-600 mb-6">
                Adding the chat widget to your website is as easy as copying and pasting a few lines of code.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-gray-700">Copy the installation code from your dashboard</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-gray-700">Paste it into your website's HTML before the closing body tag</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-gray-700">Refresh your website and see the chat widget in action</span>
                </li>
              </ul>
              {!user && (
                <Link 
                  to="/register" 
                  className="btn-primary inline-flex"
                >
                  Get Started
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              )}
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="text-sm font-medium text-gray-500 mb-2">Installation Code</div>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                <code>{`<script src="https://widget-chat-app.netlify.app/chat.js"></script>

<script>
  new BusinessChatPlugin({
    uid: 'YOUR_UID'
  });
</script>`}</code>
              </pre>
              <p className="mt-4 text-sm text-gray-600">
                Replace <code className="bg-gray-100 px-1 py-0.5 rounded text-indigo-600">YOUR_UID</code> with your unique user ID from the dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials/Benefits Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Widget Chat</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Enhance your website with a powerful chat solution that combines automation and AI intelligence.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                <Settings className="h-5 w-5 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Fully Customizable</h3>
              <p className="text-gray-600">
                Match your brand colors and style to create a seamless experience for your visitors.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                <Zap className="h-5 w-5 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Instant Responses</h3>
              <p className="text-gray-600">
                Provide immediate answers to common questions with auto-replies and AI assistance.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                <Code className="h-5 w-5 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Easy Integration</h3>
              <p className="text-gray-600">
                Add to any website with a simple code snippet. No technical expertise required.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                <Sparkles className="h-5 w-5 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">AI Intelligence</h3>
              <p className="text-gray-600">
                Leverage advanced AI models to provide smart, contextual responses to your visitors.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-indigo-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to enhance your website with smart chat?</h2>
          <p className="text-xl text-indigo-100 mb-8 max-w-3xl mx-auto">
            Join thousands of businesses using Widget Chat to engage visitors and provide instant support.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            {user ? (
              <Link 
                to="/dashboard" 
                className="bg-white text-indigo-600 hover:bg-indigo-50 px-8 py-3 rounded-md font-medium text-lg shadow-sm transition-colors"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link 
                  to="/register" 
                  className="bg-white text-indigo-600 hover:bg-indigo-50 px-8 py-3 rounded-md font-medium text-lg shadow-sm transition-colors"
                >
                  Start for Free
                </Link>
                <Link 
                  to="/login" 
                  className="bg-indigo-700 text-white hover:bg-indigo-800 px-8 py-3 rounded-md font-medium text-lg shadow-sm transition-colors"
                >
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-6 md:mb-0">
              <MessageCircle className="h-8 w-8 text-indigo-400" />
              <h2 className="ml-2 text-xl font-bold">Widget Chat</h2>
            </div>
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-8">
              <Link to="/" className="text-gray-300 hover:text-white transition-colors">Home</Link>
              <Link to="/login" className="text-gray-300 hover:text-white transition-colors">Login</Link>
              <Link to="/register" className="text-gray-300 hover:text-white transition-colors">Register</Link>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center md:text-left">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} Widget Chat. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;