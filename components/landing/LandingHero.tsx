"use me";
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function LandingHero() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative min-h-screen w-full bg-[#441515] flex flex-col justify-between items-center overflow-hidden px-6 py-12 bg-grid-pattern">

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.18 }}
        transition={{ duration: 3, delay: 1.5, ease: "easeOut" }}
        className="absolute inset-0 z-0 pointer-events-none"
      >
        <Image
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2000&auto=format&fit=crop"
          alt="Architectural texture"
          fill
          className="object-cover object-center grayscale contrast-125 mix-blend-overlay"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#441515] via-transparent to-[#441515]/90" />
      </motion.div>

      
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 0.8, y: 0 }}
        transition={{ duration: 1.2, delay: 0.5 }}
        className="relative z-10 text-center"
      >
        <span className="text-[11px] uppercase tracking-[0.4em] font-sans text-[#DBCAA7] font-light">
          Mangalore • India
        </span>
      </motion.div>

      
      <div className="relative z-10 flex flex-col items-center justify-center my-auto max-w-3xl text-center px-4">
      
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-36 h-36 sm:w-48 sm:h-48 md:w-56 md:h-56 mb-8 drop-shadow-2xl"
        >
          <Image
            src="/logo-emblem.png"
            alt="KAIRU KALA Emblem"
            fill
            className="object-contain"
            priority
          />
        </motion.div>

        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 1.1, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-64 sm:w-80 md:w-96 h-16 sm:h-20 mb-6"
        >
          <Image
            src="/logo-wordmark.png"
            alt="KAIRU KALA Wordmark"
            fill
            className="object-contain"
            priority
          />
        </motion.div>

          
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 0.9, y: 0 }}
          transition={{ duration: 1.2, delay: 1.7 }}
          className="font-serif text-lg sm:text-xl md:text-2xl text-[#F5E6C5] font-light tracking-wide max-w-xl leading-relaxed"
        >
          Architecture shaped by context, culture and human experience.
        </motion.p>

        
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 2.3, ease: "easeOut" }}
          className="mt-10 sm:mt-12"
        >
          <Link
            href="/home"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="group inline-flex items-center gap-4 px-8 py-4 border border-[#DBCAA7]/40 bg-[#441515]/60 hover:bg-[#F5E6C5] text-[#F5E6C5] hover:text-[#441515] transition-all duration-500 rounded-none shadow-lg focus:outline-none focus:ring-1 focus:ring-[#F5E6C5]"
          >
            <span className="text-xs uppercase tracking-[0.3em] font-medium font-sans">
              Enter Studio
            </span>
            <motion.div
              animate={{ x: isHovered ? 6 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ArrowRight className="w-4 h-4" />
            </motion.div>
          </Link>
        </motion.div>
      </div>

      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ duration: 1, delay: 2.6 }}
        className="relative z-10 flex items-center justify-between w-full max-w-6xl text-[10px] text-[#DBCAA7] uppercase tracking-[0.3em] font-light"
      >
        <span>Bespoke Architectural Studio</span>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[#F5E6C5]/60" />
          <span>Established 2026</span>
        </div>
      </motion.div>
    </div>
  );
}
