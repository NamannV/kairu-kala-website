"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function BrandStatement() {
  return (
    <section className="py-28 sm:py-40 bg-[#300E0F] text-[#F7E9C7] relative overflow-hidden bg-grid-pattern border-t border-[#DCC8A0]/15">
      {/* Background Emblem Watermark */}
      <div className="absolute right-[-10%] top-1/2 -translate-y-1/2 w-[500px] h-[500px] opacity-5 pointer-events-none">
        <Image
          src="/images/logo-emblem.png"
          alt="KAIRU KALA Emblem motif"
          fill
          className="object-contain"
        />
      </div>

      <div className="max-w-6xl mx-auto px-6 sm:px-12 relative z-10 text-center">
        {/* Emblem Top Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="relative w-16 h-16 mx-auto mb-10"
        >
          <Image
            src="/images/logo-emblem.png"
            alt="KAIRU KALA Emblem"
            fill
            className="object-contain"
          />
        </motion.div>

        {/* Brand Statement Headline */}
        <motion.blockquote
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
          className="font-serif text-3xl sm:text-5xl md:text-6xl font-light text-[#F7E9C7] leading-[1.25] tracking-tight max-w-4xl mx-auto"
        >
          &ldquo;Architecture shaped by context, culture and human experience.&rdquo;
        </motion.blockquote>

        {/* Supporting Editorial Paragraph */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.4 }}
          className="mt-8 text-sm sm:text-lg text-[#DCC8A0]/90 font-sans font-light max-w-2xl mx-auto leading-relaxed"
        >
          At KAIRU KALA, we approach design not as an isolated form, but as a harmonious continuation of soil, memory, and sacred geometric order.
        </motion.p>

        {/* Decorative Geometric Separator */}
        <div className="mt-12 flex items-center justify-center gap-3">
          <div className="w-12 h-[1px] bg-[#DCC8A0]/30" />
          <div className="w-2 h-2 rotate-45 border border-[#DCC8A0]" />
          <div className="w-12 h-[1px] bg-[#DCC8A0]/30" />
        </div>
      </div>
    </section>
  );
}
