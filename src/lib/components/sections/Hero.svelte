<script lang="ts">
    import { scrollState } from "$lib/state/scrollState.svelte";
</script>

<section class="section section--full" style="height: 100dvh;" data-zone="HERO">
    <div class="hero-inner">
        <h1 class="hero-title">UTKARSH 2026</h1>
        <p class="hero-tagline">Evolution Through Heritage</p>
        <p class="hero-sub">Virasat se VIKAS tak</p>
        <div class="scroll-indicator">↓ SCROLL</div>
    </div>
</section>

<style>
    .hero-inner {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        text-align: center;
        padding: var(--section-padding);
    }

    .hero-title {
        font-family: var(--font-display);
        font-size: clamp(3rem, 10vw, 8rem);
        font-weight: 900;
        letter-spacing: 0.05em;
        text-transform: uppercase;
        background: linear-gradient(
            135deg,
            var(--color-accent),
            var(--color-accent-2)
        );
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }

    .hero-tagline {
        font-size: clamp(1rem, 3vw, 1.5rem);
        color: var(--color-muted);
        margin-top: 1rem;
        font-weight: 300;
        letter-spacing: 0.2em;
        text-transform: uppercase;
    }

    .hero-sub {
        font-family: var(--font-mono);
        font-size: clamp(0.75rem, 2vw, 1rem);
        color: var(--color-accent);
        margin-top: 0.5rem;
        opacity: 0.6;
    }

    .scroll-indicator {
        position: absolute;
        bottom: 2rem;
        font-family: var(--font-mono);
        font-size: 0.75rem;
        color: var(--color-muted);
        letter-spacing: 0.3em;
        animation: pulse 2s ease-in-out infinite;
    }

    @keyframes pulse {
        0%,
        100% {
            opacity: 0.3;
            transform: translateY(0);
        }
        50% {
            opacity: 1;
            transform: translateY(5px);
        }
    }
</style>
