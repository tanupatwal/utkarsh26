import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import { ErrorBoundary } from './components/ErrorBoundary';
import { PerformanceMonitor } from './components/PerformanceMonitor';

// TanStack Query client — caches Supabase data to avoid re-fetching
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000,       // 5 minutes — content rarely changes
            refetchOnWindowFocus: false,      // Marketing site, no need
            retry: 1,                         // One retry, then fall back to hardcoded
        },
    },
});

const rootElement = document.getElementById('root');
if (!rootElement) {
    throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <ErrorBoundary>
                <App />
                <PerformanceMonitor />
            </ErrorBoundary>
        </QueryClientProvider>
    </React.StrictMode>
);
