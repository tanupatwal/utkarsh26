<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { HIGHLIGHTS_CONTENT } from "$lib/data/highlights";

    // ════════════════════════════════════════
    //  DEPTH LAYER CONFIG
    // ════════════════════════════════════════
    type DepthLayer = "foreground" | "middle" | "background";

    interface PlacedImage {
        index: number;
        x: number; // % position
        y: number; // % position
        width: number; // vw
        layer: DepthLayer;
        rotation: number;
        floatDelay: number; // staggered float animation offset
    }

    const LAYER_CONFIG = {
        foreground: { parallax: 20, blur: 0, brightness: 1, scale: 1.05 },
        middle: { parallax: 10, blur: 0, brightness: 0.85, scale: 1 },
        background: { parallax: 4, blur: 1, brightness: 0.65, scale: 0.95 },
    };

    // Pre-computed layout — 12 images in a scattered bento pattern
    const PLACED_IMAGES: PlacedImage[] = [
        // Foreground (4 images)
        {
            index: 0,
            x: 5,
            y: 8,
            width: 22,
            layer: "foreground",
            rotation: -2,
            floatDelay: 0,
        },
        {
            index: 3,
            x: 60,
            y: 5,
            width: 18,
            layer: "foreground",
            rotation: 1.5,
            floatDelay: 1.2,
        },
        {
            index: 6,
            x: 30,
            y: 55,
            width: 20,
            layer: "foreground",
            rotation: -1,
            floatDelay: 2.4,
        },
        {
            index: 9,
            x: 72,
            y: 60,
            width: 22,
            layer: "foreground",
            rotation: 2,
            floatDelay: 0.8,
        },
        // Middle (4 images)
        {
            index: 1,
            x: 35,
            y: 2,
            width: 16,
            layer: "middle",
            rotation: 1,
            floatDelay: 0.5,
        },
        {
            index: 4,
            x: 8,
            y: 45,
            width: 18,
            layer: "middle",
            rotation: -1.5,
            floatDelay: 1.8,
        },
        {
            index: 7,
            x: 55,
            y: 40,
            width: 16,
            layer: "middle",
            rotation: 0.5,
            floatDelay: 3.0,
        },
        {
            index: 10,
            x: 80,
            y: 30,
            width: 15,
            layer: "middle",
            rotation: -0.8,
            floatDelay: 2.0,
        },
        // Background (4 images)
        {
            index: 2,
            x: 18,
            y: 28,
            width: 14,
            layer: "background",
            rotation: 0.5,
            floatDelay: 1.0,
        },
        {
            index: 5,
            x: 48,
            y: 22,
            width: 13,
            layer: "background",
            rotation: -0.5,
            floatDelay: 2.2,
        },
        {
            index: 8,
            x: 75,
            y: 12,
            width: 12,
            layer: "background",
            rotation: 1.2,
            floatDelay: 0.3,
        },
        {
            index: 11,
            x: 42,
            y: 70,
            width: 14,
            layer: "background",
            rotation: -1,
            floatDelay: 1.5,
        },
    ];

    // ════════════════════════════════════════
    //  MOUSE PARALLAX (smoothed)
    // ════════════════════════════════════════
    let mouseX = $state(0);
    let mouseY = $state(0);
    let smoothX = 0;
    let smoothY = 0;
    let hoveredIndex = $state<number | null>(null);
    let sectionEl: HTMLElement;
    let rafId: number;

    function handleMouse(e: MouseEvent) {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    }

    function smoothLoop() {
        // Damped lerp for smooth parallax feel
        smoothX += (mouseX - smoothX) * 0.08;
        smoothY += (mouseY - smoothY) * 0.08;
        rafId = requestAnimationFrame(smoothLoop);
    }

    // Use smoothed values for parallax
    let parallaxX = $derived(smoothX);
    let parallaxY = $derived(smoothY);

    // ════════════════════════════════════════
    //  GSAP STAGGERED ENTRANCE
    // ════════════════════════════════════════
    onMount(async () => {
        window.addEventListener("mousemove", handleMouse);
        smoothLoop();

        const gsap = (await import("gsap")).default;
        const { ScrollTrigger } = await import("gsap/ScrollTrigger");
        gsap.registerPlugin(ScrollTrigger);

        // Stagger entrance – cards fly in from below with rotation
        gsap.from(".floating-card", {
            scrollTrigger: {
                trigger: sectionEl,
                start: "top 85%",
                once: true,
            },
            opacity: 0,
            y: 60,
            scale: 0.85,
            rotation: "random(-8, 8)",
            stagger: {
                amount: 0.6,
                from: "random",
            },
            duration: 0.9,
            ease: "power3.out",
        });
    });

    onDestroy(() => {
        if (typeof window !== "undefined") {
            window.removeEventListener("mousemove", handleMouse);
            cancelAnimationFrame(rafId);
        }
    });
</script>

<section
    class="section"
    style="height: 150dvh;"
    data-zone="HIGHLIGHTS"
    bind:this={sectionEl}
>
    <div class="highlights-sticky">
        <!-- Section header -->
        <div class="highlights-header">
            <div class="header-accent"></div>
            <h2 class="highlights-title">EVENT HIGHLIGHTS</h2>
            <p class="highlights-sub">
                A constellation of moments that defined Utkarsh
            </p>
        </div>

        <!-- Floating image gallery -->
        <div class="gallery-field">
            {#each PLACED_IMAGES as img (img.index)}
                {@const data = HIGHLIGHTS_CONTENT[img.index]}
                {@const config = LAYER_CONFIG[img.layer]}
                {@const offsetX = parallaxX * config.parallax}
                {@const offsetY = parallaxY * config.parallax}
                {@const isHovered = hoveredIndex === img.index}

                <!-- svelte-ignore a11y_no_static_element_interactions -->
                <div
                    class="floating-card"
                    class:hovered={isHovered}
                    class:dimmed={hoveredIndex !== null && !isHovered}
                    style="
						left: {img.x}%;
						top: {img.y}%;
						width: {img.width}vw;
						transform: translate({offsetX}px, {offsetY}px) rotate({img.rotation}deg) scale({isHovered
                        ? 1.08
                        : config.scale});
						filter: blur({isHovered ? 0 : config.blur}px) brightness({isHovered
                        ? 1.1
                        : config.brightness});
						z-index: {isHovered
                        ? 50
                        : img.layer === 'foreground'
                          ? 3
                          : img.layer === 'middle'
                            ? 2
                            : 1};
						animation-delay: {img.floatDelay}s;
					"
                    on:mouseenter={() => (hoveredIndex = img.index)}
                    on:mouseleave={() => (hoveredIndex = null)}
                >
                    <img
                        src={data.url}
                        alt={data.title}
                        class="card-image"
                        loading="lazy"
                    />

                    <!-- Hover overlay -->
                    <div class="card-overlay" class:visible={isHovered}>
                        <h3 class="card-title">{data.title}</h3>
                        <p class="card-desc">{data.description}</p>
                    </div>

                    <!-- Edge glow on hover -->
                    <div class="card-glow" class:visible={isHovered}></div>
                </div>
            {/each}
        </div>

        <!-- Bottom counter -->
        <div class="highlights-counter">
            <span class="counter-value">{HIGHLIGHTS_CONTENT.length}</span>
            <span class="counter-label">MOMENTS CAPTURED</span>
        </div>
    </div>
</section>

<style>
    .highlights-sticky {
        position: sticky;
        top: 0;
        height: 100dvh;
        overflow: hidden;
        display: flex;
        flex-direction: column;
    }

    /* ─── Header ─── */
    .highlights-header {
        position: absolute;
        top: 2rem;
        left: 2rem;
        z-index: 10;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .header-accent {
        width: 2rem;
        height: 2px;
        background: var(--color-accent);
        margin-bottom: 0.25rem;
    }

    .highlights-title {
        font-family: var(--font-display);
        font-size: clamp(1.5rem, 3vw, 2.5rem);
        font-weight: 800;
        letter-spacing: 0.15em;
        color: #fff;
    }

    .highlights-sub {
        font-family: var(--font-mono);
        font-size: 0.7rem;
        color: var(--color-muted);
        letter-spacing: 0.08em;
    }

    /* ─── Gallery field ─── */
    .gallery-field {
        position: absolute;
        inset: 0;
    }

    /* ─── Floating card ─── */
    .floating-card {
        position: absolute;
        aspect-ratio: 4 / 3;
        border-radius: 6px;
        overflow: hidden;
        cursor: pointer;
        transition:
            transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94),
            filter 0.5s ease,
            opacity 0.4s ease;
        will-change: transform;
        animation: subtleFloat 6s ease-in-out infinite;
    }

    .floating-card.hovered {
        z-index: 50 !important;
    }

    .floating-card.dimmed {
        opacity: 0.55;
    }

    /* Subtle floating animation — each card drifts at its own pace */
    @keyframes subtleFloat {
        0%,
        100% {
            translate: 0 0;
        }
        50% {
            translate: 0 -8px;
        }
    }

    .card-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
        transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }

    .floating-card.hovered .card-image {
        transform: scale(1.05);
    }

    /* ─── Hover overlay ─── */
    .card-overlay {
        position: absolute;
        inset: 0;
        background: linear-gradient(
            to top,
            rgba(0, 0, 0, 0.85) 0%,
            rgba(0, 0, 0, 0.4) 40%,
            transparent 70%
        );
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        padding: 1rem;
        opacity: 0;
        transition: opacity 0.35s ease;
        pointer-events: none;
    }

    .card-overlay.visible {
        opacity: 1;
    }

    .card-title {
        font-family: var(--font-display);
        font-size: clamp(0.75rem, 1.2vw, 1rem);
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: #fff;
        margin: 0 0 0.3rem;
    }

    .card-desc {
        font-family: var(--font-body);
        font-size: clamp(0.6rem, 0.8vw, 0.75rem);
        color: rgba(255, 255, 255, 0.7);
        line-height: 1.4;
        margin: 0;
    }

    /* ─── Edge glow ─── */
    .card-glow {
        position: absolute;
        inset: -1px;
        border-radius: 7px;
        border: 1px solid transparent;
        opacity: 0;
        transition: opacity 0.35s ease;
        pointer-events: none;
    }

    .card-glow.visible {
        opacity: 1;
        border-color: var(--color-accent);
        box-shadow:
            0 0 20px rgba(56, 189, 248, 0.15),
            inset 0 0 20px rgba(56, 189, 248, 0.05);
    }

    /* ─── Counter ─── */
    .highlights-counter {
        position: absolute;
        bottom: 2rem;
        right: 2rem;
        z-index: 10;
        display: flex;
        align-items: baseline;
        gap: 0.5rem;
    }

    .counter-value {
        font-family: var(--font-display);
        font-size: 2rem;
        font-weight: 800;
        color: var(--color-accent);
    }

    .counter-label {
        font-family: var(--font-mono);
        font-size: 0.6rem;
        color: var(--color-muted);
        letter-spacing: 0.12em;
    }

    /* ─── Responsive ─── */
    @media (max-width: 768px) {
        .highlights-header {
            left: 1rem;
            top: 1rem;
        }

        .highlights-counter {
            bottom: 1rem;
            right: 1rem;
        }
    }
</style>
