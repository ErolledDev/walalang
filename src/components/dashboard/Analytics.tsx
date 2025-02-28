import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { BarChart, Search, Calendar, Mail, User, Clock, MessageSquare, ChevronDown, ChevronUp, Download, RefreshCw } from 'lucide-react';
import { useNotification } from '../../contexts/NotificationContext';
import * as XLSX from 'xlsx';

interface ChatAnalytics {
  id: string;
  visitor_name: string;
  visitor_email: string;
  ip_address: string;
  timestamp: string;
}

interface ChatMessage {
  id: string;
  analytics_id: string;
  message: string;
  sender: string;
  timestamp: string;
}

const Analytics: React.FC = () => {
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<ChatAnalytics[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedChat, setExpandedChat] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<Record<string, ChatMessage[]>>({});
  const [dateRange, setDateRange] = useState({
    from: '',
    to: ''
  });

  useEffect(() => {
    if (user) {
      fetchAnalytics();
    }
  }, [user]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('chat_analytics')
        .select('*')
        .eq('user_id', user?.id)
        .order('timestamp', { ascending: false });
      
      // Apply date filters if set
      if (dateRange.from) {
        query = query.gte('timestamp', dateRange.from);
      }
      if (dateRange.to) {
        // Add one day to include the end date fully
        const endDate = new Date(dateRange.to);
        endDate.setDate(endDate.getDate() + 1);
        query = query.lt('timestamp', endDate.toISOString());
      }
      
      const { data, error } = await query;

      if (error) throw error;
      setAnalytics(data || []);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      showNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to load analytics data. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchChatMessages = async (analyticsId: string) => {
    try {
      // Check if we already have the messages
      if (chatMessages[analyticsId]) {
        return;
      }
      
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('analytics_id', analyticsId)
        .order('timestamp', { ascending: true });

      if (error) throw error;
      
      setChatMessages(prev => ({
        ...prev,
        [analyticsId]: data || []
      }));
    } catch (error) {
      console.error('Error fetching chat messages:', error);
      showNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to load chat messages. Please try again.'
      });
    }
  };

  const toggleChatExpansion = async (analyticsId: string) => {
    if (expandedChat === analyticsId) {
      setExpandedChat(null);
    } else {
      setExpandedChat(analyticsId);
      await fetchChatMessages(analyticsId);
    }
  };

  const handleDateRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDateRange(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const applyFilters = () => {
    fetchAnalytics();
  };

  const resetFilters = () => {
    setDateRange({
      from: '',
      to: ''
    });
    setSearchTerm('');
    fetchAnalytics();
  };

  const exportToExcel = () => {
    if (analytics.length === 0) {
      showNotification({
        type: 'error',
        title: 'Export Failed',
        message: 'No data to export'
      });
      return;
    }
    
    // Prepare data for export
    const exportData = analytics.map(item => ({
      'Visitor Name': item.visitor_name,
      'Visitor Email': item.visitor_email,
      'IP Address': item.ip_address,
      'Timestamp': new Date(item.timestamp).toLocaleString(),
    }));
    
    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    
    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Chat Analytics');
    
    // Generate Excel file
    XLSX.writeFile(workbook, 'chat_analytics_export.xlsx');
    
    showNotification({
      type: 'success',
      title: 'Export Successful',
      message: 'Analytics data exported to Excel file'
    });
  };

  const filteredAnalytics = analytics.filter(item => 
    item.visitor_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.visitor_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.ip_address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        <span className="ml-3 text-gray-600">Loading analytics data...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <BarChart className="h-6 w-6 text-indigo-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">Chat Analytics</h2>
        </div>
        <button
          onClick={fetchAnalytics}
          className="text-gray-600 hover:text-gray-900 flex items-center transition-colors"
          title="Refresh analytics"
        >
          <RefreshCw className="h-4 w-4 mr-1" />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
        <h3 className="text-lg font-medium mb-4 text-gray-900">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="form-label flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-gray-500" />
              From Date
            </label>
            <input
              type="date"
              name="from"
              value={dateRange.from}
              onChange={handleDateRangeChange}
              className="form-input"
            />
          </div>
          <div>
            <label className="form-label flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-gray-500" />
              To Date
            </label>
            <input
              type="date"
              name="to"
              value={dateRange.to}
              onChange={handleDateRangeChange}
              className="form-input"
            />
          </div>
          <div>
            <label className="form-label flex items-center">
              <Search className="h-4 w-4 mr-2 text-gray-500" />
              Search
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input"
              placeholder="Search by name, email or IP..."
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={applyFilters}
            className="btn-primary"
          >
            Apply Filters
          </button>
          <button
            onClick={resetFilters}
            className="btn-secondary"
          >
            Reset Filters
          </button>
          <button
            onClick={exportToExcel}
            className="btn-secondary ml-auto"
          >
            <Download className="h-4 w-4 mr-2" />
            Export to Excel
          </button>
        </div>
      </div>

      {/* Analytics Table */}
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-medium mb-4 text-gray-900">Chat Sessions</h3>
        
        {filteredAnalytics.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <BarChart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No analytics data found</p>
            {searchTerm || dateRange.from || dateRange.to ? (
              <p className="text-gray-400 mt-2">Try different search terms or date range</p>
            ) : (
              <p className="text-gray-400 mt-2">Analytics data will appear here once visitors use your chat widget</p>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Visitor
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    IP Address
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Timestamp
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Chat
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAnalytics.map((item) => (
                  <React.Fragment key={item.id}>
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <User className="h-5 w-5 text-gray-400 mr-2" />
                          <div className="text-sm font-medium text-gray-900">{item.visitor_name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Mail className="h-5 w-5 text-gray-400 mr-2" />
                          <div className="text-sm text-gray-500">{item.visitor_email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{item.ip_address || 'Not available'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Clock className="h-5 w-5 text-gray-400 mr-2" />
                          <div className="text-sm text-gray-500">{formatDate(item.timestamp)}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => toggleChatExpansion(item.id)}
                          className="flex items-center text-indigo-600 hover:text-indigo-900"
                        >
                          <MessageSquare className="h-5 w-5 mr-1" />
                          <span>View Chat</span>
                          {expandedChat === item.id ? (
                            <ChevronUp className="h-4 w-4 ml-1" />
                          ) : (
                            <ChevronDown className="h-4 w-4 ml-1" />
                          )}
                        </button>
                      </td>
                    </tr>
                    {expandedChat === item.id && (
                      <tr>
                        <td colSpan={5} className="px-6 py-4 bg-gray-50">
                          <div className="rounded-lg border border-gray-200 p-4 max-h-96 overflow-y-auto">
                            <h4 className="font-medium text-gray-900 mb-3">Chat History</h4>
                            {chatMessages[item.id]?.length > 0 ? (
                              <div className="space-y-3">
                                {chatMessages[item.id].map((message) => (
                                  <div 
                                    key={message.id} 
                                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                  >
                                    <div 
                                      className={`max-w-xs rounded-lg px-4 py-2 ${
                                        message.sender === 'user' 
                                          ? 'bg-indigo-100 text-indigo-800' 
                                          : 'bg-gray-100 text-gray-800'
                                      }`}
                                    >
                                      <p className="text-sm">{message.message}</p>
                                      <p className="text-xs text-gray-500 mt-1">{formatDate(message.timestamp)}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-gray-500 text-center py-4">No chat messages found</p>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;