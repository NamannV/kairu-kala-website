"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";

export default function HomeHero() {
  return (
    <section className="relative min-h-[90vh] sm:min-h-screen w-full flex items-center justify-center overflow-hidden pt-24 pb-16 bg-[#4B1718]">
      {/* Editorial Background Image with Slow Scale */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          initial={{ scale: 1.12, opacity: 0.35 }}
          animate={{ scale: 1, opacity: 0.5 }}
          transition={{ duration: 2.5, ease: "easeOut" }}
          className="w-full h-full relative"
        >
          <Image
            src="/images/projects/coastal-cantilever.jpg"
            alt="KAIRU KALA Architecture Hero"
            fill
            className="object-cover object-center grayscale contrast-125"
            priority
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#4B1718] via-[#4B1718]/60 to-[#4B1718]/85" />
      </div>

      {/* Hero Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 w-full text-left">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="max-w-4xl"
        >
          {/* Subtle Tagline */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-[1px] bg-[#DCC8A0]" />
            <span className="text-xs uppercase tracking-[0.35em] text-[#DCC8A0] font-medium font-sans">
              Architecture / Design / Space
            </span>
          </div>

          {/* Large Editorial Headline */}
          <h1 className="font-serif text-5xl sm:text-7xl lg:text-8xl text-[#F7E9C7] font-light leading-[1.05] tracking-tight mb-8">
            KAIRU KALA
          </h1>

          <p className="text-lg sm:text-2xl text-[#F7E9C7]/90 font-serif font-light max-w-2xl leading-relaxed mb-10">
            Crafting architectural forms deeply rooted in regional culture, natural daylight, and enduring materiality.
          </p>

          <div className="flex flex-wrap items-center gap-6">
            <Link
              href="/projects"
              className="inline-flex items-center gap-3 px-8 py-4 bg-[#F7E9C7] text-[#4B1718] hover:bg-[#DCC8A0] transition-all duration-300 font-sans text-xs uppercase tracking-[0.25em] font-bold"
            >
              Explore Portfolio
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-3 px-8 py-4 border border-[#DCC8A0]/40 text-[#F7E9C7] hover:border-[#F7E9C7] transition-all duration-300 font-sans text-xs uppercase tracking-[0.25em] font-medium"
            >
              The Studio
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-[#DCC8A0]"
      >
        <span className="text-[10px] uppercase tracking-[0.3em] font-sans">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <ArrowDown className="w-4 h-4" />
        </motion.div>
      </motion.div>
    </section>
  );
}
