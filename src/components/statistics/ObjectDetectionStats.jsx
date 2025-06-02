// src/components/statistics/ObjectDetectionStats.jsx
import React, { useMemo } from 'react';

const ObjectDetectionStats = ({ events, timeRange }) => {
  // Calculate object detection statistics
  const stats = useMemo(() => {
    if (!events || events.length === 0) {
      return {
        totalObjects: 0,
        byType: {},
        byConfidence: {
          high: 0,
          medium: 0,
          low: 0
        }
      };
    }

    // Extract all detected objects from events
    const allObjects = events.flatMap(event => event.objects || []);
    
    // Count objects by type
    const byType = allObjects.reduce((acc, obj) => {
      const type = obj.type || 'unknown';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});
    
    // Count objects by confidence level
    const byConfidence = allObjects.reduce((acc, obj) => {
      const confidence = obj.confidence || 0;
      if (confidence >= 0.85) {
        acc.high++;
      } else if (confidence >= 0.6) {
        acc.medium++;
      } else {
        acc.low++;
      }
      return acc;
    }, { high: 0, medium: 0, low: 0 });
    
    return {
      totalObjects: allObjects.length,
      byType,
      byConfidence
    };
  }, [events]);

  // Get percentage of total for a value
  const getPercentage = (value) => {
    if (!stats.totalObjects) return 0;
    return ((value / stats.totalObjects) * 100).toFixed(1);
  };

  // Prepare data for type chart
  const typeData = Object.entries(stats.byType).sort((a, b) => b[1] - a[1]);
  
  return (
    <div className="flex-grow">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-sm font-medium text-gray-700">Object Detection Summary</h4>
          <div className="text-2xl font-bold text-blue-800">{stats.totalObjects}</div>
        </div>
        <p className="text-xs text-gray-500">
          Total objects detected during {timeRange === 'day' ? 'today' : 
          timeRange === 'week' ? 'this week' : 
          timeRange === 'month' ? 'this month' : 'this year'}
        </p>
      </div>
      
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Detection by Object Type</h4>
        <div className="space-y-2">
          {typeData.length > 0 ? (
            typeData.map(([type, count]) => (
              <div key={type} className="bg-white rounded-md p-2">
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center">
                    <span className={`w-3 h-3 rounded-full mr-2 ${
                      type === 'vehicle' ? 'bg-blue-500' : 
                      type === 'pedestrian' ? 'bg-green-500' : 
                      type === 'animal' ? 'bg-purple-500' : 'bg-gray-500'
                    }`}></span>
                    <span className="text-sm capitalize">{type}</span>
                  </div>
                  <span className="text-sm font-medium">{count} ({getPercentage(count)}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      type === 'vehicle' ? 'bg-blue-500' : 
                      type === 'pedestrian' ? 'bg-green-500' : 
                      type === 'animal' ? 'bg-purple-500' : 'bg-gray-500'
                    }`} 
                    style={{ width: `${getPercentage(count)}%` }}
                  ></div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-gray-500">No object detection data available</div>
          )}
        </div>
      </div>
      
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">Detection by Confidence Level</h4>
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-green-50 rounded-lg p-3 text-center">
            <div className="text-sm text-green-800 font-medium">High</div>
            <div className="text-lg font-bold mt-1 text-green-900">{stats.byConfidence.high}</div>
            <div className="text-xs text-green-700">&gt;85%</div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-3 text-center">
            <div className="text-sm text-yellow-800 font-medium">Medium</div>
            <div className="text-lg font-bold mt-1 text-yellow-900">{stats.byConfidence.medium}</div>
            <div className="text-xs text-yellow-700">60-85%</div>
          </div>
          <div className="bg-red-50 rounded-lg p-3 text-center">
            <div className="text-sm text-red-800 font-medium">Low</div>
            <div className="text-lg font-bold mt-1 text-red-900">{stats.byConfidence.low}</div>
            <div className="text-xs text-red-700">&lt;60%</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ObjectDetectionStats;