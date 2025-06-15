import React from 'react';
import BrandSidebar from '../../components/BrandSidebar';

export default function BrandLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      <BrandSidebar />
      <main className="flex-1 ml-64 p-8">
        {children}
      </main>
    </div>
  );
} 