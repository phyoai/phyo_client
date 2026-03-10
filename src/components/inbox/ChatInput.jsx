'use client'
import { useState, useRef, memo, useCallback } from 'react';
import { ClipboardLine, EmotionLine, SendPlane2Fill } from '@phyoofficial/phyo-icon-library';

const ChatInput = memo(({
  onSendMessage,
  onFileSelect = null,
  placeholder = 'Type your message here...',
}) => {
  const [message, setMessage] = useState('');
  const [showAttachments, setShowAttachments] = useState(false);
  const fileInputRef = useRef(null);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  }, [message, onSendMessage]);

  const handleFileClick = useCallback(() => {
    setShowAttachments(false);
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback((e) => {
    const file = e.target.files?.[0];
    if (file && onFileSelect) onFileSelect(file);
  }, [onFileSelect]);

  return (
    <div className="border-t border-neutral-muted p-4 bg-neutral-base">
      {/* Attachment Menu */}
      {showAttachments && (
        <div className="mb-3 bg-neutral-base border border-neutral-muted rounded-xl shadow-lg p-2 w-44">
          <button onClick={() => handleFileClick()} className="flex items-center gap-3 w-full p-2 hover:bg-neutral-muted rounded-lg transition-colors">
            <div className="w-8 h-8 bg-neutral-muted rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-text-muted" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"/>
              </svg>
            </div>
            <span className="text-sm text-text-base">Document</span>
          </button>
          <button onClick={() => handleFileClick()} className="flex items-center gap-3 w-full p-2 hover:bg-neutral-muted rounded-lg transition-colors">
            <div className="w-8 h-8 bg-neutral-muted rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-text-muted" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd"/>
              </svg>
            </div>
            <span className="text-sm text-text-base">Photo</span>
          </button>
        </div>
      )}

      {/* Input Row */}
      <form onSubmit={handleSubmit} className="flex items-end gap-2">
        <div className="flex-1 relative">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={placeholder}
            className="w-full px-4 py-3 pr-20 border border-neutral-muted rounded-xl bg-neutral-muted text-text-base placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-base focus:border-transparent text-sm"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <button
              type="button"
              onClick={() => setShowAttachments(!showAttachments)}
              className="p-1.5 text-text-muted hover:text-text-base transition-colors"
            >
              <ClipboardLine className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="p-1.5 text-text-muted hover:text-text-base transition-colors"
            >
              <EmotionLine className="h-4 w-4" />
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={!message.trim()}
          className="p-3 bg-brand-base text-white rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity flex-shrink-0"
        >
          <SendPlane2Fill className="h-5 w-5" />
        </button>
      </form>

      <input ref={fileInputRef} type="file" onChange={handleFileChange} className="hidden" accept="*/*" />
    </div>
  );
});

ChatInput.displayName = 'ChatInput';

export default ChatInput;
