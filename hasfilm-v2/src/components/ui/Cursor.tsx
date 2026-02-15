import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import styles from './Cursor.module.css';

const Cursor = () => {
    const cursorRef = useRef<HTMLDivElement>(null);
    const [hovered, setHovered] = useState(false);

    useEffect(() => {
        const cursor = cursorRef.current;
        if (!cursor) return;

        const onMouseMove = (e: MouseEvent) => {
            gsap.to(cursor, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.1,
                ease: 'power2.out'
            });
        };

        const onMouseEnter = () => setHovered(true);
        const onMouseLeave = () => setHovered(false);

        // Add event listeners to interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .interactive');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', onMouseEnter);
            el.addEventListener('mouseleave', onMouseLeave);
        });

        window.addEventListener('mousemove', onMouseMove);

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            interactiveElements.forEach(el => {
                el.removeEventListener('mouseenter', onMouseEnter);
                el.removeEventListener('mouseleave', onMouseLeave);
            });
        };
    }, []);

    return (
        <div
            ref={cursorRef}
            className={`${styles.cursor} ${hovered ? styles.hovered : ''}`}
        />
    );
};

export default Cursor;
