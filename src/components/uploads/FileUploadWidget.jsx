'use client';

import React, { useRef, useState } from 'react';
import { useFile } from '@/hooks/useFile';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

/**
 * File Upload Widget Component (TIER 5)
 * Drag-drop area, progress bar, file validation
 * Calls uploadImage() and updateUploadProgress()
 */
const FileUploadWidget = ({ conversationId, onUploadSuccess }) => {
  const fileInputRef = useRef(null);
  const { uploadImage, uploading, uploadProgress, error, clearError } = useFile();

  const [dragActive, setDragActive] = useState(false);
  const [validationError, setValidationError] = useState('');

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

  const validateFile = (file) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      setValidationError('Only JPEG, PNG, GIF, and WebP images are allowed');
      return false;
    }
    if (file.size > MAX_FILE_SIZE) {
      setValidationError('File size must be less than 5MB');
      return false;
    }
    setValidationError('');
    return true;
  };

  const handleFile = async (file) => {
    if (!validateFile(file)) return;

    try {
      await uploadImage(file, conversationId);
      onUploadSuccess && onUploadSuccess();
    } catch (err) {
      console.error('Upload failed:', err);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleChange = (e) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <Card
        className={`border-2 border-dashed transition cursor-pointer ${
          dragActive
            ? 'border-brand-base bg-brand-base/5'
            : 'border-neutral-muted hover:border-brand-base'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={ALLOWED_TYPES.join(',')}
          onChange={handleChange}
          style={{ display: 'none' }}
          disabled={uploading}
        />

        <div
          className="p-12 text-center cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="text-4xl mb-3">📸</div>
          <h3 className="font-semibold text-lg">Drag and drop your image</h3>
          <p className="text-sm text-neutral-text mt-2">
            or click to select from your computer
          </p>
          <p className="text-xs text-neutral-text mt-3">
            Supported: JPEG, PNG, GIF, WebP (max 5MB)
          </p>
        </div>
      </Card>

      {/* Validation Error */}
      {validationError && (
        <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg">
          {validationError}
        </div>
      )}

      {/* Upload Error */}
      {error && (
        <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg flex items-center justify-between">
          <span>{error}</span>
          <Button variant="secondary" size="sm" onClick={clearError}>
            Dismiss
          </Button>
        </div>
      )}

      {/* Progress Bar */}
      {uploading && (
        <Card>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Uploading...</span>
              <span className="text-sm font-semibold">{uploadProgress}%</span>
            </div>
            <div className="w-full bg-neutral-muted rounded-full h-3">
              <div
                className="bg-brand-base h-3 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        </Card>
      )}

      {/* Success Message */}
      {!uploading && uploadProgress === 100 && !error && (
        <div className="p-3 bg-green-50 text-green-700 text-sm rounded-lg">
          ✓ File uploaded successfully
        </div>
      )}
    </div>
  );
};

export default FileUploadWidget;
