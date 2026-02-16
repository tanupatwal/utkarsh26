<script lang="ts">
</script>

<section class="section" style="height: 50dvh;" data-zone="FOOTER">
    <div class="footer-inner">
        <h2 class="footer-title">UTKARSH 2026</h2>
        <p class="footer-college">
            Dr. Akhilesh Das Gupta Institute of Professional Studies
        </p>
        <div class="footer-links">
            <a href="#" class="footer-link">Instagram</a>
            <a href="#" class="footer-link">Twitter</a>
            <a href="#" class="footer-link">YouTube</a>
        </div>
        <p class="footer-credit">© 2026 UTKARSH. Built with ❤️ in Svelte</p>
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
        gap: 1.5rem;
        text-align: center;
    }

    .footer-title {
        font-family: var(--font-display);
        font-size: clamp(1.5rem, 4vw, 2.5rem);
        font-weight: 800;
    }

    .footer-college {
        font-size: 0.85rem;
        color: var(--color-muted);
    }

    .footer-links {
        display: flex;
        gap: 2rem;
    }

    .footer-link {
        font-family: var(--font-mono);
        font-size: 0.75rem;
        color: var(--color-muted);
        text-decoration: none;
        letter-spacing: 0.1em;
        transition: color 0.3s;
    }

    .footer-link:hover {
        color: var(--color-accent);
    }

    .footer-credit {
        font-size: 0.7rem;
        color: rgba(255, 255, 255, 0.3);
        margin-top: 1rem;
    }
</style>
