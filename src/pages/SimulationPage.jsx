// src/pages/SimulationPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../components/auth/AuthContext';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import Footer from '../components/layout/Footer';
import { createSimulation, getSimulationHistory } from '../services/simulationService';

const SimulationPage = () => {
  const { currentUser, loading: authLoading } = useContext(AuthContext);
  const [simulations, setSimulations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [activeSimulation, setActiveSimulation] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    location: {
      latitude: 0.347596,
      longitude: 32.582520,
      address: 'Kampala, Uganda'
    },
    scenario: 'urban_traffic',
    trafficDensity: 'medium',
    timeOfDay: 'day',
    weatherCondition: 'clear',
    vehicleTypes: ['car', 'motorcycle', 'bus'],
    pedestrianDensity: 'medium',
    duration: 60
  });

  // Predefined scenarios
  const scenarioOptions = [
    { value: 'urban_traffic', label: 'Urban Traffic Junction' },
    { value: 'highway', label: 'Highway Scenario' },
    { value: 'school_zone', label: 'School Zone' },
    { value: 'rural_road', label: 'Rural Road' },
    { value: 'market_area', label: 'Busy Market Area' }
  ];

  useEffect(() => {
    if (currentUser) {
      fetchSimulationHistory();
    }
  }, [currentUser]);

  const fetchSimulationHistory = async () => {
    try {
      setLoading(true);
      const history = await getSimulationHistory();
      setSimulations(history);
      setError('');
    } catch (err) {
      console.error('Failed to fetch simulation history:', err);
      setError('Failed to load simulation history. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      location: {
        ...prevData.location,
        [name]: value
      }
    }));
  };

  const handleVehicleTypeChange = (type) => {
    setFormData(prevData => {
      const updatedVehicleTypes = [...prevData.vehicleTypes];
      
      if (updatedVehicleTypes.includes(type)) {
        // Remove type if already selected
        return {
          ...prevData,
          vehicleTypes: updatedVehicleTypes.filter(t => t !== type)
        };
      } else {
        // Add type if not selected
        return {
          ...prevData,
          vehicleTypes: [...updatedVehicleTypes, type]
        };
      }
    });
  };

  const handleRunSimulation = async (e) => {
    e.preventDefault();
    
    if (!formData.name) {
      setError('Please provide a name for your simulation.');
      return;
    }
    
    setIsRunning(true);
    setError('');
    
    try {
      const result = await createSimulation(formData);
      setActiveSimulation(result);
      // Add to simulation history
      setSimulations(prev => [result, ...prev]);
    } catch (err) {
      console.error('Failed to run simulation:', err);
      setError('Failed to run simulation. Please check your parameters and try again.');
    } finally {
      setIsRunning(false);
    }
  };

  const handleViewSimulation = (simulation) => {
    setActiveSimulation(simulation);
  };

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

  // Check if user has permissions to access simulations
  if (currentUser.role !== 'admin' && currentUser.role !== 'researcher') {
    return (
      <div className="flex h-screen bg-gray-100">
        <div className="hidden md:block">
          <Sidebar />
        </div>
        
        <div className="flex flex-col flex-1 overflow-hidden">
          <Header />
          
          <main className="flex-1 overflow-y-auto p-6">
            <div className="bg-yellow-50 text-yellow-800 p-8 rounded-md max-w-lg mx-auto text-center">
              <i className="fas fa-lock text-4xl mb-4"></i>
              <h2 className="text-xl font-semibold mb-2">Access Restricted</h2>
              <p className="mb-4">The simulation feature is only available for researchers and administrators.</p>
              <button 
                onClick={() => window.history.back()}
                className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
              >
                Go Back
              </button>
            </div>
          </main>
          
          <Footer />
        </div>
      </div>
    );
  }

  const renderSimulationForm = () => {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">Create New Simulation</h3>
        
        {error && (
          <div className="bg-red-50 text-red-800 p-3 rounded-md mb-6 flex items-start">
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
        
        <form onSubmit={handleRunSimulation}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Simulation Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter a descriptive name"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Scenario Type
              </label>
              <select
                name="scenario"
                value={formData.scenario}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {scenarioOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.location.address}
                onChange={handleLocationChange}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter location address"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Latitude
                </label>
                <input
                  type="number"
                  step="0.000001"
                  name="latitude"
                  value={formData.location.latitude}
                  onChange={handleLocationChange}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Longitude
                </label>
                <input
                  type="number"
                  step="0.000001"
                  name="longitude"
                  value={formData.location.longitude}
                  onChange={handleLocationChange}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Traffic Density
              </label>
              <select
                name="trafficDensity"
                value={formData.trafficDensity}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="congested">Congested</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Weather Condition
              </label>
              <select
                name="weatherCondition"
                value={formData.weatherCondition}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="clear">Clear</option>
                <option value="rain">Rain</option>
                <option value="fog">Fog</option>
                <option value="night">Night</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Time of Day
              </label>
              <select
                name="timeOfDay"
                value={formData.timeOfDay}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="morning">Morning</option>
                <option value="day">Day</option>
                <option value="evening">Evening</option>
                <option value="night">Night</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Simulation Duration (seconds)
              </label>
              <input
                type="number"
                name="duration"
                min="10"
                max="300"
                value={formData.duration}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vehicle Types to Include
              </label>
              <div className="flex flex-wrap gap-2">
                {['car', 'bus', 'truck', 'motorcycle', 'bicycle'].map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleVehicleTypeChange(type)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      formData.vehicleTypes.includes(type)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pedestrian Density
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="range"
                  name="pedestrianDensity"
                  min="0"
                  max="2"
                  step="1"
                  value={
                    formData.pedestrianDensity === 'none' ? 0 :
                    formData.pedestrianDensity === 'medium' ? 1 : 2
                  }
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    const densityValue = value === 0 ? 'none' : value === 1 ? 'medium' : 'high';
                    setFormData({...formData, pedestrianDensity: densityValue});
                  }}
                  className="flex-grow h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-sm font-medium text-gray-700 w-20">
                  {formData.pedestrianDensity === 'none' ? 'None' : 
                   formData.pedestrianDensity === 'medium' ? 'Medium' : 'High'}
                </span>
              </div>
            </div>
          </div>
          
          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              disabled={isRunning}
              className={`px-6 py-2 rounded-lg ${
                isRunning
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              } text-white font-medium`}
            >
              {isRunning ? (
                <>
                  <i className="fas fa-circle-notch fa-spin mr-2"></i>
                  Running Simulation...
                </>
              ) : (
                <>
                  <i className="fas fa-play mr-2"></i>
                  Run Simulation
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    );
  };

  const renderSimulationHistory = () => {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">Simulation History</h3>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading simulations...</span>
          </div>
        ) : simulations.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <i className="fas fa-history text-4xl mb-4"></i>
            <p>No simulation history available</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Scenario</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {simulations.map((simulation) => (
                  <tr 
                    key={simulation.id} 
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleViewSimulation(simulation)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {simulation.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(simulation.timestamp).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {scenarioOptions.find(s => s.value === simulation.scenario)?.label || simulation.scenario}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${simulation.status === 'completed' ? 'bg-green-100 text-green-800' : 
                          simulation.status === 'failed' ? 'bg-red-100 text-red-800' : 
                          'bg-yellow-100 text-yellow-800'}`}>
                        {simulation.status?.charAt(0).toUpperCase() + simulation.status?.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewSimulation(simulation);
                        }}
                        className="mr-2 hover:text-blue-800"
                      >
                        <i className="fas fa-eye mr-1"></i> View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  const renderSimulationResults = () => {
    if (!activeSimulation) return null;
    
    const { results } = activeSimulation;
    
    return (
      <div className="bg-white rounded-lg shadow-sm overflow-hidden mt-6">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-800">Simulation Results: {activeSimulation.name}</h3>
            <button 
              onClick={() => setActiveSimulation(null)} 
              className="text-gray-500 hover:text-gray-700"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
              {scenarioOptions.find(s => s.value === activeSimulation.scenario)?.label}
            </span>
            <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
              {activeSimulation.trafficDensity.charAt(0).toUpperCase() + activeSimulation.trafficDensity.slice(1)} Traffic
            </span>
            <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
              {activeSimulation.timeOfDay.charAt(0).toUpperCase() + activeSimulation.timeOfDay.slice(1)}
            </span>
            <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
              {activeSimulation.weatherCondition.charAt(0).toUpperCase() + activeSimulation.weatherCondition.slice(1)}
            </span>
          </div>
          
          <div className="text-sm text-gray-600">
            <p>
              <span className="font-medium">Location:</span> {activeSimulation.location.address}
            </p>
            <p>
              <span className="font-medium">Run Date:</span> {new Date(activeSimulation.timestamp).toLocaleString()}
            </p>
          </div>
        </div>
        
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h4 className="font-medium text-gray-800 mb-3">Simulation Summary</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h5 className="text-sm text-gray-600">Total Events</h5>
              <div className="text-2xl font-bold text-blue-600">{results?.totalEvents || 0}</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h5 className="text-sm text-gray-600">Near Misses</h5>
              <div className="text-2xl font-bold text-yellow-600">{results?.nearMisses || 0}</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h5 className="text-sm text-gray-600">Critical Events</h5>
              <div className="text-2xl font-bold text-red-600">{results?.criticalEvents || 0}</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h5 className="text-sm text-gray-600">Safety Score</h5>
              <div className="text-2xl font-bold text-green-600">{results?.safetyScore || 'N/A'}</div>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <h4 className="font-medium text-gray-800 mb-4">Detected Events</h4>
          
          {results?.events && results.events.length > 0 ? (
            <div className="space-y-4">
              {results.events.map((event, index) => (
                <div key={index} className={`p-4 border rounded-lg ${
                  event.severity === 'critical' ? 'border-red-300 bg-red-50' :
                  event.severity === 'warning' ? 'border-yellow-300 bg-yellow-50' :
                  'border-gray-200'
                }`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h5 className="font-medium text-gray-800">{event.type}</h5>
                      <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                      <p className="text-xs text-gray-500 mt-2">Time: {event.timeOffset}s</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      event.severity === 'critical' ? 'bg-red-100 text-red-800' :
                      event.severity === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {event.severity.charAt(0).toUpperCase() + event.severity.slice(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <i className="fas fa-info-circle text-4xl mb-4"></i>
              <p>No events detected during this simulation</p>
            </div>
          )}
        </div>
        
        {results?.recommendations && (
          <div className="p-6 border-t border-gray-200">
            <h4 className="font-medium text-gray-800 mb-3">Safety Recommendations</h4>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <ul className="list-disc pl-5 space-y-1">
                {results.recommendations.map((rec, index) => (
                  <li key={index} className="text-sm text-gray-700">{rec}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
        
        <div className="p-6 border-t border-gray-200 flex justify-end">
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 mr-2">
            <i className="fas fa-download mr-2"></i> Export Results
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            <i className="fas fa-chart-line mr-2"></i> Detailed Analysis
          </button>
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
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">
              <i className="fas fa-flask mr-2 text-blue-600"></i>
              Simulation Center
            </h1>
          </div>
          
          {renderSimulationForm()}
          {activeSimulation ? renderSimulationResults() : renderSimulationHistory()}
        </main>
        
        <Footer />
      </div>
    </div>
  );
};

export default SimulationPage;