'use client';

import React from 'react';
import Link from 'next/link';
import { Container, Grid, Flex } from '@/components/layout';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';

const quickLinks = [
  { href: '/', label: 'Home' },
  { href: '/events', label: 'Events' },
  { href: '/schedule', label: 'Schedule' },
  { href: '/registration', label: 'Register' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/contact', label: 'Contact' },
];

const socialLinks = [
  { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
  { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
  { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
  { icon: Youtube, href: 'https://youtube.com', label: 'YouTube' },
];

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-900 dark:bg-black text-neutral-300 mt-20">
      <Container>
        {/* Main Footer Content */}
        <div className="py-12">
          <Grid cols={4} gap="lg">
            {/* About Section */}
            <div className="col-span-4 md:col-span-2 lg:col-span-1">
              <h3 className="text-xl font-bold text-white mb-4">
                UTKARSH 2026
              </h3>
              <p className="text-sm text-neutral-400 mb-4">
                Join us for an unforgettable college festival experience filled with
                cultural performances, technical competitions, and memorable moments.
              </p>
              <Flex gap="sm">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-neutral-800 hover:bg-primary-600 transition-colors"
                    aria-label={social.label}
                  >
                    <social.icon size={18} />
                  </a>
                ))}
              </Flex>
            </div>

            {/* Quick Links */}
            <div className="col-span-2 md:col-span-1">
              <h4 className="text-lg font-semibold text-white mb-4">
                Quick Links
              </h4>
              <Flex direction="col" gap="sm">
                {quickLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm text-neutral-400 hover:text-primary-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </Flex>
            </div>

            {/* Contact Info */}
            <div className="col-span-2 md:col-span-1">
              <h4 className="text-lg font-semibold text-white mb-4">
                Contact Us
              </h4>
              <Flex direction="col" gap="sm">
                <Flex gap="sm" align="start">
                  <Mail size={18} className="flex-shrink-0 mt-0.5" />
                  <a
                    href="mailto:info@utkarsh2026.com"
                    className="text-sm text-neutral-400 hover:text-primary-400 transition-colors"
                  >
                    info@utkarsh2026.com
                  </a>
                </Flex>
                <Flex gap="sm" align="start">
                  <Phone size={18} className="flex-shrink-0 mt-0.5" />
                  <a
                    href="tel:+911234567890"
                    className="text-sm text-neutral-400 hover:text-primary-400 transition-colors"
                  >
                    +91 123 456 7890
                  </a>
                </Flex>
                <Flex gap="sm" align="start">
                  <MapPin size={18} className="flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-neutral-400">
                    College Campus, City, State - 123456
                  </span>
                </Flex>
              </Flex>
            </div>

            {/* Newsletter */}
            <div className="col-span-4 md:col-span-2 lg:col-span-1">
              <h4 className="text-lg font-semibold text-white mb-4">
                Stay Updated
              </h4>
              <p className="text-sm text-neutral-400 mb-4">
                Subscribe to our newsletter for the latest updates and announcements.
              </p>
              <form className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-600 hover:bg-primary-700 rounded-lg text-sm font-medium transition-colors"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </Grid>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-neutral-800 py-6">
          <Flex justify="between" align="center" className="flex-col md:flex-row gap-4">
            <p className="text-sm text-neutral-400 text-center md:text-left">
              © {currentYear} UTKARSH. All rights reserved.
            </p>
            <Flex gap="md" className="text-sm text-neutral-400">
              <Link href="/privacy" className="hover:text-primary-400 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-primary-400 transition-colors">
                Terms of Service
              </Link>
            </Flex>
          </Flex>
        </div>
      </Container>
    </footer>
  );
};
