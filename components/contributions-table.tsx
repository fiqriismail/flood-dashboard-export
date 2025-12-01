'use client';

import { useState, useEffect } from 'react';
import { FloodContribution } from '@/lib/api-types';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { MapPin, Phone, CircleCheck, CircleX, Package, Wrench, Users, CircleAlert } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export interface ContributionsTableProps {
    contributions: FloodContribution[];
    loading?: boolean;
}

const statusColors = {
    available: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100',
    committed: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100',
    delivered: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100',
    unavailable: 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100',
};

const contributionTypeIcons = {
    Goods: Package,
    Services: Wrench,
    Labor: Users,
};

/**
 * Table component for displaying flood contributions
 */
export function ContributionsTable({ contributions, loading = false }: ContributionsTableProps) {
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

    if (contributions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <CircleAlert className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-1">No Contributions Found</h3>
                <p className="text-sm text-muted-foreground">
                    No contributions match the current filters.
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
                        <TableHead className="text-xs uppercase tracking-wider font-medium text-muted-foreground">Contribution Types</TableHead>
                        <TableHead className="text-xs uppercase tracking-wider font-medium text-muted-foreground">Details</TableHead>
                        <TableHead className="text-xs uppercase tracking-wider font-medium text-muted-foreground">Coverage</TableHead>
                        <TableHead className="text-xs uppercase tracking-wider font-medium text-muted-foreground">Status</TableHead>
                        <TableHead className="text-xs uppercase tracking-wider font-medium text-muted-foreground">Verified</TableHead>
                        <TableHead className="text-xs uppercase tracking-wider font-medium text-muted-foreground">Distance</TableHead>
                        <TableHead className="text-xs uppercase tracking-wider font-medium text-muted-foreground">Registered</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {contributions.map((contribution) => {
                        return (
                            <TableRow key={contribution.id}>
                                {/* Contact */}
                                <TableCell>
                                    <div className="flex flex-col gap-1">
                                        <span className="font-medium">{contribution.full_name}</span>
                                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                            <Phone className="h-3 w-3" />
                                            <span>{contribution.mobile_number}</span>
                                        </div>
                                        <span className="text-xs text-muted-foreground">{contribution.email}</span>
                                    </div>
                                </TableCell>

                                {/* Location */}
                                <TableCell>
                                    <div className="flex items-start gap-1">
                                        <MapPin className="h-3 w-3 mt-0.5 flex-shrink-0" />
                                        <span className="text-sm max-w-[200px] line-clamp-2">
                                            {contribution.address}
                                        </span>
                                    </div>
                                </TableCell>

                                {/* Contribution Types */}
                                <TableCell>
                                    <div className="flex flex-wrap gap-1">
                                        {contribution.contribution_types.map((type) => {
                                            const Icon = contributionTypeIcons[type] || CircleAlert;
                                            return (
                                                <Badge key={type} variant="outline" className="gap-1">
                                                    <Icon className="h-3 w-3" />
                                                    {type}
                                                </Badge>
                                            );
                                        })}
                                    </div>
                                </TableCell>

                                {/* Details (goods, services, labor types) */}
                                <TableCell>
                                    <div className="flex flex-col gap-1 max-w-[250px]">
                                        {contribution.goods_types && contribution.goods_types.length > 0 && (
                                            <div>
                                                <span className="text-xs font-medium text-muted-foreground">Goods:</span>
                                                <div className="flex flex-wrap gap-1 mt-0.5">
                                                    {contribution.goods_types.map((type) => (
                                                        <Badge key={type} variant="secondary" className="text-xs">
                                                            {type}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        {contribution.services_types && contribution.services_types.length > 0 && (
                                            <div>
                                                <span className="text-xs font-medium text-muted-foreground">Services:</span>
                                                <div className="flex flex-wrap gap-1 mt-0.5">
                                                    {contribution.services_types.map((type) => (
                                                        <Badge key={type} variant="secondary" className="text-xs">
                                                            {type}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        {contribution.labor_types && contribution.labor_types.length > 0 && (
                                            <div>
                                                <span className="text-xs font-medium text-muted-foreground">Labor:</span>
                                                <div className="flex flex-wrap gap-1 mt-0.5">
                                                    {contribution.labor_types.map((type) => (
                                                        <Badge key={type} variant="secondary" className="text-xs">
                                                            {type}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        {contribution.pickup_required && (
                                            <Badge variant="outline" className="w-fit text-xs mt-1">
                                                Pickup Required
                                            </Badge>
                                        )}
                                    </div>
                                </TableCell>

                                {/* Coverage radius */}
                                <TableCell>
                                    <span className="text-sm">
                                        {contribution.coverage_radius_km} km
                                    </span>
                                </TableCell>

                                {/* Status */}
                                <TableCell>
                                    <Badge variant="outline" className={statusColors[contribution.status]}>
                                        {contribution.status}
                                    </Badge>
                                </TableCell>

                                {/* Verified */}
                                <TableCell>
                                    <div className="flex flex-col gap-1">
                                        {contribution.verified ? (
                                            <>
                                                <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                                                    <CircleCheck className="h-4 w-4" />
                                                    <span className="text-sm font-medium">Verified</span>
                                                </div>
                                                {contribution.verified_by_name && (
                                                    <span className="text-xs text-muted-foreground">
                                                        by {contribution.verified_by_name}
                                                    </span>
                                                )}
                                            </>
                                        ) : (
                                            <div className="flex items-center gap-1 text-muted-foreground">
                                                <CircleX className="h-4 w-4" />
                                                <span className="text-sm">Not verified</span>
                                            </div>
                                        )}
                                    </div>
                                </TableCell>

                                {/* Distance */}
                                <TableCell>
                                    {contribution.distance_km !== undefined ? (
                                        <span className="text-sm">
                                            {contribution.distance_km.toFixed(1)} km
                                        </span>
                                    ) : (
                                        <span className="text-sm text-muted-foreground">-</span>
                                    )}
                                </TableCell>

                                {/* Registered time */}
                                <TableCell>
                                    <span className="text-sm text-muted-foreground">
                                        {mounted ? formatDistanceToNow(new Date(contribution.created_at), {
                                            addSuffix: true,
                                        }) : new Date(contribution.created_at).toLocaleDateString()}
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
