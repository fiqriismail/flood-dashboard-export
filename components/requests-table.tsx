'use client';

import { useState, useEffect } from 'react';
import { FloodAssistanceRequest } from '@/lib/api-types';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { MapPin, Phone, Users, CircleAlert } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export interface RequestsTableProps {
    requests: FloodAssistanceRequest[];
    loading?: boolean;
}

const urgencyColors = {
    low: 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200',
    medium: 'bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200',
    high: 'bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200',
    critical: 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200',
};

const statusColors = {
    pending: 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100',
    acknowledged: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100',
    in_progress: 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100',
    resolved: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100',
    cancelled: 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100',
};

/**
 * Table component for displaying flood assistance requests
 */
export function RequestsTable({ requests, loading = false }: RequestsTableProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setTimeout(() => setMounted(true), 0);
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
        );
    }

    if (requests.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <CircleAlert className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-1">No Requests Found</h3>
                <p className="text-sm text-muted-foreground">
                    No assistance requests match the current filters.
                </p>
            </div>
        );
    }

    return (
        <div className="rounded-md">
            <Table>
                <TableHeader>
                    <TableRow className="hover:bg-transparent">
                        <TableHead className="w-[200px] text-xs uppercase tracking-wider font-medium text-muted-foreground">Contact</TableHead>
                        <TableHead className="min-w-[200px] text-xs uppercase tracking-wider font-medium text-muted-foreground">Location</TableHead>
                        <TableHead className="text-xs uppercase tracking-wider font-medium text-muted-foreground">People</TableHead>
                        <TableHead className="text-xs uppercase tracking-wider font-medium text-muted-foreground">Urgency</TableHead>
                        <TableHead className="text-xs uppercase tracking-wider font-medium text-muted-foreground">Assistance Needed</TableHead>
                        <TableHead className="text-xs uppercase tracking-wider font-medium text-muted-foreground">Status</TableHead>
                        <TableHead className="text-xs uppercase tracking-wider font-medium text-muted-foreground">Distance</TableHead>
                        <TableHead className="text-xs uppercase tracking-wider font-medium text-muted-foreground">Submitted</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {requests.map((request) => {
                        const totalPeople = request.num_men + request.num_women + request.num_children;

                        return (
                            <TableRow key={request.id}>
                                {/* Contact */}
                                <TableCell>
                                    <div className="flex flex-col gap-1">
                                        <span className="font-medium">{request.full_name}</span>
                                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                            <Phone className="h-3 w-3" />
                                            <span>{request.mobile_number}</span>
                                        </div>
                                        {request.email && (
                                            <span className="text-xs text-muted-foreground">{request.email}</span>
                                        )}
                                    </div>
                                </TableCell>

                                {/* Location */}
                                <TableCell>
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-start gap-1">
                                            <MapPin className="h-3 w-3 mt-0.5 flex-shrink-0" />
                                            <span className="text-sm max-w-[200px] line-clamp-2">
                                                {request.address}
                                            </span>
                                        </div>
                                        {request.establishment_type && (
                                            <Badge variant="outline" className="w-fit text-xs">
                                                {request.establishment_type}
                                            </Badge>
                                        )}
                                    </div>
                                </TableCell>

                                {/* People count */}
                                <TableCell>
                                    <div className="flex items-center gap-1">
                                        <Users className="h-4 w-4 text-muted-foreground" />
                                        <span className="font-medium">{totalPeople}</span>
                                    </div>
                                    <div className="text-xs text-muted-foreground mt-1">
                                        M:{request.num_men} W:{request.num_women} C:{request.num_children}
                                    </div>
                                </TableCell>

                                {/* Urgency */}
                                <TableCell>
                                    <Badge variant="outline" className={urgencyColors[request.urgency]}>
                                        {request.urgency}
                                    </Badge>
                                </TableCell>

                                {/* Assistance types */}
                                <TableCell>
                                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                                        {request.assistance_types.map((type) => (
                                            <Badge key={type} variant="secondary" className="text-xs">
                                                {type}
                                            </Badge>
                                        ))}
                                    </div>
                                </TableCell>

                                {/* Status */}
                                <TableCell>
                                    <Badge variant="outline" className={statusColors[request.status]}>
                                        {request.status.replace('_', ' ')}
                                    </Badge>
                                </TableCell>

                                {/* Distance */}
                                <TableCell>
                                    {request.distance_km !== undefined ? (
                                        <span className="text-sm">
                                            {request.distance_km.toFixed(1)} km
                                        </span>
                                    ) : (
                                        <span className="text-sm text-muted-foreground">-</span>
                                    )}
                                </TableCell>

                                {/* Submitted time */}
                                <TableCell>
                                    <span className="text-sm text-muted-foreground">
                                        {mounted ? formatDistanceToNow(new Date(request.created_at), {
                                            addSuffix: true,
                                        }) : new Date(request.created_at).toLocaleDateString()}
                                    </span>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}
