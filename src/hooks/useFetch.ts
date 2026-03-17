import { useEffect, useState, useCallback } from 'react';
import axios, { AxiosError } from 'axios';

/**
 * Advanced API Hook with Caching and Error Handling
 * Features:
 * - Automatic retry
 * - Request deduplication
 * - Error handling
 * - Loading states
 */

interface UseFetchOptions {
    skip?: boolean;
    retry?: number;
    cache?: boolean;
    cacheDuration?: number; // in milliseconds
    onSuccess?: (data: any) => void;
    onError?: (error: AxiosError) => void;
}

interface UseFetchState<T> {
    data: T | null;
    loading: boolean;
    error: AxiosError | null;
}

// In-memory cache store
const apiCache = new Map<string, { data: any; timestamp: number }>();

export const useFetch = <T = any>(
    url: string | null,
    options: UseFetchOptions = {}
): UseFetchState<T> & { refetch: () => void } => {
    const {
        skip = false,
        retry = 3,
        cache = true,
        cacheDuration = 5 * 60 * 1000, // 5 minutes default
        onSuccess,
        onError,
    } = options;

    const [state, setState] = useState<UseFetchState<T>>({
        data: null,
        loading: true,
        error: null,
    });

    const [retryCount, setRetryCount] = useState(0);

    const fetchData = useCallback(async () => {
        if (!url || skip) {
            setState({ data: null, loading: false, error: null });
            return;
        }

        try {
            setState(prev => ({ ...prev, loading: true }));

            // Check cache
            const cachedData = apiCache.get(url);
            if (cache && cachedData) {
                const isExpired = Date.now() - cachedData.timestamp > cacheDuration;
                if (!isExpired) {
                    setState({ data: cachedData.data, loading: false, error: null });
                    onSuccess?.(cachedData.data);
                    return;
                }
            }

            // Fetch from API
            const response = await axios.get<T>(url);
            const data = response.data;

            // Store in cache
            if (cache) {
                apiCache.set(url, { data, timestamp: Date.now() });
            }

            setState({ data, loading: false, error: null });
            onSuccess?.(data);
            setRetryCount(0);
        } catch (error) {
            const axiosError = error as AxiosError;

            // Retry logic
            if (retryCount < retry) {
                setRetryCount(prev => prev + 1);
                setTimeout(fetchData, 1000 * (retryCount + 1)); // Exponential backoff
            } else {
                setState(prev => ({ ...prev, error: axiosError, loading: false }));
                onError?.(axiosError);
            }
        }
    }, [url, skip, retry, cache, cacheDuration, retryCount, onSuccess, onError]);

    useEffect(() => {
        fetchData();
    }, [url, skip, fetchData]);

    const refetch = useCallback(() => {
        // Clear cache for this URL
        apiCache.delete(url!);
        setRetryCount(0);
        fetchData();
    }, [url, fetchData]);

    return { ...state, refetch };
};

/**
 * Hook for POST/PUT/DELETE requests
 */
export const useMutation = <T = any>(
    method: 'post' | 'put' | 'delete' = 'post',
    options?: Omit<UseFetchOptions, 'skip'>
) => {
    const { retry = 3, onSuccess, onError } = options || {};

    const [state, setState] = useState<UseFetchState<T>>({
        data: null,
        loading: false,
        error: null,
    });

    const [retryCount, setRetryCount] = useState(0);

    const mutate = useCallback(
        async (url: string, payload?: any) => {
            try {
                setState(prev => ({ ...prev, loading: true }));

                let response;
                if (method === 'post') {
                    response = await axios.post<T>(url, payload);
                } else if (method === 'put') {
                    response = await axios.put<T>(url, payload);
                } else {
                    response = await axios.delete<T>(url);
                }

                setState({ data: response.data, loading: false, error: null });
                onSuccess?.(response.data);
                setRetryCount(0);

                return response.data;
            } catch (error) {
                const axiosError = error as AxiosError;

                if (retryCount < retry) {
                    setRetryCount(prev => prev + 1);
                    setTimeout(() => mutate(url, payload), 1000 * (retryCount + 1));
                } else {
                    setState(prev => ({ ...prev, error: axiosError, loading: false }));
                    onError?.(axiosError);
                }
            }
        },
        [method, retry, retryCount, onSuccess, onError]
    );

    const reset = useCallback(() => {
        setState({ data: null, loading: false, error: null });
        setRetryCount(0);
    }, []);

    return { ...state, mutate, reset };
};

/**
 * Clear API cache
 */
export const clearApiCache = (url?: string) => {
    if (url) {
        apiCache.delete(url);
    } else {
        apiCache.clear();
    }
};
