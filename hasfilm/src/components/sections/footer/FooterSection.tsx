import React from 'react';
import './FooterSection.css';

const QUICK_LINKS = [
    { label: 'Home', href: '#hero-section' },
    { label: 'About', href: '#about-section' },
    { label: 'Gallery', href: '#gallery-section' },
    { label: 'Events', href: '#highlights-section' },
    { label: 'Schedule', href: '#schedule-section' },
    { label: 'Team', href: '#team-section' },
];

const InstagramIcon: React.FC = () => (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
);

const FooterSection: React.FC = () => {
    return (
        <footer className="footer">
            {/* ── Brand title ── */}
            <div className="footer__brand">
                <h2 className="footer__brand-title">
                    UTKARSH
                    <span className="footer__brand-year">2026</span>
                </h2>
            </div>

            {/* ── Three-column grid ── */}
            <div className="footer__grid">
                {/* Quick Links */}
                <div className="footer__col">
                    <h3 className="footer__col-title">Quick Links</h3>
                    <ul className="footer__links">
                        {QUICK_LINKS.map((link) => (
                            <li key={link.href}>
                                <a className="footer__link" href={link.href}>
                                    {link.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Connect */}
                <div className="footer__col">
                    <h3 className="footer__col-title">Connect</h3>
                    <div className="footer__social-list">
                        {/* Utkarsh Instagram */}
                        <div className="footer__social-item">
                            <a
                                href="https://www.instagram.com/utkarsh.adgips/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="footer__social-icon"
                            >
                                <InstagramIcon />
                            </a>
                            <div className="footer__social-info">
                                <a
                                    href="https://www.instagram.com/utkarsh.adgips/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="footer__social-name"
                                >
                                    Utkarsh ADGIPS
                                </a>
                                <span className="footer__social-handle">@utkarsh.adgips</span>
                            </div>
                        </div>

                        {/* TCC Instagram */}
                        <div className="footer__social-item">
                            <a
                                href="http://instagram.com/thecampuschronicles.adgips/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="footer__social-icon"
                            >
                                <InstagramIcon />
                            </a>
                            <div className="footer__social-info">
                                <a
                                    href="http://instagram.com/thecampuschronicles.adgips/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="footer__social-name"
                                >
                                    The Campus Chronicles
                                </a>
                                <span className="footer__social-handle">@thecampuschronicles.adgips</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Find Us — Map */}
                <div className="footer__col">
                    <h3 className="footer__col-title">Find Us</h3>
                    <div className="footer__map-wrap">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3499.487762356847!2d77.11938461549402!3d28.71545008238768!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d0143502f456f%3A0x4047396142836fa1!2sAmbedkar%20Dgp%20Institute%20of%20Technology!5e0!3m2!1sen!2sin!4v1708000000000!5m2!1sen!2sin"
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="ADGIPS Location"
                        />
                    </div>
                    <a
                        href="https://maps.app.goo.gl/2sD66keGRfLJFTEc6"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="footer__map-link"
                    >
                        ↗ Open in Google Maps
                    </a>
                </div>
            </div>

            {/* ── Bottom bar ── */}
            <div className="footer__bottom">
                <p className="footer__credit">
                    Made with <span className="heart">❤️</span> by{' '}
                    <a
                        href="http://instagram.com/thecampuschronicles.adgips/"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        TCC
                    </a>{' '}
                    — The Official Media House of ADGIPS
                </p>
                <p className="footer__copyright">
                    © {new Date().getFullYear()} Utkarsh · ADGIPS
                </p>
            </div>

            {/* ── Decorative geometric ── */}
            <div className="footer__geo">
                <svg viewBox="0 0 280 280" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="200" cy="200" r="120" stroke="rgba(255,255,255,0.5)" strokeWidth="0.5" />
                    <circle cx="200" cy="200" r="180" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
                    <line x1="80" y1="0" x2="280" y2="200" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
                    <line x1="0" y1="80" x2="200" y2="280" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
                </svg>
            </div>
        </footer>
    );
};

export default FooterSection;
