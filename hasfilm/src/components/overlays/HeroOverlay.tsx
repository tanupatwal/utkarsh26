import React, { useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useScroll } from '@react-three/drei';
import { TIMELINE } from '../../config';
import { CONTENT } from '../../data';

/**
 * HeroOverlay - HTML overlay that displays titles during the tunnel phase.
 * Shows content titles with animated transitions as user scrolls.
 */
const HeroOverlay: React.FC = () => {
    const scroll = useScroll();
    const [currentStep, setCurrentStep] = useState(0);

    useFrame(() => {
        const r = scroll.offset;
        if (r < TIMELINE.TUNNEL_END) {
            const progress = r / TIMELINE.TUNNEL_END;
            const index = Math.floor(progress * CONTENT.length);
            setCurrentStep(index);
        } else {
            setCurrentStep(-1);
        }
    });

    return (
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-10 flex items-center justify-center">
            <div className="sticky top-0 h-screen w-full flex items-center justify-center">
                {CONTENT.map((item, index) => {
                    const isActive = index === currentStep;
                    return (
                        <div
                            key={index}
                            className={`absolute text-center transition-all duration-700 ease-out transform
                ${isActive
                                    ? 'opacity-100 blur-0 translate-y-0 scale-100'
                                    : 'opacity-0 blur-lg translate-y-20 scale-90'}
              `}
                        >
                            <h2 className="text-5xl md:text-9xl font-black text-white mb-6 uppercase tracking-tighter mix-blend-overlay">
                                {item.title}
                            </h2>
                            <p className="text-lg md:text-2xl text-white/80 font-light tracking-[1em] uppercase ml-2">
                                {item.description}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default HeroOverlay;
