import React, { useState, useEffect } from 'react';
import { BarChart, ClipboardList, Clock, Calendar, MessageCircle, User, ArrowRight, Download, Filter } from 'lucide-react';
import { getAnalyticsData, ChatSession } from '../../lib/analyticsService';
import { useAuth } from '../../contexts/AuthContext';
import { format } from 'date-fns';

const Analytics: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<{
    totalSessions: number;
    totalMessages: number;
    averageMessagesPerSession: number;
    sessions: ChatSession[];
  }>({
    totalSessions: 0,
    totalMessages: 0,
    averageMessagesPerSession: 0,
    sessions: []
  });
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const data = await getAnalyticsData();
        setAnalytics(data);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [user]);

  const filteredSessions = analytics.sessions.filter(session => {
    if (!filter) return true;
    
    const lowerFilter = filter.toLowerCase();
    const visitorInfo = session.visitorInfo;
    
    return (
      (visitorInfo.name && visitorInfo.name.toLowerCase().includes(lowerFilter)) ||
      (visitorInfo.email && visitorInfo.email.toLowerCase().includes(lowerFilter)) ||
      (visitorInfo.ipAddress && visitorInfo.ipAddress.toLowerCase().includes(lowerFilter)) ||
      session.messages.some(msg => msg.content.toLowerCase().includes(lowerFilter))
    );
  });

  const handleExportData = () => {
    try {
      const dataStr = JSON.stringify(analytics.sessions, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `widget-chat-analytics-${new Date().toISOString().split('T')[0]}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    } catch (error) {
      console.error('Error exporting data:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        <span className="ml-3 text-gray-600">Loading analytics...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <BarChart className="h-6 w-6 text-indigo-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">Analytics</h2>
        </div>
        <button 
          onClick={handleExportData}
          className="btn-secondary"
        >
          <Download className="h-4 w-4 mr-2" />
          Export Data
        </button>
      </div>
      
      {analytics.totalSessions === 0 ? (
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
          <div className="flex flex-col items-center justify-center py-12">
            <div className="bg-indigo-100 p-4 rounded-full mb-6">
              <ClipboardList className="h-12 w-12 text-indigo-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No Chat Data Yet</h3>
            <p className="text-gray-600 max-w-lg mx-auto mb-6">
              Once visitors start using your chat widget, you'll see analytics data here.
              All conversations are stored locally in the browser.
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Analytics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center mb-2">
                <MessageCircle className="h-5 w-5 text-indigo-600 mr-2" />
                <h3 className="text-lg font-medium text-gray-900">Total Conversations</h3>
              </div>
              <p className="text-3xl font-bold text-gray-900">{analytics.totalSessions}</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center mb-2">
                <ClipboardList className="h-5 w-5 text-indigo-600 mr-2" />
                <h3 className="text-lg font-medium text-gray-900">Total Messages</h3>
              </div>
              <p className="text-3xl font-bold text-gray-900">{analytics.totalMessages}</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center mb-2">
                <BarChart className="h-5 w-5 text-indigo-600 mr-2" />
                <h3 className="text-lg font-medium text-gray-900">Avg. Messages</h3>
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {analytics.averageMessagesPerSession.toFixed(1)}
              </p>
            </div>
          </div>
          
          {/* Chat Sessions List and Detail View */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sessions List */}
            <div className="lg:col-span-1">
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Conversations</h3>
                  <div className="relative">
                    <input
                      type="text"
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                      placeholder="Search..."
                      className="pl-8 pr-4 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <Filter className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                </div>
                
                <div className="space-y-2 max-h-[500px] overflow-y-auto">
                  {filteredSessions.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No conversations match your search
                    </div>
                  ) : (
                    filteredSessions.map((session) => (
                      <div 
                        key={session.id}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                          selectedSession?.id === session.id 
                            ? 'bg-indigo-50 border-indigo-200' 
                            : 'bg-white border-gray-200 hover:bg-gray-50'
                        }`}
                        onClick={() => setSelectedSession(session)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start">
                            <div className="bg-gray-100 rounded-full p-2 mr-3">
                              <User className="h-4 w-4 text-gray-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {session.visitorInfo.name || 'Anonymous Visitor'}
                              </p>
                              <p className="text-xs text-gray-500">
                                {session.visitorInfo.email || session.visitorInfo.ipAddress || 'No contact info'}
                              </p>
                            </div>
                          </div>
                          <div className="text-xs text-gray-500">
                            {format(new Date(session.timestamp), 'MMM d, yyyy')}
                          </div>
                        </div>
                        <div className="mt-2 flex justify-between items-center">
                          <span className="text-xs text-gray-500">
                            {session.messages.length} messages
                          </span>
                          <ArrowRight className="h-3 w-3 text-gray-400" />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
            
            {/* Chat Detail View */}
            <div className="lg:col-span-2">
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 h-full">
                {selectedSession ? (
                  <>
                    <div className="border-b border-gray-200 pb-4 mb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="bg-indigo-100 rounded-full p-2 mr-3">
                            <User className="h-5 w-5 text-indigo-600" />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">
                              {selectedSession.visitorInfo.name || 'Anonymous Visitor'}
                            </h3>
                            <p className="text-xs text-gray-500">
                              {selectedSession.visitorInfo.email || 'No email provided'}
                            </p>
                          </div>
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {format(new Date(selectedSession.timestamp), 'MMM d, yyyy h:mm a')}
                        </div>
                      </div>
                      
                      {selectedSession.visitorInfo.ipAddress && (
                        <div className="mt-3 text-xs text-gray-500">
                          IP: {selectedSession.visitorInfo.ipAddress}
                        </div>
                      )}
                      
                      {selectedSession.visitorInfo.referrer && (
                        <div className="mt-1 text-xs text-gray-500">
                          Referrer: {selectedSession.visitorInfo.referrer}
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-3 max-h-[400px] overflow-y-auto p-2">
                      {selectedSession.messages.map((message) => (
                        <div 
                          key={message.id}
                          className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div 
                            className={`max-w-[80%] p-3 rounded-lg ${
                              message.sender === 'user' 
                                ? 'bg-indigo-100 text-indigo-900' 
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                            <p className="text-xs text-right mt-1 opacity-70">
                              {format(new Date(message.timestamp), 'h:mm a')}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                    <MessageCircle className="h-12 w-12 text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-500 mb-2">No Conversation Selected</h3>
                    <p className="text-gray-400 max-w-md">
                      Select a conversation from the list to view the details
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Analytics;