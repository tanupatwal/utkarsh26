import { useGSAP } from '@gsap/react'
import type { RefObject } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface HeroAnimationOptions {
    containerRef: RefObject<HTMLDivElement | null>
    matteRef: RefObject<HTMLDivElement | null>
    reducedMotion: boolean
}

/**
 * Hero animation hook — GSAP ScrollTrigger with pin + scrub
 *
 * Scroll behavior (as fraction of section scroll progress 0→1):
 * - Hold phase (0 → 0.35): Static, scale: 1, opacity: 1
 * - Zoom phase (0.35 → 0.8): scale 1 → 2, opacity: 1
 * - Fade phase (0.8 → 1.0): scale 2 → 2.2, opacity 1 → 0
 *
 * This replaces the old RAF polling loop with GSAP scrub.
 */
export function useHeroAnimation({
    containerRef,
    matteRef,
    reducedMotion,
}: HeroAnimationOptions) {
    useGSAP(() => {
        const container = containerRef.current
        const matte = matteRef.current

        if (!container || !matte) return

        if (reducedMotion) {
            // For reduced motion: no zoom, just simple fade
            gsap.set(container, { scale: 1 })
            return
        }

        // Create timeline with pin + scrub
        // Use scrub: true for instant response (no extra smoothing since Lenis handles it)
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: container,
                pin: true,
                scrub: true, // Changed from 1 to true - instant response, let Lenis do the smoothing
                start: 'top top',
                end: '+=200%', // Longer scroll distance for smoother feel
            },
        })

        // Smooth continuous animation: scale starts at 1, gradually increases
        // Opacity stays at 1 until 70%, then fades out smoothly
        tl.to(
            container,
            {
                scale: 2.5,
                opacity: 1,
                duration: 0.7, // 0-70%: zoom only
                ease: 'power1.inOut', // Slight easing for more natural feel
            },
            0
        )

        // Fade out phase with matte coming in
        tl.to(
            container,
            {
                opacity: 0,
                duration: 0.3, // 70-100%: fade out
                ease: 'power2.in',
            },
            0.7
        )

        // Matte fades in as hero fades out
        tl.to(
            matte,
            {
                opacity: 1,
                duration: 0.3,
                ease: 'power2.in',
            },
            0.7
        )

        return () => {
            ScrollTrigger.getAll()
                .filter((t) => t.trigger === container)
                .forEach((t) => t.kill())
        }
    }, [reducedMotion])
}
