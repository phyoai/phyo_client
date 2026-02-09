'use client'
import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const LogoutPage = () => {
  const { logout } = useAuth();

  useEffect(() => {
    // Perform logout (clears state and storage)
    logout();
    
    // Use a small delay to ensure storage is cleared
    const timer = setTimeout(() => {
      // Force a hard redirect to clear all state
      window.location.href = '/login';
    }, 100);

    return () => clearTimeout(timer);
  }, [logout]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
        <p className="text-gray-700">Logging out...</p>
      </div>
    </div>
  );
};

export default LogoutPage; 