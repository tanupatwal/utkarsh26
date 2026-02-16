<script lang="ts">
</script>

<section class="section" style="height: 200dvh;" data-zone="GALLERY">
    <div class="gallery-sticky">
        <div class="gallery-hud">
            <div class="gallery-label">
                <h3>ARCHIVES</h3>
                <h2>GLIMPSES</h2>
            </div>
            <p class="gallery-counter">1 / 5</p>
        </div>
    </div>
</section>

<style>
    .gallery-sticky {
        position: sticky;
        top: 0;
        height: 100dvh;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: var(--section-padding);
        pointer-events: none;
    }

    .gallery-hud {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
    }

    .gallery-label {
        border-left: 2px solid var(--color-border);
        padding-left: 1rem;
    }

    .gallery-label h3 {
        font-family: var(--font-mono);
        font-size: 0.75rem;
        color: var(--color-accent);
        letter-spacing: 0.2em;
    }

    .gallery-label h2 {
        font-size: clamp(1.5rem, 4vw, 2.5rem);
        font-weight: 700;
    }

    .gallery-counter {
        font-family: var(--font-mono);
        font-size: 0.75rem;
        color: var(--color-muted);
    }
</style>
