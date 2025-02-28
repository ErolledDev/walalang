import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
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

  const showNotification = useCallback((notification: Omit<Notification, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setNotifications(prev => [...prev, { ...notification, id }]);
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      hideNotification(id);
    }, 5000);
  }, []);

  const hideNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const getNotificationStyles = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          text: 'text-green-800',
          textLight: 'text-green-700',
          icon: <CheckCircle className="h-5 w-5 text-green-500" />
        };
      case 'error':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          text: 'text-red-800',
          textLight: 'text-red-700',
          icon: <AlertCircle className="h-5 w-5 text-red-500" />
        };
      case 'warning':
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          text: 'text-yellow-800',
          textLight: 'text-yellow-700',
          icon: <AlertCircle className="h-5 w-5 text-yellow-500" />
        };
      default:
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          text: 'text-blue-800',
          textLight: 'text-blue-700',
          icon: <Info className="h-5 w-5 text-blue-500" />
        };
    }
  };

  return (
    <NotificationContext.Provider value={{ showNotification, hideNotification }}>
      {children}
      
      {/* Notification container */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 max-w-md w-full">
        {notifications.map(notification => {
          const styles = getNotificationStyles(notification.type);
          
          return (
            <div 
              key={notification.id}
              className={`flex items-start p-4 rounded-lg shadow-md border animate-fade-in ${styles.bg} ${styles.border}`}
            >
              <div className="flex-shrink-0 mr-3">
                {styles.icon}
              </div>
              <div className="flex-1">
                <h4 className={`text-sm font-medium ${styles.text}`}>
                  {notification.title}
                </h4>
                <p className={`mt-1 text-sm ${styles.textLight}`}>
                  {notification.message}
                </p>
              </div>
              <button 
                onClick={() => hideNotification(notification.id)}
                className={`ml-4 flex-shrink-0 text-${notification.type === 'info' ? 'blue' : notification.type}-500 hover:text-${notification.type === 'info' ? 'blue' : notification.type}-700`}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </NotificationContext.Provider>
  );
};