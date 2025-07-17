'use client'
import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';

const LogoutPage = () => {
  const { logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Perform logout
    logout();
    // Redirect to home page
    router.push('/');
  }, [logout, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
        <p>Logging out...</p>
      </div>
    </div>
  );
};

export default LogoutPage; 