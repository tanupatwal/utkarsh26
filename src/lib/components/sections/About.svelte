<script lang="ts">
</script>

<section
    class="section section--full"
    style="height: 100dvh;"
    data-zone="ABOUT"
>
    <div class="about-inner">
        <div class="stats-row">
            <div class="stat">
                <span class="stat-value">2006</span>
                <span class="stat-label">Established</span>
            </div>
            <div class="stat">
                <span class="stat-value">10K+</span>
                <span class="stat-label">Attendees</span>
            </div>
            <div class="stat">
                <span class="stat-value">3</span>
                <span class="stat-label">Days</span>
            </div>
            <div class="stat">
                <span class="stat-value">50+</span>
                <span class="stat-label">Events</span>
            </div>
        </div>
        <p class="about-text">
            About section content goes here — heritage story, festival
            evolution, vision for 2026.
        </p>
    </div>
</section>

<style>
    .about-inner {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        padding: var(--section-padding);
        gap: 3rem;
    }

    .stats-row {
        display: flex;
        gap: clamp(1.5rem, 5vw, 4rem);
        flex-wrap: wrap;
        justify-content: center;
    }

    .stat {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
    }

    .stat-value {
        font-family: var(--font-display);
        font-size: clamp(2rem, 5vw, 3.5rem);
        font-weight: 800;
        color: var(--color-accent);
    }

    .stat-label {
        font-family: var(--font-mono);
        font-size: 0.75rem;
        color: var(--color-muted);
        text-transform: uppercase;
        letter-spacing: 0.15em;
    }

    .about-text {
        max-width: 60ch;
        text-align: center;
        color: var(--color-muted);
        line-height: 1.8;
    }
</style>
