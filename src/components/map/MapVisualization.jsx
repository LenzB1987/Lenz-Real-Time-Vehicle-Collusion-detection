// src/components/map/MapVisualization.jsx
import React, { useEffect, useRef, useState } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';

// Since we're not using actual Mapbox API key, we'll create a simulated map visualization
const MapVisualization = ({ events, onEventSelect, selectedEvent }) => {
  const mapContainerRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  
  // This would normally contain the map initialization code with MapboxGL
  useEffect(() => {
    // Simulate map loading delay
    const timer = setTimeout(() => {
      setMapLoaded(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // For simulation, we'll render a simplified map visualization
  const renderSimulatedMap = () => {
    return (
      <div className="relative w-full h-full bg-gray-200 overflow-hidden">
        {/* Simulated map background */}
        <div className="absolute inset-0 bg-gray-100">
          <div className="grid grid-cols-20 grid-rows-20 h-full w-full">
            {Array(400).fill(0).map((_, i) => (
              <div 
                key={i} 
                className="border border-gray-200"
                style={{
                  backgroundColor: i % 7 === 0 ? '#f0f0f0' : i % 13 === 0 ? '#e8e8e8' : 'transparent'
                }}
              ></div>
            ))}
          </div>
          
          {/* Simulated roads */}
          <div className="absolute left-0 top-1/2 w-full h-6 bg-gray-300 transform -translate-y-1/2"></div>
          <div className="absolute left-1/2 top-0 w-6 h-full bg-gray-300 transform -translate-x-1/2"></div>
          <div className="absolute left-1/4 top-0 w-4 h-full bg-gray-300 transform -translate-x-1/2"></div>
          <div className="absolute left-3/4 top-0 w-4 h-full bg-gray-300 transform -translate-x-1/2"></div>
          <div className="absolute left-0 top-1/4 w-full h-4 bg-gray-300 transform -translate-y-1/2"></div>
          <div className="absolute left-0 top-3/4 w-full h-4 bg-gray-300 transform -translate-y-1/2"></div>
        </div>
        
        {/* Event markers */}
        {events.map((event) => {
          // Calculate random positions for demo
          const left = (Math.sin(parseInt(event.id) * 7) * 0.4 + 0.5) * 100;
          const top = (Math.cos(parseInt(event.id) * 13) * 0.4 + 0.5) * 100;
          
          const isSelected = selectedEvent && selectedEvent.id === event.id;
          
          return (
            <div 
              key={event.id}
              className={`absolute w-6 h-6 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center cursor-pointer transition-all duration-200 ${
                isSelected ? 'z-10 scale-150' : 'hover:scale-125'
              }`}
              style={{ left: `${left}%`, top: `${top}%` }}
              onClick={() => onEventSelect(event)}
            >
              <div className={`
                rounded-full w-full h-full flex items-center justify-center
                ${event.severity === 'critical' ? 'bg-red-500' : 
                  event.severity === 'high' ? 'bg-orange-500' : 
                  event.severity === 'medium' ? 'bg-yellow-500' : 
                  'bg-green-500'}
                ${isSelected ? 'ring-4 ring-blue-500 ring-opacity-70' : ''}
              `}>
                <i className="fas fa-car-crash text-white text-xs"></i>
              </div>
              
              {isSelected && (
                <div className="absolute top-full mt-2 bg-white rounded-md shadow-lg p-2 min-w-[200px] z-20">
                  <p className="font-medium text-sm">
                    {event.location.address || 'Unknown location'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(event.timestamp).toLocaleString()}
                  </p>
                  <div className="mt-1 flex items-center">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium
                      ${event.severity === 'critical' ? 'bg-red-100 text-red-800' : 
                        event.severity === 'high' ? 'bg-orange-100 text-orange-800' : 
                        event.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-green-100 text-green-800'}`}>
                      {event.severity.charAt(0).toUpperCase() + event.severity.slice(1)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };
  
  return (
    <div className="h-full w-full" ref={mapContainerRef}>
      {!mapLoaded ? (
        <div className="flex h-full items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading map...</span>
        </div>
      ) : renderSimulatedMap()}
      
      <div className="absolute bottom-4 left-4 bg-white rounded-md shadow-md p-3 z-10">
        <div className="text-xs text-gray-500 mb-2">Event Severity</div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
            <span className="text-xs">Low</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-yellow-500 mr-1"></div>
            <span className="text-xs">Medium</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-orange-500 mr-1"></div>
            <span className="text-xs">High</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
            <span className="text-xs">Critical</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapVisualization;