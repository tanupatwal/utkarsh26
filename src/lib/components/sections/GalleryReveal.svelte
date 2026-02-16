<script lang="ts">
    import { scrollState } from "$lib/state/scrollState.svelte";
    import { GALLERY_CONTENT } from "$lib/data/gallery";
    import { clamp } from "$lib/utils/easing";

    // Gallery progress ranges (matching GalleryGroup.svelte)
    const VIEW_START = 0.34;
    const VIEW_END = 0.46;

    const totalItems = GALLERY_CONTENT.length;

    // Current panel index based on scroll progress
    const currentIndex = $derived.by(() => {
        const r = scrollState.progress;
        if (r < VIEW_START) return 0;
        if (r >= VIEW_END) return totalItems - 1;
        const rotProgress = (r - VIEW_START) / (VIEW_END - VIEW_START);
        const rawIndex = Math.max(
            0,
            Math.min(rotProgress * totalItems - 0.5, totalItems - 1),
        );
        return Math.round(rawIndex);
    });

    const currentItem = $derived(GALLERY_CONTENT[currentIndex]);
    const counterText = $derived(`${currentIndex + 1} / ${totalItems}`);
</script>

<section class="section" style="height: 200dvh;" data-zone="GALLERY">
    <div class="gallery-sticky">
        <div class="gallery-hud">
            <div class="gallery-label">
                <h3>ARCHIVES</h3>
                <h2>GLIMPSES</h2>
            </div>
            <p class="gallery-counter">{counterText}</p>
        </div>

        <div class="gallery-info">
            <h3 class="gallery-title">{currentItem.title}</h3>
            <p class="gallery-desc">{currentItem.description}</p>
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
        margin: 0;
    }

    .gallery-label h2 {
        font-size: clamp(1.5rem, 4vw, 2.5rem);
        font-weight: 700;
        margin: 0.25rem 0 0;
    }

    .gallery-counter {
        font-family: var(--font-mono);
        font-size: 0.75rem;
        color: var(--color-muted);
    }

    .gallery-info {
        max-width: 40ch;
        padding-bottom: 2rem;
    }

    .gallery-title {
        font-family: var(--font-display, var(--font-body));
        font-size: clamp(1rem, 2.5vw, 1.5rem);
        font-weight: 600;
        margin: 0 0 0.5rem;
        color: var(--color-text);
    }

    .gallery-desc {
        font-size: 0.85rem;
        color: var(--color-muted);
        line-height: 1.6;
        margin: 0;
    }
</style>
