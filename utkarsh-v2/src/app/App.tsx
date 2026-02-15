import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

import { CanvasLayer } from '@/canvas/CanvasLayer'
import { useScrollStore } from '@/shared/stores/scrollStore'
import { Navbar } from '@/shared/components/Navbar'
import { ProgressBar } from '@/shared/components/ProgressBar'
import { SkipLink } from '@/shared/components/SkipLink'
import { HeroSection } from '@/features/hero/HeroSection'
import styles from './App.module.css'

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger)

const PLACEHOLDER_SECTIONS = [
    { id: 'tunnel', label: 'Tunnel' },
    { id: 'about', label: 'About' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'highlights', label: 'Highlights' },
    { id: 'schedule', label: 'Schedule' },
    { id: 'team', label: 'Team' },
] as const

export function App() {
    const lenisRef = useRef<Lenis | null>(null)
    const setProgress = useScrollStore((s) => s.setProgress)

    // Initialize Lenis smooth scroll + GSAP ScrollTrigger proxy
    useEffect(() => {
        const lenis = new Lenis({
            lerp: 0.15,          // Increased from 0.1 for smoother feel
            smoothWheel: true,
            wheelMultiplier: 1,  // Normal scroll speed
        })
        lenisRef.current = lenis

        // Use requestAnimationFrame for Lenis (separate from GSAP ticker)
        function raf(time: number) {
            lenis.raf(time)
            requestAnimationFrame(raf)
        }
        requestAnimationFrame(raf)

        // Update ScrollTrigger on Lenis scroll
        lenis.on('scroll', ScrollTrigger.update)

        return () => {
            lenis.destroy()
        }
    }, [])

    // Track global scroll progress via ScrollTrigger
    useGSAP(() => {
        ScrollTrigger.create({
            trigger: 'body',
            start: 'top top',
            end: 'bottom bottom',
            onUpdate: (self) => {
                setProgress(self.progress)
            },
        })
    })

    // Detect reduced motion preference
    useEffect(() => {
        const mql = window.matchMedia('(prefers-reduced-motion: reduce)')
        useScrollStore.getState().setReducedMotion(mql.matches)

        const handler = (e: MediaQueryListEvent) => {
            useScrollStore.getState().setReducedMotion(e.matches)
        }
        mql.addEventListener('change', handler)
        return () => mql.removeEventListener('change', handler)
    }, [])

    return (
        <>
            {/* A11y: skip link for keyboard users */}
            <SkipLink />

            {/* Fixed 3D Canvas behind everything */}
            <CanvasLayer />

            {/* Fixed UI overlays */}
            <Navbar />
            <ProgressBar />

            {/* HTML content layer */}
            <main className={styles.app}>
                {/* Full Hero Section */}
                <HeroSection />

                {/* Placeholder sections for remaining features */}
                {PLACEHOLDER_SECTIONS.map(({ id, label }) => (
                    <section
                        key={id}
                        id={id}
                        className={styles.section}
                        aria-labelledby={`${id}-heading`}
                    >
                        <h2 id={`${id}-heading`} className={styles.sectionTitle}>
                            {label}
                        </h2>
                    </section>
                ))}
            </main>
        </>
    )
}

