// src/services/notificationService.js
/**
 * Notification Service for UgandaSafe Dashboard
 * Handles notification management, retrieval, and updates
 */

import { getStoredData, setStoredData } from '../utils/localStorage';

const NOTIFICATIONS_KEY = 'ugandaSafe_notifications';

/**
 * Gets notifications for a specific user
 * 
 * @param {string} userId User ID to get notifications for
 * @returns {Promise<Array>} List of notifications
 */
export const getNotifications = async (userId) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Get all notifications
  const notifications = getStoredData(NOTIFICATIONS_KEY) || [];
  
  // Filter for the specified user or general notifications (null userId)
  return notifications
    .filter(notification => 
      notification.userId === userId || notification.userId === null || notification.userId === undefined
    )
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};

/**
 * Marks a notification as read
 * 
 * @param {string} notificationId Notification ID to mark as read
 * @returns {Promise<void>}
 */
export const markNotificationAsRead = async (notificationId) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Get all notifications
  const notifications = getStoredData(NOTIFICATIONS_KEY) || [];
  
  // Update the specified notification
  const updatedNotifications = notifications.map(notification => {
    if (notification.id === notificationId) {
      return { ...notification, read: true };
    }
    return notification;
  });
  
  // Store updated notifications
  setStoredData(NOTIFICATIONS_KEY, updatedNotifications);
};

/**
 * Creates a new notification
 * 
 * @param {Object} notificationData Notification data
 * @returns {Promise<Object>} The created notification
 */
export const createNotification = async (notificationData) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 400));
  
  // Get existing notifications
  const notifications = getStoredData(NOTIFICATIONS_KEY) || [];
  
  // Create notification with unique ID
  const newNotification = {
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
    read: false,
    ...notificationData
  };
  
  // Store updated notifications
  setStoredData(NOTIFICATIONS_KEY, [newNotification, ...notifications]);
  
  return newNotification;
};

/**
 * Deletes a notification
 * 
 * @param {string} notificationId Notification ID to delete
 * @returns {Promise<void>}
 */
export const deleteNotification = async (notificationId) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Get all notifications
  const notifications = getStoredData(NOTIFICATIONS_KEY) || [];
  
  // Filter out the notification to delete
  const updatedNotifications = notifications.filter(
    notification => notification.id !== notificationId
  );
  
  // Store updated notifications
  setStoredData(NOTIFICATIONS_KEY, updatedNotifications);
};

/**
 * Marks all notifications as read for a specific user
 * 
 * @param {string} userId User ID
 * @returns {Promise<void>}
 */
export const markAllNotificationsAsRead = async (userId) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Get all notifications
  const notifications = getStoredData(NOTIFICATIONS_KEY) || [];
  
  // Update notifications for the specified user
  const updatedNotifications = notifications.map(notification => {
    if (notification.userId === userId) {
      return { ...notification, read: true };
    }
    return notification;
  });
  
  // Store updated notifications
  setStoredData(NOTIFICATIONS_KEY, updatedNotifications);
};

/**
 * Creates a collision event notification for user(s)
 * 
 * @param {Object} eventData Collision event data
 * @param {Array<string>|null} userIds User IDs to notify (null for everyone)
 * @returns {Promise<Object>} Created notification
 */
export const createCollisionEventNotification = async (eventData, userIds = null) => {
  // Generate notification data from event
  const notification = {
    title: `New ${eventData.severity || ''} collision event detected`,
    message: eventData.location?.address 
      ? `Collision detected near ${eventData.location.address}` 
      : 'New collision event detected',
    type: 'collision',
    priority: eventData.severity === 'critical' ? 'critical' : 'normal',
    userId: null, // null means notification is for everyone
    timestamp: new Date().toISOString(),
    read: false,
    data: {
      eventId: eventData.id,
      severity: eventData.severity
    }
  };
  
  return createNotification(notification);
};

/**
 * Initializes notification service with sample data if empty
 */
export const initializeNotificationService = () => {
  const notifications = getStoredData(NOTIFICATIONS_KEY);
  
  // Only initialize if no notifications exist
  if (!notifications || notifications.length === 0) {
    // Create default notifications
    const defaultNotifications = [
      {
        id: '1',
        title: 'Welcome to UgandaSafe',
        message: 'Welcome to the Road Collision Detection Dashboard. Get started by exploring the map.',
        type: 'system',
        priority: 'normal',
        userId: null, // for all users
        timestamp: new Date().toISOString(),
        read: false
      }
    ];
    
    setStoredData(NOTIFICATIONS_KEY, defaultNotifications);
  }
};