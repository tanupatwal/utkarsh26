import React from 'react';

/**
 * LoadingOverlay - Initial loading screen that fades out.
 */
const LoadingOverlay: React.FC = () => {
    return (
        <>
            <div
                className="absolute inset-0 bg-black flex items-center justify-center pointer-events-none transition-opacity duration-1000 opacity-0"
                style={{ animation: 'fadeOut 1s forwards 2s' }}
            >
                <div className="text-white text-sm tracking-widest uppercase">
                    Initializing Simulation...
                </div>
            </div>

            <style>{`
        @keyframes fadeOut {
          to { opacity: 0; display: none; }
        }
      `}</style>
        </>
    );
};

export default LoadingOverlay;
