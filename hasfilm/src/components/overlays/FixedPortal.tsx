import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

/**
 * FixedPortal - Portals children to document.body so they are truly
 * viewport-fixed, even when rendered inside a scrolling container like
 * drei's <Scroll html>. React context (useScroll, useFrame) still works
 * because portals preserve the React tree.
 */
const FixedPortal: React.FC<{ children: React.ReactNode; zIndex?: number }> = ({
    children,
    zIndex = 20,
}) => {
    const elRef = useRef<HTMLDivElement | null>(null);

    if (!elRef.current && typeof document !== 'undefined') {
        elRef.current = document.createElement('div');
        elRef.current.style.cssText = `position:fixed;inset:0;pointer-events:none;z-index:${zIndex};`;
    }

    useEffect(() => {
        const el = elRef.current;
        if (!el) return;
        document.body.appendChild(el);
        return () => {
            el.remove();
        };
    }, []);

    if (!elRef.current) return null;
    return createPortal(children, elRef.current);
};

export default FixedPortal;
