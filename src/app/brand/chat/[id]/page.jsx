'use client'
import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Smile, Paperclip, Mic } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function ChatPage({ params }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const influencerName = searchParams.get('name') || 'Influencer';
  const influencerId = params.id;

  const [messages, setMessages] = useState([
    { id: 1, sender: 'other', text: 'Campaign Chacha', timestamp: '18:09', type: 'text' },
    { id: 2, sender: 'other', text: 'typing...', timestamp: '', type: 'typing', isTyping: true },
    { id: 3, sender: 'me', file: { name: 'Document', pages: '1 page' }, timestamp: '18:13', type: 'document' },
    { id: 4, sender: 'other', text: 'Perfect! I will be ready.', timestamp: '18:15', type: 'text' },
    { id: 5, sender: 'other', text: 'Around 6 AM, I think.', timestamp: '18:14', type: 'text' },
    { id: 6, sender: 'me', text: 'Great! Can\'t wait to see you!', timestamp: '18:16', type: 'text' },
    { id: 7, sender: 'other', text: 'Same here! It\'s been a while.', timestamp: '18:17', type: 'text' },
    { id: 8, sender: 'me', file: { name: 'Document', pages: '1 page' }, timestamp: '18:18', type: 'document' },
    { id: 9, sender: 'other', text: 'Absolutely! How about a beach getaway next?', timestamp: '18:25', type: 'text' },
    { id: 10, sender: 'other', voice: { duration: '1:11' }, timestamp: '18:12', type: 'voice' },
    { id: 11, sender: 'me', voice: { duration: '1:11' }, timestamp: '18:12', type: 'voice' },
    { id: 12, sender: 'other', text: 'Count me in! We should consider a road trip too.', timestamp: '18:30', type: 'text' }
  ]);

  const [messageInput, setMessageInput] = useState('');
  const [showAttachments, setShowAttachments] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [pendingVoiceMessage, setPendingVoiceMessage] = useState(null);
  const [pendingAttachment, setPendingAttachment] = useState(null);
  const messagesEndRef = useRef(null);
  const documentInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Cleanup microphone and recording on unmount
  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();
        setIsRecording(false);
      }
      // Stop all audio tracks
      if (mediaRecorderRef.current?.stream) {
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isRecording]);

  const handleSendMessage = () => {
    // Send pending voice message
    if (pendingVoiceMessage) {
      setMessages([...messages, pendingVoiceMessage]);
      setPendingVoiceMessage(null);
      simulateTypingResponse();
      return;
    }

    // Send pending attachment
    if (pendingAttachment) {
      setMessages([...messages, pendingAttachment]);
      setPendingAttachment(null);
      simulateTypingResponse();
      return;
    }

    // Send text message
    if (messageInput.trim()) {
      const newMessage = {
        id: messages.length + 1,
        sender: 'me',
        text: messageInput,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        type: 'text'
      };
      setMessages([...messages, newMessage]);
      setMessageInput('');
      setShowAttachments(false);
      setShowEmojiPicker(false);

      simulateTypingResponse();
    }
  };

  const emojis = ['😀', '😂', '😍', '🥰', '😎', '🤔', '👍', '🎉', '🔥', '💯'];

  const handleDocumentUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const newMessage = {
        id: messages.length + 1,
        sender: 'me',
        file: { name: file.name, pages: '1 page' },
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        type: 'document'
      };
      setPendingAttachment(newMessage);
      setShowAttachments(false);
      documentInputRef.current.value = '';
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newMessage = {
          id: messages.length + 1,
          sender: 'me',
          image: event.target.result,
          imageName: file.name,
          timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          type: 'image'
        };
        setPendingAttachment(newMessage);
        setShowAttachments(false);
        imageInputRef.current.value = '';
      };
      reader.readAsDataURL(file);
    }
  };

  const simulateTypingResponse = () => {
    setTimeout(() => {
      setIsTyping(true);
      const typingMessage = {
        id: messages.length + 2,
        sender: 'other',
        text: 'typing...',
        timestamp: '',
        type: 'typing',
        isTyping: true
      };
      setMessages(prev => [...prev, typingMessage]);
    }, 500);

    setTimeout(() => {
      setMessages(prev => prev.filter(msg => !msg.isTyping));
      setIsTyping(false);
    }, 2000);
  };

  const handleVoiceRecord = async () => {
    if (!isRecording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (event) => {
          audioChunksRef.current.push(event.data);
        };

        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
          const audioUrl = URL.createObjectURL(audioBlob);

          // Generate random duration for demo
          const duration = `${Math.floor(Math.random() * 2) + 1}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`;

          const voiceMessage = {
            id: messages.length + 1,
            sender: 'me',
            voice: { duration, audioUrl },
            timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            type: 'voice'
          };

          // Store as pending message - user must click send to send it
          setPendingVoiceMessage(voiceMessage);
          setShowAttachments(false);

          // Stop all tracks
          stream.getTracks().forEach(track => track.stop());
        };

        mediaRecorder.start();
        setIsRecording(true);
      } catch (error) {
        console.error('Error accessing microphone:', error);
        alert('Please allow microphone access to record voice messages');
      }
    } else {
      // Stop recording
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
        setIsRecording(false);
      }
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Chat Header */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-700" />
          </button>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-gradient-to-br from-orange-300 to-red-400 flex-shrink-0"></div>
            <div className="min-w-0">
              <h3 className="text-base sm:text-lg font-semibold text-[#242527] truncate">{influencerName}</h3>
              <p className="text-xs sm:text-sm text-[#808080]">Online</p>
            </div>
          </div>
        </div>
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0">
          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </button>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-3 bg-white">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'} gap-2`}>
            {msg.type === 'typing' ? (
              <div className="bg-gray-200 rounded-2xl px-4 py-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            ) : msg.type === 'document' ? (
              <div className={`max-w-xs ${msg.sender === 'me' ? 'bg-[#43573b]' : 'bg-green-600'} text-white rounded-2xl p-4 ${msg.sender === 'me' ? 'rounded-br-none' : 'rounded-bl-none'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
                  </svg>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{msg.file.name}</p>
                    <p className="text-xs opacity-80">{msg.file.pages}</p>
                  </div>
                  <svg className="w-5 h-5 cursor-pointer hover:opacity-80" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                  </svg>
                </div>
                <p className="text-xs opacity-75">{msg.timestamp}</p>
              </div>
            ) : msg.type === 'voice' ? (
              <div className={`max-w-xs ${msg.sender === 'me' ? 'bg-[#43573b]' : 'bg-green-600'} text-white rounded-2xl p-4 ${msg.sender === 'me' ? 'rounded-br-none' : 'rounded-bl-none'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <audio controls className="h-8 w-32 sm:w-40">
                    <source src={msg.voice.audioUrl} type="audio/wav" />
                    Your browser does not support the audio element.
                  </audio>
                  <div className="flex-1">
                    <div className="flex gap-1 mb-1">
                      {[...Array(12)].map((_, i) => (
                        <div key={i} className="h-6 w-1 bg-white opacity-60 rounded-full" style={{ height: Math.random() * 20 + 8 + 'px' }}></div>
                      ))}
                    </div>
                    <p className="text-xs opacity-75">{msg.voice.duration}</p>
                  </div>
                </div>
                <p className="text-xs opacity-75">{msg.timestamp}</p>
              </div>
            ) : msg.type === 'image' ? (
              <div className={`max-w-xs ${msg.sender === 'me' ? 'rounded-br-none' : 'rounded-bl-none'}`}>
                <img
                  src={msg.image}
                  alt={msg.imageName}
                  className="rounded-2xl max-h-64 object-cover"
                />
                {msg.timestamp && <p className={`text-xs mt-1 ${msg.sender === 'me' ? 'text-gray-600' : 'text-gray-500'}`}>{msg.timestamp}</p>}
              </div>
            ) : (
              <div className={`max-w-xs sm:max-w-md px-4 py-3 rounded-2xl ${
                msg.sender === 'me'
                  ? 'bg-[#43573b] text-white rounded-br-none'
                  : 'bg-gray-100 text-[#242527] rounded-bl-none'
              }`}>
                <p className="text-sm">{msg.text}</p>
                {msg.timestamp && <p className={`text-xs mt-1 ${msg.sender === 'me' ? 'text-gray-300' : 'text-gray-500'}`}>{msg.timestamp}</p>}
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div className="px-4 sm:px-6 py-3 border-t border-gray-200 bg-white">
          <div className="flex flex-wrap gap-2 justify-center">
            {emojis.map((emoji, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setMessageInput(messageInput + emoji);
                  setShowEmojiPicker(false);
                }}
                className="text-2xl hover:scale-125 transition-transform"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Attachment Panel */}
      {showAttachments && (
        <div className="px-4 sm:px-6 py-4 border-t border-gray-200 bg-white">
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => documentInputRef.current?.click()}
              className="flex flex-col items-center gap-2 p-3 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-7 h-7 text-[#43573b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="text-xs sm:text-sm text-[#808080]">Document</span>
            </button>
            <button
              onClick={() => imageInputRef.current?.click()}
              className="flex flex-col items-center gap-2 p-3 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-7 h-7 text-[#43573b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-xs sm:text-sm text-[#808080]">Gallery</span>
            </button>
            <button
              onClick={handleVoiceRecord}
              className={`flex flex-col items-center gap-2 p-3 rounded-lg transition-colors ${isRecording ? 'bg-red-100' : 'hover:bg-gray-100'}`}
            >
              <svg className={`w-7 h-7 ${isRecording ? 'text-red-600' : 'text-[#43573b]'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
              <span className="text-xs sm:text-sm text-[#808080]">{isRecording ? 'Recording...' : 'Voice'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Hidden File Inputs */}
      <input
        ref={documentInputRef}
        type="file"
        accept=".pdf,.doc,.docx,.txt,.xls,.xlsx"
        onChange={handleDocumentUpload}
        className="hidden"
      />
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />

      {/* Pending Attachment Preview */}
      {(pendingVoiceMessage || pendingAttachment) && (
        <div className="px-4 sm:px-6 py-3 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
          <div className="flex-1">
            {pendingVoiceMessage && (
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-[#43573b]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 1C6.48 1 2 5.48 2 11s4.48 10 10 10 10-4.48 10-10S17.52 1 12 1zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm0-12.5c-2.49 0-4.5 2.01-4.5 4.5S9.51 15.5 12 15.5s4.5-2.01 4.5-4.5-2.01-4.5-4.5-4.5z"/>
                </svg>
                <span className="text-sm text-gray-700">Voice message ready to send</span>
              </div>
            )}
            {pendingAttachment && (
              <div className="flex items-center gap-2">
                {pendingAttachment.type === 'image' ? (
                  <>
                    <svg className="w-5 h-5 text-[#43573b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm text-gray-700">Image ready to send</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 text-[#43573b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="text-sm text-gray-700">{pendingAttachment.file.name}</span>
                  </>
                )}
              </div>
            )}
          </div>
          <button
            onClick={() => {
              setPendingVoiceMessage(null);
              setPendingAttachment(null);
            }}
            className="ml-2 text-gray-500 hover:text-gray-700"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/>
            </svg>
          </button>
        </div>
      )}

      {/* Message Input */}
      <div className="px-4 sm:px-6 py-4 border-t border-gray-200 bg-white">
        <div className="flex items-end gap-2 sm:gap-3">
          <div className="flex-1 flex items-center gap-2 bg-gray-100 rounded-full px-4 py-3">
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="p-1.5 hover:bg-gray-200 rounded-full transition-colors flex-shrink-0"
            >
              <Smile className="w-5 h-5 text-[#43573b]" />
            </button>
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type a message..."
              className="flex-1 bg-transparent text-sm sm:text-base focus:outline-none text-[#242527] placeholder-gray-400"
            />
            <button
              onClick={() => setShowAttachments(!showAttachments)}
              className="p-1.5 hover:bg-gray-200 rounded-full transition-colors flex-shrink-0"
            >
              <Paperclip className="w-5 h-5 text-[#43573b]" />
            </button>
            <button
              onClick={handleVoiceRecord}
              className={`p-1.5 rounded-full transition-colors flex-shrink-0 ${isRecording ? 'bg-red-200' : 'hover:bg-gray-200'}`}
            >
              <Mic className={`w-5 h-5 ${isRecording ? 'text-red-600' : 'text-[#43573b]'}`} />
            </button>
          </div>
          <button
            onClick={handleSendMessage}
            className="p-2.5 sm:p-3 bg-[#43573b] text-white rounded-full hover:bg-[#374829] transition-colors flex-shrink-0"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M16.6915026,12.4744748 L3.50612381,13.2599618 C3.19218622,13.2599618 3.03521743,13.4170592 3.03521743,13.5741566 L1.15159189,20.0151496 C0.8376543,20.8006365 0.99,21.89 1.77946707,22.52 C2.41,22.99 3.50612381,23.1 4.13399899,22.8429026 L21.714504,14.0454487 C22.6563168,13.5741566 23.1272231,12.6315722 22.9702544,11.6889879 L4.13399899,1.16350578 C3.34915502,0.9 2.40734225,0.99 1.77946707,1.4772935 C0.994623095,2.10604706 0.837654326,3.0486314 1.15159189,3.99721575 L3.03521743,10.4382088 C3.03521743,10.5953061 3.19218622,10.7524035 3.50612381,10.7524035 L16.6915026,11.5378905 C16.6915026,11.5378905 17.1624089,11.5378905 17.1624089,12.0091827 C17.1624089,12.4804748 16.6915026,12.4744748 16.6915026,12.4744748 Z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
