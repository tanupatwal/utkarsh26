'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import HeroSection from './HeroSection';
import AboutSection from './sections/AboutSection';

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

const TUNNEL_IMAGES = [
    '/assets/eventimg/img1.jpg',
    '/assets/eventimg/img2.jpg',
    '/assets/eventimg/img3.jpg',
    '/assets/eventimg/img4.jpg',
    '/assets/eventimg/img5.jpg',
    '/assets/eventimg/img6.jpg',
    '/assets/eventimg/img7.jpg',
    '/assets/eventimg/img8.jpg',
    '/assets/eventimg/img9.jpg',
];

const ScrollyTellingSequence: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const heroRef = useRef<HTMLDivElement>(null);
    const tunnelRef = useRef<HTMLDivElement>(null);
    const aboutRef = useRef<HTMLDivElement>(null);
    const imagesRef = useRef<(HTMLDivElement | null)[]>([]);

    useGSAP(() => {
        if (!containerRef.current || !heroRef.current || !aboutRef.current) return;

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: "+=400%", // Scroll distance triggers the animation 4x window height
                pin: true,
                scrub: 1,
                // markers: true, // Remove in production
            }
        });

        // 1. Hero Expansion & Fade Out
        // Expand the hero towards the viewer (scale up) and fade it out
        tl.to(heroRef.current, {
            scale: 5,
            opacity: 0,
            duration: 2,
            ease: "power2.in",
            pointerEvents: "none" // Disable interactions after it leaves
        }, 0);

        // 2. Tunnel Sequence
        // Initially set images deep in Z space
        // We want them to start invisible or far away

        // Animate tunnel images coming towards camera
        // We stagger them so they don't all come at once
        if (imagesRef.current.length > 0) {
            // Set initial state for images
            gsap.set(imagesRef.current, {
                z: (i) => -2000 - (i * 500), // Start far back
                opacity: 0,
                scale: 0.5,
                display: "block"
            });

            // Animate them forward
            tl.to(imagesRef.current, {
                z: 1000, // Move past camera
                opacity: 1, // Fade in as they approach
                scale: 1.5,
                duration: 5, // Lasts through most of the timeline
                stagger: {
                    each: 0.2,
                    from: "start"
                },
                ease: "power1.inOut",
            }, 0.5); // Start shortly after hero starts moving

            // Add blur effect as they get close (using a second tween on the same targets?)
            // Or simple opacity/scale is enough for now.
            // Let's fade them out when they get too close (z > 500)
            tl.to(imagesRef.current, {
                opacity: 0,
                duration: 1,
                stagger: {
                    each: 0.2,
                    from: "start"
                },
                ease: "power1.in",
            }, 3.5); // Start fading out near the end of their flight
        }

        // 3. About Section Entry
        // It waits until the tunnel is mostly done
        tl.fromTo(aboutRef.current, {
            opacity: 0,
            scale: 0.8,
            z: -100, // Slightly back
        }, {
            opacity: 1,
            scale: 1,
            z: 0,
            duration: 2,
            ease: "back.out(1.2)",
        }, "-=1.5"); // Overlap with end of tunnel

    }, { scope: containerRef });

    return (
        <div
            ref={containerRef}
            className="relative w-full h-screen overflow-hidden bg-navy-dark perspective-container"
            style={{
                perspective: "1000px",
                transformStyle: "preserve-3d"
            }}
        >
            {/* HERO SECTION - Absolute to allow pinning effects */}
            <div
                ref={heroRef}
                className="absolute inset-0 w-full h-full z-20 origin-center will-change-transform"
            >
                <HeroSection />
            </div>

            {/* TUNNEL CONTAINER */}
            <div
                ref={tunnelRef}
                className="absolute inset-0 w-full h-full z-10 pointer-events-none flex items-center justify-center transform-style-3d"
            >
                {TUNNEL_IMAGES.map((src, i) => {
                    // Random positioning for the tunnel "walls"
                    // We want them spread out from center
                    const angle = (i / TUNNEL_IMAGES.length) * Math.PI * 2;
                    const radius = 300 + Math.random() * 200; // Distance from center
                    const x = Math.cos(angle) * radius; // Spread in circle
                    const y = Math.sin(angle) * radius * 0.8; // Ellipse

                    return (
                        <div
                            key={i}
                            ref={el => { imagesRef.current[i] = el; }}
                            className="absolute bg-cover bg-center border-2 border-white/20 rounded-lg shadow-2xl "
                            style={{
                                width: '300px',
                                height: '200px',
                                backgroundImage: `url(${src})`,
                                left: `calc(50% + ${x}px)`, // Offset from center
                                top: `calc(50% + ${y}px)`,
                                marginLeft: '-150px', // Center the element itself
                                marginTop: '-100px',
                                display: 'none', // Hidden initially, revealed by GSAP
                                transformStyle: "preserve-3d"
                            }}
                        />
                    );
                })}
            </div>

            {/* ABOUT SECTION - Final Landing */}
            <div
                ref={aboutRef}
                className="absolute inset-0 w-full h-full z-30 opacity-0 overflow-y-auto"
            >
                {/* About Section typically has its own padding/container, so just render it */}
                <AboutSection />
            </div>

            {/* Overlay Vignette */}
            <div className="absolute inset-0 pointer-events-none z-50 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]" />
        </div>
    );
};

export default ScrollyTellingSequence;
