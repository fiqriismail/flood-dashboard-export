'use client';

import { Toolbar } from './components/toolbar';
import { FloodRequestTable } from './components/flood-request-table';
import { useDataGrid } from './hooks/use-data-grid';

/**
 * Data Grid Feature - Main Component
 * 
 * This is the entry point for the Data Grid vertical slice.
 * It orchestrates the toolbar and data table components.
 */
export function DataGridFeature() {
    const { data, loading, error, totalCount, refetch } = useDataGrid();

    return (
        <div className="flex h-screen flex-col">
            <Toolbar
                title="Flood Assistance Requests"
                onRefresh={refetch}
                loading={loading}
                totalCount={totalCount}
            />

            <div className="flex-1 overflow-auto p-6">
                <div className="rounded-lg border bg-card">
                    <FloodRequestTable
                        data={data}
                        loading={loading}
                        error={error}
                    />
                </div>
            </div>
        </div>
    );
}
