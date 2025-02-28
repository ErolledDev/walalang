import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

type NotificationType = 'success' | 'error' | 'info' | 'warning';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
}

interface NotificationContextType {
  showNotification: (notification: Omit<Notification, 'id'>) => void;
  hideNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType>({
  showNotification: () => {},
  hideNotification: () => {},
});

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const showNotification = (notification: Omit<Notification, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setNotifications(prev => [...prev, { ...notification, id }]);
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      hideNotification(id);
    }, 5000);
  };

  const hideNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ showNotification, hideNotification }}>
      {children}
      
      {/* Notification container */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 max-w-md w-full">
        {notifications.map(notification => (
          <div 
            key={notification.id}
            className={`flex items-start p-4 rounded-lg shadow-md border animate-fade-in ${
              notification.type === 'success' ? 'bg-green-50 border-green-200' :
              notification.type === 'error' ? 'bg-red-50 border-red-200' :
              notification.type === 'warning' ? 'bg-yellow-50 border-yellow-200' :
              'bg-blue-50 border-blue-200'
            }`}
          >
            <div className="flex-shrink-0 mr-3">
              {notification.type === 'success' && <CheckCircle className="h-5 w-5 text-green-500" />}
              {notification.type === 'error' && <AlertCircle className="h-5 w-5 text-red-500" />}
              {notification.type === 'warning' && <AlertCircle className="h-5 w-5 text-yellow-500" />}
              {notification.type === 'info' && <Info className="h-5 w-5 text-blue-500" />}
            </div>
            <div className="flex-1">
              <h4 className={`text-sm font-medium ${
                notification.type === 'success' ? 'text-green-800' :
                notification.type === 'error' ? 'text-red-800' :
                notification.type === 'warning' ? 'text-yellow-800' :
                'text-blue-800'
              }`}>
                {notification.title}
              </h4>
              <p className={`mt-1 text-sm ${
                notification.type === 'success' ? 'text-green-700' :
                notification.type === 'error' ? 'text-red-700' :
                notification.type === 'warning' ? 'text-yellow-700' :
                'text-blue-700'
              }`}>
                {notification.message}
              </p>
            </div>
            <button 
              onClick={() => hideNotification(notification.id)}
              className={`ml-4 flex-shrink-0 ${
                notification.type === 'success' ? 'text-green-500 hover:text-green-700' :
                notification.type === 'error' ? 'text-red-500 hover:text-red-700' :
                notification.type === 'warning' ? 'text-yellow-500 hover:text-yellow-700' :
                'text-blue-500 hover:text-blue-700'
              }`}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};