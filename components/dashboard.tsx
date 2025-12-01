'use client';

import { useState, useEffect } from 'react';
import { useFloodData } from '@/lib/use-api';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RequestsTable } from '@/components/requests-table';
import { ContributionsTable } from '@/components/contributions-table';
import { Pagination } from '@/components/pagination';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { RefreshCw, Download, Search, X, Filter } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    exportRequestsToCSV,
    exportContributionsToCSV,
    copyRequestsToClipboard,
    copyContributionsToClipboard
} from '@/lib/csv-export';

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState<'all' | 'requests' | 'contributions'>('requests');
    const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'nearest'>('newest');

    // Filter states
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [urgencyFilter, setUrgencyFilter] = useState<string>('all');

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const floodData = useFloodData({
        immediate: true,
        itemsPerPage: 25,
        type: activeTab,
        sort: sortOrder,
        search: debouncedSearch,
        status: statusFilter === 'all' ? undefined : statusFilter,
        urgency: urgencyFilter === 'all' ? undefined : urgencyFilter,
    });

    const {
        data,
        loading,
        error,
        currentPage,
        totalPages,
        itemsPerPage,
        goToPage,
        setItemsPerPage,
        refetch,
    } = floodData;

    // Handle tab change
    const handleTabChange = (value: string) => {
        const newType = value as 'all' | 'requests' | 'contributions';
        setActiveTab(newType);
        // Reset filters when changing tabs might be good UX, but keeping them is also fine.
        // Let's keep them for now, but maybe reset urgency if switching to contributions
        if (newType === 'contributions') {
            setUrgencyFilter('all');
        }
    };

    // Handle sort change
    const handleSortChange = (value: string) => {
        const newSort = value as 'newest' | 'oldest' | 'nearest';
        setSortOrder(newSort);
    };

    const totalRequests = data?.meta.total_requests || 0;
    const totalContributions = data?.meta.total_contributions || 0;
    const displayedRequests = data?.requests.length || 0;
    const displayedContributions = data?.contributions.length || 0;

    return (
        <div className="min-h-screen bg-muted/30">
            {/* Top Navigation Bar */}
            <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 px-6 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="flex flex-1 items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-5 w-5"
                        >
                            <path d="M3.3 7.4a2 2 0 0 1 2.3-1.1l2.4.7" />
                            <path d="M10.9 4.3a2 2 0 0 1 2.2.6l1.3 1.8" />
                            <path d="M17.8 7.6a2 2 0 0 1 2.3 1.1l.7 2.4" />
                            <path d="M12 22v-9" />
                            <path d="m8 13-2.5 4.5" />
                            <path d="m16 13 2.5 4.5" />
                            <path d="M3 10c0-2.8 5-5 9-5s9 2.2 9 5c0 2.8-5 5-9 5s-9-2.2-9-5Z" />
                        </svg>
                    </div>
                    <h1 className="text-xl font-semibold tracking-tight">Flood Relief Coordinator</h1>
                </div>

                <div className="flex items-center gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="gap-2 h-9">
                                <Download className="h-4 w-4" />
                                <span className="hidden sm:inline">Export</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => {
                                if (activeTab === 'requests' || activeTab === 'all') {
                                    if (data?.requests) exportRequestsToCSV(data.requests);
                                } else {
                                    if (data?.contributions) exportContributionsToCSV(data.contributions);
                                }
                            }}>
                                CSV File
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={async () => {
                                if (activeTab === 'requests' || activeTab === 'all') {
                                    if (data?.requests) {
                                        const success = await copyRequestsToClipboard(data.requests);
                                        if (success) {
                                            window.open('https://sheets.new', '_blank');
                                            alert('Requests copied! A new Google Sheet has been opened. Press Cmd+V (or Ctrl+V) to paste the data.');
                                        }
                                    }
                                } else {
                                    if (data?.contributions) {
                                        const success = await copyContributionsToClipboard(data.contributions);
                                        if (success) {
                                            window.open('https://sheets.new', '_blank');
                                            alert('Contributions copied! A new Google Sheet has been opened. Press Cmd+V (or Ctrl+V) to paste the data.');
                                        }
                                    }
                                }
                            }}>
                                Copy for Google Sheets
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Button
                        onClick={() => refetch()}
                        disabled={loading}
                        variant="outline"
                        size="sm"
                        className="gap-2 h-9"
                    >
                        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                        <span className="hidden sm:inline">{loading ? 'Loading...' : 'Refresh'}</span>
                    </Button>
                </div>
            </header>

            <main className="container mx-auto p-6 max-w-7xl">
                {/* Error State */}
                {error && (
                    <Card className="mb-6 border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800">
                        <CardHeader>
                            <CardTitle className="text-red-800 dark:text-red-400">Error</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-red-800 dark:text-red-400">{error}</p>
                            <Button onClick={() => refetch()} className="mt-4" variant="outline">
                                Try Again
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {!error && (
                    <div className="space-y-6">

                        {/* Main Data Card */}
                        <Card className="shadow-sm border-none sm:border">
                            <CardHeader className="px-6 py-4 border-b bg-card">
                                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full md:w-auto">
                                        <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
                                            <TabsTrigger value="requests">Requests</TabsTrigger>
                                            <TabsTrigger value="contributions">Contributions</TabsTrigger>
                                        </TabsList>
                                    </Tabs>

                                    <div className="flex items-center gap-2">
                                        <div className="relative flex-1 md:w-[300px]">
                                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                placeholder="Search..."
                                                className="pl-9 bg-muted/50 border-none focus-visible:ring-1"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                            />
                                            {searchQuery && (
                                                <button
                                                    onClick={() => setSearchQuery('')}
                                                    className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Secondary Filters Toolbar */}
                                <div className="mt-4 flex flex-wrap items-center gap-2 pt-2">
                                    <div className="flex items-center gap-2">
                                        <Filter className="h-3.5 w-3.5 text-muted-foreground" />
                                        <span className="text-xs font-medium text-muted-foreground">Filters:</span>
                                    </div>

                                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                                        <SelectTrigger className="h-8 w-[140px] text-xs bg-background border-dashed">
                                            <div className="flex items-center gap-2 truncate">
                                                <span className="text-muted-foreground">Status:</span>
                                                <SelectValue />
                                            </div>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All</SelectItem>
                                            {activeTab === 'requests' || activeTab === 'all' ? (
                                                <>
                                                    <SelectItem value="pending">Pending</SelectItem>
                                                    <SelectItem value="resolved">Resolved</SelectItem>
                                                </>
                                            ) : null}
                                            {activeTab === 'contributions' || activeTab === 'all' ? (
                                                <>
                                                    <SelectItem value="available">Available</SelectItem>
                                                    <SelectItem value="engaged">Engaged</SelectItem>
                                                    <SelectItem value="unavailable">Unavailable</SelectItem>
                                                </>
                                            ) : null}
                                        </SelectContent>
                                    </Select>

                                    {activeTab === 'requests' && (
                                        <Select value={urgencyFilter} onValueChange={setUrgencyFilter}>
                                            <SelectTrigger className="h-8 w-[140px] text-xs bg-background border-dashed">
                                                <div className="flex items-center gap-2 truncate">
                                                    <span className="text-muted-foreground">Urgency:</span>
                                                    <SelectValue />
                                                </div>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All</SelectItem>
                                                <SelectItem value="critical">Critical</SelectItem>
                                                <SelectItem value="high">High</SelectItem>
                                                <SelectItem value="medium">Medium</SelectItem>
                                                <SelectItem value="low">Low</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}

                                    <div className="ml-auto flex items-center gap-2">
                                        <span className="text-xs text-muted-foreground">Sort by:</span>
                                        <Select value={sortOrder} onValueChange={handleSortChange}>
                                            <SelectTrigger className="h-8 w-[130px] text-xs border-none shadow-none bg-transparent hover:bg-accent/50">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent align="end">
                                                <SelectItem value="newest">Newest First</SelectItem>
                                                <SelectItem value="oldest">Oldest First</SelectItem>
                                                <SelectItem value="nearest">Nearest First</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent className="p-0">
                                <Tabs value={activeTab} onValueChange={handleTabChange}>
                                    <TabsContent value="requests" className="m-0 border-none p-0 outline-none">
                                        <RequestsTable
                                            requests={data?.requests || []}
                                            loading={loading}
                                        />
                                    </TabsContent>
                                    <TabsContent value="contributions" className="m-0 border-none p-0 outline-none">
                                        <ContributionsTable
                                            contributions={data?.contributions || []}
                                            loading={loading}
                                        />
                                    </TabsContent>
                                </Tabs>

                                {/* Pagination Footer */}
                                <div className="border-t p-4">
                                    {data && !loading && (activeTab === 'requests' ? displayedRequests : activeTab === 'contributions' ? displayedContributions : Math.max(displayedRequests, displayedContributions)) > 0 && (
                                        <Pagination
                                            currentPage={currentPage}
                                            totalPages={totalPages}
                                            totalItems={
                                                activeTab === 'requests'
                                                    ? totalRequests
                                                    : activeTab === 'contributions'
                                                        ? totalContributions
                                                        : Math.max(totalRequests, totalContributions)
                                            }
                                            itemsPerPage={itemsPerPage}
                                            displayedItems={
                                                activeTab === 'requests'
                                                    ? displayedRequests
                                                    : activeTab === 'contributions'
                                                        ? displayedContributions
                                                        : Math.max(displayedRequests, displayedContributions)
                                            }
                                            onPageChange={goToPage}
                                            onItemsPerPageChange={setItemsPerPage}
                                            loading={loading}
                                        />
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </main>
        </div>
    );
}
