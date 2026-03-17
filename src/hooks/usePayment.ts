'use client';

import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getSubscriptionPlans,
  getUserPlan,
  getCreditInfo,
  createPaymentOrder,
  verifyPayment,
  getPaymentHistory,
  cancelSubscription,
  clearPaymentError,
  clearCurrentOrder,
} from '@/store/slices/paymentSlice';

export const usePayment = () => {
  const dispatch = useDispatch();
  const paymentState = useSelector((state: any) => state.payment);

  // State
  const {
    plans,
    userPlan,
    creditInfo,
    paymentHistory,
    currentOrder,
    loading,
    error,
    pagination,
  } = paymentState;

  // Actions
  const fetchSubscriptionPlans = useCallback(() => {
    return dispatch(getSubscriptionPlans() as any);
  }, [dispatch]);

  const fetchUserPlan = useCallback(() => {
    return dispatch(getUserPlan() as any);
  }, [dispatch]);

  const fetchCreditInfo = useCallback(() => {
    return dispatch(getCreditInfo() as any);
  }, [dispatch]);

  const createNewPaymentOrder = useCallback(
    (planId: string, interval: string) => {
      return dispatch(createPaymentOrder({ planId, interval }) as any);
    },
    [dispatch]
  );

  const verifyNewPayment = useCallback(
    (
      razorpayOrderId: string,
      razorpayPaymentId: string,
      razorpaySignature: string,
      planId: string
    ) => {
      return dispatch(
        verifyPayment({
          razorpayOrderId,
          razorpayPaymentId,
          razorpaySignature,
          planId,
        }) as any
      );
    },
    [dispatch]
  );

  const fetchPaymentHistory = useCallback(
    (page = 1, limit = 10) => {
      return dispatch(getPaymentHistory({ page, limit }) as any);
    },
    [dispatch]
  );

  const cancelCurrentSubscription = useCallback(() => {
    return dispatch(cancelSubscription() as any);
  }, [dispatch]);

  const clearError = useCallback(() => {
    dispatch(clearPaymentError() as any);
  }, [dispatch]);

  const clearOrder = useCallback(() => {
    dispatch(clearCurrentOrder() as any);
  }, [dispatch]);

  return {
    // State
    plans,
    userPlan,
    creditInfo,
    paymentHistory,
    currentOrder,
    loading,
    error,
    pagination,

    // Actions
    fetchSubscriptionPlans,
    fetchUserPlan,
    fetchCreditInfo,
    createNewPaymentOrder,
    verifyNewPayment,
    fetchPaymentHistory,
    cancelCurrentSubscription,
    clearError,
    clearOrder,
  };
};
