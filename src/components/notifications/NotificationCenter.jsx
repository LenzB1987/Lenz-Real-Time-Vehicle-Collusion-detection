// src/components/notifications/NotificationCenter.jsx
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../auth/AuthContext';
import { getNotifications, markNotificationAsRead } from '../../services/notificationService';

const NotificationCenter = () => {
  const { currentUser } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // all, unread, critical
  
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!currentUser) return;
      
      try {
        setLoading(true);
        const fetchedNotifications = await getNotifications(currentUser.id);
        setNotifications(fetchedNotifications);
        setError('');
      } catch (err) {
        console.error('Failed to fetch notifications:', err);
        setError('Failed to load notifications');
      } finally {
        setLoading(false);
      }
    };
    
    fetchNotifications();
    
    // Set up polling for new notifications (every 30 seconds)
    const intervalId = setInterval(fetchNotifications, 30000);
    
    return () => clearInterval(intervalId);
  }, [currentUser]);
  
  const handleMarkAsRead = async (notificationId) => {
    try {
      await markNotificationAsRead(notificationId);
      setNotifications(prevNotifications => 
        prevNotifications.map(notification => 
          notification.id === notificationId 
            ? { ...notification, read: true } 
            : notification
        )
      );
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };
  
  const handleMarkAllAsRead = async () => {
    try {
      const unreadIds = notifications
        .filter(n => !n.read)
        .map(n => n.id);
      
      if (unreadIds.length === 0) return;
      
      // Mark all as read in the backend
      await Promise.all(unreadIds.map(id => markNotificationAsRead(id)));
      
      // Update local state
      setNotifications(prevNotifications => 
        prevNotifications.map(notification => ({ ...notification, read: true }))
      );
    } catch (err) {
      console.error('Failed to mark all notifications as read:', err);
    }
  };
  
  const filterNotifications = () => {
    if (activeTab === 'unread') {
      return notifications.filter(notification => !notification.read);
    }
    if (activeTab === 'critical') {
      return notifications.filter(notification => notification.priority === 'critical');
    }
    return notifications;
  };
  
  const filteredNotifications = filterNotifications();
  const unreadCount = notifications.filter(notification => !notification.read).length;
  
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'collision':
        return <i className="fas fa-car-crash text-red-500"></i>;
      case 'system':
        return <i className="fas fa-cog text-blue-500"></i>;
      case 'message':
        return <i className="fas fa-envelope text-green-500"></i>;
      case 'alert':
        return <i className="fas fa-exclamation-triangle text-yellow-500"></i>;
      default:
        return <i className="fas fa-bell text-gray-500"></i>;
    }
  };
  
  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return '';
    
    const now = new Date();
    const notifTime = new Date(timestamp);
    const diffMs = now - notifTime;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };
  
  return (
    <div className="w-full bg-white rounded-md shadow-lg overflow-hidden divide-y divide-gray-200">
      <div className="px-4 py-3 bg-gray-50">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-lg font-medium text-gray-900">Notifications</h3>
          {unreadCount > 0 && (
            <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">
              {unreadCount} new
            </span>
          )}
        </div>
        
        <div className="flex space-x-2">
          <button 
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1 text-sm rounded-md ${
              activeTab === 'all' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          <button 
            onClick={() => setActiveTab('unread')}
            className={`px-3 py-1 text-sm rounded-md ${
              activeTab === 'unread' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Unread
          </button>
          <button 
            onClick={() => setActiveTab('critical')}
            className={`px-3 py-1 text-sm rounded-md ${
              activeTab === 'critical' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Critical
          </button>
          
          <button 
            onClick={handleMarkAllAsRead}
            className="ml-auto text-sm text-blue-600 hover:text-blue-800"
          >
            Mark all as read
          </button>
        </div>
      </div>
      
      <div className="max-h-80 overflow-y-auto">
        {loading ? (
          <div className="p-4 text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-500">Loading notifications...</p>
          </div>
        ) : error ? (
          <div className="p-4 text-center text-red-500">
            <i className="fas fa-exclamation-circle mr-2"></i>
            {error}
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            <i className="fas fa-check-circle text-3xl mb-2"></i>
            <p>No {activeTab === 'unread' ? 'unread ' : activeTab === 'critical' ? 'critical ' : ''}notifications</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {filteredNotifications.map(notification => (
              <li 
                key={notification.id}
                className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                  !notification.read ? 'bg-blue-50' : ''
                }`}
                onClick={() => handleMarkAsRead(notification.id)}
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-3">
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div className="flex-grow">
                    <div className="flex items-start justify-between">
                      <p className={`text-sm font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                        {notification.title}
                      </p>
                      <span className="text-xs text-gray-500 ml-2">
                        {formatTimeAgo(notification.timestamp)}
                      </span>
                    </div>
                    
                    <p className={`text-sm ${!notification.read ? 'text-gray-800' : 'text-gray-600'}`}>
                      {notification.message}
                    </p>
                    
                    {notification.priority === 'critical' && (
                      <span className="mt-1 inline-block px-2 py-0.5 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                        Critical
                      </span>
                    )}
                  </div>
                  
                  {!notification.read && (
                    <div className="ml-2 w-2 h-2 bg-blue-600 rounded-full"></div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      <div className="px-4 py-3 bg-gray-50 text-center border-t border-gray-200">
        <a 
          href="#" 
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          View all notifications
        </a>
      </div>
    </div>
  );
};

export default NotificationCenter;