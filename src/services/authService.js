// src/services/authService.js
/**
 * Authentication Service for UgandaSafe Dashboard
 * Handles user authentication, registration, and session management
 */

// Since we don't have a real backend, we'll use localStorage to simulate persistence
import { getStoredData, setStoredData } from '../utils/localStorage';

const USERS_KEY = 'ugandaSafe_users';
const CURRENT_USER_KEY = 'ugandaSafe_currentUser';

/**
 * Attempts to log in a user with provided credentials
 * 
 * @param {string} email User's email 
 * @param {string} password User's password
 * @returns {Promise<Object>} The logged in user object
 */
export const login = async (email, password) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Get all users from storage
  const users = getStoredData(USERS_KEY) || [];
  
  // Find user with matching credentials
  const user = users.find(u => 
    u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );
  
  if (!user) {
    throw new Error('Invalid email or password');
  }
  
  // Update last login timestamp
  const updatedUser = { 
    ...user, 
    lastLogin: new Date().toISOString(),
    password: undefined // Remove password before storing in session
  };
  
  // Update in storage
  setStoredData(CURRENT_USER_KEY, updatedUser);
  
  // Return user (without password)
  return { ...updatedUser };
};

/**
 * Registers a new user
 * 
 * @param {Object} userData User registration data
 * @returns {Promise<Object>} The newly registered user
 */
export const register = async (userData) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Get existing users
  const users = getStoredData(USERS_KEY) || [];
  
  // Check if email is already in use
  if (users.some(u => u.email.toLowerCase() === userData.email.toLowerCase())) {
    throw new Error('Email is already in use');
  }
  
  // Create new user object
  const newUser = {
    id: Date.now().toString(),
    name: userData.name,
    email: userData.email,
    password: userData.password,
    phoneNumber: userData.phoneNumber || '',
    role: userData.role === 'admin' ? 'user' : userData.role, // Admin requires approval (simulate restriction)
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
    approved: userData.role !== 'admin' // Admin requires approval
  };
  
  // Add new user to storage
  setStoredData(USERS_KEY, [...users, newUser]);
  
  // Log in the new user
  const userWithoutPassword = { ...newUser, password: undefined };
  setStoredData(CURRENT_USER_KEY, userWithoutPassword);
  
  return userWithoutPassword;
};

/**
 * Gets the current logged in user
 * 
 * @returns {Promise<Object|null>} The current user or null if not logged in
 */
export const getCurrentUser = async () => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Get current user from storage
  const currentUser = getStoredData(CURRENT_USER_KEY);
  return currentUser || null;
};

/**
 * Logs out the current user
 * 
 * @returns {Promise<void>}
 */
export const logout = async () => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Remove user from storage
  localStorage.removeItem(CURRENT_USER_KEY);
};

/**
 * Updates user profile information
 * 
 * @param {string} userId User ID to update
 * @param {Object} updates Updates to apply to user profile
 * @returns {Promise<Object>} The updated user profile
 */
export const updateUserProfile = async (userId, updates) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Get all users
  const users = getStoredData(USERS_KEY) || [];
  
  // Find and update the user
  const updatedUsers = users.map(user => {
    if (user.id === userId) {
      return { 
        ...user, 
        ...updates,
        // Don't allow certain fields to be updated
        role: user.role,
        email: updates.email || user.email
      };
    }
    return user;
  });
  
  // Update storage
  setStoredData(USERS_KEY, updatedUsers);
  
  // If this is the current user, update the current user too
  const currentUser = getStoredData(CURRENT_USER_KEY);
  if (currentUser && currentUser.id === userId) {
    const updatedCurrentUser = { 
      ...currentUser, 
      ...updates,
      role: currentUser.role,
      email: updates.email || currentUser.email
    };
    setStoredData(CURRENT_USER_KEY, updatedCurrentUser);
    return updatedCurrentUser;
  }
  
  // Find and return the updated user (without password)
  const updatedUser = updatedUsers.find(u => u.id === userId);
  return { ...updatedUser, password: undefined };
};

/**
 * Changes user password
 * 
 * @param {string} userId User ID
 * @param {string} currentPassword Current password for verification
 * @param {string} newPassword New password to set
 * @returns {Promise<void>}
 */
export const changePassword = async (userId, currentPassword, newPassword) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Get all users
  const users = getStoredData(USERS_KEY) || [];
  
  // Find the user
  const user = users.find(u => u.id === userId);
  
  if (!user) {
    throw new Error('User not found');
  }
  
  // Verify current password
  if (user.password !== currentPassword) {
    throw new Error('Current password is incorrect');
  }
  
  // Update password
  const updatedUsers = users.map(u => {
    if (u.id === userId) {
      return { ...u, password: newPassword };
    }
    return u;
  });
  
  // Update storage
  setStoredData(USERS_KEY, updatedUsers);
};

/**
 * Initializes the auth service with admin user if none exists
 */
export const initializeAuthService = () => {
  const users = getStoredData(USERS_KEY) || [];
  
  // Create default admin user if no users exist
  if (users.length === 0) {
    const defaultUsers = [
      {
        id: '1',
        name: 'Admin User',
        email: 'admin@ugandasafe.org',
        password: 'admin123',
        role: 'admin',
        createdAt: new Date().toISOString(),
        lastLogin: null,
        approved: true,
        organization: 'UgandaSafe',
        jobTitle: 'System Administrator',
        phoneNumber: '+256700000000'
      },
      {
        id: '2',
        name: 'John Researcher',
        email: 'researcher@ugandasafe.org',
        password: 'research123',
        role: 'researcher',
        createdAt: new Date().toISOString(),
        lastLogin: null,
        approved: true,
        organization: 'Makerere University',
        jobTitle: 'Research Scientist',
        phoneNumber: '+256711111111'
      },
      {
        id: '3',
        name: 'Sarah User',
        email: 'user@ugandasafe.org',
        password: 'user123',
        role: 'user',
        createdAt: new Date().toISOString(),
        lastLogin: null,
        approved: true,
        organization: 'Uganda National Roads Authority',
        jobTitle: 'Safety Officer',
        phoneNumber: '+256722222222'
      }
    ];
    
    setStoredData(USERS_KEY, defaultUsers);
  }
};