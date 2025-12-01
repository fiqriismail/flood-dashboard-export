/**
 * API Client for Supabase Public Data API
 * 
 * This module provides a type-safe client for accessing the Supabase public endpoint
 * with proper authentication headers.
 */

import type { FloodDataResponse, LocationFilter } from './api-types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://cynwvkagfmhlpsvkparv.supabase.co/functions/v1/public-data-api';
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || '';

interface ApiResponse<T = unknown> {
    data?: T;
    error?: string;
    status: number;
}

/**
 * Builds a query string from an object of parameters
 */
function buildQueryString(params: Record<string, unknown>): string {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
            if (typeof value === 'object') {
                // For objects like location filters, stringify them
                searchParams.append(key, JSON.stringify(value));
            } else {
                searchParams.append(key, String(value));
            }
        }
    });

    const queryString = searchParams.toString();
    return queryString ? `?${queryString}` : '';
}

/**
 * Base fetch wrapper with authentication headers
 */
async function apiFetch<T = unknown>(
    endpoint: string = '',
    options: RequestInit = {}
): Promise<ApiResponse<T>> {
    const url = endpoint ? `${API_URL}${endpoint}` : API_URL;

    try {
        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': API_KEY,
                ...options.headers,
            },
        });

        const data = await response.json();

        return {
            data,
            status: response.status,
        };
    } catch (error) {
        return {
            error: error instanceof Error ? error.message : 'An error occurred',
            status: 500,
        };
    }
}

/**
 * API Client with common HTTP methods
 */
export const apiClient = {
    /**
     * GET request to the API
     */
    get: async <T = unknown>(endpoint: string = '', options?: RequestInit): Promise<ApiResponse<T>> => {
        return apiFetch<T>(endpoint, {
            ...options,
            method: 'GET',
        });
    },

    /**
     * POST request to the API
     */
    post: async <T = unknown>(
        endpoint: string = '',
        body?: unknown,
        options?: RequestInit
    ): Promise<ApiResponse<T>> => {
        return apiFetch<T>(endpoint, {
            ...options,
            method: 'POST',
            body: JSON.stringify(body),
        });
    },

    /**
     * PUT request to the API
     */
    put: async <T = unknown>(
        endpoint: string = '',
        body?: unknown,
        options?: RequestInit
    ): Promise<ApiResponse<T>> => {
        return apiFetch<T>(endpoint, {
            ...options,
            method: 'PUT',
            body: JSON.stringify(body),
        });
    },

    /**
     * DELETE request to the API
     */
    delete: async <T = unknown>(endpoint: string = '', options?: RequestInit): Promise<ApiResponse<T>> => {
        return apiFetch<T>(endpoint, {
            ...options,
            method: 'DELETE',
        });
    },

    /**
     * PATCH request to the API
     */
    patch: async <T = unknown>(
        endpoint: string = '',
        body?: unknown,
        options?: RequestInit
    ): Promise<ApiResponse<T>> => {
        return apiFetch<T>(endpoint, {
            ...options,
            method: 'PATCH',
            body: JSON.stringify(body),
        });
    },
};

// ============================================================================
// FLOOD DATA API
// ============================================================================

/**
 * Options for fetching flood data
 */
export interface FetchFloodDataOptions {
    /** Type of data to fetch */
    type?: 'all' | 'requests' | 'contributions';
    /** Number of items to return */
    limit?: number;
    /** Offset for pagination */
    offset?: number;
    /** Filter by status */
    status?: string;
    /** Filter by urgency (requests only) */
    urgency?: string;
    /** Filter by establishment type */
    establishment?: string;
    /** Filter by assistance type */
    assistance_type?: string;
    /** Filter by contribution type */
    contribution_type?: string;
    /** Search query */
    search?: string;
    /** Location-based filter */
    location?: LocationFilter;
    /** Sort order */
    sort?: 'newest' | 'oldest' | 'nearest';
}

/**
 * Fetch flood assistance requests and contributions with optional filters and pagination
 */
export async function fetchFloodData(options: FetchFloodDataOptions = {}) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const queryString = buildQueryString(options as any);
    return apiClient.get<FloodDataResponse>(queryString);
}

/**
 * Example: Fetch data from the main endpoint (legacy support)
 */
export async function fetchPublicData<T = unknown>() {
    return apiClient.get<T>();
}
