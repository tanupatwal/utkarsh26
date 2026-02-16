<script lang="ts">
    import { onMount } from "svelte";

    // ════════════════════════════════════════
    //  ANIMATED COUNTERS
    // ════════════════════════════════════════
    interface StatItem {
        value: string;
        numericValue: number;
        suffix: string;
        label: string;
    }

    const STATS: StatItem[] = [
        { value: "2006", numericValue: 2006, suffix: "", label: "Established" },
        { value: "10K+", numericValue: 10, suffix: "K+", label: "Attendees" },
        { value: "3", numericValue: 3, suffix: "", label: "Days" },
        { value: "60+", numericValue: 60, suffix: "+", label: "Events" },
    ];

    let displayValues = $state<string[]>(STATS.map(() => "0"));
    let hasAnimated = $state(false);
    let sectionEl: HTMLElement;

    onMount(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !hasAnimated) {
                    hasAnimated = true;
                    animateCounters();
                }
            },
            { threshold: 0.5 },
        );

        observer.observe(sectionEl);

        return () => observer.disconnect();
    });

    function animateCounters() {
        const duration = 1500;
        const startTime = performance.now();

        function update(now: number) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);

            displayValues = STATS.map((stat) => {
                const current = Math.round(stat.numericValue * eased);
                return `${current}${stat.suffix}`;
            });

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
    }
</script>

<section
    class="section section--full"
    style="height: 100dvh;"
    data-zone="ABOUT"
    bind:this={sectionEl}
>
    <div class="about-inner">
        <!-- Stats row -->
        <div class="stats-row">
            {#each STATS as stat, i (stat.label)}
                <div class="stat">
                    <span class="stat-value">{displayValues[i]}</span>
                    <span class="stat-label">{stat.label}</span>
                </div>
            {/each}
        </div>

        <!-- Narrative -->
        <div class="about-text-wrap">
            <p class="about-text">
                Born in <strong>2006</strong> as a humble college gathering,
                Utkarsh has evolved into
                <em>Northern India's premier techno-cultural symphony</em>. For
                two decades, we've been the crucible where ancient heritage
                meets cutting-edge innovation — where tradition finds a new
                language through the lens of engineering.
            </p>
            <p class="about-text">
                In <strong>2026</strong>, we celebrate this journey with our
                most ambitious edition yet. Three days of electrifying
                competitions, soul-stirring performances, and boundary-pushing
                technology — all under the banner of
                <span class="about-accent">Virasat se VIKAS TAK</span>.
            </p>
        </div>
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

    /* ─── Stats ─── */
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
        text-shadow: 0 0 30px rgba(56, 189, 248, 0.15);
    }

    .stat-label {
        font-family: var(--font-mono);
        font-size: 0.7rem;
        color: var(--color-muted);
        text-transform: uppercase;
        letter-spacing: 0.15em;
    }

    /* ─── About text ─── */
    .about-text-wrap {
        max-width: 60ch;
        display: flex;
        flex-direction: column;
        gap: 1.2rem;
    }

    .about-text {
        text-align: center;
        color: rgba(255, 255, 255, 0.65);
        line-height: 1.8;
        font-size: 0.95rem;
    }

    .about-text strong {
        color: #fff;
        font-weight: 600;
    }

    .about-text em {
        color: rgba(255, 255, 255, 0.85);
        font-style: normal;
    }

    .about-accent {
        color: var(--color-accent);
        font-weight: 600;
        letter-spacing: 0.04em;
    }
</style>
