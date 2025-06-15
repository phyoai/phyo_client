import React from 'react';

export default function BrandInbox() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Inbox</h1>
      
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <div className="text-center py-8">
            <p className="text-gray-500">No messages found</p>
            <p className="text-sm text-gray-400 mt-2">
              Your messages will appear here
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 