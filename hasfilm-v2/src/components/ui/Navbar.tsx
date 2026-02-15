import { useState, useEffect, useRef } from 'react';
import styles from './Navbar.module.css';

const Navbar = () => {
    const [hidden, setHidden] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const lastScrollY = useRef(0);

    // Use native scroll listener for simplicity and performance with Lenis
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Determine if scrolled significantly to show background
            setScrolled(currentScrollY > 50);

            // Hide on scroll down, show on scroll up
            if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
                setHidden(true);
            } else {
                setHidden(false);
            }

            lastScrollY.current = currentScrollY;
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (id: string) => {
        const el = document.getElementById(id);
        if (el) {
            // lenis.scrollTo(el) would be ideal, but native verified works with Lenis too
            el.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''} ${hidden ? styles.hidden : ''}`}>
            <a href="#" className={styles.logo} onClick={() => window.scrollTo(0, 0)}>
                Utkarsh '26
            </a>

            <ul className={styles.navLinks}>
                <li><button onClick={() => scrollToSection('about')} className={styles.navLink}>About</button></li>
                <li><button onClick={() => scrollToSection('gallery')} className={styles.navLink}>Gallery</button></li>
                <li><button onClick={() => scrollToSection('schedule')} className={styles.navLink}>Schedule</button></li>
                <li><button onClick={() => scrollToSection('team')} className={styles.navLink}>Team</button></li>
            </ul>

            <button className={styles.ctaBtn}>Register</button>
        </nav>
    );
};

export default Navbar;
