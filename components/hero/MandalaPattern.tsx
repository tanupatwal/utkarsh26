'use client';

import { motion } from 'framer-motion';

export default function MandalaPattern() {
  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
      {/* Main rotating mandala */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
        className="absolute w-[150%] h-[150%]"
      >
        <svg
          viewBox="0 0 800 800"
          className="w-full h-full"
          style={{ filter: 'drop-shadow(0 0 40px rgba(247, 127, 0, 0.6))' }}
        >
          <defs>
            {/* Gradients for Heritage colors */}
            <radialGradient id="mandalaGrad1" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFBA08" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#F77F00" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#E63946" stopOpacity="0.5" />
            </radialGradient>
            
            <radialGradient id="mandalaGrad2" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#F77F00" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#E63946" stopOpacity="0.4" />
            </radialGradient>
          </defs>

          <g transform="translate(400, 400)">
            {/* Center core */}
            <circle cx="0" cy="0" r="30" fill="url(#mandalaGrad1)" opacity="0.8" />
            
            {/* Inner petals - 8 petals */}
            {[...Array(8)].map((_, i) => (
              <g key={`inner-${i}`} transform={`rotate(${i * 45})`}>
                <path
                  d="M 0,-50 Q 20,-70 30,-90 Q 20,-70 0,-50 Q -20,-70 -30,-90 Q -20,-70 0,-50"
                  fill="url(#mandalaGrad1)"
                  stroke="#FFBA08"
                  strokeWidth="1"
                  opacity="0.7"
                />
              </g>
            ))}

            {/* Middle layer - 12 petals */}
            {[...Array(12)].map((_, i) => (
              <g key={`middle-${i}`} transform={`rotate(${i * 30})`}>
                <path
                  d="M 0,-80 Q 25,-110 35,-140 Q 25,-110 0,-80 Q -25,-110 -35,-140 Q -25,-110 0,-80"
                  fill="url(#mandalaGrad2)"
                  stroke="#F77F00"
                  strokeWidth="1.5"
                  opacity="0.6"
                />
              </g>
            ))}

            {/* Outer layer - 16 petals */}
            {[...Array(16)].map((_, i) => (
              <g key={`outer-${i}`} transform={`rotate(${i * 22.5})`}>
                <path
                  d="M 0,-120 Q 30,-160 40,-200 Q 30,-160 0,-120 Q -30,-160 -40,-200 Q -30,-160 0,-120"
                  fill="none"
                  stroke="#E63946"
                  strokeWidth="2"
                  opacity="0.5"
                />
              </g>
            ))}

            {/* Decorative circles */}
            <circle cx="0" cy="0" r="60" fill="none" stroke="#FFBA08" strokeWidth="2" opacity="0.6" />
            <circle cx="0" cy="0" r="100" fill="none" stroke="#F77F00" strokeWidth="1.5" opacity="0.5" />
            <circle cx="0" cy="0" r="150" fill="none" stroke="#E63946" strokeWidth="1" opacity="0.4" />
            <circle cx="0" cy="0" r="210" fill="none" stroke="#F77F00" strokeWidth="0.5" opacity="0.3" />

            {/* Intricate details - dots on circles */}
            {[...Array(24)].map((_, i) => {
              const angle = (i * 15) * (Math.PI / 180);
              const radius = 150;
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;
              return (
                <circle
                  key={`dot-${i}`}
                  cx={x}
                  cy={y}
                  r="3"
                  fill="#FFBA08"
                  opacity="0.7"
                />
              );
            })}
          </g>
        </svg>
      </motion.div>

      {/* Additional layer with counter-rotation */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 180, repeat: Infinity, ease: 'linear' }}
        className="absolute w-[120%] h-[120%] opacity-40"
      >
        <svg viewBox="0 0 600 600" className="w-full h-full">
          <g transform="translate(300, 300)">
            {[...Array(8)].map((_, i) => (
              <line
                key={`line-${i}`}
                x1="0"
                y1="0"
                x2={Math.cos((i * 45) * Math.PI / 180) * 250}
                y2={Math.sin((i * 45) * Math.PI / 180) * 250}
                stroke="#F77F00"
                strokeWidth="0.5"
                opacity="0.3"
              />
            ))}
          </g>
        </svg>
      </motion.div>
    </div>
  );
}
