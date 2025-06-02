// src/components/statistics/StatisticsPanel.jsx
import React, { useState } from 'react';
import ObjectDetectionStats from './ObjectDetectionStats';
import AccidentStats from './AccidentStats';

const StatisticsPanel = ({ events, timeRange, loading }) => {
  const [activeTab, setActiveTab] = useState('overview');
  
  const getTabClass = (tab) => {
    return `px-4 py-2 text-sm font-medium rounded-md cursor-pointer
      ${activeTab === tab 
        ? 'bg-blue-600 text-white' 
        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`;
  };
  
  // Get summary statistics from events
  const getOverviewStats = () => {
    if (!events?.length) return { total: 0, critical: 0, high: 0, medium: 0, low: 0 };
    
    return {
      total: events.length,
      critical: events.filter(e => e.severity === 'critical').length,
      high: events.filter(e => e.severity === 'high').length,
      medium: events.filter(e => e.severity === 'medium').length,
      low: events.filter(e => e.severity === 'low').length
    };
  };
  
  const overviewStats = getOverviewStats();
  
  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Statistics</h3>
        <div className="text-sm text-gray-500">
          {timeRange === 'day' ? 'Today' :
           timeRange === 'week' ? 'This Week' :
           timeRange === 'month' ? 'This Month' : 'This Year'}
        </div>
      </div>
      
      <div className="flex space-x-2 mb-4">
        <button 
          className={getTabClass('overview')}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={getTabClass('objects')}
          onClick={() => setActiveTab('objects')}
        >
          Objects
        </button>
        <button 
          className={getTabClass('accidents')}
          onClick={() => setActiveTab('accidents')}
        >
          Accidents
        </button>
      </div>
      
      {loading ? (
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading statistics...</span>
        </div>
      ) : (
        <>
          {activeTab === 'overview' && (
            <div className="flex-grow">
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="text-sm text-blue-800 font-medium">Total Events</div>
                  <div className="text-2xl font-bold mt-1 text-blue-900">{overviewStats.total}</div>
                </div>
                <div className="bg-red-50 rounded-lg p-3">
                  <div className="text-sm text-red-800 font-medium">Critical</div>
                  <div className="text-2xl font-bold mt-1 text-red-900">{overviewStats.critical}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="bg-orange-50 rounded-lg p-3">
                  <div className="text-sm text-orange-800 font-medium">High</div>
                  <div className="text-xl font-bold mt-1 text-orange-900">{overviewStats.high}</div>
                </div>
                <div className="bg-yellow-50 rounded-lg p-3">
                  <div className="text-sm text-yellow-800 font-medium">Medium</div>
                  <div className="text-xl font-bold mt-1 text-yellow-900">{overviewStats.medium}</div>
                </div>
                <div className="bg-green-50 rounded-lg p-3">
                  <div className="text-sm text-green-800 font-medium">Low</div>
                  <div className="text-xl font-bold mt-1 text-green-900">{overviewStats.low}</div>
                </div>
              </div>
              
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Event Distribution</h4>
                <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                  {overviewStats.total > 0 && (
                    <>
                      <div 
                        className="h-full bg-red-500 float-left" 
                        style={{ width: `${(overviewStats.critical / overviewStats.total) * 100}%` }}
                      ></div>
                      <div 
                        className="h-full bg-orange-500 float-left" 
                        style={{ width: `${(overviewStats.high / overviewStats.total) * 100}%` }}
                      ></div>
                      <div 
                        className="h-full bg-yellow-500 float-left" 
                        style={{ width: `${(overviewStats.medium / overviewStats.total) * 100}%` }}
                      ></div>
                      <div 
                        className="h-full bg-green-500 float-left" 
                        style={{ width: `${(overviewStats.low / overviewStats.total) * 100}%` }}
                      ></div>
                    </>
                  )}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Recent Trend</h4>
                <div className="h-32 bg-gray-50 rounded-lg p-2 flex items-end justify-around">
                  {/* Simplified trend chart - would be replaced with a real chart library */}
                  {Array(10).fill(0).map((_, i) => {
                    // Generate random heights for demo
                    const height = 20 + Math.sin(i * 0.6) * 15 + Math.random() * 40;
                    return (
                      <div 
                        key={i} 
                        className="w-5 bg-blue-500 rounded-t"
                        style={{ height: `${height}%` }}
                      ></div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'objects' && (
            <ObjectDetectionStats events={events} timeRange={timeRange} />
          )}
          
          {activeTab === 'accidents' && (
            <AccidentStats events={events} timeRange={timeRange} />
          )}
        </>
      )}
    </div>
  );
};

export default StatisticsPanel;