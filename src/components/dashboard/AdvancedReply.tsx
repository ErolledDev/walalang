import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { AdvancedReply as AdvancedReplyType } from '../../types';
import { Plus, Trash2, MessageCircle, Search, ExternalLink, Link as LinkIcon } from 'lucide-react';
import { useNotification } from '../../contexts/NotificationContext';

const AdvancedReply: React.FC = () => {
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(true);
  const [advancedReplies, setAdvancedReplies] = useState<AdvancedReplyType[]>([]);
  const [newReply, setNewReply] = useState<Partial<AdvancedReplyType>>({
    keyword: '',
    button_text: '',
    response: '',
    url: '',
    match_type: 'contains'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [showUrlField, setShowUrlField] = useState(false);

  useEffect(() => {
    if (user) {
      fetchAdvancedReplies();
    }
  }, [user]);

  const fetchAdvancedReplies = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('advanced_replies')
        .select('*')
        .eq('user_id', user?.id);

      if (error) throw error;
      setAdvancedReplies(data || []);
    } catch (error) {
      console.error('Error fetching advanced replies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewReply(prev => ({ ...prev, [name]: value }));
    
    // Toggle URL field visibility based on whether there's a URL
    if (name === 'url') {
      setShowUrlField(value.trim().length > 0);
    }
  };

  const handleAddReply = async () => {
    if (!newReply.keyword || !newReply.button_text) {
      showNotification({
        type: 'error',
        title: 'Validation Error',
        message: 'Keyword and button text are required'
      });
      return;
    }

    // Ensure at least one of response or URL is provided
    if (!newReply.response && !newReply.url) {
      showNotification({
        type: 'error',
        title: 'Validation Error',
        message: 'Either a response message or a URL is required'
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('advanced_replies')
        .insert({
          user_id: user?.id,
          keyword: newReply.keyword,
          button_text: newReply.button_text,
          response: newReply.response || null,
          url: newReply.url || null,
          match_type: newReply.match_type
        })
        .select();

      if (error) throw error;
      
      if (data) {
        setAdvancedReplies(prev => [...prev, data[0]]);
        setNewReply({
          keyword: '',
          button_text: '',
          response: '',
          url: '',
          match_type: 'contains'
        });
        setShowUrlField(false);
        
        // Show notification
        showNotification({
          type: 'success',
          title: 'Advanced Reply Added',
          message: `Advanced reply for "${data[0].keyword}" has been added successfully.`
        });
      }
    } catch (error) {
      console.error('Error adding advanced reply:', error);
      showNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to add advanced reply. Please try again.'
      });
    }
  };

  const handleDeleteReply = async (id: string) => {
    try {
      const replyToDelete = advancedReplies.find(reply => reply.id === id);
      const { error } = await supabase
        .from('advanced_replies')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setAdvancedReplies(prev => prev.filter(reply => reply.id !== id));
      
      // Show notification
      showNotification({
        type: 'info',
        title: 'Advanced Reply Deleted',
        message: `Advanced reply for "${replyToDelete?.keyword}" has been deleted.`
      });
    } catch (error) {
      console.error('Error deleting advanced reply:', error);
      showNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to delete advanced reply. Please try again.'
      });
    }
  };

  const filteredReplies = advancedReplies.filter(reply => 
    reply.keyword.toLowerCase().includes(searchTerm.toLowerCase()) || 
    reply.button_text.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (reply.response && reply.response.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        <span className="ml-3 text-gray-600">Loading advanced replies...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <MessageCircle className="h-6 w-6 text-indigo-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">Advanced Reply Settings</h2>
        </div>
      </div>

      {/* Add new advanced reply form */}
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
        <h3 className="text-lg font-medium mb-4 text-gray-900">Add New Advanced Reply</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="form-label">
              Keyword or Phrase
            </label>
            <input
              type="text"
              name="keyword"
              value={newReply.keyword}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Enter keyword or phrase to match"
            />
            <p className="mt-1 text-xs text-gray-500">
              This is what will trigger the advanced reply option.
            </p>
          </div>
          
          <div>
            <label className="form-label">
              Match Type
            </label>
            <select
              name="match_type"
              value={newReply.match_type}
              onChange={handleInputChange}
              className="form-input"
            >
              <option value="exact">Exact Match</option>
              <option value="contains">Contains</option>
              <option value="fuzzy">Fuzzy Match</option>
              <option value="regex">Regular Expression</option>
            </select>
            <p className="mt-1 text-xs text-gray-500">
              How the keyword should be matched in user messages.
            </p>
          </div>
        </div>
        
        <div className="mb-4">
          <label className="form-label">
            Button Text
          </label>
          <input
            type="text"
            name="button_text"
            value={newReply.button_text}
            onChange={handleInputChange}
            className="form-input"
            placeholder="Text to display on the button"
          />
          <p className="mt-1 text-xs text-gray-500">
            This text will be shown on the button that users can click.
          </p>
        </div>
        
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <label className="form-label mb-0">
              Response Message
            </label>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="toggle-url"
                checked={showUrlField}
                onChange={() => setShowUrlField(!showUrlField)}
                className="mr-2"
              />
              <label htmlFor="toggle-url" className="text-sm text-gray-600 cursor-pointer">
                Add URL instead
              </label>
            </div>
          </div>
          
          {!showUrlField ? (
            <textarea
              name="response"
              value={newReply.response}
              onChange={handleInputChange}
              rows={3}
              className="form-input"
              placeholder="Enter response message"
            ></textarea>
          ) : (
            <div className="flex items-center flex-col sm:flex-row gap-2 sm:gap-0">
              <div className="flex-grow w-full">
                <input
                  type="url"
                  name="url"
                  value={newReply.url}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="https://example.com/page"
                />
              </div>
              <div className="sm:ml-2 hidden sm:block">
                <LinkIcon className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          )}
          
          <p className="mt-1 text-xs text-gray-500">
            {!showUrlField 
              ? "This message will be sent when the user clicks the button." 
              : "The user will be redirected to this URL when they click the button."}
          </p>
        </div>
        
        <button
          type="button"
          onClick={handleAddReply}
          className="btn-primary"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Advanced Reply
        </button>
      </div>

      {/* List of advanced replies */}
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3 sm:gap-0">
          <h3 className="text-lg font-medium text-gray-900">Advanced Replies</h3>
          <div className="relative w-full sm:w-auto">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full"
              placeholder="Search replies..."
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </div>
        
        {filteredReplies.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No advanced replies found</p>
            {searchTerm ? (
              <p className="text-gray-400 mt-2">Try a different search term or clear the search</p>
            ) : (
              <p className="text-gray-400 mt-2">Add your first advanced reply using the form above</p>
            )}
          </div>
        ) : (
          <div className="table-container overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Keyword</th>
                  <th>Match Type</th>
                  <th>Button Text</th>
                  <th>Action Type</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredReplies.map((reply) => (
                  <tr key={reply.id} className="hover:bg-gray-50 transition-colors">
                    <td>
                      <div className="text-sm font-medium text-gray-900">{reply.keyword}</div>
                    </td>
                    <td>
                      <span className="badge badge-blue">
                        {reply.match_type}
                      </span>
                    </td>
                    <td>
                      <div className="text-sm text-gray-900">{reply.button_text}</div>
                    </td>
                    <td>
                      {reply.url ? (
                        <div className="flex items-center text-sm text-gray-900">
                          <ExternalLink className="h-4 w-4 text-gray-500 mr-1" />
                          <span className="truncate max-w-[150px]">{reply.url}</span>
                        </div>
                      ) : (
                        <div className="flex items-center text-sm text-gray-900">
                          <MessageCircle className="h-4 w-4 text-gray-500 mr-1" />
                          <span className="truncate max-w-[150px]">{reply.response}</span>
                        </div>
                      )}
                    </td>
                    <td>
                      <button
                        onClick={() => handleDeleteReply(reply.id)}
                        className="text-red-600 hover:text-red-900 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvancedReply;