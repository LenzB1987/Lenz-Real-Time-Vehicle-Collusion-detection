// src/components/statistics/AccidentStats.jsx
import React, { useMemo } from 'react';

const AccidentStats = ({ events, timeRange }) => {
  // Calculate accident statistics
  const stats = useMemo(() => {
    if (!events || events.length === 0) {
      return {
        totalAccidents: 0,
        critical: 0,
        high: 0,
        medium: 0,
        low: 0,
        byTimeOfDay: {
          morning: 0,    // 6:00 - 12:00
          afternoon: 0,  // 12:00 - 18:00
          evening: 0,    // 18:00 - 22:00
          night: 0       // 22:00 - 6:00
        }
      };
    }
    
    // Only count events marked as accidents (for this demo, we'll consider all critical and high severity events as accidents)
    const accidents = events.filter(event => 
      event.severity === 'critical' || event.severity === 'high'
    );
    
    // Count by severity
    const bySeverity = {
      critical: accidents.filter(e => e.severity === 'critical').length,
      high: accidents.filter(e => e.severity === 'high').length,
      medium: accidents.filter(e => e.severity === 'medium').length,
      low: accidents.filter(e => e.severity === 'low').length
    };
    
    // Count by time of day
    const byTimeOfDay = accidents.reduce((acc, event) => {
      const hour = new Date(event.timestamp).getHours();
      if (hour >= 6 && hour < 12) {
        acc.morning++;
      } else if (hour >= 12 && hour < 18) {
        acc.afternoon++;
      } else if (hour >= 18 && hour < 22) {
        acc.evening++;
      } else {
        acc.night++;
      }
      return acc;
    }, { morning: 0, afternoon: 0, evening: 0, night: 0 });
    
    return {
      totalAccidents: accidents.length,
      ...bySeverity,
      byTimeOfDay
    };
  }, [events]);

  const renderTimeOfDayBar = () => {
    const total = stats.byTimeOfDay.morning + stats.byTimeOfDay.afternoon + 
                  stats.byTimeOfDay.evening + stats.byTimeOfDay.night;
    
    if (total === 0) return null;
    
    const getWidth = (value) => ((value / total) * 100).toFixed(2) + '%';
    
    return (
      <div className="w-full h-5 bg-gray-200 rounded-full overflow-hidden flex">
        <div 
          className="h-full bg-yellow-500" 
          style={{ width: getWidth(stats.byTimeOfDay.morning) }}
          title={`Morning: ${stats.byTimeOfDay.morning}`}
        ></div>
        <div 
          className="h-full bg-blue-500" 
          style={{ width: getWidth(stats.byTimeOfDay.afternoon) }}
          title={`Afternoon: ${stats.byTimeOfDay.afternoon}`}
        ></div>
        <div 
          className="h-full bg-orange-500" 
          style={{ width: getWidth(stats.byTimeOfDay.evening) }}
          title={`Evening: ${stats.byTimeOfDay.evening}`}
        ></div>
        <div 
          className="h-full bg-indigo-800" 
          style={{ width: getWidth(stats.byTimeOfDay.night) }}
          title={`Night: ${stats.byTimeOfDay.night}`}
        ></div>
      </div>
    );
  };

  return (
    <div className="flex-grow">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-sm font-medium text-gray-700">Accident Summary</h4>
          <div className="text-2xl font-bold text-red-800">{stats.totalAccidents}</div>
        </div>
        <p className="text-xs text-gray-500">
          Total accidents recorded during {timeRange === 'day' ? 'today' : 
          timeRange === 'week' ? 'this week' : 
          timeRange === 'month' ? 'this month' : 'this year'}
        </p>
      </div>
      
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Severity Breakdown</h4>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-red-50 rounded-lg p-3">
            <div className="text-sm text-red-800 font-medium">Critical</div>
            <div className="text-xl font-bold mt-1 text-red-900">{stats.critical}</div>
          </div>
          <div className="bg-orange-50 rounded-lg p-3">
            <div className="text-sm text-orange-800 font-medium">High</div>
            <div className="text-xl font-bold mt-1 text-orange-900">{stats.high}</div>
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Time of Day Distribution</h4>
        {stats.totalAccidents > 0 ? (
          <>
            {renderTimeOfDayBar()}
            <div className="grid grid-cols-4 mt-2 text-center">
              <div className="text-xs text-yellow-600">Morning</div>
              <div className="text-xs text-blue-600">Afternoon</div>
              <div className="text-xs text-orange-600">Evening</div>
              <div className="text-xs text-indigo-700">Night</div>
            </div>
            
            <div className="grid grid-cols-4 mt-1 text-center">
              <div className="text-xs font-medium">{stats.byTimeOfDay.morning}</div>
              <div className="text-xs font-medium">{stats.byTimeOfDay.afternoon}</div>
              <div className="text-xs font-medium">{stats.byTimeOfDay.evening}</div>
              <div className="text-xs font-medium">{stats.byTimeOfDay.night}</div>
            </div>
          </>
        ) : (
          <div className="text-center py-4 text-gray-500">No accident data available</div>
        )}
      </div>
      
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2">Safety Tips</h4>
        <ul className="text-xs text-gray-600 space-y-1">
          <li className="flex">
            <i className="fas fa-check-circle text-green-500 mr-2 mt-0.5"></i>
            <span>Maintain safe following distances, especially at night</span>
          </li>
          <li className="flex">
            <i className="fas fa-check-circle text-green-500 mr-2 mt-0.5"></i>
            <span>Reduce speed during peak accident hours (evening)</span>
          </li>
          <li className="flex">
            <i className="fas fa-check-circle text-green-500 mr-2 mt-0.5"></i>
            <span>Take extra caution at known accident hotspots</span>
          </li>
          <li className="flex">
            <i className="fas fa-check-circle text-green-500 mr-2 mt-0.5"></i>
            <span>Always wear seatbelts and ensure proper vehicle maintenance</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AccidentStats;