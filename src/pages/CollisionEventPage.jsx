// src/pages/CollisionEventPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../components/auth/AuthContext';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import Footer from '../components/layout/Footer';
import { getEventById } from '../services/eventService';

const CollisionEventPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, loading: authLoading } = useContext(AuthContext);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  
  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        setLoading(true);
        const eventData = await getEventById(id);
        setEvent(eventData);
      } catch (err) {
        console.error('Failed to fetch event details:', err);
        setError('Failed to load event details. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchEventDetails();
    }
  }, [id]);
  
  if (authLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
          <h2 className="text-xl font-semibold mt-4 text-gray-700">Loading...</h2>
        </div>
      </div>
    );
  }
  
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  
  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const renderOverviewTab = () => {
    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="text-lg font-medium text-gray-800 mb-3">Event Summary</h3>
            <div className="space-y-2">
              <div>
                <span className="text-gray-600">Event ID:</span>
                <span className="ml-2 font-medium text-gray-800">{event.id}</span>
              </div>
              <div>
                <span className="text-gray-600">Timestamp:</span>
                <span className="ml-2 font-medium text-gray-800">
                  {new Date(event.timestamp).toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Status:</span>
                <span className="ml-2 font-medium text-blue-600">{event.status}</span>
              </div>
              <div>
                <span className="text-gray-600">Severity:</span>
                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(event.severity)}`}>
                  {event.severity.charAt(0).toUpperCase() + event.severity.slice(1)}
                </span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="text-lg font-medium text-gray-800 mb-3">Location</h3>
            <div className="space-y-2">
              <div>
                <span className="text-gray-600">Address:</span>
                <span className="ml-2 font-medium text-gray-800">
                  {event.location.address || 'Unknown location'}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Coordinates:</span>
                <span className="ml-2 font-medium text-gray-800">
                  {event.location.latitude}, {event.location.longitude}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Road Type:</span>
                <span className="ml-2 font-medium text-gray-800">
                  {event.location.roadType || 'Unknown'}
                </span>
              </div>
              <div className="mt-3">
                <button className="text-blue-600 hover:text-blue-800 text-sm">
                  <i className="fas fa-map-marker-alt mr-1"></i> View on Map
                </button>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="text-lg font-medium text-gray-800 mb-3">Weather Conditions</h3>
            <div className="space-y-2">
              <div>
                <span className="text-gray-600">Condition:</span>
                <span className="ml-2 font-medium text-gray-800">
                  {event.weather?.condition || 'Unknown'}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Temperature:</span>
                <span className="ml-2 font-medium text-gray-800">
                  {event.weather?.temperature ? `${event.weather.temperature}°C` : 'Unknown'}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Visibility:</span>
                <span className="ml-2 font-medium text-gray-800">
                  {event.weather?.visibility || 'Unknown'}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Road Condition:</span>
                <span className="ml-2 font-medium text-gray-800">
                  {event.weather?.roadCondition || 'Unknown'}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <h3 className="text-lg font-medium text-gray-800 mb-3">Detection Results</h3>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subtype</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Confidence</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Speed</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {event.objects.map((obj, index) => (
                  <tr key={obj.id || index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-2
                          ${obj.type === 'vehicle' ? 'bg-blue-500' : 
                            obj.type === 'pedestrian' ? 'bg-green-500' : 
                            obj.type === 'animal' ? 'bg-purple-500' : 'bg-gray-500'}`}>
                        </div>
                        <span className="capitalize">{obj.type}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {obj.subType || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className={`h-2 rounded-full ${
                              obj.confidence >= 0.85 ? 'bg-green-500' :
                              obj.confidence >= 0.6 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${obj.confidence * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm">
                          {Math.round(obj.confidence * 100)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {obj.position ? `(${obj.position.x.toFixed(1)}, ${obj.position.y.toFixed(1)})` : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {obj.speed ? `${obj.speed.toFixed(1)} km/h` : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h3 className="text-lg font-medium text-gray-800 mb-3">Distance Measurements</h3>
          
          {event.distances.length > 0 ? (
            <>
              <p className="text-sm text-gray-600 mb-4">
                Critical distances are highlighted in red. These indicate potential collision risks.
              </p>
              <div className="space-y-3">
                {event.distances.map((distance, index) => {
                  const obj1 = event.objects.find(o => o.id === distance.objectId1);
                  const obj2 = event.objects.find(o => o.id === distance.objectId2);
                  const isCritical = distance.status === 'critical';
                  
                  return (
                    <div 
                      key={index}
                      className={`p-3 rounded-lg border ${
                        isCritical ? 'border-red-300 bg-red-50' : 'border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex flex-col items-center mr-3">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white
                              ${obj1?.type === 'vehicle' ? 'bg-blue-500' : 
                                obj1?.type === 'pedestrian' ? 'bg-green-500' : 
                                obj1?.type === 'animal' ? 'bg-purple-500' : 'bg-gray-500'}`}>
                              <i className={`fas fa-${
                                obj1?.type === 'vehicle' ? 'car' : 
                                obj1?.type === 'pedestrian' ? 'walking' : 
                                obj1?.type === 'animal' ? 'paw' : 'question'
                              } text-xs`}></i>
                            </div>
                            <div className="text-xs mt-1">{obj1?.subType || obj1?.type || 'Object 1'}</div>
                          </div>
                          
                          <div className="flex-grow px-2">
                            <div className="h-0.5 bg-gray-300 relative">
                              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-sm font-medium">
                                {distance.distance.toFixed(1)}m
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-col items-center ml-3">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white
                              ${obj2?.type === 'vehicle' ? 'bg-blue-500' : 
                                obj2?.type === 'pedestrian' ? 'bg-green-500' : 
                                obj2?.type === 'animal' ? 'bg-purple-500' : 'bg-gray-500'}`}>
                              <i className={`fas fa-${
                                obj2?.type === 'vehicle' ? 'car' : 
                                obj2?.type === 'pedestrian' ? 'walking' : 
                                obj2?.type === 'animal' ? 'paw' : 'question'
                              } text-xs`}></i>
                            </div>
                            <div className="text-xs mt-1">{obj2?.subType || obj2?.type || 'Object 2'}</div>
                          </div>
                        </div>
                        
                        <span className={`ml-4 px-2 py-1 rounded-full text-xs font-medium
                          ${getSeverityColor(distance.status)}`}>
                          {distance.status.charAt(0).toUpperCase() + distance.status.slice(1)}
                        </span>
                      </div>
                      
                      {isCritical && (
                        <div className="mt-2 text-sm text-red-700">
                          <i className="fas fa-exclamation-triangle mr-1"></i>
                          Collision risk detected. Distance below safety threshold.
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No distance measurements available for this event
            </div>
          )}
        </div>
      </>
    );
  };
  
  const renderImagesTab = () => {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h3 className="text-lg font-medium text-gray-800 mb-3">Event Images</h3>
        
        {event.images && event.images.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {event.images.map((image, index) => (
              <div key={index} className="bg-gray-100 rounded-lg overflow-hidden">
                <img 
                  src={image.url} 
                  alt={`Event image ${index+1}`}
                  className="w-full h-48 object-cover"
                />
                <div className="p-2">
                  <p className="text-sm text-gray-600">
                    {`Captured: ${new Date(image.timestamp).toLocaleTimeString()}`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No images available for this event
          </div>
        )}
      </div>
    );
  };
  
  const renderReportsTab = () => {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h3 className="text-lg font-medium text-gray-800 mb-3">Reports and Analysis</h3>
        
        <div className="space-y-6">
          <div>
            <h4 className="font-medium text-gray-700 mb-2">System Analysis</h4>
            <div className="bg-gray-50 rounded-lg p-3 text-gray-700">
              {event.analysis?.systemReport || 'No system analysis available for this event.'}
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-700 mb-2">AI Insights</h4>
            <div className="bg-blue-50 rounded-lg p-3 text-gray-700">
              {event.analysis?.aiInsights || 'No AI insights available for this event.'}
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Safety Recommendations</h4>
            {event.analysis?.recommendations ? (
              <ul className="list-disc list-inside space-y-1">
                {event.analysis.recommendations.map((rec, index) => (
                  <li key={index} className="text-gray-700">{rec}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No safety recommendations available.</p>
            )}
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>
      
      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
                <h2 className="text-xl font-semibold mt-4 text-gray-700">Loading Event Details...</h2>
              </div>
            </div>
          ) : error ? (
            <div className="flex h-full items-center justify-center">
              <div className="bg-red-50 text-red-800 p-8 rounded-md max-w-lg text-center">
                <i className="fas fa-exclamation-circle text-4xl mb-4"></i>
                <h2 className="text-xl font-semibold mb-2">Error Loading Event</h2>
                <p>{error}</p>
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Return to Dashboard
                </button>
              </div>
            </div>
          ) : !event ? (
            <div className="flex h-full items-center justify-center">
              <div className="bg-yellow-50 text-yellow-800 p-8 rounded-md max-w-lg text-center">
                <i className="fas fa-search text-4xl mb-4"></i>
                <h2 className="text-xl font-semibold mb-2">Event Not Found</h2>
                <p>The requested collision event could not be found.</p>
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Return to Dashboard
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <div>
                  <button 
                    onClick={() => navigate(-1)}
                    className="text-blue-600 hover:text-blue-800 mb-2"
                  >
                    <i className="fas fa-arrow-left mr-2"></i> Back
                  </button>
                  <h1 className="text-2xl font-bold text-gray-800">
                    Collision Event Details
                  </h1>
                </div>
                
                <div className="flex space-x-2 mt-4 md:mt-0">
                  <button className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    <i className="fas fa-print mr-1"></i> Print Report
                  </button>
                  <button className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">
                    <i className="fas fa-download mr-1"></i> Export
                  </button>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                <div className="flex overflow-x-auto space-x-2 mb-4">
                  <button 
                    onClick={() => setActiveTab('overview')}
                    className={`px-4 py-2 font-medium rounded-md whitespace-nowrap ${
                      activeTab === 'overview' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <i className="fas fa-info-circle mr-2"></i> Overview
                  </button>
                  <button 
                    onClick={() => setActiveTab('images')}
                    className={`px-4 py-2 font-medium rounded-md whitespace-nowrap ${
                      activeTab === 'images' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <i className="fas fa-images mr-2"></i> Images & Video
                  </button>
                  <button 
                    onClick={() => setActiveTab('reports')}
                    className={`px-4 py-2 font-medium rounded-md whitespace-nowrap ${
                      activeTab === 'reports' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <i className="fas fa-file-alt mr-2"></i> Reports & Analysis
                  </button>
                </div>
              </div>
              
              {activeTab === 'overview' && renderOverviewTab()}
              {activeTab === 'images' && renderImagesTab()}
              {activeTab === 'reports' && renderReportsTab()}
            </>
          )}
        </main>
        
        <Footer />
      </div>
    </div>
  );
};

export default CollisionEventPage;