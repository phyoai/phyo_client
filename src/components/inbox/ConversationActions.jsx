'use client';

import React, { useState } from 'react';
import { useMessaging } from '@/hooks/useMessaging';
import Button from '@/components/ui/Button';

/**
 * Conversation Actions Component (TIER 6)
 * Long-press or menu on conversations with delete option
 * Calls removeConversation() on confirm
 */
const ConversationActions = ({ conversationId, onDelete }) => {
  const { removeConversation, loading } = useMessaging();
  const [showMenu, setShowMenu] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    try {
      await removeConversation(conversationId);
      onDelete && onDelete();
      setShowConfirm(false);
      setShowMenu(false);
    } catch (err) {
      console.error('Failed to delete conversation:', err);
    }
  };

  return (
    <div className="relative">
      {/* Menu Button */}
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="p-2 hover:bg-neutral-muted rounded-lg transition"
        title="Conversation actions"
      >
        ⋮
      </button>

      {/* Dropdown Menu */}
      {showMenu && (
        <div className="absolute right-0 top-full mt-1 bg-white border border-neutral-muted rounded-lg shadow-lg z-10 min-w-max">
          {!showConfirm ? (
            <button
              onClick={() => setShowConfirm(true)}
              className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 transition disabled:opacity-50"
              disabled={loading}
            >
              Delete Conversation
            </button>
          ) : (
            <div className="p-3 text-sm">
              <p className="mb-3 font-medium">Delete this conversation?</p>
              <p className="text-xs text-neutral-text mb-3">
                This action cannot be undone. All messages will be deleted.
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outlined"
                  size="sm"
                  onClick={handleDelete}
                  disabled={loading}
                  className="text-red-600"
                >
                  {loading ? 'Deleting...' : 'Delete'}
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowConfirm(false)}
                  disabled={loading}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Click outside to close */}
      {showMenu && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowMenu(false)}
        />
      )}
    </div>
  );
};

export default ConversationActions;
