'use client';

import type { FloodAssistanceRequest } from '@/lib/api-types';
import { AlertCircle, Phone, Users, MapPin } from 'lucide-react';

interface FloodRequestTableProps {
    data: FloodAssistanceRequest[];
    loading?: boolean;
    error?: string | null;
}

export function FloodRequestTable({ data, loading = false, error = null }: FloodRequestTableProps) {
    if (loading) {
        return (
            <div className="flex h-[400px] items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                    <p className="text-sm text-muted-foreground">Loading assistance requests...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-[400px] items-center justify-center">
                <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center dark:border-red-800 dark:bg-red-900/20">
                    <AlertCircle className="mx-auto h-8 w-8 text-red-600 dark:text-red-400" />
                    <p className="mt-2 font-medium text-red-800 dark:text-red-400">Error loading data</p>
                    <p className="mt-1 text-sm text-red-600 dark:text-red-500">{error}</p>
                </div>
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className="flex h-[400px] items-center justify-center">
                <div className="text-center">
                    <p className="text-lg font-medium text-muted-foreground">No assistance requests found</p>
                    <p className="mt-1 text-sm text-muted-foreground">Requests will appear here when submitted</p>
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
                            Name & Contact
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            Location
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            People Affected
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            Urgency
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            Assistance Needed
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            Status
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            Submitted
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-border">
                    {data.map((request) => {
                        const totalPeople = request.num_men + request.num_women + request.num_children;

                        return (
                            <tr
                                key={request.id}
                                className="transition-colors hover:bg-muted/50"
                            >
                                {/* Name & Contact */}
                                <td className="px-4 py-3">
                                    <div className="flex flex-col">
                                        <span className="font-medium">{request.full_name}</span>
                                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                            <Phone className="h-3 w-3" />
                                            <span>{request.mobile_number}</span>
                                        </div>
                                    </div>
                                </td>

                                {/* Location */}
                                <td className="px-4 py-3">
                                    <div className="flex items-start gap-2">
                                        <MapPin className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                                        <div className="flex flex-col">
                                            <span className="text-sm">{request.address}</span>
                                            <span className="text-xs text-muted-foreground">{request.establishment_type}</span>
                                        </div>
                                    </div>
                                </td>

                                {/* People Affected */}
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        <Users className="h-4 w-4 text-muted-foreground" />
                                        <div className="flex flex-col">
                                            <span className="font-semibold">{totalPeople}</span>
                                            <span className="text-xs text-muted-foreground">
                                                {request.num_men}M · {request.num_women}W · {request.num_children}C
                                            </span>
                                        </div>
                                    </div>
                                </td>

                                {/* Urgency */}
                                <td className="px-4 py-3">
                                    <UrgencyBadge urgency={request.urgency} />
                                </td>

                                {/* Assistance Types */}
                                <td className="px-4 py-3">
                                    <div className="flex flex-wrap gap-1">
                                        {request.assistance_types.map((type, idx) => (
                                            <span
                                                key={idx}
                                                className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
                                            >
                                                {type}
                                            </span>
                                        ))}
                                    </div>
                                </td>

                                {/* Status */}
                                <td className="px-4 py-3">
                                    <StatusBadge status={request.status} />
                                </td>

                                {/* Created At */}
                                <td className="px-4 py-3 text-sm text-muted-foreground">
                                    {formatDate(request.created_at)}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

function UrgencyBadge({ urgency }: { urgency: string }) {
    const styles = {
        critical: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 ring-red-600/20',
        high: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400 ring-orange-600/20',
        medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400 ring-yellow-600/20',
        low: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 ring-green-600/20',
    };

    const style = styles[urgency as keyof typeof styles] || styles.low;

    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${style}`}>
            {urgency.toUpperCase()}
        </span>
    );
}

function StatusBadge({ status }: { status: string }) {
    const styles = {
        pending: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
        acknowledged: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
        in_progress: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
        resolved: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
        cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
    };

    const style = styles[status as keyof typeof styles] || styles.pending;

    return (
        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${style}`}>
            {status.replace('_', ' ').toUpperCase()}
        </span>
    );
}

function formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
}
