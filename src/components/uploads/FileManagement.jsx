'use client';

import React, { useEffect } from 'react';
import { useFile } from '@/hooks/useFile';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

/**
 * File Management Component (TIER 5)
 * Display uploaded files, copy URL, delete button
 * Calls deleteImage() on delete
 */
const FileManagement = () => {
  const { uploadedFiles, loading, error, deleteImage } = useFile();

  const handleCopyUrl = (url) => {
    navigator.clipboard.writeText(url);
  };

  const handleDelete = async (key) => {
    if (confirm('Are you sure you want to delete this file?')) {
      await deleteImage(key);
    }
  };

  if (loading && !uploadedFiles.length) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-16 bg-neutral-muted rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      {uploadedFiles.length === 0 ? (
        <Card className="text-center py-8">
          <p className="text-neutral-text">No files uploaded yet</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {uploadedFiles.map(file => (
            <Card key={file.key} className="flex items-center justify-between">
              <div className="flex-1">
                <h4 className="font-medium">{file.fileName}</h4>
                <p className="text-xs text-neutral-text mt-1">
                  {(file.fileSize / 1024).toFixed(2)} KB • Uploaded{' '}
                  {new Date(file.uploadedAt).toLocaleDateString()}
                </p>
                <div className="mt-2 p-2 bg-neutral-muted rounded text-xs font-mono break-all">
                  {file.url}
                </div>
              </div>

              <div className="flex gap-2 ml-4 flex-shrink-0">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleCopyUrl(file.url)}
                  title="Copy URL to clipboard"
                >
                  Copy
                </Button>
                <Button
                  variant="outlined"
                  size="sm"
                  onClick={() => handleDelete(file.key)}
                  title="Delete file"
                >
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileManagement;
