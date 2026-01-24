'use client'
import React, { createContext, useContext, useState } from 'react';

const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [sidebarButtonAction, setSidebarButtonAction] = useState(null);
  const [sidebarButtonLabel, setSidebarButtonLabel] = useState('Button');

  return (
    <SidebarContext.Provider value={{ 
      isExpanded, 
      setIsExpanded,
      sidebarButtonAction,
      setSidebarButtonAction,
      sidebarButtonLabel,
      setSidebarButtonLabel
    }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};
