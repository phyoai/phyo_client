import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sidebarOpen: false,
  globalLoading: false,
  activeModal: null, // e.g. "login", "signup", null
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    setGlobalLoading: (state, action) => {
      state.globalLoading = action.payload;
    },
    openModal: (state, action) => {
      state.activeModal = action.payload;
    },
    closeModal: (state) => {
      state.activeModal = null;
    }
  },
});

export const { 
    toggleSidebar, 
    setSidebarOpen, 
    setGlobalLoading, 
    openModal, 
    closeModal 
} = uiSlice.actions;

export default uiSlice.reducer;
