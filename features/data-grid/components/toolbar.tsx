'use client';

import { RefreshCw, Download, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ToolbarAction } from '../types';

interface ToolbarProps {
    title?: string;
    onRefresh?: () => void;
    loading?: boolean;
    actions?: ToolbarAction[];
    totalCount?: number;
}

export function Toolbar({
    title = 'Data Grid',
    onRefresh,
    loading = false,
    actions = [],
    totalCount = 0,
}: ToolbarProps) {
    const defaultActions: ToolbarAction[] = [
        {
            label: 'Refresh',
            icon: <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />,
            onClick: onRefresh || (() => { }),
            variant: 'outline',
            disabled: loading,
        },
        {
            label: 'Filter',
            icon: <Filter className="h-4 w-4" />,
            onClick: () => console.log('Filter clicked'),
            variant: 'outline',
        },
        {
            label: 'Export',
            icon: <Download className="h-4 w-4" />,
            onClick: () => console.log('Export clicked'),
            variant: 'outline',
        },
    ];

    const allActions = [...defaultActions, ...actions];

    return (
        <div className="flex items-center justify-between border-b bg-background px-6 py-4">
            <div className="flex items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
                    <p className="text-sm text-muted-foreground">
                        {totalCount} {totalCount === 1 ? 'record' : 'records'} total
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-2">
                {allActions.map((action, index) => (
                    <Button
                        key={index}
                        variant={action.variant || 'default'}
                        onClick={action.onClick}
                        disabled={action.disabled}
                        size="sm"
                    >
                        {action.icon}
                        <span className="ml-2">{action.label}</span>
                    </Button>
                ))}
            </div>
        </div>
    );
}
