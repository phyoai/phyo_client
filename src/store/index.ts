import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import uiReducer from './slices/uiSlice';
import campaignReducer from './slices/campaignSlice';
import influencerReducer from './slices/influencerSlice';
import messagingReducer from './slices/messagingSlice';
import dashboardReducer from './slices/dashboardSlice';
import paymentReducer from './slices/paymentSlice';
import influencerDataReducer from './slices/influencerDataSlice';
import projectReducer from './slices/projectSlice';
import portfolioReducer from './slices/portfolioSlice';
import fileReducer from './slices/fileSlice';
import aiReducer from './slices/aiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    ui: uiReducer,
    campaign: campaignReducer,
    influencer: influencerReducer,
    messaging: messagingReducer,
    dashboard: dashboardReducer,
    payment: paymentReducer,
    influencerData: influencerDataReducer,
    project: projectReducer,
    portfolio: portfolioReducer,
    file: fileReducer,
    ai: aiReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types for serialization check
        ignoredActions: ['campaign/getCampaigns/pending'],
      },
    }),
});

// TypeScript types for use in hooks
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
