import React, { useEffect, useRef, useState } from 'react';

/**
 * Performance monitoring state
 */
interface PerformanceStats {
    /** Current frames per second */
    fps: number;
    /** Average FPS over the sample period */
    avgFps: number;
    /** Current frame time in milliseconds */
    frameTime: number;
    /** Percentage of frames that were below 30 FPS */
    droppedFrames: number;
}

/**
 * Props for PerformanceMonitor component
 */
interface PerformanceMonitorProps {
    /** Whether to show the monitor (only in dev by default) */
    show?: boolean;
    /** Position of the monitor */
    position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
    /** Sample size for average FPS calculation */
    sampleSize?: number;
}

/**
 * PerformanceMonitor - Displays real-time FPS and performance metrics
 * Only visible in development mode by default
 *
 * @example
 * ```tsx
 * <PerformanceMonitor />
 * ```
 */
export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({
    show = import.meta.env.DEV,
    position = 'top-right',
    sampleSize = 60,
}) => {
    const [stats, setStats] = useState<PerformanceStats>({
        fps: 0,
        avgFps: 0,
        frameTime: 0,
        droppedFrames: 0,
    });

    const frameTimesRef = useRef<number[]>([]);
    const lastTimeRef = useRef<number>(performance.now());
    const frameCountRef = useRef<number>(0);
    const droppedFramesRef = useRef<number>(0);

    useEffect(() => {
        if (!show) return;

        let animationFrameId: number;

        const measureFPS = () => {
            const currentTime = performance.now();
            const deltaTime = currentTime - lastTimeRef.current;
            lastTimeRef.current = currentTime;

            // Calculate current FPS
            const currentFps = Math.round(1000 / deltaTime);

            // Store frame times for average calculation
            frameTimesRef.current.push(deltaTime);
            if (frameTimesRef.current.length > sampleSize) {
                frameTimesRef.current.shift();
            }

            // Track dropped frames (below 30 FPS)
            frameCountRef.current++;
            if (currentFps < 30) {
                droppedFramesRef.current++;
            }

            // Update stats every 10 frames to avoid UI flicker
            if (frameCountRef.current % 10 === 0) {
                const avgFrameTime =
                    frameTimesRef.current.reduce((a, b) => a + b, 0) /
                    frameTimesRef.current.length;
                const avgFps = Math.round(1000 / avgFrameTime);
                const droppedFrames =
                    (droppedFramesRef.current / frameCountRef.current) * 100;

                setStats({
                    fps: currentFps,
                    avgFps,
                    frameTime: Math.round(deltaTime),
                    droppedFrames: Math.round(droppedFrames),
                });
            }

            animationFrameId = requestAnimationFrame(measureFPS);
        };

        animationFrameId = requestAnimationFrame(measureFPS);

        return () => {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
        };
    }, [show, sampleSize]);

    if (!show) return null;

    const getPositionStyles = (): React.CSSProperties => {
        const base = {
            position: 'fixed' as const,
            padding: '12px 16px',
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            color: '#ffffff',
            fontFamily: "'JetBrains Mono', 'Monaco', monospace",
            fontSize: '12px',
            lineHeight: '1.5',
            borderRadius: '8px',
            zIndex: 10000,
            pointerEvents: 'none' as const,
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
        };

        switch (position) {
            case 'top-left':
                return { ...base, top: '16px', left: '16px' };
            case 'top-right':
                return { ...base, top: '16px', right: '16px' };
            case 'bottom-left':
                return { ...base, bottom: '16px', left: '16px' };
            case 'bottom-right':
                return { ...base, bottom: '16px', right: '16px' };
        }
    };

    const getFpsColor = (fps: number): string => {
        if (fps >= 55) return '#4ade80'; // green
        if (fps >= 40) return '#fbbf24'; // yellow
        if (fps >= 25) return '#fb923c'; // orange
        return '#ef4444'; // red
    };

    return (
        <div style={getPositionStyles()}>
            <div style={{ marginBottom: '8px', fontWeight: 600, opacity: 0.7 }}>
                Performance
            </div>
            <div>
                <span style={{ opacity: 0.5 }}>FPS:</span>{' '}
                <span style={{ color: getFpsColor(stats.fps), fontWeight: 600 }}>
                    {stats.fps}
                </span>
            </div>
            <div>
                <span style={{ opacity: 0.5 }}>Avg:</span>{' '}
                <span style={{ color: getFpsColor(stats.avgFps) }}>
                    {stats.avgFps}
                </span>
            </div>
            <div>
                <span style={{ opacity: 0.5 }}>Frame:</span> {stats.frameTime}ms
            </div>
            {stats.droppedFrames > 0 && (
                <div style={{ color: '#ef4444' }}>
                    Drops: {stats.droppedFrames.toFixed(1)}%
                </div>
            )}
        </div>
    );
};

/**
 * Hook to measure component render performance
 */
export const useRenderTime = (componentName: string) => {
    const renderStart = useRef<number>(performance.now());

    useEffect(() => {
        const renderTime = performance.now() - renderStart.current;
        if (import.meta.env.DEV && renderTime > 16) {
            console.warn(
                `[Performance] ${componentName} took ${renderTime.toFixed(2)}ms to render`
            );
        }
        renderStart.current = performance.now();
    });

    return null;
};

export default PerformanceMonitor;
