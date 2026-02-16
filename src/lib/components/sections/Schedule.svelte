<script lang="ts">
</script>

<section class="section" style="height: 200dvh;" data-zone="SCHEDULE">
    <div class="schedule-sticky">
        <h2 class="schedule-title">FESTIVAL SCHEDULE</h2>
        <div class="schedule-tabs">
            <button class="tab active">DAY 1</button>
            <button class="tab">DAY 2</button>
            <button class="tab">DAY 3</button>
        </div>
        <p class="schedule-sub">Placeholder — 60 events with tab switching</p>
    </div>
</section>

<style>
    .schedule-sticky {
        position: sticky;
        top: 0;
        height: 100dvh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: var(--section-padding);
        gap: 2rem;
    }

    .schedule-title {
        font-family: var(--font-display);
        font-size: clamp(2rem, 5vw, 3.5rem);
        font-weight: 800;
        letter-spacing: 0.1em;
    }

    .schedule-tabs {
        display: flex;
        gap: 1rem;
    }

    .tab {
        font-family: var(--font-mono);
        font-size: 0.85rem;
        padding: 0.5rem 1.5rem;
        background: transparent;
        border: 1px solid var(--color-border);
        color: var(--color-muted);
        cursor: pointer;
        letter-spacing: 0.1em;
        transition: all 0.3s var(--ease-out-expo);
    }

    .tab.active {
        border-color: var(--color-accent);
        color: var(--color-accent);
    }

    .schedule-sub {
        font-family: var(--font-mono);
        font-size: 0.75rem;
        color: var(--color-muted);
    }
</style>
