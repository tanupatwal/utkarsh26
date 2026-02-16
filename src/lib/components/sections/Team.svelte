<script lang="ts">
    import { TEAM_MEMBERS, TEAM_BG_IMAGES } from "$lib/data/team";

    // ════════════════════════════════════════
    //  STATE
    // ════════════════════════════════════════
    let activeIndex = $state(0);
    let total = TEAM_MEMBERS.length;

    // Visible names window (4 above + 4 below active)
    const VISIBLE_RADIUS = 4;

    let visibleNames = $derived(() => {
        const names: { index: number; dist: number }[] = [];
        for (let d = -VISIBLE_RADIUS; d <= VISIBLE_RADIUS; d++) {
            const idx = activeIndex + d;
            if (idx >= 0 && idx < total) {
                names.push({ index: idx, dist: Math.abs(d) });
            }
        }
        return names;
    });

    function navigate(dir: 1 | -1) {
        const next = activeIndex + dir;
        if (next >= 0 && next < total) {
            activeIndex = next;
        }
    }

    function handleKeydown(e: KeyboardEvent) {
        if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
            e.preventDefault();
            navigate(-1);
        }
        if (e.key === "ArrowDown" || e.key === "ArrowRight") {
            e.preventDefault();
            navigate(1);
        }
    }

    function distClass(dist: number): string {
        if (dist === 0) return "active";
        if (dist === 1) return "dist-1";
        if (dist === 2) return "dist-2";
        if (dist === 3) return "dist-3";
        return "dist-4";
    }

    let activeMember = $derived(TEAM_MEMBERS[activeIndex]);
    let counterText = $derived(
        `${String(activeIndex + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`,
    );
</script>

<svelte:window on:keydown={handleKeydown} />

<section class="section section--full" style="height: 100dvh;" data-zone="TEAM">
    <div class="team-root">
        <!-- Film grain overlay -->
        <div class="film-grain"></div>

        <!-- Background drift columns -->
        <div class="drift-layer">
            {#each Array(5) as _, col}
                <div
                    class="drift-col"
                    style="
						left: {col * 20}vw;
						animation: driftUp {25 + col * 5}s linear infinite;
						animation-delay: {-col * 4}s;
					"
                >
                    {#each Array(4) as _, row}
                        {@const imgIdx =
                            (col * 4 + row) % TEAM_BG_IMAGES.length}
                        <img
                            src={TEAM_BG_IMAGES[imgIdx]}
                            alt=""
                            loading="lazy"
                        />
                    {/each}
                </div>
            {/each}
        </div>

        <!-- Main content -->
        <div class="team-content">
            <!-- Left panel: Names list -->
            <div class="names-panel">
                <div class="section-label">
                    <div class="label-accent"></div>
                    <span class="label-text">THE CORE TEAM</span>
                </div>

                <div class="names-window">
                    {#each visibleNames() as { index: idx, dist } (idx)}
                        <!-- svelte-ignore a11y_no_static_element_interactions -->
                        <div
                            class="name-item {distClass(dist)}"
                            on:click={() => (activeIndex = idx)}
                        >
                            {TEAM_MEMBERS[idx].name}
                        </div>
                    {/each}
                </div>

                <!-- Counter -->
                <div class="page-counter">
                    <span class="counter-current">{counterText}</span>
                </div>

                <!-- Arrow nav -->
                <div class="arrow-nav">
                    <button
                        class="arrow-btn"
                        disabled={activeIndex === 0}
                        on:click={() => navigate(-1)}>↑</button
                    >
                    <button
                        class="arrow-btn"
                        disabled={activeIndex === total - 1}
                        on:click={() => navigate(1)}>↓</button
                    >
                </div>
            </div>

            <!-- Right panel: Portrait -->
            <div class="portrait-panel">
                {#key activeIndex}
                    <div class="portrait-frame">
                        <img
                            src={activeMember.image}
                            alt={activeMember.name}
                            class="portrait-img"
                        />
                    </div>
                    <div class="portrait-role">
                        {activeMember.role}
                    </div>
                {/key}
            </div>
        </div>
    </div>
</section>

<style>
    /* ═══ ROOT ═══ */
    .team-root {
        position: relative;
        width: 100%;
        height: 100%;
        overflow: hidden;
        background: #000;
    }

    /* ─── Film grain ─── */
    .film-grain {
        position: absolute;
        inset: 0;
        z-index: 4;
        pointer-events: none;
        opacity: 0.04;
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='grain'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23grain)'/%3E%3C/svg%3E");
        background-size: 200px 200px;
    }

    /* ─── Background drift ─── */
    .drift-layer {
        position: absolute;
        inset: 0;
        pointer-events: none;
        z-index: 1;
        overflow: hidden;
    }

    .drift-col {
        position: absolute;
        width: 20vw;
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    .drift-col img {
        width: 100%;
        height: auto;
        object-fit: cover;
        opacity: 0.12;
        filter: brightness(0.5) saturate(0.4) blur(0.5px);
        border-radius: 4px;
    }

    @keyframes driftUp {
        from {
            transform: translateY(0);
        }
        to {
            transform: translateY(-100%);
        }
    }

    /* ─── Main content ─── */
    .team-content {
        position: relative;
        z-index: 3;
        display: flex;
        height: 100%;
        align-items: center;
    }

    /* ─── Names panel ─── */
    .names-panel {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 1.5rem;
        padding: 2rem;
    }

    .section-label {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .label-accent {
        width: 1.5rem;
        height: 2px;
        background: var(--color-accent);
    }

    .label-text {
        font-family: var(--font-mono);
        font-size: 0.65rem;
        color: var(--color-muted);
        letter-spacing: 0.2em;
    }

    /* ─── Names window ─── */
    .names-window {
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;
        padding: 1rem 0;
        -webkit-mask-image: linear-gradient(
            to bottom,
            transparent 0%,
            black 15%,
            black 85%,
            transparent 100%
        );
        mask-image: linear-gradient(
            to bottom,
            transparent 0%,
            black 15%,
            black 85%,
            transparent 100%
        );
    }

    .name-item {
        font-family: var(--font-display);
        font-weight: 800;
        letter-spacing: 0.15em;
        text-transform: uppercase;
        cursor: pointer;
        padding: 0.3rem 0;
        transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
        white-space: nowrap;
    }

    .name-item.active {
        font-size: clamp(1.8rem, 3.5vw, 3rem);
        color: #fff;
        transform: scale(1.05);
        text-shadow:
            0 0 40px rgba(255, 255, 255, 0.2),
            0 0 80px rgba(255, 255, 255, 0.08);
    }

    .name-item.dist-1 {
        font-size: clamp(1rem, 1.8vw, 1.5rem);
        color: #555;
        opacity: 0.85;
    }

    .name-item.dist-2 {
        font-size: clamp(0.8rem, 1.4vw, 1.2rem);
        color: #3a3a3a;
        opacity: 0.6;
    }

    .name-item.dist-3 {
        font-size: clamp(0.7rem, 1.1vw, 1rem);
        color: #2a2a2a;
        opacity: 0.35;
    }

    .name-item.dist-4 {
        font-size: clamp(0.6rem, 0.9vw, 0.85rem);
        color: #1a1a1a;
        opacity: 0.18;
    }

    /* ─── Counter ─── */
    .page-counter {
        font-family: var(--font-mono);
        font-size: 0.7rem;
        color: var(--color-muted);
        letter-spacing: 0.15em;
    }

    /* ─── Arrow nav ─── */
    .arrow-nav {
        display: flex;
        gap: 0.75rem;
    }

    .arrow-btn {
        width: 40px;
        height: 40px;
        border: 1px solid rgba(255, 255, 255, 0.15);
        background: none;
        color: rgba(255, 255, 255, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: 1rem;
        transition: all 0.3s ease;
        border-radius: 2px;
    }

    .arrow-btn:hover:not(:disabled) {
        border-color: var(--color-accent);
        color: var(--color-accent);
        box-shadow: 0 0 12px rgba(56, 189, 248, 0.2);
    }

    .arrow-btn:disabled {
        opacity: 0.2;
        cursor: not-allowed;
    }

    /* ─── Portrait panel ─── */
    .portrait-panel {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        padding: 2rem;
    }

    .portrait-frame {
        position: relative;
        width: clamp(220px, 22vw, 340px);
        height: clamp(280px, 28vw, 420px);
        overflow: hidden;
        background: #111;
        border-radius: 4px;
        animation: portraitReveal 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }

    @keyframes portraitReveal {
        from {
            opacity: 0;
            clip-path: inset(100% 0 0 0);
            transform: scale(1.1);
        }
        to {
            opacity: 1;
            clip-path: inset(0 0 0 0);
            transform: scale(1);
        }
    }

    .portrait-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        filter: grayscale(0.8) contrast(1.1);
        transition: filter 0.5s ease;
    }

    .portrait-frame:hover .portrait-img {
        filter: grayscale(0.2) contrast(1.05);
    }

    .portrait-role {
        font-family: var(--font-mono);
        font-size: 0.7rem;
        color: rgba(255, 255, 255, 0.4);
        letter-spacing: 0.15em;
        text-transform: uppercase;
        animation: roleFade 0.4s ease;
    }

    @keyframes roleFade {
        from {
            opacity: 0;
            transform: translateY(6px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    /* ─── Responsive ─── */
    @media (max-width: 768px) {
        .team-content {
            flex-direction: column;
        }

        .names-panel {
            padding: 1rem;
            gap: 1rem;
        }

        .portrait-panel {
            padding: 1rem;
        }

        .portrait-frame {
            width: clamp(160px, 50vw, 220px);
            height: clamp(200px, 60vw, 280px);
        }

        .name-item.active {
            font-size: clamp(1.4rem, 6vw, 2rem);
        }
    }
</style>
