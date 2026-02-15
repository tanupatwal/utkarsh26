import styles from './Navbar.module.css'

/**
 * Fixed navbar with fest logo.
 * pointer-events: none on wrapper so scroll isn't blocked;
 * pointer-events: auto on the logo for interactivity.
 */
export function Navbar() {
    return (
        <nav className={styles.navbar} aria-label="Main navigation">
            <div className={styles.inner}>
                <a href="#hero" className={styles.logo}>
                    <img
                        src="/assets/fest.png"
                        alt="Utkarsh 2026"
                        width={128}
                        height={128}
                    />
                </a>
            </div>
        </nav>
    )
}
