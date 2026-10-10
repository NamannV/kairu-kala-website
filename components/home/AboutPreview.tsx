"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function AboutPreview() {
  return (
    <section className="py-24 sm:py-36 bg-[#4B1718] text-[#F7E9C7] border-t border-[#DCC8A0]/15">
      <div className="max-w-7xl mx-auto px-6 sm:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Architectural Photo */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="lg:col-span-6 relative"
          >
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#300E0F]">
              <Image
                src="/images/projects/curvilinear-pavilion.jpg"
                alt="KAIRU KALA Architecture & Spatial Geometry"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center"
              />
            </div>
            {/* Small Overlay Badge */}
            <div className="absolute bottom-6 right-6 bg-[#4B1718]/95 border border-[#DCC8A0]/30 p-6 max-w-xs shadow-xl backdrop-blur-sm hidden sm:block">
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#DCC8A0] font-sans block mb-1">
                Studio Ethos
              </span>
              <p className="font-serif text-sm text-[#F7E9C7] font-light leading-snug">
                Balancing contemporary architectural precision with artisanal heritage traditions.
              </p>
            </div>
          </motion.div>

          {/* Right Column: Text & Link */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
            className="lg:col-span-6 space-y-8"
          >
            <div>
              <span className="text-xs uppercase tracking-[0.35em] text-[#DCC8A0] font-sans font-medium block mb-3">
                About The Studio
              </span>
              <h2 className="font-serif text-4xl sm:text-5xl font-light text-[#F7E9C7] leading-tight">
                Rooted in context. Driven by timeless inquiry.
              </h2>
            </div>

            <div className="space-y-4 text-base text-[#F7E9C7]/85 font-light leading-relaxed">
              <p>
                Founded on the west coast of India, KAIRU KALA is a practice dedicated to tectonic excellence and spatial emotional weight. We collaborate closely with local stonemasons, carpenters, and structural innovators.
              </p>
              <p>
                Whether designing a quiet private coastal residence, a cultural pavilion, or restoring a century-old ancestral structure, our work honors regional microclimates and sacred geometry.
              </p>
            </div>

            <div className="pt-4">
              <Link
                href="/about"
                className="group inline-flex items-center gap-3 px-8 py-4 bg-[#300E0F] border border-[#DCC8A0]/40 text-[#F7E9C7] hover:bg-[#F7E9C7] hover:text-[#4B1718] transition-all duration-300 font-sans text-xs uppercase tracking-[0.25em] font-medium"
              >
                <span>Discover Our Story</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
