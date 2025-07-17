import React, { Suspense } from 'react';
import ChatPage from './ChatPage'

export default function BrandInbox() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <ChatPage/>
      </Suspense>
    </div>
  );
} 