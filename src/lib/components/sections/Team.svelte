<script lang="ts">
</script>

<section class="section section--full" style="height: 100dvh;" data-zone="TEAM">
    <div class="team-inner">
        <h2 class="team-title">THE CORE TEAM</h2>
        <p class="team-sub">Placeholder — 24 team members grid</p>
    </div>
</section>

<style>
    .team-inner {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        padding: var(--section-padding);
        gap: 2rem;
    }

    .team-title {
        font-family: var(--font-display);
        font-size: clamp(2rem, 5vw, 3.5rem);
        font-weight: 800;
        letter-spacing: 0.1em;
    }

    .team-sub {
        font-family: var(--font-mono);
        font-size: 0.75rem;
        color: var(--color-muted);
    }
</style>
