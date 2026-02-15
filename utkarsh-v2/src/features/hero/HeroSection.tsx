import { useEffect, useRef } from 'react'
import { useHeroAnimation } from './useHeroAnimation'
import { useScrollStore } from '@/shared/stores/scrollStore'
import styles from './HeroSection.module.css'

/**
 * HeroSection — Video background + gradient text overlay with scroll-driven zoom/fade
 *
 * Features:
 * - Full viewport video background with dark overlay
 * - Gradient title "UTKARSH" + subtitle "2026"
 * - Taglines with shimmer animation
 * - Scroll-driven zoom and fade exit (via GSAP ScrollTrigger)
 * - Reduced motion support
 */
export function HeroSection() {
    const containerRef = useRef<HTMLDivElement>(null)
    const matteRef = useRef<HTMLDivElement>(null)
    const videoRef = useRef<HTMLVideoElement>(null)
    const reducedMotion = useScrollStore((s) => s.reducedMotion)

    // Autoplay video on mount
    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.play().catch((err) => {
                console.log('Video autoplay prevented:', err)
            })
        }
    }, [])

    // Set up scroll animations
    useHeroAnimation({
        containerRef,
        matteRef,
        reducedMotion,
    })

    return (
        <>
            {/* Black matte overlay — masks transition to tunnel */}
            <div ref={matteRef} className={styles.matteOverlay} aria-hidden="true" />

            {/* Main hero container */}
            <section ref={containerRef} className={styles.root} aria-labelledby="hero-title">
                {/* Video Background */}
                <div className={styles.videoBackground} aria-hidden="true">
                    <video
                        ref={videoRef}
                        className={styles.video}
                        src="/assets/hero_video.mp4"
                        muted
                        loop
                        playsInline
                    />
                    <div className={styles.videoOverlay} />
                </div>

                {/* Content */}
                <div className={styles.content}>
                    {/* Title */}
                    <div className={styles.titleContainer}>
                        <div className={styles.titleWrapper}>
                            <h1 id="hero-title" className={styles.title}>
                                UTKARSH
                            </h1>
                            <h2 className={styles.subtitle}>2026</h2>
                        </div>
                    </div>

                    {/* Taglines */}
                    <div className={styles.taglines}>
                        <p className={styles.tagline}>Evolution Through Heritage</p>
                        <p className={styles.hindiTagline}>Virasat se VIKAS TAK</p>
                    </div>

                    {/* Scroll Indicator */}
                    <div className={styles.scrollIndicator} aria-hidden="true">
                        <div className={styles.scrollCapsule}>
                            <div className={styles.scrollDot} />
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
