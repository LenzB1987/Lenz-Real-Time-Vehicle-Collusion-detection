// src/App.jsx
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './components/auth/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import CollisionEventPage from './pages/CollisionEventPage';
import MessagingPage from './pages/MessagingPage';
import SimulationPage from './pages/SimulationPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';
import { initializeLocalStorage } from './utils/localStorage';
import { generateMockData } from './utils/mockData';

function App() {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initApp = async () => {
      // Initialize localStorage with default data if not exists
      await initializeLocalStorage();
      
      // Generate mock data for demonstration
      await generateMockData();
      
      setIsInitialized(true);
    };
    
    initApp();
  }, []);

  if (!isInitialized) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
          <h2 className="text-xl font-semibold mt-4 text-gray-700">Initializing UgandaSafe Dashboard...</h2>
          <p className="text-gray-500 mt-2">Please wait while we set up your environment</p>
        </div>
      </div>
    );
  }

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/event/:id" element={<CollisionEventPage />} />
          <Route path="/messaging" element={<MessagingPage />} />
          <Route path="/simulation" element={<SimulationPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;