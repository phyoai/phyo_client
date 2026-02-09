'use client'
import React from 'react';

const MessagesList = ({ contacts, selectedContact, onSelectContact }) => {
  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Search Bar */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search Messages"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button className="flex-1 py-3 px-4 text-sm font-medium text-gray-600 hover:text-gray-900 border-b-2 border-transparent hover:border-gray-300">
          Messages
        </button>
        <button className="flex-1 py-3 px-4 text-sm font-medium text-green-600 border-b-2 border-green-600 relative">
          Invitations
          <span className="absolute top-2 right-2 w-2 h-2 bg-green-500 rounded-full"></span>
        </button>
      </div>

      {/* Invitations Header */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900">Invitations</h3>
      </div>

      {/* Contacts List */}
      <div className="flex-1 overflow-y-auto">
        {contacts.map((contact) => (
          <div
            key={contact.id}
            onClick={() => onSelectContact(contact)}
            className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
              selectedContact?.id === contact.id ? 'bg-green-50 border-l-4 border-green-500' : ''
            }`}
          >
            <div className="flex items-center space-x-3">
              <img
                src={contact.avatar}
                alt={contact.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-gray-900 truncate">{contact.name}</h4>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    contact.status === 'Pending' 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {contact.status}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs text-gray-500">{contact.action}</p>
                  <span className="text-xs text-gray-400">{contact.time}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MessagesList;
