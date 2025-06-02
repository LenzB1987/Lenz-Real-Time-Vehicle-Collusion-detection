// src/components/dashboard/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import MapVisualization from '../map/MapVisualization';
import StatisticsPanel from '../statistics/StatisticsPanel';
import { getLatestEvents } from '../../services/eventService';

const Dashboard = () => {
  const [collisionEvents, setCollisionEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [timeRange, setTimeRange] = useState('day'); // day, week, month, year
  
  useEffect(() => {
    const fetchCollisionEvents = async () => {
      setLoading(true);
      try {
        const events = await getLatestEvents(timeRange);
        setCollisionEvents(events);
        setError('');
      } catch (err) {
        console.error('Failed to fetch collision events:', err);
        setError('Failed to load collision events. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCollisionEvents();
    
    // Set up periodic refresh
    const intervalId = setInterval(fetchCollisionEvents, 60000); // Refresh every minute
    
    return () => clearInterval(intervalId);
  }, [timeRange]);
  
  const handleEventSelect = (event) => {
    setSelectedEvent(event);
  };
  
  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
  };
  
  return (
    <div className="flex flex-col h-full">
      {error && (
        <div className="bg-red-50 text-red-800 p-3 rounded-md mb-4 flex items-start">
          <i className="fas fa-exclamation-circle mt-1 mr-2"></i>
          <span>{error}</span>
          <button 
            className="ml-auto text-red-600 hover:text-red-800"
            onClick={() => setError('')}
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
      )}
      
      {/* Time range selector */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">Collision Events Overview</h2>
          <div className="flex space-x-2">
            <button 
              onClick={() => handleTimeRangeChange('day')}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                timeRange === 'day' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Today
            </button>
            <button 
              onClick={() => handleTimeRangeChange('week')}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                timeRange === 'week' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Week
            </button>
            <button 
              onClick={() => handleTimeRangeChange('month')}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                timeRange === 'month' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Month
            </button>
            <button 
              onClick={() => handleTimeRangeChange('year')}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                timeRange === 'year' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Year
            </button>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4 flex-grow">
        {/* Map visualization - takes 2/3 of the space on large screens */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm overflow-hidden h-[500px]">
          {loading ? (
            <div className="flex h-full items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <MapVisualization 
              events={collisionEvents} 
              onEventSelect={handleEventSelect}
              selectedEvent={selectedEvent}
            />
          )}
        </div>
        
        {/* Statistics panel - takes 1/3 of the space on large screens */}
        <div className="bg-white rounded-lg shadow-sm p-4 overflow-y-auto h-[500px]">
          <StatisticsPanel 
            events={collisionEvents} 
            timeRange={timeRange}
            loading={loading}
          />
        </div>
      </div>
      
      {/* Selected event details or recent events list */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          {selectedEvent ? 'Event Details' : 'Recent Events'}
        </h2>
        
        {selectedEvent ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <h3 className="text-md font-medium text-gray-700">Basic Information</h3>
              <div className="mt-2">
                <p><span className="font-medium">Time:</span> {new Date(selectedEvent.timestamp).toLocaleString()}</p>
                <p><span className="font-medium">Location:</span> {selectedEvent.location.address || 'Unknown location'}</p>
                <p><span className="font-medium">Severity:</span> 
                  <span className={`ml-1 px-2 py-1 rounded-full text-xs font-medium
                    ${selectedEvent.severity === 'critical' ? 'bg-red-100 text-red-800' : 
                      selectedEvent.severity === 'high' ? 'bg-orange-100 text-orange-800' : 
                      selectedEvent.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-green-100 text-green-800'}`}>
                    {selectedEvent.severity.charAt(0).toUpperCase() + selectedEvent.severity.slice(1)}
                  </span>
                </p>
                <p><span className="font-medium">Status:</span> {selectedEvent.status}</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-md font-medium text-gray-700">Detected Objects</h3>
              <ul className="mt-2 space-y-1">
                {selectedEvent.objects.map((obj, index) => (
                  <li key={index} className="flex items-center">
                    <span className={`w-3 h-3 rounded-full mr-2
                      ${obj.type === 'vehicle' ? 'bg-blue-500' : 
                        obj.type === 'pedestrian' ? 'bg-green-500' : 
                        obj.type === 'animal' ? 'bg-purple-500' : 'bg-gray-500'}`}>
                    </span>
                    {obj.type} {obj.subType && `(${obj.subType})`} - {Math.round(obj.confidence * 100)}% confidence
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-md font-medium text-gray-700">Distances</h3>
              <ul className="mt-2 space-y-1">
                {selectedEvent.distances.map((dist, index) => {
                  const obj1 = selectedEvent.objects.find(o => o.id === dist.objectId1);
                  const obj2 = selectedEvent.objects.find(o => o.id === dist.objectId2);
                  return (
                    <li key={index} className="flex items-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium mr-2
                        ${dist.status === 'critical' ? 'bg-red-100 text-red-800' : 
                          dist.status === 'warning' ? 'bg-orange-100 text-orange-800' : 
                          'bg-green-100 text-green-800'}`}>
                        {dist.status}
                      </span>
                      {obj1?.type || 'Object 1'} to {obj2?.type || 'Object 2'}: {dist.distance.toFixed(1)}m
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Severity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Objects</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-600"></div>
                      </div>
                    </td>
                  </tr>
                ) : collisionEvents.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 whitespace-nowrap text-center text-gray-500">
                      No collision events found
                    </td>
                  </tr>
                ) : (
                  collisionEvents.slice(0, 5).map((event) => (
                    <tr 
                      key={event.id} 
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleEventSelect(event)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(event.timestamp).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {event.location.address || 'Unknown location'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                          ${event.severity === 'critical' ? 'bg-red-100 text-red-800' : 
                            event.severity === 'high' ? 'bg-orange-100 text-orange-800' : 
                            event.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-green-100 text-green-800'}`}>
                          {event.severity.charAt(0).toUpperCase() + event.severity.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {event.objects.length} objects detected
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button 
                          className="text-blue-600 hover:text-blue-900 mr-3"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEventSelect(event);
                          }}
                        >
                          <i className="fas fa-eye"></i> View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;