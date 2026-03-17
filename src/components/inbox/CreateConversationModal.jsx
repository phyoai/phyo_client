'use client';

import React, { useState, useEffect } from 'react';
import { useMessaging } from '@/hooks/useMessaging';
import { useUser } from '@/hooks/useUser';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

/**
 * Create Conversation Modal Component (TIER 6)
 * Search user input with async suggestions
 * Calls createNewConversation() on select
 */
const CreateConversationModal = ({ isOpen, onClose, onSuccess }) => {
  const { createNewConversation, loading } = useMessaging();
  const { users, fetchUsers } = useUser();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen]);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = async () => {
    if (!selectedUser) {
      setError('Please select a user');
      return;
    }

    try {
      await createNewConversation(selectedUser._id);
      onSuccess && onSuccess();
      handleClose();
    } catch (err) {
      setError(err.message || 'Failed to create conversation');
    }
  };

  const handleClose = () => {
    setSearchTerm('');
    setSelectedUser(null);
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Start Conversation</h2>
          <button
            onClick={handleClose}
            className="text-neutral-text hover:text-text-base"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* Search Input */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-neutral-muted rounded-lg focus:outline-none focus:border-brand-base"
            autoFocus
          />
        </div>

        {/* Suggestions */}
        <div className="mb-4 max-h-64 overflow-y-auto border border-neutral-muted rounded-lg">
          {filteredUsers.length === 0 ? (
            <div className="p-4 text-center text-neutral-text text-sm">
              {searchTerm ? 'No users found' : 'Start typing to search'}
            </div>
          ) : (
            <div className="divide-y divide-neutral-muted">
              {filteredUsers.map(user => (
                <button
                  key={user._id}
                  onClick={() => setSelectedUser(user)}
                  className={`w-full text-left p-3 hover:bg-neutral-muted/50 transition ${
                    selectedUser?._id === user._id ? 'bg-brand-base/10' : ''
                  }`}
                >
                  <div className="font-medium">{user.name}</div>
                  <div className="text-xs text-neutral-text">{user.email}</div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Selected User Display */}
        {selectedUser && (
          <div className="p-3 bg-brand-base/10 rounded-lg mb-4">
            <p className="text-sm">Selected: <strong>{selectedUser.name}</strong></p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant="primary"
            fullWidth
            onClick={handleCreate}
            disabled={!selectedUser || loading}
          >
            {loading ? 'Creating...' : 'Create Conversation'}
          </Button>
          <Button
            variant="secondary"
            fullWidth
            onClick={handleClose}
            disabled={loading}
          >
            Cancel
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default CreateConversationModal;
