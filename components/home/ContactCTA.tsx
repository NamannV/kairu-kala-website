"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function ContactCTA() {
  return (
    <section className="py-28 sm:py-40 bg-[#4B1718] text-[#F7E9C7] border-t border-[#DCC8A0]/15 relative overflow-hidden bg-grid-pattern">
      <div className="max-w-5xl mx-auto px-6 sm:px-12 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <span className="text-xs uppercase tracking-[0.35em] text-[#DCC8A0] font-sans font-medium block mb-4">
            Start A Conversation
          </span>

          <h2 className="font-serif text-4xl sm:text-6xl md:text-7xl font-light text-[#F7E9C7] leading-tight mb-10">
            Let&apos;s create something meaningful.
          </h2>

          <p className="text-base sm:text-xl text-[#DCC8A0]/90 font-sans font-light max-w-xl mx-auto mb-12">
            We welcome inquiries for residential, cultural, and restorative architectural commissions worldwide.
          </p>

          <Link
            href="/contact"
            className="group inline-flex items-center gap-4 px-10 py-5 bg-[#F7E9C7] text-[#4B1718] hover:bg-[#DCC8A0] transition-all duration-300 font-sans text-xs uppercase tracking-[0.3em] font-bold shadow-2xl"
          >
            <span>Contact Studio</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
