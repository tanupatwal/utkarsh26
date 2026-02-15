import React from 'react';
import styles from './Footer.module.css';

const Footer: React.FC = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.content}>
                <h2 className={styles.logo}>Utkarsh 2026</h2>

                <ul className={styles.links}>
                    <li><a href="#" className={styles.link}>Instagram</a></li>
                    <li><a href="#" className={styles.link}>Facebook</a></li>
                    <li><a href="#" className={styles.link}>Twitter</a></li>
                    <li><a href="#" className={styles.link}>Youtube</a></li>
                </ul>

                <div className={styles.copyright}>
                    &copy; {new Date().getFullYear()} Utkarsh Festival. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
