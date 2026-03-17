'use client';

import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  uploadChatImage,
  deleteChatImage,
  setUploadProgress,
  clearUploadError,
  clearCurrentFile,
} from '@/store/slices/fileSlice';

export const useFile = () => {
  const dispatch = useDispatch();
  const fileState = useSelector((state: any) => state.file);

  // State
  const { uploadedFiles, currentFile, uploading, uploadProgress, error } = fileState;

  // Actions
  const uploadImage = useCallback(
    (file: File, conversationId: string) => {
      return dispatch(uploadChatImage({ file, conversationId }) as any);
    },
    [dispatch]
  );

  const deleteImage = useCallback(
    (key: string) => {
      return dispatch(deleteChatImage(key) as any);
    },
    [dispatch]
  );

  const updateUploadProgress = useCallback(
    (progress: number) => {
      dispatch(setUploadProgress(progress) as any);
    },
    [dispatch]
  );

  const clearError = useCallback(() => {
    dispatch(clearUploadError() as any);
  }, [dispatch]);

  const clearFile = useCallback(() => {
    dispatch(clearCurrentFile() as any);
  }, [dispatch]);

  return {
    // State
    uploadedFiles,
    currentFile,
    uploading,
    uploadProgress,
    error,

    // Actions
    uploadImage,
    deleteImage,
    updateUploadProgress,
    clearError,
    clearFile,
  };
};
