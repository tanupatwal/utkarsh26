import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

import { CanvasLayer } from '@/canvas/CanvasLayer'
import { useScrollStore } from '@/shared/stores/scrollStore'
import styles from './App.module.css'

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger)

const SECTIONS = [
    { id: 'hero', label: 'Hero' },
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
            lerp: 0.1,
            smoothWheel: true,
        })
        lenisRef.current = lenis

        // Wire Lenis → GSAP ScrollTrigger (user-specified pattern)
        lenis.on('scroll', ScrollTrigger.update)
        gsap.ticker.add((time) => lenis.raf(time * 1000))
        gsap.ticker.lagSmoothing(0)

        return () => {
            lenis.destroy()
            gsap.ticker.remove(lenis.raf)
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
            {/* Fixed 3D Canvas behind everything */}
            <CanvasLayer />

            {/* HTML content layer */}
            <div className={styles.app}>
                {SECTIONS.map(({ id, label }) => (
                    <section key={id} id={id} className={styles.section}>
                        <h2 className={styles.sectionTitle}>{label}</h2>
                    </section>
                ))}
            </div>
        </>
    )
}
