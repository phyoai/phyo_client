import { useDispatch, useSelector } from 'react-redux';
import {
  getBrands,
  getTrendingBrands,
  getMyBrand,
  getBrandById,
  createBrand,
  updateBrand,
  deleteBrand,
  resetSelectedBrand,
  clearError,
} from '@/store/slices/brandSlice';
import { useCallback } from 'react';

/**
 * Custom hook for brand operations
 * Provides easy access to brands state and dispatch actions
 */
export const useBrands = () => {
  const dispatch = useDispatch();
  const {
    brands,
    trendingBrands,
    myBrand,
    selectedBrand,
    loading,
    error,
    pagination,
  } = useSelector((state: any) => state.brand);

  const fetchBrands = useCallback(
    (params?: any) => {
      dispatch(getBrands(params) as any);
    },
    [dispatch]
  );

  const fetchTrendingBrands = useCallback(
    (params?: any) => {
      dispatch(getTrendingBrands(params) as any);
    },
    [dispatch]
  );

  const fetchMyBrand = useCallback(() => {
    dispatch(getMyBrand() as any);
  }, [dispatch]);

  const fetchBrandById = useCallback(
    (id: string) => {
      dispatch(getBrandById(id) as any);
    },
    [dispatch]
  );

  const createNewBrand = useCallback(
    (data: any) => {
      dispatch(createBrand(data) as any);
    },
    [dispatch]
  );

  const updateExistingBrand = useCallback(
    (id: string, data: any) => {
      dispatch(updateBrand({ id, data }) as any);
    },
    [dispatch]
  );

  const removeBrand = useCallback(
    (id: string) => {
      dispatch(deleteBrand(id) as any);
    },
    [dispatch]
  );

  const clearSelectedBrandData = useCallback(() => {
    dispatch(resetSelectedBrand() as any);
  }, [dispatch]);

  const clearErrorMessage = useCallback(() => {
    dispatch(clearError() as any);
  }, [dispatch]);

  return {
    // State
    brands,
    trendingBrands,
    myBrand,
    selectedBrand,
    loading,
    error,
    pagination,
    // Actions
    fetchBrands,
    fetchTrendingBrands,
    fetchMyBrand,
    fetchBrandById,
    createNewBrand,
    updateExistingBrand,
    removeBrand,
    clearSelectedBrandData,
    clearErrorMessage,
  };
};
