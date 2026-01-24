import React, { Suspense } from 'react';
import InboxPage from './InboxPage'

export default function BrandInbox() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <InboxPage/>
      </Suspense>
    </div>
  );
} 