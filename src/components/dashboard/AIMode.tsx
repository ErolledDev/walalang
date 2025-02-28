import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { AISettings } from '../../types';
import { Save, RefreshCw, Bot, CheckCircle, AlertCircle, ToggleLeft, ToggleRight, Key, Info, Sparkles } from 'lucide-react';
import { useNotification } from '../../contexts/NotificationContext';

const AIMode: React.FC = () => {
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [settings, setSettings] = useState<AISettings>({
    id: '',
    user_id: user?.id || '',
    enabled: false,
    api_key: '',
    model: 'gpt-3.5-turbo',
    business_context: ''
  });

  useEffect(() => {
    if (user) {
      fetchSettings();
    }
  }, [user]);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('ai_settings')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        // PGRST116 is the error code for "no rows returned"
        throw error;
      }

      if (data) {
        setSettings(data);
      }
    } catch (error) {
      console.error('Error fetching AI settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleToggleChange = () => {
    setSettings(prev => ({ ...prev, enabled: !prev.enabled }));
  };

  const handleSaveSettings = async () => {
    if (!user) return;

    try {
      setSaving(true);
      
      // Check if settings already exist for this user
      const { data: existingData, error: fetchError } = await supabase
        .from('ai_settings')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      let saveError;
      
      if (existingData) {
        // Update existing settings
        const { error } = await supabase
          .from('ai_settings')
          .update({
            enabled: settings.enabled,
            api_key: settings.api_key,
            model: settings.model,
            business_context: settings.business_context
          })
          .eq('id', existingData.id);
          
        saveError = error;
      } else {
        // Insert new settings
        const { error } = await supabase
          .from('ai_settings')
          .insert({
            user_id: user.id,
            enabled: settings.enabled,
            api_key: settings.api_key,
            model: settings.model,
            business_context: settings.business_context
          });
          
        saveError = error;
      }

      if (saveError) throw saveError;
      
      // Refresh settings after save
      fetchSettings();
      
      // Show success notification
      showNotification({
        type: 'success',
        title: 'AI Settings Saved',
        message: 'Your AI settings have been updated successfully.'
      });
      
      // Show success message
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving AI settings:', error);
      showNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to save AI settings. Please try again.'
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        <span className="ml-3 text-gray-600">Loading AI settings...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Bot className="h-6 w-6 text-indigo-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">AI Mode Settings</h2>
        </div>
        <button
          onClick={fetchSettings}
          className="text-gray-600 hover:text-gray-900 flex items-center transition-colors"
          title="Refresh settings"
        >
          <RefreshCw className="h-4 w-4 mr-1" />
          Refresh
        </button>
      </div>

      {success && (
        <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-md flex items-start">
          <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm text-green-700 font-medium">AI settings saved successfully!</p>
            <p className="text-xs text-green-600 mt-1">Your widget has been updated with the new AI settings.</p>
          </div>
        </div>
      )}

      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
          <div className="flex items-center">
            <Sparkles className="h-5 w-5 text-indigo-600 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">AI-Powered Responses</h3>
          </div>
          <button
            onClick={handleToggleChange}
            className="flex items-center focus:outline-none"
            aria-pressed={settings.enabled}
            role="switch"
          >
            <span className="mr-2 text-sm font-medium text-gray-700">
              {settings.enabled ? 'Enabled' : 'Disabled'}
            </span>
            {settings.enabled ? (
              <ToggleRight className="h-6 w-6 text-indigo-600" />
            ) : (
              <ToggleLeft className="h-6 w-6 text-gray-400" />
            )}
          </button>
        </div>

        <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded-r-md mb-6">
          <div className="flex">
            <Info className="h-5 w-5 text-indigo-600 mr-2 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-indigo-700">
                When AI Mode is enabled, the widget will use AI to generate responses for messages that don't match any of your auto-replies.
              </p>
              <p className="text-sm text-indigo-700 mt-1">
                If disabled, the default message "Thank you for your message. We'll get back to you as soon as possible." will be shown instead.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <label className="form-label flex items-center">
            <Key className="h-4 w-4 mr-2 text-gray-500" />
            API Key
          </label>
          <input
            type="password"
            name="api_key"
            value={settings.api_key}
            onChange={handleInputChange}
            className="form-input"
            placeholder="Enter your API key"
            disabled={!settings.enabled}
          />
          <p className="mt-1 text-xs text-gray-500">
            Your API key is stored securely and never shared with third parties.
          </p>
        </div>
        
        <div className="mb-6">
          <label className="form-label">
            AI Model
          </label>
          <select
            name="model"
            value={settings.model}
            onChange={handleInputChange}
            className="form-input"
            disabled={!settings.enabled}
          >
            <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
            <option value="gpt-4">GPT-4</option>
            <option value="gpt-4-turbo">GPT-4 Turbo</option>
            <option value="claude-3-haiku">Claude 3 Haiku</option>
            <option value="claude-3-sonnet">Claude 3 Sonnet</option>
            <option value="claude-3-opus">Claude 3 Opus</option>
            <option value="custom">Custom Model</option>
          </select>
          {settings.model === 'custom' && (
            <input
              type="text"
              name="model"
              value={settings.model === 'custom' ? '' : settings.model}
              onChange={handleInputChange}
              className="form-input mt-2"
              placeholder="Enter custom model name"
              disabled={!settings.enabled}
            />
          )}
          <p className="mt-1 text-xs text-gray-500">
            Select the AI model you want to use for generating responses.
          </p>
        </div>
        
        <div className="mb-6">
          <label className="form-label">
            Business Context
          </label>
          <textarea
            name="business_context"
            value={settings.business_context}
            onChange={handleInputChange}
            rows={5}
            className="form-input"
            placeholder="Provide information about your business, products, services, and how you want the AI to respond to customers..."
            disabled={!settings.enabled}
          ></textarea>
          <p className="mt-1 text-xs text-gray-500">
            This information will be used to help the AI generate more accurate and relevant responses for your customers.
          </p>
        </div>
        
        <div className="mt-8">
          <button
            onClick={handleSaveSettings}
            disabled={saving}
            className="btn-primary"
          >
            {saving ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </span>
            ) : (
              <span className="flex items-center">
                <Save className="h-4 w-4 mr-2" />
                Save AI Settings
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Example AI responses section */}
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-medium mb-4 text-gray-900">How AI Mode Works</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-800 mb-2 flex items-center">
              <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
              Without AI Mode
            </h4>
            <div className="bg-gray-50 p-3 rounded-lg mb-3">
              <p className="text-sm text-gray-700">Hi, do you offer international shipping?</p>
            </div>
            <div className="bg-gray-100 p-3 rounded-lg">
              <p className="text-sm text-gray-700">Thank you for your message. We'll get back to you as soon as possible.</p>
              <p className="text-xs text-gray-500 mt-1">Default response when no auto-reply matches</p>
            </div>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-800 mb-2 flex items-center">
              <Sparkles className="h-4 w-4 text-indigo-600 mr-2" />
              With AI Mode
            </h4>
            <div className="bg-gray-50 p-3 rounded-lg mb-3">
              <p className="text-sm text-gray-700">Hi, do you offer international shipping?</p>
            </div>
            <div className="bg-indigo-50 p-3 rounded-lg">
              <p className="text-sm text-indigo-700">Yes, we do offer international shipping to most countries! Shipping costs vary depending on the destination and order size. You can see the exact shipping cost at checkout. Is there a specific country you're asking about?</p>
              <p className="text-xs text-indigo-500 mt-1">AI-generated response based on your business context</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIMode;