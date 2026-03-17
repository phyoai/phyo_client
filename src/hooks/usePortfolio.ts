'use client';

import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getPortfolioItems,
  getPortfolioItem,
  createPortfolioItem,
  updatePortfolioItem,
  deletePortfolioItem,
  addClientToPortfolio,
  updatePortfolioClient,
  removePortfolioClient,
  getPortfolioStats,
  selectPortfolioItem,
  clearPortfolio,
} from '@/store/slices/portfolioSlice';

export const usePortfolio = () => {
  const dispatch = useDispatch();
  const state = useSelector((state: any) => state.portfolio);

  // State
  const {
    portfolioItems,
    selectedItem,
    portfolioStats,
    categories,
    loading,
    error,
    pagination,
  } = state;

  // Actions
  const fetchPortfolioItems = useCallback(
    (page = 1, limit = 10) => {
      return dispatch(getPortfolioItems({ page, limit }) as any);
    },
    [dispatch]
  );

  const fetchPortfolioItem = useCallback(
    (id: string) => {
      return dispatch(getPortfolioItem(id) as any);
    },
    [dispatch]
  );

  const createNewPortfolioItem = useCallback(
    (itemData: { title: string; description: string }) => {
      return dispatch(createPortfolioItem(itemData) as any);
    },
    [dispatch]
  );

  const updateExistingPortfolioItem = useCallback(
    (id: string, itemData: any) => {
      return dispatch(updatePortfolioItem({ id, itemData }) as any);
    },
    [dispatch]
  );

  const removePortfolioItem = useCallback(
    (id: string) => {
      return dispatch(deletePortfolioItem(id) as any);
    },
    [dispatch]
  );

  const addClient = useCallback(
    (portfolioId: string, clientData: any) => {
      return dispatch(addClientToPortfolio({ portfolioId, clientData }) as any);
    },
    [dispatch]
  );

  const updateClient = useCallback(
    (portfolioId: string, clientId: string, clientData: any) => {
      return dispatch(updatePortfolioClient({ portfolioId, clientId, clientData }) as any);
    },
    [dispatch]
  );

  const removeClient = useCallback(
    (portfolioId: string, clientId: string) => {
      return dispatch(removePortfolioClient({ portfolioId, clientId }) as any);
    },
    [dispatch]
  );

  const fetchStats = useCallback(() => {
    return dispatch(getPortfolioStats() as any);
  }, [dispatch]);

  const selectNewPortfolioItem = useCallback(
    (item) => {
      dispatch(selectPortfolioItem(item) as any);
    },
    [dispatch]
  );

  const clearAll = useCallback(() => {
    dispatch(clearPortfolio() as any);
  }, [dispatch]);

  return {
    // State
    portfolioItems,
    selectedItem,
    portfolioStats,
    categories,
    loading,
    error,
    pagination,

    // Actions
    fetchPortfolioItems,
    fetchPortfolioItem,
    createNewPortfolioItem,
    updateExistingPortfolioItem,
    removePortfolioItem,
    addClient,
    updateClient,
    removeClient,
    fetchStats,
    selectNewPortfolioItem,
    clearAll,
  };
};
