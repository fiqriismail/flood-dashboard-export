'use client';

import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

export interface PaginationProps {
    /** Current page (1-indexed) */
    currentPage: number;
    /** Total number of pages */
    totalPages: number;
    /** Total number of items */
    totalItems: number;
    /** Items per page */
    itemsPerPage: number;
    /** Number of items currently displayed */
    displayedItems: number;
    /** Callback when page changes */
    onPageChange: (page: number) => void;
    /** Callback when items per page changes */
    onItemsPerPageChange: (count: number) => void;
    /** Whether data is loading */
    loading?: boolean;
}

/**
 * Pagination component for navigating through pages of data
 */
export function Pagination({
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    displayedItems,
    onPageChange,
    onItemsPerPageChange,
    loading = false,
}: PaginationProps) {
    const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(startItem + displayedItems - 1, totalItems);

    const canGoPrev = currentPage > 1;
    const canGoNext = currentPage < totalPages;

    // Generate page numbers to display
    const getPageNumbers = () => {
        const pages: (number | 'ellipsis')[] = [];
        const maxVisible = 7; // Maximum page buttons to show

        if (totalPages <= maxVisible) {
            // Show all pages if total is small
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Always show first page
            pages.push(1);

            if (currentPage > 3) {
                pages.push('ellipsis');
            }

            // Show pages around current page
            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);

            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            if (currentPage < totalPages - 2) {
                pages.push('ellipsis');
            }

            // Always show last page
            if (totalPages > 1) {
                pages.push(totalPages);
            }
        }

        return pages;
    };

    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-t pt-4">
            {/* Items info and per-page selector */}
            <div className="flex items-center gap-4">
                <p className="text-sm text-muted-foreground">
                    Showing <span className="font-medium">{startItem}</span> to{' '}
                    <span className="font-medium">{endItem}</span> of{' '}
                    <span className="font-medium">{totalItems}</span> results
                </p>

                <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Per page:</span>
                    <Select
                        value={String(itemsPerPage)}
                        onValueChange={(value) => onItemsPerPageChange(Number(value))}
                        disabled={loading}
                    >
                        <SelectTrigger className="w-20">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="25">25</SelectItem>
                            <SelectItem value="50">50</SelectItem>
                            <SelectItem value="100">100</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Page navigation */}
            <div className="flex items-center gap-2">
                {/* First page */}
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onPageChange(1)}
                    disabled={!canGoPrev || loading}
                    aria-label="First page"
                >
                    <ChevronsLeft className="h-4 w-4" />
                </Button>

                {/* Previous page */}
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={!canGoPrev || loading}
                    aria-label="Previous page"
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>

                {/* Page numbers */}
                <div className="flex items-center gap-1">
                    {getPageNumbers().map((page, index) =>
                        page === 'ellipsis' ? (
                            <span key={`ellipsis-${index}`} className="px-2 text-muted-foreground">
                                ...
                            </span>
                        ) : (
                            <Button
                                key={page}
                                variant={currentPage === page ? 'default' : 'outline'}
                                size="icon"
                                onClick={() => onPageChange(page)}
                                disabled={loading}
                                className="w-10"
                            >
                                {page}
                            </Button>
                        )
                    )}
                </div>

                {/* Next page */}
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={!canGoNext || loading}
                    aria-label="Next page"
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>

                {/* Last page */}
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onPageChange(totalPages)}
                    disabled={!canGoNext || loading}
                    aria-label="Last page"
                >
                    <ChevronsRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
