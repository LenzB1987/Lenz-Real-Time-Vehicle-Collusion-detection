// src/components/layout/Sidebar.jsx
import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext';

const Sidebar = () => {
  const { currentUser } = useContext(AuthContext);
  const location = useLocation();
  
  // Define navigation items based on user role
  const navItems = [
    { 
      name: 'Dashboard', 
      path: '/dashboard', 
      icon: 'fa-solid fa-gauge-high',
      roles: ['admin', 'researcher', 'user']
    },
    { 
      name: 'Messaging', 
      path: '/messaging', 
      icon: 'fa-solid fa-comments',
      roles: ['admin', 'researcher', 'user']
    },
    { 
      name: 'Simulation', 
      path: '/simulation', 
      icon: 'fa-solid fa-flask',
      roles: ['admin', 'researcher']
    },
    { 
      name: 'Profile', 
      path: '/profile', 
      icon: 'fa-solid fa-user',
      roles: ['admin', 'researcher', 'user']
    },
    { 
      name: 'Admin Panel', 
      path: '/admin', 
      icon: 'fa-solid fa-users-gear',
      roles: ['admin']
    }
  ];

  // Filter nav items based on user role
  const filteredNavItems = navItems.filter(item => 
    item.roles.includes(currentUser?.role || 'guest')
  );

  return (
    <div className="bg-gray-900 text-white w-64 min-h-screen p-4">
      <div className="flex items-center mb-8 px-2">
        <div className="bg-blue-600 rounded-full w-10 h-10 flex items-center justify-center mr-3">
          <i className="fas fa-shield-alt text-white"></i>
        </div>
        <h1 className="text-xl font-bold">UgandaSafe</h1>
      </div>
      
      <nav>
        <ul>
          {filteredNavItems.map((item, index) => (
            <li key={index} className="mb-2">
              <Link 
                to={item.path} 
                className={`flex items-center p-3 rounded-lg transition-colors duration-200
                  ${location.pathname === item.path 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
              >
                <i className={`${item.icon} w-5 mr-3`}></i>
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-auto pt-8">
        <div className="border-t border-gray-700 pt-4">
          <div className="px-4 py-2">
            <h5 className="text-xs uppercase text-gray-500 font-medium">System Status</h5>
            <div className="mt-2 flex items-center">
              <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
              <span className="text-sm text-gray-400">Online</span>
            </div>
          </div>
          
          <div className="px-4 py-2">
            <h5 className="text-xs uppercase text-gray-500 font-medium">Version</h5>
            <div className="mt-2 text-sm text-gray-400">1.0.0-alpha</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;