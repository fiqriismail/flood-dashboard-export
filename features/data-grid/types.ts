/**
 * Type definitions for the Data Grid feature
 * Following Vertical Slice Architecture - all types for this feature are contained here
 */

import type { FloodAssistanceRequest } from '@/lib/api-types';

export interface DataRecord {
    id: string | number;
    [key: string]: unknown;
}

export interface DataGridState {
    data: FloodAssistanceRequest[];
    loading: boolean;
    error: string | null;
    totalCount: number;
    currentPage: number;
    pageSize: number;
}

export interface ToolbarAction {
    label: string;
    icon?: React.ReactNode;
    onClick: () => void;
    variant?: 'default' | 'outline' | 'ghost';
    disabled?: boolean;
}
