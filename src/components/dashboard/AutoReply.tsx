import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { AutoReply as AutoReplyType } from '../../types';
import { Upload, Download, Plus, Trash2, Save, AlertCircle, MessageSquare, Search } from 'lucide-react';
import * as XLSX from 'xlsx';
import stringSimilarity from 'string-similarity';
import { useNotification } from '../../contexts/NotificationContext';

const AutoReply: React.FC = () => {
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(true);
  const [autoReplies, setAutoReplies] = useState<AutoReplyType[]>([]);
  const [newReply, setNewReply] = useState<Partial<AutoReplyType>>({
    keyword: '',
    response: '',
    match_type: 'exact',
    synonyms: []
  });
  const [synonymInput, setSynonymInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [testInput, setTestInput] = useState('');
  const [testResults, setTestResults] = useState<{id: string, matched: boolean}[]>([]);

  useEffect(() => {
    if (user) {
      fetchAutoReplies();
    }
  }, [user]);

  const fetchAutoReplies = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('auto_replies')
        .select('*')
        .eq('user_id', user?.id);

      if (error) throw error;
      setAutoReplies(data || []);
    } catch (error) {
      console.error('Error fetching auto replies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewReply(prev => ({ ...prev, [name]: value }));
  };

  const handleAddSynonym = () => {
    if (synonymInput.trim()) {
      setNewReply(prev => ({
        ...prev,
        synonyms: [...(prev.synonyms || []), synonymInput.trim()]
      }));
      setSynonymInput('');
    }
  };

  const handleRemoveSynonym = (index: number) => {
    setNewReply(prev => ({
      ...prev,
      synonyms: (prev.synonyms || []).filter((_, i) => i !== index)
    }));
  };

  const handleAddReply = async () => {
    if (!newReply.keyword || !newReply.response) {
      alert('Keyword and response are required');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('auto_replies')
        .insert({
          user_id: user?.id,
          keyword: newReply.keyword,
          response: newReply.response,
          match_type: newReply.match_type,
          synonyms: newReply.synonyms
        })
        .select();

      if (error) throw error;
      
      if (data) {
        setAutoReplies(prev => [...prev, data[0]]);
        setNewReply({
          keyword: '',
          response: '',
          match_type: 'exact',
          synonyms: []
        });
        
        // Show notification
        showNotification({
          type: 'success',
          title: 'Auto Reply Added',
          message: `Auto reply for "${data[0].keyword}" has been added successfully.`
        });
      }
    } catch (error) {
      console.error('Error adding auto reply:', error);
      showNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to add auto reply. Please try again.'
      });
    }
  };

  const handleDeleteReply = async (id: string) => {
    try {
      const replyToDelete = autoReplies.find(reply => reply.id === id);
      const { error } = await supabase
        .from('auto_replies')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setAutoReplies(prev => prev.filter(reply => reply.id !== id));
      
      // Show notification
      showNotification({
        type: 'info',
        title: 'Auto Reply Deleted',
        message: `Auto reply for "${replyToDelete?.keyword}" has been deleted.`
      });
    } catch (error) {
      console.error('Error deleting auto reply:', error);
      showNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to delete auto reply. Please try again.'
      });
    }
  };

  const handleImportExcel = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const binaryData = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(binaryData, { type: 'array' });
        
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        const jsonData = XLSX.utils.sheet_to_json(worksheet) as { keyword: string; response: string; match_type?: string }[];
        
        if (jsonData.length === 0) {
          showNotification({
            type: 'error',
            title: 'Import Failed',
            message: 'No data found in the Excel file'
          });
          return;
        }
        
        // Prepare data for insertion
        const newReplies = jsonData.map(row => ({
          user_id: user?.id,
          keyword: row.keyword,
          response: row.response,
          match_type: (row.match_type as 'exact' | 'fuzzy' | 'regex' | 'synonym') || 'exact'
        }));
        
        // Insert into database
        const { data: insertedData, error } = await supabase
          .from('auto_replies')
          .insert(newReplies)
          .select();
          
        if (error) throw error;
        
        if (insertedData) {
          setAutoReplies(prev => [...prev, ...insertedData]);
          showNotification({
            type: 'success',
            title: 'Import Successful',
            message: `Successfully imported ${insertedData.length} auto replies`
          });
        }
      } catch (error) {
        console.error('Error importing Excel:', error);
        showNotification({
          type: 'error',
          title: 'Import Failed',
          message: 'Failed to import Excel file. Please check the format and try again.'
        });
      }
    };
    
    reader.readAsArrayBuffer(file);
    // Reset the input
    e.target.value = '';
  };

  const handleExportExcel = () => {
    if (autoReplies.length === 0) {
      showNotification({
        type: 'error',
        title: 'Export Failed',
        message: 'No data to export'
      });
      return;
    }
    
    // Prepare data for export
    const exportData = autoReplies.map(reply => ({
      keyword: reply.keyword,
      response: reply.response,
      match_type: reply.match_type,
      synonyms: reply.synonyms ? reply.synonyms.join(', ') : ''
    }));
    
    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    
    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Auto Replies');
    
    // Generate Excel file
    XLSX.writeFile(workbook, 'auto_replies_export.xlsx');
    
    showNotification({
      type: 'success',
      title: 'Export Successful',
      message: 'Auto replies exported to Excel file'
    });
  };

  // Function to test matching
  const testMatching = (input: string, keyword: string, matchType: string, synonyms?: string[]) => {
    switch (matchType) {
      case 'exact':
        return input.toLowerCase() === keyword.toLowerCase();
      case 'fuzzy':
        return stringSimilarity.compareTwoStrings(input.toLowerCase(), keyword.toLowerCase()) > 0.6;
      case 'regex':
        try {
          const regex = new RegExp(keyword, 'i');
          return regex.test(input);
        } catch (e) {
          return false;
        }
      case 'synonym':
        if (input.toLowerCase() === keyword.toLowerCase()) return true;
        return synonyms ? synonyms.some(s => s.toLowerCase() === input.toLowerCase()) : false;
      default:
        return false;
    }
  };

  const handleTestMatching = () => {
    if (!testInput.trim()) return;
    
    const results = autoReplies.map(reply => ({
      id: reply.id,
      matched: testMatching(testInput, reply.keyword, reply.match_type, reply.synonyms)
    }));
    
    setTestResults(results);
  };

  const filteredReplies = autoReplies.filter(reply => 
    reply.keyword.toLowerCase().includes(searchTerm.toLowerCase()) || 
    reply.response.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        <span className="ml-3 text-gray-600">Loading auto replies...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 sm:gap-0">
        <div className="flex items-center">
          <MessageSquare className="h-6 w-6 text-indigo-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">Auto Reply Settings</h2>
        </div>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <label className="btn-secondary cursor-pointer flex-grow sm:flex-grow-0">
            <Upload className="h-4 w-4 mr-2" />
            Import Excel
            <input
              type="file"
              accept=".xlsx, .xls"
              className="hidden"
              onChange={handleImportExcel}
            />
          </label>
          <button
            onClick={handleExportExcel}
            className="btn-primary flex-grow sm:flex-grow-0"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Excel
          </button>
        </div>
      </div>

      {/* Add new auto reply form */}
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
        <h3 className="text-lg font-medium mb-4 text-gray-900">Add New Auto Reply</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="form-label">
              Keyword
            </label>
            <input
              type="text"
              name="keyword"
              value={newReply.keyword}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Enter keyword"
            />
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
              <option value="fuzzy">Fuzzy Match</option>
              <option value="regex">Regular Expression</option>
              <option value="synonym">Synonym Match</option>
            </select>
          </div>
        </div>
        
        {newReply.match_type === 'synonym' && (
          <div className="mb-4">
            <label className="form-label">
              Synonyms
            </label>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-0">
              <input
                type="text"
                value={synonymInput}
                onChange={(e) => setSynonymInput(e.target.value)}
                className="form-input sm:rounded-r-none"
                placeholder="Add synonym"
              />
              <button
                type="button"
                onClick={handleAddSynonym}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-md sm:rounded-l-none"
              >
                Add
              </button>
            </div>
            
            {newReply.synonyms && newReply.synonyms.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {newReply.synonyms.map((synonym, index) => (
                  <div key={index} className="bg-gray-100 px-2 py-1 rounded-md flex items-center">
                    <span className="text-sm text-gray-800">{synonym}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSynonym(index)}
                      className="ml-1 text-gray-500 hover:text-gray-700"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        <div className="mb-4">
          <label className="form-label">
            Response
          </label>
          <textarea
            name="response"
            value={newReply.response}
            onChange={handleInputChange}
            rows={3}
            className="form-input"
            placeholder="Enter response message"
          ></textarea>
        </div>
        
        <button
          type="button"
          onClick={handleAddReply}
          className="btn-primary"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Auto Reply
        </button>
      </div>

      {/* Test matching section */}
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
        <h3 className="text-lg font-medium mb-4 text-gray-900">Test Your Auto Replies</h3>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 mb-4">
          <input
            type="text"
            value={testInput}
            onChange={(e) => setTestInput(e.target.value)}
            className="form-input sm:rounded-r-none"
            placeholder="Enter a test message"
          />
          <button
            type="button"
            onClick={handleTestMatching}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md sm:rounded-l-none"
          >
            Test
          </button>
        </div>
        
        {testResults.length > 0 && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Test Results:</h4>
            {testResults.some(r => r.matched) ? (
              <div className="space-y-2">
                {testResults
                  .filter(r => r.matched)
                  .map(result => {
                    const reply = autoReplies.find(r => r.id === result.id);
                    return reply ? (
                      <div key={result.id} className="bg-green-50 border border-green-200 p-3 rounded-lg">
                        <div className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-green-800">Matched: "{reply.keyword}"</p>
                            <p className="text-sm text-green-700 mt-1">Response: "{reply.response}"</p>
                            <p className="text-xs text-green-600 mt-1">Match type: {reply.match_type}</p>
                          </div>
                        </div>
                      </div>
                    ) : null;
                  })}
              </div>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-yellow-800">No matches found</p>
                    <p className="text-sm text-yellow-700 mt-1">
                      Your message "{testInput}" didn't match any of your auto replies.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* List of auto replies */}
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3 sm:gap-0">
          <h3 className="text-lg font-medium text-gray-900">Auto Replies</h3>
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
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No auto replies found</p>
            {searchTerm ? (
              <p className="text-gray-400 mt-2">Try a different search term or clear the search</p>
            ) : (
              <p className="text-gray-400 mt-2">Add your first auto reply using the form above</p>
            )}
          </div>
        ) : (
          <div className="table-container overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Keyword</th>
                  <th>Match Type</th>
                  <th>Response</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredReplies.map((reply) => (
                  <tr key={reply.id} className="hover:bg-gray-50 transition-colors">
                    <td>
                      <div className="text-sm font-medium text-gray-900">{reply.keyword}</div>
                      {reply.match_type === 'synonym' && reply.synonyms && reply.synonyms.length > 0 && (
                        <div className="text-xs text-gray-500 mt-1">
                          Synonyms: {reply.synonyms.join(', ')}
                        </div>
                      )}
                    </td>
                    <td>
                      <span className="badge badge-blue">
                        {reply.match_type}
                      </span>
                    </td>
                    <td>
                      <div className="text-sm text-gray-900 max-w-xs truncate">{reply.response}</div>
                    </td>
                    <td>
                      <button
                        onClick={() => handleDeleteReply(reply.id)}
                        className="text-red-600 hover:text-red-900 transition-colors"
                      >
                        Delete
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

// CheckCircle component for test results
const CheckCircle = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

export default AutoReply;