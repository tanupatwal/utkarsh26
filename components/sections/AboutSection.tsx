'use client';

import { motion } from 'framer-motion';
import { useRef } from 'react';

export default function AboutSection() {
  const containerRef = useRef(null);

  return (
    <section id="about" className="relative py-20 md:py-32 bg-navy-dark overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-heritage-gold to-transparent opacity-30" />
        <div className="absolute -left-20 top-40 w-64 h-64 bg-heritage-orange/10 rounded-full blur-[100px]" />
        <div className="absolute -right-20 bottom-40 w-64 h-64 bg-tech-cyan/10 rounded-full blur-[100px]" />

        <div className="container mx-auto px-6 relative z-10">
            <motion.div 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
                className="max-w-4xl mx-auto text-center mb-16"
            >
                <h2 className="text-4xl md:text-5xl font-cinzel text-transparent bg-clip-text bg-gradient-to-r from-heritage-gold via-white to-tech-cyan mb-6">
                    About Utkarsh
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-heritage-orange to-tech-cyan mx-auto rounded-full" />
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
                
                {/* Text Content */}
                <motion.div 
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="md:col-span-8 md:col-start-3 text-lg md:text-xl leading-relaxed font-outfit text-gray-300 space-y-6 text-center md:text-left"
                >
                    <p>
                        <span className="text-heritage-gold font-bold">Utkarsh</span>, formerly known as <span className="text-white">INNOVIZ</span>, is a three-day extravaganza celebrating arts, culture, and engineering.
                    </p>
                    <p>
                        As a premier tech fest, it brings together bright minds, groundbreaking ideas, and cutting-edge advancements that shape the future. From hands-on workshops and competitive hackathons to insightful talks by industry experts and research paper presentations, Utkarsh is the ultimate platform for students, professionals, and tech enthusiasts to explore, learn, and showcase their talents.
                    </p>
                    <p>
                        Since its inception in <span className="text-tech-cyan font-bold">2006</span>, UTKARSH has established itself as a premier event in Delhi & NCR, attracting over <span className="text-heritage-saffron font-bold">10,000 attendees</span> annually.
                    </p>
                    <p className="text-xl md:text-2xl font-cinzel text-white pt-4">
                        Join us in pushing boundaries, redefining the present, and pioneering a smarter tomorrow.
                    </p>
                </motion.div>

            </div>
        </div>
    </section>
  );
}
