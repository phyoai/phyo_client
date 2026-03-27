'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, AlertCircle, Trash2, Plus } from 'lucide-react';
import { accountApi } from '@/api/account-api';

export default function MyLists() {
  const router = useRouter();
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showNewListModal, setShowNewListModal] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [newListType, setNewListType] = useState('custom');
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch lists on mount
  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await accountApi.getLists();
        setLists(response || []);
      } catch (err) {
        setError(err?.message || 'Failed to load lists');
        console.error('Error fetching lists:', err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handleCreateList = async () => {
    if (!newListName.trim()) {
      setError('List name is required');
      return;
    }

    try {
      setActionLoading(true);
      const newList = await accountApi.createList({
        name: newListName.trim(),
        type: newListType,
      });
      setLists([...lists, newList]);
      setNewListName('');
      setNewListType('custom');
      setShowNewListModal(false);
      setError(null);
    } catch (err) {
      setError(err?.message || 'Failed to create list');
      console.error('Error creating list:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteList = async (listId) => {
    try {
      setActionLoading(true);
      // Note: deleteList method doesn't exist in account-api yet
      // For now, we'll remove from UI optimistically
      // TODO: Add deleteList method to account-api
      setLists(lists.filter(l => l.id !== listId));
      setError(null);
    } catch (err) {
      setError(err?.message || 'Failed to delete list');
      console.error('Error deleting list:', err);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-semibold">My Lists</h1>
        </div>
        <button
          onClick={() => setShowNewListModal(true)}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 m-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-red-800">{error}</p>
          </div>
          <button
            onClick={() => setError(null)}
            className="text-red-600 hover:text-red-700 text-sm font-medium"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="p-4 space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && lists.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 px-4">
          <p className="text-center text-gray-500 text-lg">No lists created yet</p>
          <p className="text-center text-gray-400 text-sm mt-2">Create your first list to organize items</p>
        </div>
      )}

      {/* Lists Grid */}
      {!loading && lists.length > 0 && (
        <div className="p-4 space-y-4">
          {lists.map(list => (
            <div
              key={list.id}
              className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => router.push(`/brand/account/my-lists/${list.id}`)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{list.name}</h3>
                  {list.description && (
                    <p className="text-sm text-gray-500 mt-1">{list.description}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-2">
                    {list.type} • {list.itemCount} {list.itemCount === 1 ? 'item' : 'items'}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteList(list.id);
                  }}
                  disabled={actionLoading}
                  className="p-2 hover:bg-red-50 rounded-full disabled:opacity-50"
                >
                  <Trash2 className="w-5 h-5 text-red-600" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New List Modal */}
      {showNewListModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full shadow-lg">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-xl font-semibold">Create New List</h2>
            </div>

            <div className="px-6 py-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  List Name
                </label>
                <input
                  type="text"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCreateList()}
                  placeholder="Enter list name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type
                </label>
                <select
                  value={newListType}
                  onChange={(e) => setNewListType(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="custom">Custom</option>
                  <option value="campaigns">Campaigns</option>
                  <option value="influencers">Influencers</option>
                  <option value="brands">Brands</option>
                </select>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 flex gap-2 justify-end">
              <button
                onClick={() => {
                  setShowNewListModal(false);
                  setNewListName('');
                  setNewListType('custom');
                }}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateList}
                disabled={actionLoading || !newListName.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {actionLoading ? 'Creating...' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
