'use client';

import type { DataRecord } from '../types';

interface DataTableProps {
    data: DataRecord[];
    loading?: boolean;
    error?: string | null;
}

export function DataTable({ data, loading = false, error = null }: DataTableProps) {
    // Extract column headers from the first data item
    const columns = data.length > 0 ? Object.keys(data[0]) : [];

    if (loading) {
        return (
            <div className="flex h-[400px] items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                    <p className="text-sm text-muted-foreground">Loading data...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-[400px] items-center justify-center">
                <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center dark:border-red-800 dark:bg-red-900/20">
                    <p className="font-medium text-red-800 dark:text-red-400">Error loading data</p>
                    <p className="mt-1 text-sm text-red-600 dark:text-red-500">{error}</p>
                </div>
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className="flex h-[400px] items-center justify-center">
                <div className="text-center">
                    <p className="text-lg font-medium text-muted-foreground">No data available</p>
                    <p className="mt-1 text-sm text-muted-foreground">Try refreshing or adjusting your filters</p>
                </div>
            </div>
        );
    }

    return (
        <div className="relative w-full overflow-auto">
            <table className="w-full border-collapse">
                <thead>
                    <tr className="border-b bg-muted/50">
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            #
                        </th>
                        {columns.map((column) => (
                            <th
                                key={column}
                                className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground"
                            >
                                {column.replace(/_/g, ' ')}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-border">
                    {data.map((row, rowIndex) => (
                        <tr
                            key={row.id || rowIndex}
                            className="transition-colors hover:bg-muted/50"
                        >
                            <td className="px-4 py-3 text-sm text-muted-foreground">
                                {rowIndex + 1}
                            </td>
                            {columns.map((column) => (
                                <td key={column} className="px-4 py-3 text-sm">
                                    {formatCellValue(row[column])}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function formatCellValue(value: unknown): string {
    if (value === null || value === undefined) {
        return '-';
    }

    if (typeof value === 'object') {
        return JSON.stringify(value);
    }

    if (typeof value === 'boolean') {
        return value ? '✓' : '✗';
    }

    return String(value);
}
