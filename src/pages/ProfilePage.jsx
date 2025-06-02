// src/pages/ProfilePage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../components/auth/AuthContext';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import Footer from '../components/layout/Footer';

const ProfilePage = () => {
  const { currentUser, loading: authLoading } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    organization: '',
    jobTitle: '',
    bio: '',
    notifications: {
      email: true,
      push: true,
      sms: false
    },
    preferences: {
      darkMode: false,
      autoRefresh: true,
      showCollisionAlerts: true
    }
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: '', message: '' });

  useEffect(() => {
    if (currentUser) {
      // Initialize form with user data
      setFormData(prevData => ({
        ...prevData,
        name: currentUser.name || '',
        email: currentUser.email || '',
        phoneNumber: currentUser.phoneNumber || '',
        organization: currentUser.organization || '',
        jobTitle: currentUser.jobTitle || '',
        bio: currentUser.bio || '',
        notifications: {
          ...prevData.notifications,
          ...(currentUser.notifications || {})
        },
        preferences: {
          ...prevData.preferences,
          ...(currentUser.preferences || {})
        }
      }));
    }
  }, [currentUser]);

  if (authLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
          <h2 className="text-xl font-semibold mt-4 text-gray-700">Loading Profile...</h2>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      notifications: {
        ...prevData.notifications,
        [name]: checked
      }
    }));
  };

  const handlePreferenceChange = (e) => {
    const { name, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      preferences: {
        ...prevData.preferences,
        [name]: checked
      }
    }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      // Simulate API call for saving profile
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStatusMessage({ 
        type: 'success', 
        message: 'Profile updated successfully!' 
      });
      setIsEditing(false);
    } catch (error) {
      setStatusMessage({ 
        type: 'error', 
        message: 'Failed to update profile. Please try again.' 
      });
    } finally {
      setIsSaving(false);
      
      // Clear status message after 5 seconds
      setTimeout(() => {
        setStatusMessage({ type: '', message: '' });
      }, 5000);
    }
  };

  const renderProfileTab = () => {
    return (
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-800">Personal Information</h3>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <i className="fas fa-edit mr-2"></i> Edit Profile
              </button>
            ) : (
              <div className="space-x-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className={`px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isSaving
                      ? 'bg-blue-400 text-white cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {isSaving ? (
                    <>
                      <i className="fas fa-circle-notch fa-spin mr-2"></i> Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            )}
          </div>
          
          {statusMessage.message && (
            <div className={`mb-4 p-3 rounded-md ${
              statusMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
            }`}>
              <div className="flex items-center">
                <i className={`mr-2 fas ${
                  statusMessage.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'
                }`}></i>
                <span>{statusMessage.message}</span>
              </div>
            </div>
          )}
          
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/3 flex flex-col items-center p-4">
              <div className="w-40 h-40 bg-blue-600 rounded-full flex items-center justify-center text-white text-4xl font-bold mb-4">
                {currentUser.name?.charAt(0) || 'U'}
              </div>
              <span className="text-lg font-medium text-gray-900">{currentUser.name || 'User'}</span>
              <span className="text-sm text-gray-600 capitalize mb-2">{currentUser.role || 'User'}</span>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Active
              </span>
            </div>
            
            <div className="md:w-2/3 p-4">
              <form>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      disabled={!isEditing}
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full p-2 border rounded-md ${
                        isEditing
                          ? 'bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                          : 'bg-gray-100'
                      }`}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      disabled={!isEditing}
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full p-2 border rounded-md ${
                        isEditing
                          ? 'bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                          : 'bg-gray-100'
                      }`}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      disabled={!isEditing}
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      className={`w-full p-2 border rounded-md ${
                        isEditing
                          ? 'bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                          : 'bg-gray-100'
                      }`}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="organization" className="block text-sm font-medium text-gray-700 mb-1">
                      Organization
                    </label>
                    <input
                      type="text"
                      id="organization"
                      name="organization"
                      disabled={!isEditing}
                      value={formData.organization}
                      onChange={handleInputChange}
                      className={`w-full p-2 border rounded-md ${
                        isEditing
                          ? 'bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                          : 'bg-gray-100'
                      }`}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 mb-1">
                      Job Title
                    </label>
                    <input
                      type="text"
                      id="jobTitle"
                      name="jobTitle"
                      disabled={!isEditing}
                      value={formData.jobTitle}
                      onChange={handleInputChange}
                      className={`w-full p-2 border rounded-md ${
                        isEditing
                          ? 'bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                          : 'bg-gray-100'
                      }`}
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                      Bio
                    </label>
                    <textarea
                      id="bio"
                      name="bio"
                      rows="4"
                      disabled={!isEditing}
                      value={formData.bio}
                      onChange={handleInputChange}
                      className={`w-full p-2 border rounded-md ${
                        isEditing
                          ? 'bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                          : 'bg-gray-100'
                      }`}
                    ></textarea>
                  </div>
                </div>
                
                {isEditing && (
                  <div className="mt-6">
                    <button
                      type="submit"
                      onClick={handleSaveProfile}
                      disabled={isSaving}
                      className={`px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        isSaving
                          ? 'bg-blue-400 text-white cursor-not-allowed'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {isSaving ? (
                        <>
                          <i className="fas fa-circle-notch fa-spin mr-2"></i> Saving...
                        </>
                      ) : (
                        'Save Changes'
                      )}
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Account Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium text-gray-800 mb-2">User Role</h4>
              <div className="flex items-center">
                <span className="text-gray-700 capitalize">{currentUser.role || 'User'}</span>
                <span className="ml-2 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                  {currentUser.role === 'admin' ? 'Full Access' : currentUser.role === 'researcher' ? 'Research Access' : 'Limited Access'}
                </span>
              </div>
              {currentUser.role !== 'admin' && (
                <button className="mt-2 text-sm text-blue-600 hover:text-blue-800">
                  Request Role Upgrade
                </button>
              )}
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium text-gray-800 mb-2">Account Status</h4>
              <div className="flex items-center">
                <span className="text-gray-700">Active since</span>
                <span className="ml-2 font-medium text-gray-900">
                  {currentUser.createdAt ? new Date(currentUser.createdAt).toLocaleDateString() : 'Unknown'}
                </span>
              </div>
              <div className="mt-2 text-sm text-gray-600">
                Last login: {currentUser.lastLogin ? new Date(currentUser.lastLogin).toLocaleString() : 'Unknown'}
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <h4 className="font-medium text-gray-800 mb-3">Security</h4>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Password</span>
                <button className="text-blue-600 hover:text-blue-800">
                  Change Password
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Two-Factor Authentication</span>
                <button className="text-blue-600 hover:text-blue-800">
                  Enable
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Login History</span>
                <button className="text-blue-600 hover:text-blue-800">
                  View History
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderSettingsTab = () => {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">Settings</h3>
        
        <div className="space-y-8">
          <div>
            <h4 className="font-medium text-gray-800 mb-3">Notifications</h4>
            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="email-notif"
                  name="email"
                  checked={formData.notifications.email}
                  onChange={handleNotificationChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="email-notif" className="ml-3">
                  <span className="block text-sm font-medium text-gray-700">Email Notifications</span>
                  <span className="block text-sm text-gray-500">Receive email updates about collision events and system alerts</span>
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="push-notif"
                  name="push"
                  checked={formData.notifications.push}
                  onChange={handleNotificationChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="push-notif" className="ml-3">
                  <span className="block text-sm font-medium text-gray-700">Push Notifications</span>
                  <span className="block text-sm text-gray-500">Receive browser push notifications for important events</span>
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="sms-notif"
                  name="sms"
                  checked={formData.notifications.sms}
                  onChange={handleNotificationChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="sms-notif" className="ml-3">
                  <span className="block text-sm font-medium text-gray-700">SMS Notifications</span>
                  <span className="block text-sm text-gray-500">Receive text messages for critical collision events</span>
                </label>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-800 mb-3">Display Preferences</h4>
            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="dark-mode"
                  name="darkMode"
                  checked={formData.preferences.darkMode}
                  onChange={handlePreferenceChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="dark-mode" className="ml-3">
                  <span className="block text-sm font-medium text-gray-700">Dark Mode</span>
                  <span className="block text-sm text-gray-500">Use dark theme throughout the application</span>
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="auto-refresh"
                  name="autoRefresh"
                  checked={formData.preferences.autoRefresh}
                  onChange={handlePreferenceChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="auto-refresh" className="ml-3">
                  <span className="block text-sm font-medium text-gray-700">Auto Refresh</span>
                  <span className="block text-sm text-gray-500">Automatically refresh dashboard data every minute</span>
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="collision-alerts"
                  name="showCollisionAlerts"
                  checked={formData.preferences.showCollisionAlerts}
                  onChange={handlePreferenceChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="collision-alerts" className="ml-3">
                  <span className="block text-sm font-medium text-gray-700">Collision Alerts</span>
                  <span className="block text-sm text-gray-500">Show real-time collision alerts on the dashboard</span>
                </label>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-800 mb-3">Data Privacy</h4>
            <div className="bg-yellow-50 p-4 rounded-md mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <i className="fas fa-info-circle text-yellow-600"></i>
                </div>
                <div className="ml-3">
                  <h5 className="text-sm font-medium text-yellow-800">Privacy Notice</h5>
                  <p className="text-sm text-yellow-700">
                    Your data is used to improve road safety in Uganda. All personal information is protected according to our privacy policy.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                Download My Data
              </button>
              <button className="text-red-600 hover:text-red-800 text-sm font-medium">
                Delete My Account
              </button>
            </div>
          </div>
        </div>
        
        <div className="mt-8 border-t border-gray-200 pt-6 flex justify-end">
          <button
            onClick={handleSaveProfile}
            disabled={isSaving}
            className={`px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isSaving
                ? 'bg-blue-400 text-white cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isSaving ? (
              <>
                <i className="fas fa-circle-notch fa-spin mr-2"></i> Saving...
              </>
            ) : (
              'Save Settings'
            )}
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
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
          </div>
          
          <div className="flex mb-6 overflow-x-auto">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-2 font-medium rounded-md whitespace-nowrap mr-2 ${
                activeTab === 'profile'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <i className="fas fa-user mr-2"></i> Profile
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-4 py-2 font-medium rounded-md whitespace-nowrap ${
                activeTab === 'settings'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <i className="fas fa-cog mr-2"></i> Settings
            </button>
          </div>
          
          {activeTab === 'profile' && renderProfileTab()}
          {activeTab === 'settings' && renderSettingsTab()}
        </main>
        
        <Footer />
      </div>
    </div>
  );
};

export default ProfilePage;