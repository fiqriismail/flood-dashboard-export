'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiClient, fetchFloodData, type FetchFloodDataOptions } from './api-client';
import type { FloodDataResponse } from './api-types';

interface UseApiOptions<T> {
    /** Whether to fetch data immediately on mount */
    immediate?: boolean;
    /** Initial data value */
    initialData?: T;
    /** Optional endpoint path (leave empty for base URL) */
    endpoint?: string;
}

interface UseApiReturn<T> {
    /** The fetched data */
    data: T | null;
    /** Loading state */
    loading: boolean;
    /** Error message if request failed */
    error: string | null;
    /** HTTP status code */
    status: number | null;
    /** Function to manually trigger a fetch */
    refetch: () => Promise<void>;
}

/**
 * React hook for fetching data from the Supabase Public API
 * 
 * @example
 * ```tsx
 * const { data, loading, error, refetch } = useApi({
 *   immediate: true,
 *   endpoint: '/some-path' // optional
 * });
 * ```
 */
export function useApi<T = unknown>(
    options: UseApiOptions<T> = {}
): UseApiReturn<T> {
    const { immediate = false, initialData = null, endpoint = '' } = options;

    const [data, setData] = useState<T | null>(initialData);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [status, setStatus] = useState<number | null>(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);

        const response = await apiClient.get<T>(endpoint);

        setStatus(response.status);

        if (response.error) {
            setError(response.error);
            setData(null);
        } else {
            setData(response.data || null);
        }

        setLoading(false);
    }, [endpoint]);

    useEffect(() => {
        if (immediate) {
            // Use setTimeout to avoid 'set-state-in-effect' warning
            const timer = setTimeout(() => {
                fetchData();
            }, 0);
            return () => clearTimeout(timer);
        }
    }, [immediate, fetchData]);

    return {
        data,
        loading,
        error,
        status,
        refetch: fetchData,
    };
}

/**
 * React hook for making POST requests to the API
 */
export function useApiPost<TRequest = unknown, TResponse = unknown>() {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [status, setStatus] = useState<number | null>(null);

    const post = async (endpoint: string = '', body?: TRequest) => {
        setLoading(true);
        setError(null);

        const response = await apiClient.post<TResponse>(endpoint, body);

        setStatus(response.status);
        setLoading(false);

        if (response.error) {
            setError(response.error);
            return { data: null, error: response.error };
        }

        return { data: response.data || null, error: null };
    };

    return {
        post,
        loading,
        error,
        status,
    };
}

// ============================================================================
// FLOOD DATA HOOKS
// ============================================================================

/**
 * Options for useFloodData hook
 */
export interface UseFloodDataOptions extends Omit<FetchFloodDataOptions, 'limit' | 'offset'> {
    /** Whether to fetch immediately on mount */
    immediate?: boolean;
    /** Items per page */
    itemsPerPage?: number;
    /** Initial page (1-indexed) */
    initialPage?: number;
}

/**
 * Return type for useFloodData hook
 */
export interface UseFloodDataReturn {
    /** Flood data response */
    data: FloodDataResponse | null;
    /** Loading state */
    loading: boolean;
    /** Error message */
    error: string | null;
    /** HTTP status */
    status: number | null;
    /** Current page (1-indexed) */
    currentPage: number;
    /** Total pages */
    totalPages: number;
    /** Items per page */
    itemsPerPage: number;
    /** Go to specific page */
    goToPage: (page: number) => void;
    /** Go to next page */
    nextPage: () => void;
    /** Go to previous page */
    prevPage: () => void;
    /** Set items per page */
    setItemsPerPage: (count: number) => void;
    /** Refetch with current filters */
    refetch: () => Promise<void>;
    /** Update filters */
    updateFilters: (filters: Partial<FetchFloodDataOptions>) => void;
}

/**
 * React hook for fetching flood data with pagination and filtering
 * 
 * @example
 * ```tsx
 * const { data, loading, currentPage, goToPage, updateFilters } = useFloodData({
 *   immediate: true,
 *   itemsPerPage: 25,
 *   type: 'all',
 *   sort: 'newest'
 * });
 * ```
 */
export function useFloodData(options: UseFloodDataOptions = {}): UseFloodDataReturn {
    const {
        immediate = false,
        itemsPerPage: initialItemsPerPage = 25,
        initialPage = 1,
        ...filterOptions
    } = options;

    const [data, setData] = useState<FloodDataResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [status, setStatus] = useState<number | null>(null);

    const [currentPage, setCurrentPage] = useState<number>(initialPage);
    const [itemsPerPage, setItemsPerPage] = useState<number>(initialItemsPerPage);
    const [filters, setFilters] = useState<Partial<FetchFloodDataOptions>>(filterOptions);

    // Calculate total pages based on data type
    const totalPages = data ? Math.ceil(
        (filters.type === 'requests' ? data.meta.total_requests :
            filters.type === 'contributions' ? data.meta.total_contributions :
                Math.max(data.meta.total_requests, data.meta.total_contributions)) / itemsPerPage
    ) : 1;

    // Sync filters from props
    useEffect(() => {
        // Use setTimeout to avoid 'set-state-in-effect' warning and cascading renders
        const timer = setTimeout(() => {
            setFilters(prev => {
                // Only update if filters have actually changed to avoid infinite loops
                const newFilters = { ...prev, ...filterOptions };
                if (JSON.stringify(prev) !== JSON.stringify(newFilters)) {
                    return newFilters;
                }
                return prev;
            });

            if (JSON.stringify(filters) !== JSON.stringify({ ...filters, ...filterOptions })) {
                setCurrentPage(1);
            }
        }, 0);

        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filterOptions]);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);

        const offset = (currentPage - 1) * itemsPerPage;
        const response = await fetchFloodData({
            ...filters,
            limit: itemsPerPage,
            offset,
        });

        setStatus(response.status);

        if (response.error) {
            setError(response.error);
            setData(null);
        } else {
            setData(response.data || null);
        }

        setLoading(false);
    }, [currentPage, itemsPerPage, filters]);

    useEffect(() => {
        if (immediate) {
            // Use setTimeout to avoid 'set-state-in-effect' warning
            const timer = setTimeout(() => {
                fetchData();
            }, 0);
            return () => clearTimeout(timer);
        }
    }, [immediate, fetchData]);

    const goToPage = useCallback((page: number) => {
        setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    }, [totalPages]);

    const nextPage = useCallback(() => {
        setCurrentPage(prev => Math.min(prev + 1, totalPages));
    }, [totalPages]);

    const prevPage = useCallback(() => {
        setCurrentPage(prev => Math.max(prev - 1, 1));
    }, []);

    const handleSetItemsPerPage = useCallback((count: number) => {
        setItemsPerPage(count);
        setCurrentPage(1); // Reset to first page when changing items per page
    }, []);

    const updateFilters = useCallback((newFilters: Partial<FetchFloodDataOptions>) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
        setCurrentPage(1); // Reset to first page when filters change
    }, []);

    return {
        data,
        loading,
        error,
        status,
        currentPage,
        totalPages,
        itemsPerPage,
        goToPage,
        nextPage,
        prevPage,
        setItemsPerPage: handleSetItemsPerPage,
        refetch: fetchData,
        updateFilters,
    };
}

/**
 * Simple pagination hook for managing pagination state
 * 
 * @example
 * ```tsx
 * const pagination = usePagination(150, 25);
 * // pagination.currentPage, pagination.goToPage(2), etc.
 * ```
 */
export function usePagination(totalItems: number, itemsPerPage: number = 25) {
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    return {
        currentPage,
        totalPages,
        offset: (currentPage - 1) * itemsPerPage,
        limit: itemsPerPage,
        goToPage: (page: number) => setCurrentPage(Math.max(1, Math.min(page, totalPages))),
        nextPage: () => setCurrentPage(prev => Math.min(prev + 1, totalPages)),
        prevPage: () => setCurrentPage(prev => Math.max(prev - 1, 1)),
        hasNextPage: currentPage < totalPages,
        hasPrevPage: currentPage > 1,
    };
}
