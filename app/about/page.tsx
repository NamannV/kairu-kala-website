import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Compass, Layers, Sun, Mountain } from "lucide-react";
import { getFounders, getSiteContent } from "@/lib/db";

export const revalidate = 0;

export const metadata = {
  title: "About Studio — KAIRU KALA Contemporary Architecture",
  description: "Learn about KAIRU KALA's architectural philosophy, contextual principles, and founder profile.",
};

export default async function AboutPage() {
  const founders = await getFounders();
  const siteContent = await getSiteContent();

  const studioIntro = siteContent?.studio_intro || {
    headline: "An architectural practice shaped by context, culture, and human experience.",
    description: "At Kairu Kala, we believe built spaces must emerge from their geographical and cultural soil. Our practice investigates the dialogue between tactile permanence and ethereal light, creating dwellings and institutions that age with dignity."
  };

  const philosophy = siteContent?.philosophy || {
    title: "Architectural Philosophy",
    subtitle: "Materiality, Atmosphere, and Stillness",
    body: "Every project begins with a careful reading of climate, topography, and memory. Rather than imposing alien geometries, we cultivate spaces through subtractive massing, natural cross-ventilation, and regional materials that develop an honest patina over decades."
  };

  return (
    <div className="bg-[#4B1718] text-[#F7E9C7] pt-32 sm:pt-40 min-h-screen">
      {/* 1. STUDIO INTRO (Deep Maroon Section) */}
      <section className="pb-24 sm:pb-36 max-w-7xl mx-auto px-6 sm:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-7 space-y-6">
            <span className="text-xs uppercase tracking-[0.35em] text-[#DCC8A0] font-sans font-medium block">
              About KAIRU KALA
            </span>
            <h1 className="font-serif text-5xl sm:text-7xl font-light text-[#F7E9C7] leading-tight">
              {studioIntro.headline}
            </h1>
            <p className="text-lg sm:text-xl text-[#F7E9C7]/90 font-serif font-light leading-relaxed">
              {studioIntro.description}
            </p>
            <p className="text-sm sm:text-base text-[#DCC8A0]/90 font-sans font-light leading-relaxed">
              Rooted along the west coast of India in Mangalore, our studio creates bespoke residential, cultural, and environmental architectures with deep attentiveness to craft, shadow, and materiality.
            </p>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[4/5] bg-[#300E0F] overflow-hidden shadow-2xl">
              <Image
                src="/images/projects/curvilinear-pavilion.jpg"
                alt="KAIRU KALA Studio Architecture"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
                priority
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-[#300E0F] border border-[#DCC8A0]/30 p-6 hidden sm:block shadow-xl">
              <div className="relative w-12 h-12 mb-2">
                <Image src="/images/logo-emblem.png" alt="Emblem" fill className="object-contain" />
              </div>
              <span className="text-[10px] uppercase tracking-[0.25em] font-sans text-[#DCC8A0]">
                Est. 2026 • Mangalore, India
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. DESIGN PHILOSOPHY (Architectural Jali Motif Section) */}
      <section className="py-24 sm:py-36 text-[#4B1718] relative overflow-hidden bg-[#EFE3C3]">
        {/* Repeating Architectural Floral Jali Motif Background */}
        <div
          className="absolute inset-0 bg-philosophy-pattern pointer-events-none"
          aria-hidden="true"
        />
        {/* Soft atmospheric gradient wash for depth and seamless edge transitions */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-[#F7E9C7]/60 via-transparent to-[#F7E9C7]/60 pointer-events-none"
          aria-hidden="true"
        />

        <div className="max-w-7xl mx-auto px-6 sm:px-12 relative z-10">
          <div className="max-w-3xl mb-16 p-6 sm:p-8 bg-[#FCFAF4]/80 backdrop-blur-xs border border-[#DCC8A0]/60 shadow-sm">
            <span className="text-xs uppercase tracking-[0.35em] text-[#4B1718]/80 font-sans font-semibold block mb-3">
              Studio Philosophy
            </span>
            <h2 className="font-serif text-4xl sm:text-6xl font-light text-[#4B1718] leading-tight">
              {philosophy.subtitle}
            </h2>
            <p className="mt-4 text-base sm:text-lg text-[#4B1718]/85 font-sans font-light leading-relaxed">
              {philosophy.body}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-8 bg-[#FCFAF4]/95 backdrop-blur-xs border border-[#DCC8A0] space-y-4 shadow-md hover:shadow-xl transition-all duration-300">
              <Compass className="w-8 h-8 text-[#4B1718]" />
              <h3 className="font-serif text-2xl text-[#4B1718] font-normal">Context</h3>
              <p className="text-xs sm:text-sm text-[#4B1718]/80 font-sans leading-relaxed font-light">
                Responding intimately to terrain, climate, wind channels, and regional vernacular traditions.
              </p>
            </div>

            <div className="p-8 bg-[#FCFAF4]/95 backdrop-blur-xs border border-[#DCC8A0] space-y-4 shadow-md hover:shadow-xl transition-all duration-300">
              <Sun className="w-8 h-8 text-[#4B1718]" />
              <h3 className="font-serif text-2xl text-[#4B1718] font-normal">Light & Shade</h3>
              <p className="text-xs sm:text-sm text-[#4B1718]/80 font-sans leading-relaxed font-light">
                Sculpting openings, courtyards, and deep overhangs to frame daylight as a dynamic living material.
              </p>
            </div>

            <div className="p-8 bg-[#FCFAF4]/95 backdrop-blur-xs border border-[#DCC8A0] space-y-4 shadow-md hover:shadow-xl transition-all duration-300">
              <Layers className="w-8 h-8 text-[#4B1718]" />
              <h3 className="font-serif text-2xl text-[#4B1718] font-normal">Materiality</h3>
              <p className="text-xs sm:text-sm text-[#4B1718]/80 font-sans leading-relaxed font-light">
                Honoring honest textures—board-marked concrete, natural laterite, reclaimed teak, and patinated brass.
              </p>
            </div>

            <div className="p-8 bg-[#FCFAF4]/95 backdrop-blur-xs border border-[#DCC8A0] space-y-4 shadow-md hover:shadow-xl transition-all duration-300">
              <Mountain className="w-8 h-8 text-[#4B1718]" />
              <h3 className="font-serif text-2xl text-[#4B1718] font-normal">Spatial Stillness</h3>
              <p className="text-xs sm:text-sm text-[#4B1718]/80 font-sans leading-relaxed font-light">
                Creating spaces that offer contemplation, quiet dignity, and respite from urban acceleration.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FOUNDER PROFILES (Database Driven) */}
      <section className="py-24 sm:py-36 max-w-7xl mx-auto px-6 sm:px-12 border-t border-[#DCC8A0]/15">
        <div className="mb-16">
          <span className="text-xs uppercase tracking-[0.35em] text-[#DCC8A0] font-sans font-medium block mb-3">
            Studio Leadership
          </span>
          <h2 className="font-serif text-4xl sm:text-6xl font-light text-[#F7E9C7]">
            Founder & Principal Architect
          </h2>
        </div>

        <div className="space-y-20">
          {founders.map((founder) => (
            <div key={founder.id} className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-5 relative aspect-[4/5] bg-[#300E0F] overflow-hidden shadow-2xl">
                <Image
                  src={founder.portrait_url}
                  alt={founder.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover object-top grayscale contrast-110"
                />
              </div>

              <div className="lg:col-span-7 space-y-6">
                <div>
                  <span className="text-xs uppercase tracking-[0.25em] text-[#DCC8A0] font-sans block mb-1">
                    {founder.role}
                  </span>
                  <h3 className="font-serif text-3xl sm:text-5xl text-[#F7E9C7]">
                    {founder.name}
                  </h3>
                </div>

                <div className="text-base sm:text-lg text-[#F7E9C7]/85 font-light leading-relaxed whitespace-pre-line">
                  {founder.biography}
                </div>

                <div className="pt-6 border-t border-[#DCC8A0]/15 flex items-center gap-6 text-xs uppercase tracking-[0.2em] text-[#DCC8A0] font-sans">
                  <span>Architecture & Design Direction</span>
                  <span>•</span>
                  <span>Mangalore, India</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. VALUES & APPROACH CTA */}
      <section className="py-24 bg-[#300E0F] text-[#F7E9C7] border-t border-[#DCC8A0]/15 text-center">
        <div className="max-w-4xl mx-auto px-6 sm:px-12">
          <h2 className="font-serif text-3xl sm:text-5xl font-light mb-6">
            Initiate an Architectural Dialogue
          </h2>
          <p className="text-sm sm:text-lg text-[#DCC8A0] font-light max-w-xl mx-auto mb-8">
            We collaborate with clients across residential, cultural, and environmental landscape commissions.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-3 px-8 py-4 bg-[#F7E9C7] text-[#4B1718] font-sans text-xs uppercase tracking-[0.25em] font-bold hover:bg-[#DCC8A0] transition-colors"
          >
            <span>Inquire for Commission</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
