'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, MoreVertical, Trash2, Download, Plus } from 'lucide-react';

export default function MyLists() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [activeChip, setActiveChip] = useState('All');
  
  // Mock data - Replace with actual API call
  const [lists, setLists] = useState([
    {
      id: 1,
      name: 'Emily Thompson',
      description: 'Lifestyle influencer sharing sustainable living tips and eco-friendly products.',
      avatar: '/dummyAvatar.jpg',
      list: 'Favorites'
    },
    {
      id: 2,
      name: 'Sophie Kim',
      description: 'Travel blogger exploring hidden gems around the world and sharing travel hacks.',
      avatar: '/dummyAvatar1.jpg',
      list: 'Campaign 1'
    },
    {
      id: 3,
      name: 'Jake Reyes',
      description: 'Tech enthusiast and reviewer focusing on the latest gadgets and software.',
      avatar: '/test1.png',
      list: 'Campaign 2'
    },
    {
      id: 4,
      name: 'Olivia Martinez',
      description: 'Beauty guru demonstrating makeup tutorials and skincare routines.',
      avatar: '/dummyAvatar.jpg',
      list: 'Favorites'
    },
    {
      id: 5,
      name: 'Michael Chen',
      description: 'Fitness coach offering workout plans and healthy meal prep ideas.',
      avatar: '/dummyAvatar1.jpg',
      list: 'Campaign 1'
    }
  ]);

  const chips = ['All', 'Favorites', 'Campaign 1', 'Campaign 2', 'Label', 'Label', 'Label', 'Label', 'Label', 'Label'];

  const handleSelectAll = () => {
    if (selectedItems.length === lists.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(lists.map(item => item.id));
    }
  };

  const handleSelectItem = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(item => item !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleBack = () => {
    if (selectionMode) {
      setSelectionMode(false);
      setSelectedItems([]);
    } else {
      router.back();
    }
  };

  const handleDelete = () => {
    // Filter out selected items
    setLists(lists.filter(item => !selectedItems.includes(item.id)));
    setSelectedItems([]);
    setSelectionMode(false);
  };

  const handleExport = () => {
    console.log('Exporting selected items:', selectedItems);
    // Add export logic here
  };

  const handleCreateNewList = () => {
    console.log('Create new list');
    // Add create list logic here
  };

  // Empty state
  if (lists.length === 0 && !loading) {
    return (
      <div className="flex flex-col h-screen bg-white">
        {/* App Bar */}
        <div className="flex items-center justify-between px-1 py-2 bg-white shrink-0">
          <button
            onClick={handleBack}
            className="flex items-center justify-center w-12 h-12 rounded-3xl hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-[#242527]" strokeWidth={1.5} />
          </button>
          <div className="flex-1 px-2">
            <h1 className="text-xl font-semibold text-[#242527] leading-7 tracking-[-0.14px]">My Lists</h1>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center justify-center w-12 h-12 rounded-3xl hover:bg-gray-100 transition-colors">
              <MoreVertical className="w-6 h-6 text-[#242527]" strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {/* Empty State */}
        <div className="flex-1 flex items-center justify-center px-9 py-4">
          <div className="flex flex-col items-center justify-center p-4">
            <h2 className="text-2xl font-semibold text-[#242527] leading-8 tracking-[-0.32px]">no lists created yet</h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* App Bar */}
      <div className="flex items-center justify-between px-1 py-2 bg-white shrink-0">
        <button
          onClick={handleBack}
          className="flex items-center justify-center w-12 h-12 rounded-3xl hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-[#242527]" strokeWidth={1.5} />
        </button>
        <div className="flex-1 px-2">
          <h1 className="text-xl font-semibold text-[#242527] leading-7 tracking-[-0.14px]">My Lists</h1>
        </div>
        <div className="flex items-center gap-2 h-12">
          {selectionMode && (
            <button 
              onClick={handleDelete}
              className="flex items-center justify-center w-12 h-12 rounded-3xl hover:bg-gray-100 transition-colors"
            >
              <Trash2 className="w-6 h-6 text-[#242527]" strokeWidth={1.5} />
            </button>
          )}
          <button className="flex items-center justify-center w-12 h-12 rounded-3xl hover:bg-gray-100 transition-colors">
            <MoreVertical className="w-6 h-6 text-[#242527]" strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* Container */}
      <div className="flex-1 flex flex-col overflow-hidden px-9 py-4">
        <div className="flex flex-col flex-1 h-full overflow-hidden">
          {/* Chip Group - Only show when not in selection mode */}
          {!selectionMode && lists.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto overflow-y-hidden pl-4 py-2 shrink-0 scrollbar-hide">
              {chips.map((chip, index) => (
                <button
                  key={index}
                  onClick={() => setActiveChip(chip)}
                  className={`flex items-center justify-center px-3 py-1.5 rounded-lg shrink-0 whitespace-nowrap transition-colors ${
                    activeChip === chip
                      ? 'bg-[#43573b] text-white'
                      : 'bg-[#fbfcfa] text-[#242527] border border-[#f4f6f1] hover:bg-gray-50'
                  }`}
                  style={{ fontFamily: 'Work Sans, sans-serif' }}
                >
                  <span className="text-sm font-medium leading-5 tracking-[0.2px]">{chip}</span>
                </button>
              ))}
            </div>
          )}

          {/* List Items */}
          <div className="flex-1 overflow-y-auto">
            {/* Select All - Only show in selection mode */}
            {selectionMode && (
              <>
                <div className="flex items-center bg-white pl-4 hover:bg-gray-50 transition-colors">
                  <div className="flex-1 flex flex-col justify-center pr-4 py-3">
                    <p className="text-base font-semibold text-[#242527] leading-6 tracking-[0.24px]" style={{ fontFamily: 'Work Sans, sans-serif' }}>
                      Select All
                    </p>
                  </div>
                  <div className="flex items-center justify-center shrink-0">
                    <button
                      onClick={handleSelectAll}
                      className="flex items-center justify-center w-12 h-12 rounded-full p-3 hover:bg-gray-100 transition-colors"
                    >
                      <div className="w-6 h-6 flex items-center justify-center">
                        {selectedItems.length === lists.length ? (
                          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                            <rect x="3" y="3" width="18" height="18" rx="3" stroke="#808080" strokeWidth="2" fill="none"/>
                            <path d="M6 12h12" stroke="#43573b" strokeWidth="2" strokeLinecap="round"/>
                          </svg>
                        ) : (
                          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                            <rect x="3" y="3" width="18" height="18" rx="3" stroke="#808080" strokeWidth="2" fill="none"/>
                          </svg>
                        )}
                      </div>
                    </button>
                  </div>
                </div>
                <div className="h-px bg-[#f0f0f0]"></div>
              </>
            )}

            {/* Influencer List */}
            {lists.map((item, index) => (
              <React.Fragment key={item.id}>
                <div 
                  className={`flex items-center bg-white ${selectionMode ? 'cursor-pointer hover:bg-gray-50' : ''} transition-colors`}
                  onClick={() => selectionMode && handleSelectItem(item.id)}
                  onDoubleClick={() => {
                    if (!selectionMode) {
                      setSelectionMode(true);
                      setSelectedItems([item.id]);
                    }
                  }}
                >
                  <div className="flex items-center px-4 py-1.5 shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                      <span className="text-lg font-bold text-white">
                        {getInitials(item.name)}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col justify-center pr-4 py-3 overflow-hidden">
                    <p className="text-base font-semibold text-[#242527] leading-6 tracking-[0.24px] truncate" style={{ fontFamily: 'Work Sans, sans-serif' }}>
                      {item.name}
                    </p>
                    <p className="text-sm text-[#808080] leading-5 tracking-[0px] truncate" style={{ fontFamily: 'Work Sans, sans-serif' }}>
                      {item.description}
                    </p>
                  </div>
                  {selectionMode && (
                    <div className="flex items-center justify-center shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectItem(item.id);
                        }}
                        className="flex items-center justify-center w-12 h-12 rounded-full p-3 hover:bg-gray-100 transition-colors"
                      >
                        <div className="w-6 h-6 flex items-center justify-center">
                          {selectedItems.includes(item.id) ? (
                            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                              <rect x="3" y="3" width="18" height="18" rx="3" fill="#43573b"/>
                              <path d="M7 12L10.5 15.5L17 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          ) : (
                            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                              <rect x="3" y="3" width="18" height="18" rx="3" stroke="#808080" strokeWidth="2" fill="none"/>
                            </svg>
                          )}
                        </div>
                      </button>
                    </div>
                  )}
                </div>
                {index < lists.length - 1 && (
                  <div className="h-px bg-[#f0f0f0]"></div>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Button Container - Only show in selection mode */}
          {selectionMode && (
            <div className="flex gap-2 p-4 bg-white shrink-0">
              <button 
                onClick={handleExport}
                className="flex-1 flex items-center justify-center gap-2 px-8 py-4 border border-[#43573b] rounded-[32px] hover:bg-gray-50 transition-colors"
              >
                <Download className="w-6 h-6 text-[#43573b]" strokeWidth={1.5} />
                <span className="text-base font-semibold text-[#43573b] leading-6 tracking-[0.24px]" style={{ fontFamily: 'Work Sans, sans-serif' }}>
                  Export
                </span>
              </button>
              <button 
                onClick={handleCreateNewList}
                className="flex-1 flex items-center justify-center gap-2 px-8 py-4 bg-[#43573b] text-white rounded-[32px] hover:bg-[#3d4f36] transition-colors"
              >
                <Plus className="w-6 h-6" strokeWidth={1.5} />
                <span className="text-base font-semibold leading-6 tracking-[0.24px]" style={{ fontFamily: 'Work Sans, sans-serif' }}>
                  Create New List
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
