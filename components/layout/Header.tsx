'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui';
import { Container, Flex } from '@/components/layout';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

const navLinks = [
  { href: '/about', label: 'About' },
  { href: '/events', label: 'Events' },
  { href: '/schedule', label: 'Schedule' },
  { href: '/team', label: 'Team' },
  { href: '/contact', label: 'Contact' },
];

export const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-[var(--z-fixed)] transition-all duration-300',
          isScrolled 
            ? 'bg-black/80 backdrop-blur-md py-2 border-b border-white/10 shadow-lg' 
            : 'bg-transparent py-4'
        )}
      >
        <Container>
          <Flex justify="between" align="center">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group h-16"> 
                <div className="relative w-12 h-12 flex items-center justify-center overflow-hidden rounded-full bg-white/5 mix-blend-screen transition-transform duration-300 group-hover:scale-105">
                  <Image
                    src="/assets/utkarsh-logo.png"
                    alt="Utkarsh Logo"
                    width={50}
                    height={50}
                    className="w-full h-full object-contain mix-blend-multiply"
                  />
                </div>
                
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:block">
              <Flex gap="md" align="center">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "font-medium transition-colors relative group text-sm tracking-wide",
                        isActive ? "text-[#F5C16C]" : "text-[#F4F4F4] hover:text-[#00E5FF]"
                      )}
                    >
                      {link.label}
                      <span className={cn(
                        "absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300",
                        isActive ? "w-full bg-[#F5C16C]" : "bg-[#00E5FF] group-hover:w-full"
                      )} />
                    </Link>
                  );
                })}
              </Flex>
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-[#F4F4F4] hover:bg-white/10 transition-colors"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </Flex>
        </Container>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[var(--z-fixed)] md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              style={{ top: isScrolled ? '65px' : '88px' }}
            />

            {/* Menu Panel */}
            <motion.div
              className="fixed right-0 bottom-0 w-[280px] bg-[#0a0a0a] border-l border-white/10 shadow-2xl z-[var(--z-fixed)] md:hidden overflow-y-auto"
              style={{ top: isScrolled ? '65px' : '88px' }}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              <nav className="p-6">
                <Flex direction="col" gap="sm">
                  {navLinks.map((link) => {
                     const isActive = pathname === link.href;
                     return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={cn(
                          "text-lg font-medium py-3 border-b border-white/5 transition-colors",
                          isActive ? "text-[#F5C16C]" : "text-[#F4F4F4] hover:text-[#00E5FF]"
                        )}
                      >
                        {link.label}
                      </Link>
                    );
                  })}
                </Flex>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
