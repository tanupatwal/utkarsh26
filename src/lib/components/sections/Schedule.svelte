<script lang="ts">
    import { onMount, tick } from "svelte";
    import {
        SCHEDULE_DAYS,
        SCHEDULE_EVENTS,
        CATEGORY_COLORS,
        getEventsForDay,
        type ScheduleEvent,
    } from "$lib/data/schedule";

    // ════════════════════════════════════════
    //  STATE
    // ════════════════════════════════════════
    let activeDay = $state(1);
    let selectedEvent = $state<ScheduleEvent | null>(null);
    let dayEvents = $derived(getEventsForDay(activeDay));
    let cardsGridEl: HTMLElement | undefined = $state(undefined);
    let isTransitioning = $state(false);
    let gsapInstance: typeof import("gsap").default | null = null;

    // ════════════════════════════════════════
    //  GSAP INIT
    // ════════════════════════════════════════
    onMount(async () => {
        gsapInstance = (await import("gsap")).default;
        const { ScrollTrigger } = await import("gsap/ScrollTrigger");
        gsapInstance.registerPlugin(ScrollTrigger);

        // Initial entrance animation
        gsapInstance.from(".event-card", {
            scrollTrigger: {
                trigger: cardsGridEl,
                start: "top 85%",
                once: true,
            },
            opacity: 0,
            y: 30,
            rotateX: 12,
            stagger: 0.04,
            duration: 0.5,
            ease: "power2.out",
        });
    });

    // ════════════════════════════════════════
    //  DAY SWITCHING WITH GSAP
    // ════════════════════════════════════════
    async function selectDay(dayId: number) {
        if (dayId === activeDay || isTransitioning) return;
        if (!gsapInstance) {
            // Fallback: just switch without animation
            activeDay = dayId;
            return;
        }

        isTransitioning = true;
        const gsap = gsapInstance;

        // Animate out current cards
        const currentCards = cardsGridEl?.querySelectorAll(".event-card");
        if (currentCards && currentCards.length > 0) {
            await gsap.to(currentCards, {
                opacity: 0,
                y: -20,
                stagger: 0.03,
                duration: 0.2,
                ease: "power2.in",
            });
        }

        // Switch day (triggers Svelte reactivity)
        activeDay = dayId;
        await tick(); // Wait for DOM update

        // Animate in new cards
        const newCards = cardsGridEl?.querySelectorAll(".event-card");
        if (newCards && newCards.length > 0) {
            gsap.from(newCards, {
                opacity: 0,
                y: 20,
                rotateX: 12,
                stagger: 0.04,
                duration: 0.4,
                ease: "power2.out",
                onComplete: () => {
                    isTransitioning = false;
                },
            });
        } else {
            isTransitioning = false;
        }
    }

    function openModal(event: ScheduleEvent) {
        selectedEvent = event;
    }

    function closeModal() {
        selectedEvent = null;
    }

    function navigateModal(dir: 1 | -1) {
        if (!selectedEvent) return;
        const events = getEventsForDay(selectedEvent.dayId);
        const idx = events.findIndex((e) => e.title === selectedEvent!.title);
        const next = (idx + dir + events.length) % events.length;
        selectedEvent = events[next];
    }

    function handleKeydown(e: KeyboardEvent) {
        if (!selectedEvent) return;
        if (e.key === "Escape") closeModal();
        if (e.key === "ArrowLeft") navigateModal(-1);
        if (e.key === "ArrowRight") navigateModal(1);
    }

    function getCategoryColor(cat?: string): string {
        return cat ? (CATEGORY_COLORS[cat] ?? "#666") : "#666";
    }
</script>

<svelte:window on:keydown={handleKeydown} />

<section class="section" style="height: 200dvh;" data-zone="SCHEDULE">
    <div class="schedule-sticky">
        <!-- Scanline overlay -->
        <div class="scanlines"></div>

        <!-- Header -->
        <div class="schedule-header">
            <div class="header-accent"></div>
            <h2 class="schedule-title">FESTIVAL SCHEDULE</h2>
            <p class="schedule-sub">
                3 days · 60 events · Infinite possibilities
            </p>
        </div>

        <!-- Day tabs -->
        <div class="tabs-bar">
            {#each SCHEDULE_DAYS as day (day.id)}
                <button
                    class="tab"
                    class:active={activeDay === day.id}
                    on:click={() => selectDay(day.id)}
                >
                    <span class="tab-label">{day.label}</span>
                    <span class="tab-date">{day.date}</span>
                    {#if activeDay === day.id}
                        <div class="tab-indicator"></div>
                    {/if}
                </button>
            {/each}
        </div>

        <!-- Event grid -->
        <div class="cards-scroll">
            <div class="cards-grid" bind:this={cardsGridEl}>
                {#each dayEvents as event, i (event.title)}
                    <!-- svelte-ignore a11y_no_static_element_interactions -->
                    <div
                        class="event-card"
                        style="
								--cat-color: {getCategoryColor(event.category)};
							"
                        on:click={() => openModal(event)}
                    >
                        <!-- Image -->
                        <div class="card-img-wrap">
                            <img
                                src={event.image}
                                alt={event.title}
                                class="card-img"
                                loading="lazy"
                            />
                            <!-- Category strip -->
                            <div
                                class="cat-strip"
                                style="background: {getCategoryColor(
                                    event.category,
                                )}"
                            ></div>
                        </div>

                        <!-- Info -->
                        <div class="card-body">
                            <div class="card-meta">
                                <span class="card-time">{event.time}</span>
                                {#if event.category}
                                    <span
                                        class="card-cat"
                                        style="color: {getCategoryColor(
                                            event.category,
                                        )}">{event.category.toUpperCase()}</span
                                    >
                                {/if}
                            </div>
                            <h3 class="card-title">{event.title}</h3>
                            <p class="card-venue">{event.venue}</p>
                            {#if event.prizePool}
                                <span class="card-prize"
                                    >🏆 {event.prizePool}</span
                                >
                            {/if}
                        </div>

                        <!-- Hover glow corners -->
                        <div class="card-corner tl"></div>
                        <div class="card-corner br"></div>
                    </div>
                {/each}
            </div>
        </div>
    </div>
</section>

<!-- ═══ MODAL ═══ -->
{#if selectedEvent}
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="modal-backdrop" on:click={closeModal}>
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div class="modal-content" on:click|stopPropagation>
            <!-- Image side -->
            <div class="modal-img-wrap">
                <img
                    src={selectedEvent.image}
                    alt={selectedEvent.title}
                    class="modal-img"
                />
                <div class="modal-img-gradient"></div>
                <h3 class="modal-img-title">{selectedEvent.title}</h3>
            </div>

            <!-- Details side -->
            <div class="modal-details">
                <div class="modal-cat-row">
                    {#if selectedEvent.category}
                        <span
                            class="modal-cat-tag"
                            style="
								color: {getCategoryColor(selectedEvent.category)};
								border-color: {getCategoryColor(selectedEvent.category)};
							">{selectedEvent.category.toUpperCase()}</span
                        >
                    {/if}
                </div>

                <h2 class="modal-title">{selectedEvent.title}</h2>

                {#if selectedEvent.description}
                    <p class="modal-desc">{selectedEvent.description}</p>
                {/if}

                <div class="modal-rows">
                    <div class="modal-row">
                        <span class="modal-row-label">Time</span>
                        <span class="modal-row-value">
                            {selectedEvent.time}{selectedEvent.endTime
                                ? ` — ${selectedEvent.endTime}`
                                : ""}
                        </span>
                    </div>
                    <div class="modal-row">
                        <span class="modal-row-label">Venue</span>
                        <span class="modal-row-value"
                            >{selectedEvent.venue}</span
                        >
                    </div>
                    {#if selectedEvent.prizePool}
                        <div class="modal-row">
                            <span class="modal-row-label">Prize Pool</span>
                            <span class="modal-row-value prize"
                                >{selectedEvent.prizePool}</span
                            >
                        </div>
                    {/if}
                    {#if selectedEvent.teamSize}
                        <div class="modal-row">
                            <span class="modal-row-label">Team Size</span>
                            <span class="modal-row-value"
                                >{selectedEvent.teamSize}</span
                            >
                        </div>
                    {/if}
                </div>
            </div>

            <!-- Close button -->
            <button class="modal-close" on:click={closeModal}>✕</button>

            <!-- Nav arrows -->
            <button class="modal-nav prev" on:click={() => navigateModal(-1)}
                >‹</button
            >
            <button class="modal-nav next" on:click={() => navigateModal(1)}
                >›</button
            >
        </div>
    </div>
{/if}

<style>
    /* ═══ STICKY CONTAINER ═══ */
    .schedule-sticky {
        position: sticky;
        top: 0;
        height: 100dvh;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        background: #000;
    }

    /* ─── Scanline overlay ─── */
    .scanlines {
        position: absolute;
        inset: 0;
        pointer-events: none;
        z-index: 5;
        background: repeating-linear-gradient(
            to bottom,
            transparent 0px,
            transparent 2px,
            rgba(0, 0, 0, 0.03) 2px,
            rgba(0, 0, 0, 0.03) 4px
        );
    }

    /* ─── Header ─── */
    .schedule-header {
        padding: 1.5rem 2rem 0;
        z-index: 2;
        flex-shrink: 0;
    }

    .header-accent {
        width: 2rem;
        height: 2px;
        background: var(--color-accent);
        margin-bottom: 0.5rem;
    }

    .schedule-title {
        font-family: var(--font-display);
        font-size: clamp(1.5rem, 3vw, 2.5rem);
        font-weight: 800;
        letter-spacing: 0.15em;
        margin: 0;
    }

    .schedule-sub {
        font-family: var(--font-mono);
        font-size: 0.7rem;
        color: var(--color-muted);
        letter-spacing: 0.08em;
        margin: 0.25rem 0 0;
    }

    /* ─── Tabs ─── */
    .tabs-bar {
        display: flex;
        gap: 0;
        padding: 1.25rem 2rem 0;
        z-index: 2;
        flex-shrink: 0;
    }

    .tab {
        display: flex;
        flex-direction: column;
        align-items: center;
        cursor: pointer;
        position: relative;
        width: 33.33%;
        padding: 0.75rem 0;
        background: none;
        border: none;
        border-bottom: 1px solid var(--color-border);
        transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
    }

    .tab-label {
        font-family: var(--font-display);
        font-size: clamp(0.75rem, 1.2vw, 1rem);
        font-weight: 700;
        letter-spacing: 0.15em;
        color: var(--color-muted);
        transition: color 0.3s ease;
    }

    .tab-date {
        font-family: var(--font-mono);
        font-size: 0.6rem;
        color: rgba(255, 255, 255, 0.3);
        margin-top: 0.2rem;
        letter-spacing: 0.1em;
    }

    .tab.active .tab-label {
        color: var(--color-accent);
    }

    .tab.active .tab-date {
        color: rgba(56, 189, 248, 0.6);
    }

    .tab-indicator {
        position: absolute;
        bottom: -1px;
        left: 0;
        right: 0;
        height: 2px;
        background: var(--color-accent);
        box-shadow: 0 0 10px var(--color-accent);
    }

    /* ─── Cards scroll ─── */
    .cards-scroll {
        flex: 1;
        overflow-y: auto;
        padding: 1.25rem 2rem 2rem;
        z-index: 2;
        scrollbar-width: thin;
        scrollbar-color: rgba(56, 189, 248, 0.2) transparent;
    }

    .cards-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
        gap: 1.25rem;
        animation: gridFadeIn 0.35s ease both;
    }

    @keyframes gridFadeIn {
        from {
            opacity: 0;
            transform: translateY(12px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    /* ─── Event card ─── */
    .event-card {
        position: relative;
        border-radius: 8px;
        overflow: hidden;
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.06);
        cursor: pointer;
        transition:
            transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94),
            border-color 0.3s ease,
            box-shadow 0.3s ease;
        animation: cardReveal 0.5s ease both;
    }

    @keyframes cardReveal {
        from {
            opacity: 0;
            transform: translateZ(0) rotateX(8deg) scale(0.97);
        }
        to {
            opacity: 1;
            transform: translateZ(0) rotateX(0deg) scale(1);
        }
    }

    .event-card:hover {
        transform: translateY(-4px) scale(1.02);
        border-color: var(--cat-color);
        box-shadow:
            0 8px 32px rgba(0, 0, 0, 0.4),
            0 0 0 1px var(--cat-color);
    }

    .card-img-wrap {
        position: relative;
        height: 140px;
        overflow: hidden;
    }

    .card-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.5s ease;
    }

    .event-card:hover .card-img {
        transform: scale(1.08);
    }

    .cat-strip {
        position: absolute;
        top: 0;
        right: 0;
        width: 3px;
        height: 100%;
        opacity: 0.7;
        transition:
            opacity 0.3s ease,
            box-shadow 0.3s ease;
    }

    .event-card:hover .cat-strip {
        opacity: 1;
        box-shadow:
            0 0 8px var(--cat-color),
            0 0 16px var(--cat-color);
    }

    .card-body {
        padding: 0.75rem 1rem;
        display: flex;
        flex-direction: column;
        gap: 0.3rem;
    }

    .card-meta {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .card-time {
        font-family: var(--font-mono);
        font-size: 0.65rem;
        color: rgba(255, 255, 255, 0.5);
        letter-spacing: 0.08em;
    }

    .card-cat {
        font-family: var(--font-mono);
        font-size: 0.55rem;
        font-weight: 700;
        letter-spacing: 0.12em;
    }

    .card-title {
        font-family: var(--font-display);
        font-size: 0.85rem;
        font-weight: 700;
        letter-spacing: 0.04em;
        color: #fff;
        margin: 0;
    }

    .card-venue {
        font-family: var(--font-mono);
        font-size: 0.6rem;
        color: var(--color-muted);
        margin: 0;
    }

    .card-prize {
        font-family: var(--font-mono);
        font-size: 0.6rem;
        color: #fbbf24;
        letter-spacing: 0.05em;
    }

    /* Hover glow corners */
    .card-corner {
        position: absolute;
        width: 20px;
        height: 20px;
        border-style: solid;
        border-color: var(--cat-color);
        opacity: 0;
        transition: opacity 0.3s ease;
    }

    .card-corner.tl {
        top: -2px;
        left: -2px;
        border-width: 1px 0 0 1px;
    }

    .card-corner.br {
        bottom: -2px;
        right: -2px;
        border-width: 0 1px 1px 0;
    }

    .event-card:hover .card-corner {
        opacity: 1;
    }

    /* ═══ MODAL ═══ */
    .modal-backdrop {
        position: fixed;
        inset: 0;
        z-index: 200;
        background: rgba(0, 2, 10, 0.85);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        display: flex;
        align-items: center;
        justify-content: center;
        animation: backdropIn 0.3s ease;
    }

    @keyframes backdropIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

    .modal-content {
        position: relative;
        display: grid;
        grid-template-columns: 1fr 1fr;
        width: min(90vw, 800px);
        max-height: 80vh;
        border-radius: 12px;
        overflow: hidden;
        background: rgba(10, 15, 30, 0.95);
        border: 1px solid rgba(56, 189, 248, 0.15);
        box-shadow:
            0 32px 64px rgba(0, 0, 0, 0.6),
            0 0 0 1px rgba(56, 189, 248, 0.08);
        animation: modalIn 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }

    @keyframes modalIn {
        from {
            opacity: 0;
            transform: scale(0.95) translateY(20px);
        }
        to {
            opacity: 1;
            transform: scale(1) translateY(0);
        }
    }

    .modal-img-wrap {
        position: relative;
        height: 100%;
        min-height: 300px;
        overflow: hidden;
    }

    .modal-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .modal-img-gradient {
        position: absolute;
        inset: 0;
        background: linear-gradient(
            to top,
            rgba(2, 6, 23, 0.85) 0%,
            rgba(2, 6, 23, 0.15) 35%,
            transparent 60%
        );
    }

    .modal-img-title {
        position: absolute;
        bottom: 1.2rem;
        left: 1.2rem;
        right: 1.2rem;
        font-family: var(--font-display);
        font-size: clamp(1.2rem, 2vw, 1.5rem);
        font-weight: 800;
        letter-spacing: 0.1em;
        color: #fff;
        text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
        margin: 0;
    }

    .modal-details {
        padding: 2rem 1.5rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        overflow-y: auto;
    }

    .modal-cat-row {
        display: flex;
    }

    .modal-cat-tag {
        font-family: var(--font-mono);
        font-size: 0.6rem;
        font-weight: 700;
        letter-spacing: 0.12em;
        padding: 0.2rem 0.5rem;
        border: 1px solid;
        border-radius: 3px;
    }

    .modal-title {
        font-family: var(--font-display);
        font-size: clamp(1.2rem, 2vw, 1.6rem);
        font-weight: 800;
        letter-spacing: 0.08em;
        color: #fff;
        margin: 0;
    }

    .modal-desc {
        font-size: 0.85rem;
        color: rgba(255, 255, 255, 0.7);
        line-height: 1.6;
        margin: 0;
    }

    .modal-rows {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        margin-top: 0.5rem;
    }

    .modal-row {
        display: flex;
        gap: 1rem;
        align-items: baseline;
    }

    .modal-row-label {
        font-family: var(--font-mono);
        font-size: 0.65rem;
        letter-spacing: 0.1em;
        color: rgba(148, 163, 184, 0.9);
        min-width: 80px;
        text-transform: uppercase;
    }

    .modal-row-value {
        font-size: 0.85rem;
        font-weight: 500;
        color: #e2e8f0;
    }

    .modal-row-value.prize {
        color: #fbbf24;
    }

    /* Close & nav */
    .modal-close {
        position: absolute;
        top: 1rem;
        right: 1rem;
        width: 32px;
        height: 32px;
        border: 1px solid rgba(56, 189, 248, 0.3);
        background: rgba(2, 6, 23, 0.7);
        backdrop-filter: blur(8px);
        color: var(--color-accent);
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.8rem;
        z-index: 10;
        transition: all 0.3s ease;
    }

    .modal-close:hover {
        background: rgba(56, 189, 248, 0.15);
        box-shadow: 0 0 15px rgba(56, 189, 248, 0.3);
    }

    .modal-nav {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        width: 40px;
        height: 40px;
        border: 1px solid rgba(255, 255, 255, 0.15);
        background: rgba(2, 6, 23, 0.7);
        backdrop-filter: blur(8px);
        color: #fff;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.3rem;
        transition: all 0.3s ease;
    }

    .modal-nav:hover {
        background: rgba(56, 189, 248, 0.15);
        box-shadow: 0 0 15px rgba(56, 189, 248, 0.3);
        transform: translateY(-50%) scale(1.1);
    }

    .modal-nav.prev {
        left: -56px;
    }

    .modal-nav.next {
        right: -56px;
    }

    /* ─── Responsive ─── */
    @media (max-width: 768px) {
        .schedule-header {
            padding: 1rem 1rem 0;
        }

        .tabs-bar {
            padding: 1rem 1rem 0;
        }

        .cards-scroll {
            padding: 1rem;
        }

        .cards-grid {
            grid-template-columns: 1fr;
        }

        .modal-content {
            grid-template-columns: 1fr;
            width: 95vw;
            max-height: 90vh;
        }

        .modal-img-wrap {
            min-height: 200px;
            max-height: 250px;
        }

        .modal-nav.prev {
            left: 0.5rem;
        }

        .modal-nav.next {
            right: 0.5rem;
        }
    }
</style>
