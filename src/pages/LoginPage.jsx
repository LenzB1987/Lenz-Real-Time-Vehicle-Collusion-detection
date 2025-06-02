// src/pages/LoginPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';

const LoginPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex flex-col">
      <header className="py-4 px-6">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <div className="bg-blue-600 rounded-full w-8 h-8 flex items-center justify-center mr-2">
              <i className="fas fa-shield-alt text-white"></i>
            </div>
            <span className="text-xl font-bold text-gray-800">UgandaSafe</span>
          </div>
          <button 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
            onClick={() => navigate('/register')}
          >
            Register
          </button>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-4">
                Improving Road Safety in Uganda
              </h1>
              <p className="text-gray-600 mb-6">
                Welcome to the UgandaSafe Collision Detection Dashboard, a comprehensive system for monitoring
                and analyzing road safety data to reduce accidents and save lives.
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-blue-100 rounded-full p-2 mr-3">
                    <i className="fas fa-chart-line text-blue-600"></i>
                  </div>
                  <div>
                    <h2 className="font-medium text-gray-800">Real-time Monitoring</h2>
                    <p className="text-sm text-gray-600">Track collision events as they happen across the country</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-blue-100 rounded-full p-2 mr-3">
                    <i className="fas fa-map-marked-alt text-blue-600"></i>
                  </div>
                  <div>
                    <h2 className="font-medium text-gray-800">Advanced Visualization</h2>
                    <p className="text-sm text-gray-600">Interactive maps and charts for data analysis</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-blue-100 rounded-full p-2 mr-3">
                    <i className="fas fa-comment-alt text-blue-600"></i>
                  </div>
                  <div>
                    <h2 className="font-medium text-gray-800">Collaborate</h2>
                    <p className="text-sm text-gray-600">Communicate with researchers and administrators</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <LoginForm />
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white py-6 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-600 mb-4 md:mb-0">
              © {new Date().getFullYear()} UgandaSafe - Road Collision Detection Dashboard. All rights reserved.
            </div>
            <div className="flex space-x-4">
              <a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                About
              </a>
              <a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LoginPage;