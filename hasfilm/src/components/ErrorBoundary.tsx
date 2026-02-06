import { Component, ErrorInfo, ReactNode } from 'react';

/**
 * Props for ErrorBoundary component
 */
interface ErrorBoundaryProps {
    /** Fallback UI to render when an error occurs */
    fallback?: ReactNode;
    /** Children components to be wrapped */
    children: ReactNode;
}

/**
 * State for ErrorBoundary component
 */
interface ErrorBoundaryState {
    /** Whether an error has occurred */
    hasError: boolean;
    /** The error that occurred */
    error?: Error;
    /** Additional error information */
    errorInfo?: ErrorInfo;
}

/**
 * ErrorBoundary - Catches JavaScript errors anywhere in the child component tree
 * Displays a fallback UI instead of crashing the entire app
 *
 * @example
 * ```tsx
 * <ErrorBoundary fallback={<ErrorFallback />}>
 *   <App />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
        // Update state so the next render will show the fallback UI
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        // Log the error to console in development
        if (import.meta.env.DEV) {
            console.error('ErrorBoundary caught an error:', error, errorInfo);
        }

        // Store error info for rendering
        this.setState({ errorInfo });
    }

    render(): ReactNode {
        if (this.state.hasError) {
            const { fallback } = this.props;
            const { error, errorInfo } = this.state;

            // Use custom fallback if provided
            if (fallback) {
                return fallback;
            }

            // Default error UI
            return (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    flexDirection: 'column' as const,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#0B0F1A',
                    color: '#ffffff',
                    fontFamily: "'Inter', sans-serif",
                    padding: '20px',
                    zIndex: 9999,
                }}>
                    <div style={{
                        maxWidth: '600px',
                        textAlign: 'center',
                    }}>
                        <h1 style={{
                            fontSize: '2rem',
                            fontWeight: 700,
                            marginBottom: '1rem',
                            background: 'linear-gradient(90deg, #F5C16C, #00E5FF)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}>
                            Oops! Something went wrong
                        </h1>
                        <p style={{
                            fontSize: '1rem',
                            color: 'rgba(255, 255, 255, 0.7)',
                            marginBottom: '1.5rem',
                            lineHeight: '1.6',
                        }}>
                            An unexpected error occurred. Please refresh the page to try again.
                        </p>

                        {import.meta.env.DEV && error && (
                            <details style={{
                                textAlign: 'left',
                                marginTop: '1rem',
                                padding: '1rem',
                                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                borderRadius: '8px',
                                fontSize: '0.875rem',
                            }}>
                                <summary style={{
                                    cursor: 'pointer',
                                    fontWeight: 600,
                                    marginBottom: '0.5rem',
                                }}>
                                    Error Details
                                </summary>
                                <pre style={{
                                    whiteSpace: 'pre-wrap',
                                    wordBreak: 'break-word',
                                    color: '#ff6b6b',
                                    margin: 0,
                                }}>
                                    {error.toString()}
                                    {errorInfo?.componentStack}
                                </pre>
                            </details>
                        )}

                        <button
                            onClick={() => window.location.reload()}
                            style={{
                                marginTop: '1.5rem',
                                padding: '12px 24px',
                                background: 'linear-gradient(90deg, #F5C16C, #FF9F43)',
                                color: '#0B0F1A',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '1rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 8px 24px rgba(245, 193, 108, 0.4)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 4px 16px rgba(245, 193, 108, 0.3)';
                            }}
                        >
                            Refresh Page
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
