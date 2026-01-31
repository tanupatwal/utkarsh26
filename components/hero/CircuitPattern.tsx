'use client';

import { motion } from 'framer-motion';

export default function CircuitPattern() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <svg
        viewBox="0 0 1000 1000"
        className="w-full h-full"
        style={{ filter: 'drop-shadow(0 0 20px rgba(0, 217, 255, 0.4))' }}
      >
        <defs>
          {/* Gradients for Tech colors */}
          <linearGradient id="circuitGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00D9FF" />
            <stop offset="50%" stopColor="#0066CC" />
            <stop offset="100%" stopColor="#6247AA" />
          </linearGradient>

          <linearGradient id="circuitGrad2" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6247AA" />
            <stop offset="100%" stopColor="#00D9FF" />
          </linearGradient>
        </defs>

        {/* Horizontal circuit paths */}
        <g opacity="0.6">
          <motion.path
            d="M 100 150 L 300 150 L 300 250 L 500 250 L 500 150 L 700 150"
            stroke="url(#circuitGrad1)"
            strokeWidth="3"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.8 }}
            transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse' }}
          />
          
          <motion.path
            d="M 150 350 L 250 350 L 250 450 L 450 450 L 450 350 L 650 350"
            stroke="url(#circuitGrad2)"
            strokeWidth="2.5"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.7 }}
            transition={{ duration: 4, repeat: Infinity, repeatType: 'reverse', delay: 0.5 }}
          />

          <path
            d="M 200 550 L 400 550 L 400 650 L 600 650"
            stroke="#00D9FF"
            strokeWidth="2"
            fill="none"
            opacity="0.5"
          />

          <path
            d="M 50 750 L 200 750 L 200 850 L 450 850"
            stroke="#0066CC"
            strokeWidth="2"
            fill="none"
            opacity="0.4"
          />
        </g>

        {/* Vertical circuit paths */}
        <g opacity="0.6">
          <motion.path
            d="M 800 100 L 800 300 L 700 300 L 700 500"
            stroke="url(#circuitGrad1)"
            strokeWidth="2.5"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 5, repeat: Infinity, repeatType: 'reverse', delay: 1 }}
          />

          <path
            d="M 600 200 L 600 400 L 700 400 L 700 600"
            stroke="#6247AA"
            strokeWidth="2"
            fill="none"
            opacity="0.5"
          />
        </g>

        {/* Circuit nodes (connection points) */}
        <g>
          {/* Animated pulsing nodes */}
          {[
            { x: 300, y: 150 }, { x: 500, y: 250 }, { x: 250, y: 350 },
            { x: 450, y: 450 }, { x: 400, y: 550 }, { x: 600, y: 650 },
            { x: 800, y: 300 }, { x: 700, y: 500 }
          ].map((node, i) => (
            <g key={`node-${i}`}>
              <motion.circle
                cx={node.x}
                cy={node.y}
                r="8"
                fill="#00D9FF"
                animate={{
                  opacity: [0.4, 1, 0.4],
                  scale: [1, 1.3, 1]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.3
                }}
              />
              <circle
                cx={node.x}
                cy={node.y}
                r="4"
                fill="#0066CC"
                opacity="0.8"
              />
            </g>
          ))}
        </g>

        {/* Chip/IC representations */}
        <g>
          <rect x="320" y="280" width="60" height="60" fill="none" stroke="#00D9FF" strokeWidth="2" opacity="0.6" />
          <rect x="325" y="285" width="50" height="50" fill="#0066CC" opacity="0.2" />
          
          <rect x="720" y="420" width="50" height="50" fill="none" stroke="#6247AA" strokeWidth="2" opacity="0.6" />
          <rect x="725" y="425" width="40" height="40" fill="#6247AA" opacity="0.2" />
        </g>

        {/* Decorative hexagons */}
        <g opacity="0.4">
          {[
            { x: 550, y: 180 }, { x: 380, y: 680 }, { x: 750, y: 750 }
          ].map((hex, i) => {
            const points = [...Array(6)].map((_, j) => {
              const angle = (j * 60 - 30) * Math.PI / 180;
              const px = hex.x + Math.cos(angle) * 30;
              const py = hex.y + Math.sin(angle) * 30;
              return `${px},${py}`;
            }).join(' ');
            
            return (
              <polygon
                key={`hex-${i}`}
                points={points}
                fill="none"
                stroke="#00D9FF"
                strokeWidth="1.5"
              />
            );
          })}
        </g>

        {/* Data flow lines (animated) */}
        <g>
          <motion.line
            x1="300"
            y1="150"
            x2="500"
            y2="250"
            stroke="#00D9FF"
            strokeWidth="1"
            strokeDasharray="5,5"
            animate={{
              strokeDashoffset: [0, -20]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'linear'
            }}
            opacity="0.6"
          />
        </g>
      </svg>
    </div>
  );
}
