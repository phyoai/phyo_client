import { useDispatch } from 'react-redux';
import type { AppDispatch } from '@/store';

/**
 * Custom hook to use dispatch with proper typing
 * Use this instead of useDispatch for better TypeScript support
 */
export const useAppDispatch = () => useDispatch<AppDispatch>();
