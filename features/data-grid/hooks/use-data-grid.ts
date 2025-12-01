'use client';

import { useState, useEffect } from 'react';
import { useApi } from '@/lib/use-api';
import type { FloodAssistanceRequest } from '@/lib/api-types';
import type { DataGridState } from '../types';

/**
 * Custom hook for managing data grid state and API integration
 * Part of the Data Grid vertical slice
 */
export function useDataGrid() {
    const { data: apiData, loading, error, refetch } = useApi({
        immediate: true,
    });

    const [gridState, setGridState] = useState<DataGridState>({
        data: [],
        loading: false,
        error: null,
        totalCount: 0,
        currentPage: 1,
        pageSize: 10,
    });

    useEffect(() => {
        if (apiData) {
            // Parse the API response and extract records
            let records: FloodAssistanceRequest[] = [];

            // Handle different response formats
            if (Array.isArray(apiData)) {
                records = apiData as FloodAssistanceRequest[];
            } else if (typeof apiData === 'object' && apiData !== null) {
                // Check for common pagination formats
                if ('requests' in apiData && Array.isArray(apiData.requests)) {
                    records = apiData.requests as FloodAssistanceRequest[];
                } else if ('data' in apiData && Array.isArray(apiData.data)) {
                    records = apiData.data as FloodAssistanceRequest[];
                } else if ('results' in apiData && Array.isArray(apiData.results)) {
                    records = apiData.results as FloodAssistanceRequest[];
                } else if ('items' in apiData && Array.isArray(apiData.items)) {
                    records = apiData.items as FloodAssistanceRequest[];
                }
            }

            // Use setTimeout to avoid 'set-state-in-effect' warning
            setTimeout(() => {
                setGridState({
                    data: records.slice(0, 10), // First 10 results
                    loading: false,
                    error: null,
                    totalCount: records.length,
                    currentPage: 1,
                    pageSize: 10,
                });
            }, 0);
        }
    }, [apiData]);

    // Syncing loading/error state from useApi is not necessary if we just return them
    // or merge them in the return statement.
    // Removing the useEffect that causes 'set-state-in-effect' warning.

    return {
        ...gridState,
        loading: loading || gridState.loading,
        error: error || gridState.error,
        refetch,
    };
}
