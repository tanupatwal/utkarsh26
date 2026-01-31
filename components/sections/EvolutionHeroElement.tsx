'use client';
import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

export const EvolutionHeroElement: React.FC = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
      {/* Radial gradient background */}
      <div className="absolute inset-0 bg-gradient-radial from-neutral-900 via-black to-black" />
      
      {/* Main circular element - substituted with Reference Image */}
      <motion.div
        className="relative w-[600px] h-[600px] md:w-[800px] md:h-[800px] flex items-center justify-center"
        animate={{
          scale: [1, 1.02, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
         <div className="relative w-full h-full max-w-[600px] max-h-[600px]">
            <Image 
                src="/assets/reference_hero.jpg" 
                alt="Evolution Through Heritage" 
                fill
                className="object-contain"
                priority
            />
             {/* Overlay to blend the black background of the image with the section background if needed */}
            <div className="absolute inset-0 bg-black mix-blend-multiply opacity-20"></div>
         </div>
      </motion.div>
    </div>
  );
};
