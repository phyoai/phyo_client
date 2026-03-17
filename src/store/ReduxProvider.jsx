'use client';

import { Provider } from 'react-redux';
import { store } from './index';
import AuthInitializer from '@/components/AuthInitializer';

export function ReduxProvider({ children }) {
  return (
    <Provider store={store}>
      <AuthInitializer />
      {children}
    </Provider>
  );
}
