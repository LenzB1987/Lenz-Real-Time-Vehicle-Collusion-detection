// src/pages/DashboardPage.jsx
import React from 'react';
import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import Footer from '../components/layout/Footer';
import Dashboard from '../components/dashboard/Dashboard';
import { AuthContext } from '../components/auth/AuthContext';

const DashboardPage = () => {
  const { currentUser, loading } = useContext(AuthContext);
  
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
          <h2 className="text-xl font-semibold mt-4 text-gray-700">Loading Dashboard...</h2>
          <p className="text-gray-500 mt-2">Please wait while we fetch your data</p>
        </div>
      </div>
    );
  }
  
  if (!currentUser) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }
  
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
          <Dashboard />
        </main>
        
        <Footer />
      </div>
      
      {/* Mobile Navigation - Only visible on small screens */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900 md:hidden">
        <div className="flex justify-around py-3">
          <button className="text-white focus:outline-none">
            <i className="fas fa-gauge-high"></i>
          </button>
          <button className="text-gray-500 focus:outline-none">
            <i className="fas fa-comments"></i>
          </button>
          <button className="text-gray-500 focus:outline-none">
            <i className="fas fa-chart-line"></i>
          </button>
          <button className="text-gray-500 focus:outline-none">
            <i className="fas fa-user"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;