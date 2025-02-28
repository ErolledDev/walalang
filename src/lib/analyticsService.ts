import { supabase } from './supabase';

// Types for analytics data
export interface ChatSession {
  id: string;
  timestamp: string;
  visitorInfo: {
    name?: string;
    email?: string;
    ipAddress?: string;
    userAgent?: string;
    referrer?: string;
  };
  messages: {
    id: string;
    content: string;
    sender: 'user' | 'bot';
    timestamp: string;
  }[];
}

// Generate a unique ID for sessions
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Get visitor IP address (this will be limited by browser security)
const getIpAddress = async (): Promise<string | undefined> => {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error('Failed to get IP address:', error);
    return undefined;
  }
};

// Get all chat sessions from localStorage
export const getChatSessions = (): ChatSession[] => {
  try {
    const sessions = localStorage.getItem('widget_chat_sessions');
    return sessions ? JSON.parse(sessions) : [];
  } catch (error) {
    console.error('Error retrieving chat sessions:', error);
    return [];
  }
};

// Start a new chat session
export const startChatSession = async (): Promise<ChatSession> => {
  const ipAddress = await getIpAddress();
  
  const newSession: ChatSession = {
    id: generateId(),
    timestamp: new Date().toISOString(),
    visitorInfo: {
      ipAddress,
      userAgent: navigator.userAgent,
      referrer: document.referrer
    },
    messages: []
  };
  
  // Save to localStorage
  const sessions = getChatSessions();
  localStorage.setItem('widget_chat_sessions', JSON.stringify([...sessions, newSession]));
  
  return newSession;
};

// Get current active session or create a new one
export const getCurrentSession = async (): Promise<ChatSession> => {
  const sessions = getChatSessions();
  const currentSession = sessions[sessions.length - 1];
  
  if (!currentSession) {
    return startChatSession();
  }
  
  return currentSession;
};

// Add a message to the current session
export const addMessageToSession = async (
  content: string, 
  sender: 'user' | 'bot'
): Promise<void> => {
  const session = await getCurrentSession();
  const sessions = getChatSessions();
  
  const message = {
    id: generateId(),
    content,
    sender,
    timestamp: new Date().toISOString()
  };
  
  session.messages.push(message);
  
  // Update the session in localStorage
  const updatedSessions = sessions.map(s => 
    s.id === session.id ? session : s
  );
  
  localStorage.setItem('widget_chat_sessions', JSON.stringify(updatedSessions));
};

// Update visitor information
export const updateVisitorInfo = async (
  name?: string,
  email?: string
): Promise<void> => {
  const session = await getCurrentSession();
  const sessions = getChatSessions();
  
  session.visitorInfo = {
    ...session.visitorInfo,
    name,
    email
  };
  
  // Update the session in localStorage
  const updatedSessions = sessions.map(s => 
    s.id === session.id ? session : s
  );
  
  localStorage.setItem('widget_chat_sessions', JSON.stringify(updatedSessions));
};

// Sync sessions with database if user is authenticated
export const syncSessionsWithDatabase = async (userId: string): Promise<void> => {
  try {
    const sessions = getChatSessions();
    
    // Only proceed if there are sessions to sync
    if (sessions.length === 0) return;
    
    // For each session, try to save to database
    for (const session of sessions) {
      try {
        // First create the analytics entry
        const { data: analyticsData, error: analyticsError } = await supabase
          .from('chat_analytics')
          .insert({
            user_id: userId,
            visitor_name: session.visitorInfo.name || 'Anonymous',
            visitor_email: session.visitorInfo.email || 'anonymous@example.com',
            ip_address: session.visitorInfo.ipAddress,
            timestamp: session.timestamp
          })
          .select();
          
        if (analyticsError) throw analyticsError;
        
        if (analyticsData && analyticsData[0]) {
          const analyticsId = analyticsData[0].id;
          
          // Then save all messages
          for (const message of session.messages) {
            await supabase
              .from('chat_messages')
              .insert({
                analytics_id: analyticsId,
                message: message.content,
                sender: message.sender,
                timestamp: message.timestamp
              });
          }
        }
      } catch (error) {
        console.error('Error syncing session to database:', error);
        // Continue with next session even if this one fails
      }
    }
    
    // Clear localStorage after successful sync
    // localStorage.removeItem('widget_chat_sessions');
    // Note: Commented out to keep local copy as backup
  } catch (error) {
    console.error('Error in syncSessionsWithDatabase:', error);
  }
};

// Get analytics data for dashboard
export const getAnalyticsData = async (): Promise<{
  totalSessions: number;
  totalMessages: number;
  averageMessagesPerSession: number;
  sessions: ChatSession[];
}> => {
  const sessions = getChatSessions();
  
  const totalSessions = sessions.length;
  const totalMessages = sessions.reduce(
    (total, session) => total + session.messages.length, 
    0
  );
  const averageMessagesPerSession = totalSessions > 0 
    ? totalMessages / totalSessions 
    : 0;
  
  return {
    totalSessions,
    totalMessages,
    averageMessagesPerSession,
    sessions
  };
};