// src/pages/RegisterPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterForm from '../components/auth/RegisterForm';

const RegisterPage = () => {
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
            onClick={() => navigate('/login')}
          >
            Login
          </button>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="order-2 md:order-1">
              <RegisterForm />
            </div>
            <div className="order-1 md:order-2">
              <h1 className="text-3xl font-bold text-gray-800 mb-4">
                Join UgandaSafe
              </h1>
              <p className="text-gray-600 mb-6">
                Create an account to access the Collision Detection Dashboard and contribute to making roads safer in Uganda.
              </p>
              
              <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
                <h2 className="font-semibold text-gray-800 mb-3">User Roles & Permissions</h2>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="bg-blue-100 rounded-full p-1 mr-2">
                      <i className="fas fa-user text-sm text-blue-600"></i>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">Standard User</h3>
                      <p className="text-xs text-gray-600">Basic dashboard access with limited statistics</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-green-100 rounded-full p-1 mr-2">
                      <i className="fas fa-flask text-sm text-green-600"></i>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">Researcher</h3>
                      <p className="text-xs text-gray-600">Advanced analytics and simulation capabilities</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-purple-100 rounded-full p-1 mr-2">
                      <i className="fas fa-users-cog text-sm text-purple-600"></i>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">Administrator</h3>
                      <p className="text-xs text-gray-600">Full system access and user management</p>
                    </div>
                  </li>
                </ul>
              </div>
              
              <div className="text-sm text-gray-600">
                <p className="mb-2">
                  <i className="fas fa-info-circle text-blue-600 mr-2"></i>
                  Administrator access requires approval by the UgandaSafe team.
                </p>
                <p>
                  <i className="fas fa-lock text-blue-600 mr-2"></i>
                  Your data is secure and will only be used for road safety research purposes.
                </p>
              </div>
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

export default RegisterPage;