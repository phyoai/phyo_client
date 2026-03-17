'use client';

import React, { useState } from 'react';
import { useMessaging } from '@/hooks/useMessaging';
import Button from '@/components/ui/Button';

/**
 * Message Actions Component (TIER 6)
 * Context menu on messages with delete option
 * Calls removeMessage() on confirm
 */
const MessageActions = ({ messageId, onDelete }) => {
  const { removeMessage, loading } = useMessaging();
  const [showMenu, setShowMenu] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    try {
      await removeMessage(messageId);
      onDelete && onDelete();
      setShowConfirm(false);
      setShowMenu(false);
    } catch (err) {
      console.error('Failed to delete message:', err);
    }
  };

  return (
    <div className="relative">
      {/* Menu Button */}
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="p-1 hover:bg-neutral-muted rounded transition"
        title="Message actions"
      >
        ⋮
      </button>

      {/* Dropdown Menu */}
      {showMenu && (
        <div className="absolute right-0 top-full mt-1 bg-white border border-neutral-muted rounded-lg shadow-lg z-10 min-w-max">
          {!showConfirm ? (
            <button
              onClick={() => setShowConfirm(true)}
              className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 transition"
              disabled={loading}
            >
              Delete Message
            </button>
          ) : (
            <div className="p-3 text-sm">
              <p className="mb-3 text-neutral-text">Delete this message?</p>
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
    </div>
  );
};

export default MessageActions;
