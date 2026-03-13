'use client';

import { useState, useCallback, useEffect } from 'react';
import { AxiosError } from 'axios';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: AxiosError | null;
}

/**
 * Custom hook for making API calls with loading and error states
 * Usage:
 * const { data, loading, error, execute } = useApi(apiFunction);
 * await execute(params);
 */
export const useApi = <T,>(apiFunction: (...args: any[]) => Promise<T>) => {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null
  });

  const execute = useCallback(
    async (...args: any[]) => {
      setState({ data: null, loading: true, error: null });
      try {
        const result = await apiFunction(...args);
        setState({ data: result, loading: false, error: null });
        return result;
      } catch (error) {
        const axiosError = error as AxiosError;
        setState({ data: null, loading: false, error: axiosError });
        throw axiosError;
      }
    },
    [apiFunction]
  );

  return { ...state, execute };
};

/**
 * Custom hook for fetching data on component mount
 * Usage:
 * const { data, loading, error } = useApiQuery(apiFunction, [dependency1, dependency2]);
 */
export const useApiQuery = <T,>(
  apiFunction: (...args: any[]) => Promise<T>,
  dependencies: any[] = [],
  args?: any[]
) => {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    const fetchData = async () => {
      setState({ data: null, loading: true, error: null });
      try {
        const result = await apiFunction(...(args || []));
        setState({ data: result, loading: false, error: null });
      } catch (error) {
        const axiosError = error as AxiosError;
        setState({ data: null, loading: false, error: axiosError });
      }
    };

    fetchData();
  }, dependencies);

  return state;
};

/**
 * Custom hook for managing authenticated user state
 * Usage:
 * const { user, isAuthenticated, loading } = useAuth();
 */
export const useAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (token) {
          // You can validate the token here if needed
          setIsAuthenticated(true);
          // Optionally fetch user profile
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  return { user, isAuthenticated, loading };
};

/**
 * Custom hook for pagination
 * Usage:
 * const { page, limit, total, pages, nextPage, prevPage, goToPage } = usePagination(total, 10);
 */
export const usePagination = (total: number = 0, limit: number = 10) => {
  const [page, setPage] = useState(1);

  const pages = Math.ceil(total / limit);

  const nextPage = useCallback(() => {
    setPage((prev) => (prev < pages ? prev + 1 : prev));
  }, [pages]);

  const prevPage = useCallback(() => {
    setPage((prev) => (prev > 1 ? prev - 1 : prev));
  }, []);

  const goToPage = useCallback((newPage: number) => {
    if (newPage >= 1 && newPage <= pages) {
      setPage(newPage);
    }
  }, [pages]);

  return { page, limit, total, pages, nextPage, prevPage, goToPage };
};

/**
 * Custom hook for handling form submission with API calls
 * Usage:
 * const { submit, loading, error } = useApiMutation(apiFunction);
 * await submit(data);
 */
export const useApiMutation = <T, D>(
  apiFunction: (data: D) => Promise<T>
) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AxiosError | null>(null);

  const submit = useCallback(
    async (data: D) => {
      setLoading(true);
      setError(null);
      try {
        const result = await apiFunction(data);
        setLoading(false);
        return result;
      } catch (err) {
        const axiosError = err as AxiosError;
        setError(axiosError);
        setLoading(false);
        throw axiosError;
      }
    },
    [apiFunction]
  );

  return { submit, loading, error };
};
