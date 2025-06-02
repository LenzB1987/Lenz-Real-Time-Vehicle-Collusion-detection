// src/services/eventService.js
/**
 * Event Service for UgandaSafe Dashboard
 * Handles collision events, statistics, and related data operations
 */

import { getStoredData, setStoredData } from '../utils/localStorage';

const EVENTS_KEY = 'ugandaSafe_events';

/**
 * Gets the latest collision events based on time range
 * 
 * @param {string} timeRange Time range to filter events (day, week, month, year)
 * @returns {Promise<Array>} List of collision events
 */
export const getLatestEvents = async (timeRange = 'day') => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 700));
  
  // Get all events from storage
  const events = getStoredData(EVENTS_KEY) || [];
  
  if (events.length === 0) {
    return [];
  }
  
  // Filter events by time range
  const now = new Date();
  let cutoffDate;
  
  switch (timeRange) {
    case 'day':
      cutoffDate = new Date(now.setHours(0, 0, 0, 0));
      break;
    case 'week':
      cutoffDate = new Date(now.setDate(now.getDate() - 7));
      break;
    case 'month':
      cutoffDate = new Date(now.setMonth(now.getMonth() - 1));
      break;
    case 'year':
      cutoffDate = new Date(now.setFullYear(now.getFullYear() - 1));
      break;
    default:
      cutoffDate = new Date(0); // Return all events
  }
  
  // Sort by timestamp descending (newest first)
  return events
    .filter(event => new Date(event.timestamp) >= cutoffDate)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};

/**
 * Gets a specific collision event by ID
 * 
 * @param {string} eventId The ID of the collision event to retrieve
 * @returns {Promise<Object>} The collision event
 */
export const getEventById = async (eventId) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Get all events
  const events = getStoredData(EVENTS_KEY) || [];
  
  // Find the requested event
  const event = events.find(e => e.id === eventId);
  
  if (!event) {
    throw new Error('Event not found');
  }
  
  return event;
};

/**
 * Gets collision event statistics
 * 
 * @param {string} timeRange Time range to calculate statistics for (day, week, month, year)
 * @returns {Promise<Object>} Statistics summary
 */
export const getEventStatistics = async (timeRange = 'month') => {
  // Get latest events based on time range
  const events = await getLatestEvents(timeRange);
  
  // Initialize statistics
  const stats = {
    total: events.length,
    bySeverity: {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0
    },
    byTimeOfDay: {
      morning: 0,    // 6:00 - 12:00
      afternoon: 0,  // 12:00 - 18:00
      evening: 0,    // 18:00 - 22:00
      night: 0       // 22:00 - 6:00
    },
    objectTypes: {},
    locationClusters: [],
    recentTrend: []
  };
  
  // Calculate statistics from events
  events.forEach(event => {
    // Count by severity
    if (event.severity) {
      stats.bySeverity[event.severity] = (stats.bySeverity[event.severity] || 0) + 1;
    }
    
    // Count by time of day
    const hour = new Date(event.timestamp).getHours();
    if (hour >= 6 && hour < 12) {
      stats.byTimeOfDay.morning++;
    } else if (hour >= 12 && hour < 18) {
      stats.byTimeOfDay.afternoon++;
    } else if (hour >= 18 && hour < 22) {
      stats.byTimeOfDay.evening++;
    } else {
      stats.byTimeOfDay.night++;
    }
    
    // Count object types
    if (event.objects && Array.isArray(event.objects)) {
      event.objects.forEach(obj => {
        const type = obj.type || 'unknown';
        stats.objectTypes[type] = (stats.objectTypes[type] || 0) + 1;
      });
    }
  });
  
  // Generate trend data (daily count for past 10 days)
  const trendDays = 10;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  for (let i = trendDays - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + 1);
    
    const count = events.filter(e => {
      const eventDate = new Date(e.timestamp);
      return eventDate >= date && eventDate < nextDate;
    }).length;
    
    stats.recentTrend.push({
      date: date.toISOString().split('T')[0],
      count
    });
  }
  
  return stats;
};

/**
 * Gets object detection statistics
 * 
 * @param {string} timeRange Time range to calculate statistics for (day, week, month, year)
 * @returns {Promise<Object>} Object detection statistics
 */
export const getObjectDetectionStats = async (timeRange = 'month') => {
  // Get latest events based on time range
  const events = await getLatestEvents(timeRange);
  
  // Initialize statistics
  const stats = {
    totalObjects: 0,
    byType: {},
    byConfidence: {
      high: 0,   // 85-100%
      medium: 0, // 60-85%
      low: 0     // <60%
    }
  };
  
  // Extract all objects from events
  const allObjects = [];
  events.forEach(event => {
    if (event.objects && Array.isArray(event.objects)) {
      allObjects.push(...event.objects);
    }
  });
  
  // Update statistics
  stats.totalObjects = allObjects.length;
  
  // Count by type
  allObjects.forEach(obj => {
    const type = obj.type || 'unknown';
    stats.byType[type] = (stats.byType[type] || 0) + 1;
    
    // Count by confidence
    const confidence = obj.confidence || 0;
    if (confidence >= 0.85) {
      stats.byConfidence.high++;
    } else if (confidence >= 0.6) {
      stats.byConfidence.medium++;
    } else {
      stats.byConfidence.low++;
    }
  });
  
  return stats;
};

/**
 * Gets accident statistics
 * 
 * @param {string} timeRange Time range to calculate statistics for (day, week, month, year)
 * @returns {Promise<Object>} Accident statistics
 */
export const getAccidentStats = async (timeRange = 'month') => {
  // Get latest events based on time range
  const events = await getLatestEvents(timeRange);
  
  // Filter to only critical and high severity events (considered as accidents)
  const accidents = events.filter(
    event => event.severity === 'critical' || event.severity === 'high'
  );
  
  // Initialize statistics
  const stats = {
    totalAccidents: accidents.length,
    critical: accidents.filter(e => e.severity === 'critical').length,
    high: accidents.filter(e => e.severity === 'high').length,
    medium: 0,
    low: 0,
    byTimeOfDay: {
      morning: 0,    // 6:00 - 12:00
      afternoon: 0,  // 12:00 - 18:00
      evening: 0,    // 18:00 - 22:00
      night: 0       // 22:00 - 6:00
    }
  };
  
  // Calculate statistics from accidents
  accidents.forEach(accident => {
    // Count by time of day
    const hour = new Date(accident.timestamp).getHours();
    if (hour >= 6 && hour < 12) {
      stats.byTimeOfDay.morning++;
    } else if (hour >= 12 && hour < 18) {
      stats.byTimeOfDay.afternoon++;
    } else if (hour >= 18 && hour < 22) {
      stats.byTimeOfDay.evening++;
    } else {
      stats.byTimeOfDay.night++;
    }
  });
  
  return stats;
};

/**
 * Adds a new collision event to the system
 * 
 * @param {Object} eventData The collision event data
 * @returns {Promise<Object>} The newly created event
 */
export const addEvent = async (eventData) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Get existing events
  const events = getStoredData(EVENTS_KEY) || [];
  
  // Create new event with unique ID
  const newEvent = {
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
    ...eventData
  };
  
  // Store updated events
  setStoredData(EVENTS_KEY, [newEvent, ...events]);
  
  return newEvent;
};

/**
 * Initialize events store with sample data if empty
 */
export const initializeEventStore = () => {
  const events = getStoredData(EVENTS_KEY);
  
  // Only initialize if no events exist
  if (!events || events.length === 0) {
    // We'll use generated mock data, so no need to set default events here
    setStoredData(EVENTS_KEY, []);
  }
};