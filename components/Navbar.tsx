'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = ['About', 'Events', 'Schedule', 'Team'];

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      // Glassmorphism logic: transparent at top, blurred glass when scrolled
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-navy-dark/90 backdrop-blur-md py-4 shadow-lg' 
          : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="relative flex items-center gap-2 group">
          <div className="relative w-10 h-10 transition-transform duration-300 group-hover:scale-110">
             <Image 
               src="/assets/utkarsh-logo.png" 
               alt="Utkarsh Logo" 
               width={40} 
               height={40} 
               className="object-contain"
             />
          </div>
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex items-center gap-10">
          {navLinks.map((link, index) => (
            <motion.li
              key={link}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.3 }}
              className="group"
            >
              <Link
                href={`#${link.toLowerCase()}`}
                className="relative block py-2 px-1"
              >
                {/* Link Text with Hover Effects */}
                <span className="relative text-sm font-semibold font-outfit text-[#F5C16C] uppercase tracking-[0.15em] transition-all duration-300 ease-in-out group-hover:-translate-y-0.5 group-hover:text-[#FFD27D] inline-block group-hover:drop-shadow-[0_0_12px_rgba(0,229,255,0.6)]">
                  {link}
                </span>
                
                {/* Animated Underline - Grows from Center */}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] w-0 bg-gradient-to-r from-[#00E5FF] via-[#7B3FE4] to-[#00E5FF] transition-all duration-300 ease-in-out group-hover:w-full rounded-full shadow-[0_0_8px_rgba(0,229,255,0.8)]" />
                
                {/* Subtle Glow Effect on Hover */}
                <span className="absolute inset-0 opacity-0 bg-gradient-to-r from-transparent via-[#00E5FF]/10 to-transparent blur-xl transition-opacity duration-300 ease-in-out group-hover:opacity-100" />
              </Link>
            </motion.li>
          ))}
        </ul>

        {/* Mobile Menu Button (Hamburger) */}
        <button className="md:hidden text-[#F5C16C] hover:text-[#FFD27D] transition-all duration-300 ease-in-out hover:drop-shadow-[0_0_12px_rgba(0,229,255,0.6)] group">
          <svg className="w-8 h-8 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </motion.nav>
  );
}
