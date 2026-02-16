<script lang="ts">
</script>

<section class="section" style="height: 50dvh;" data-zone="FOOTER">
    <div class="footer-inner">
        <!-- Top border -->
        <div class="footer-divider"></div>

        <!-- Main content -->
        <h2 class="footer-title">UTKARSH 2026</h2>
        <p class="footer-college">
            Dr. Akhilesh Das Gupta Institute of Professional Studies
        </p>
        <p class="footer-tagline">Virasat se VIKAS TAK</p>

        <!-- Social links -->
        <div class="footer-links">
            <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener"
                class="footer-link"
            >
                <span class="link-icon">◈</span> Instagram
            </a>
            <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener"
                class="footer-link"
            >
                <span class="link-icon">◈</span> Twitter
            </a>
            <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener"
                class="footer-link"
            >
                <span class="link-icon">◈</span> YouTube
            </a>
            <a href="mailto:utkarsh@adgips.ac.in" class="footer-link">
                <span class="link-icon">◈</span> Contact
            </a>
        </div>

        <!-- Date & location -->
        <div class="footer-meta">
            <span class="meta-item">FEB 25 — 27, 2026</span>
            <span class="meta-divider">·</span>
            <span class="meta-item">NEW DELHI, INDIA</span>
        </div>

        <!-- Credits -->
        <p class="footer-credit">
            © 2026 UTKARSH. Crafted with obsessive detail in Svelte.
        </p>
    </div>
</section>

<style>
    .footer-inner {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        padding: var(--section-padding);
        gap: 1.2rem;
        text-align: center;
    }

    .footer-divider {
        width: 4rem;
        height: 1px;
        background: linear-gradient(
            to right,
            transparent,
            var(--color-accent),
            transparent
        );
        margin-bottom: 0.5rem;
    }

    .footer-title {
        font-family: var(--font-display);
        font-size: clamp(1.5rem, 4vw, 2.5rem);
        font-weight: 800;
        letter-spacing: 0.2em;
        text-shadow: 0 0 40px rgba(56, 189, 248, 0.1);
    }

    .footer-college {
        font-size: 0.8rem;
        color: var(--color-muted);
        letter-spacing: 0.05em;
    }

    .footer-tagline {
        font-family: var(--font-mono);
        font-size: 0.65rem;
        color: var(--color-accent);
        letter-spacing: 0.2em;
        text-transform: uppercase;
    }

    .footer-links {
        display: flex;
        gap: 2rem;
        flex-wrap: wrap;
        justify-content: center;
    }

    .footer-link {
        font-family: var(--font-mono);
        font-size: 0.7rem;
        color: var(--color-muted);
        text-decoration: none;
        letter-spacing: 0.1em;
        display: flex;
        align-items: center;
        gap: 0.35rem;
        transition: color 0.3s ease;
    }

    .footer-link:hover {
        color: var(--color-accent);
    }

    .link-icon {
        font-size: 0.5rem;
        opacity: 0.5;
        transition: opacity 0.3s ease;
    }

    .footer-link:hover .link-icon {
        opacity: 1;
    }

    .footer-meta {
        display: flex;
        gap: 0.75rem;
        align-items: center;
    }

    .meta-item {
        font-family: var(--font-mono);
        font-size: 0.6rem;
        color: rgba(255, 255, 255, 0.3);
        letter-spacing: 0.15em;
    }

    .meta-divider {
        color: rgba(255, 255, 255, 0.15);
    }

    .footer-credit {
        font-size: 0.6rem;
        color: rgba(255, 255, 255, 0.2);
        margin-top: 0.5rem;
    }
</style>
