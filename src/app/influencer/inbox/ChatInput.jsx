'use client'
import React, { useState, useRef } from 'react';
import { Paperclip, Smile, Send } from 'lucide-react';
import { SendPlane2Fill, SendPlaneFill } from '@phyoofficial/phyo-icon-library';

const ChatInput = ({ onSendMessage, onFileSelect }) => {
  const [message, setMessage] = useState('');
  const [showAttachments, setShowAttachments] = useState(false);
  const fileInputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleFileClick = (type) => {
    setShowAttachments(false);
    // In a real app, you'd handle different file types differently
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <div className="border-t border-gray-200 p-4">
      {/* Attachment Menu */}
      {showAttachments && (
        <div className="mb-4 bg-white border border-gray-200 rounded-lg shadow-lg p-2 w-48">
          <button
            onClick={() => handleFileClick('document')}
            className="flex items-center space-x-3 w-full p-2 hover:bg-gray-50 rounded"
          >
            <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
              <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"/>
              </svg>
            </div>
            <span className="text-sm text-gray-700">Document</span>
          </button>

          <button
            onClick={() => handleFileClick('video')}
            className="flex items-center space-x-3 w-full p-2 hover:bg-gray-50 rounded"
          >
            <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
              <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"/>
              </svg>
            </div>
            <span className="text-sm text-gray-700">Video</span>
          </button>

          <button
            onClick={() => handleFileClick('photo')}
            className="flex items-center space-x-3 w-full p-2 hover:bg-gray-50 rounded"
          >
            <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
              <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd"/>
              </svg>
            </div>
            <span className="text-sm text-gray-700">Photo</span>
          </button>
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex items-end space-x-2">
        <div className="flex-1 relative">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message here..."
            className="w-full px-4 py-3 pr-20 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          
          {/* Input Actions */}
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
            <button
              type="button"
              onClick={() => setShowAttachments(!showAttachments)}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Paperclip className="h-5 w-5" />
            </button>
            <button
              type="button"
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Smile className="h-5 w-5" />
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={!message.trim()}
          className="bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <SendPlane2Fill className="h-5 w-5" />
        </button>
      </form>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileChange}
        className="hidden"
        accept="*/*"
      />
    </div>
  );
};

export default ChatInput;