'use client';

import dynamic from 'next/dynamic';

const Dashboard = dynamic(() => import('@/components/dashboard'), {
    ssr: false,
    loading: () => (
        <div className="flex items-center justify-center h-screen">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
    )
});

export default function ClientDashboard() {
    return <Dashboard />;
}
