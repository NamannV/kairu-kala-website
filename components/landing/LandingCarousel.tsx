"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowUpRight, Play, Pause } from "lucide-react";
import { Project, CarouselSettings } from "@/lib/types";
import { urlForImage } from "@/lib/sanity/image";

interface LandingCarouselProps {
  projects: Project[];
  settings?: CarouselSettings;
}

export default function LandingCarousel({ projects, settings }: LandingCarouselProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [screenSize, setScreenSize] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const shouldReduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const animTimerRef = useRef<NodeJS.Timeout | null>(null);
  const prevOffsetsRef = useRef<Record<string, number>>({});
  const activeIndexRef = useRef(0);
  const totalRef = useRef(projects?.length || 0);
  const isAnimatingRef = useRef(false);

  const total = projects?.length || 0;

  // Track responsive screen size for calibrated 3D transforms
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setScreenSize("mobile");
      } else if (width < 1024) {
        setScreenSize("tablet");
      } else {
        setScreenSize("desktop");
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Track client mount and clean up timers on unmount
  useEffect(() => {
    setIsMounted(true);
    return () => {
      if (animTimerRef.current) clearTimeout(animTimerRef.current);
    };
  }, []);

  // Synchronize ref mirrors for completely stable navigation handlers
  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  useEffect(() => {
    totalRef.current = total;
  }, [total]);

  useEffect(() => {
    isAnimatingRef.current = isAnimating;
  }, [isAnimating]);

  // Set initial project if specified in carousel settings
  useEffect(() => {
    if (settings?.initial_project_id && total > 0) {
      const idx = projects.findIndex((p) => p.id === settings.initial_project_id);
      if (idx !== -1) setActiveIndex(idx);
    }
  }, [settings, projects, total]);

  // Completely stable animation debounce
  const triggerNavigation = useCallback((newIndex: number) => {
    setIsAnimating(true);
    setActiveIndex(newIndex);
    if (animTimerRef.current) clearTimeout(animTimerRef.current);
    animTimerRef.current = setTimeout(() => {
      setIsAnimating(false);
    }, 450);
  }, []);

  const handleNext = useCallback(() => {
    if (totalRef.current <= 1 || isAnimatingRef.current) return;
    triggerNavigation((activeIndexRef.current + 1) % totalRef.current);
  }, [triggerNavigation]);

  const handlePrev = useCallback(() => {
    if (totalRef.current <= 1 || isAnimatingRef.current) return;
    triggerNavigation((activeIndexRef.current - 1 + totalRef.current) % totalRef.current);
  }, [triggerNavigation]);

  const handleSelectIndex = useCallback((index: number) => {
    if (isAnimatingRef.current || index === activeIndexRef.current) return;
    triggerNavigation(index);
  }, [triggerNavigation]);

  // Reliable keyboard navigation that never tears down repeatedly
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrev]);

  // Autoplay handler
  useEffect(() => {
    if (!settings?.autoplay_enabled || isPaused || shouldReduceMotion || total <= 1) {
      return;
    }
    const interval = settings.autoplay_interval || 6000;
    const timer = setInterval(() => {
      handleNext();
    }, interval);
    return () => clearInterval(timer);
  }, [settings, isPaused, shouldReduceMotion, total, handleNext]);

  // Calculate circular relative offset (-2, -1, 0, 1, 2)
  const getRelativePosition = useCallback((index: number, currentActive: number): number => {
    let diff = index - currentActive;
    if (total > 1) {
      while (diff > total / 2) diff -= total;
      while (diff < -total / 2) diff += total;
    }
    return diff;
  }, [total]);

  // Keep circular offset history in commit phase without mutating during render
  useEffect(() => {
    const newOffsets: Record<string, number> = {};
    projects.forEach((p, i) => {
      newOffsets[p.id] = getRelativePosition(i, activeIndex);
    });
    prevOffsetsRef.current = newOffsets;
  }, [activeIndex, projects, getRelativePosition]);

  // Zero-project branded fallback
  if (!projects || total === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#4B1718] text-[#F7E9C7] p-8 text-center bg-kairu-pattern relative overflow-hidden select-none">
        <div className="relative w-16 h-16 mb-6 opacity-90">
          <Image
            src="/images/logo-emblem.png"
            alt="KAIRU KALA Emblem"
            fill
            className="object-contain"
          />
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl tracking-[0.25em] font-light mb-2 text-[#F7E9C7]">KAIRU KALA</h1>
        <p className="text-xs uppercase tracking-[0.35em] text-[#DCC8A0]/70 mb-8 font-light">Architecture & Design Studio</p>
        <p className="text-sm text-[#DCC8A0]/80 font-light max-w-md mb-8 leading-relaxed">
          No projects are currently selected for the signature landing carousel. Enable projects in the Studio CMS under Website Display Settings.
        </p>
        <div className="flex items-center gap-4">
          <Link
            href="/home"
            className="px-6 py-3 border border-[#DCC8A0]/40 text-xs uppercase tracking-[0.25em] text-[#F7E9C7] hover:bg-[#F7E9C7] hover:text-[#4B1718] transition-all"
          >
            Enter Studio Home
          </Link>
          <Link
            href="/studio"
            className="px-6 py-3 bg-[#F7E9C7] text-[#4B1718] text-xs uppercase tracking-[0.25em] font-semibold hover:bg-[#DCC8A0] transition-all"
          >
            Open Sanity Studio
          </Link>
        </div>
      </div>
    );
  }

  const activeProject = projects[activeIndex];

  // Calibrated 3D transforms matching the Voyage reference composition:
  // Center: largest, straight, fully visible in foreground
  // Immediate neighbors: medium-sized, angled inward in perspective
  // Outer cards: smaller, more strongly angled, positioned farther back
  const get3DTransform = (offset: number) => {
    if (offset === 0) {
      // Center card (Active)
      return {
        x: 0,
        z: screenSize === "desktop" ? 100 : screenSize === "tablet" ? 75 : 50,
        rotateY: 0,
        scale: 1,
        opacity: 1,
        zIndex: 30,
        filter: "brightness(1) contrast(1.02)",
        pointerEvents: "auto" as const,
      };
    }

    if (offset === -1) {
      // Left immediate neighbor
      const xVal = screenSize === "desktop" ? -215 : screenSize === "tablet" ? -175 : -120;
      return {
        x: xVal,
        z: screenSize === "desktop" ? -40 : screenSize === "tablet" ? -50 : -60,
        rotateY: screenSize === "desktop" ? 14 : screenSize === "tablet" ? 16 : 18,
        scale: screenSize === "desktop" ? 0.82 : screenSize === "tablet" ? 0.78 : 0.72,
        opacity: screenSize === "mobile" ? 0.45 : 0.92,
        zIndex: 20,
        filter: "brightness(0.74) contrast(0.96)",
        pointerEvents: "auto" as const,
      };
    }

    if (offset === 1) {
      // Right immediate neighbor
      const xVal = screenSize === "desktop" ? 215 : screenSize === "tablet" ? 175 : 120;
      return {
        x: xVal,
        z: screenSize === "desktop" ? -40 : screenSize === "tablet" ? -50 : -60,
        rotateY: screenSize === "desktop" ? -14 : screenSize === "tablet" ? -16 : -18,
        scale: screenSize === "desktop" ? 0.82 : screenSize === "tablet" ? 0.78 : 0.72,
        opacity: screenSize === "mobile" ? 0.45 : 0.92,
        zIndex: 20,
        filter: "brightness(0.74) contrast(0.96)",
        pointerEvents: "auto" as const,
      };
    }

    if (offset <= -2) {
      // Far-left outer card
      const xVal = screenSize === "desktop" ? -365 : screenSize === "tablet" ? -305 : -210;
      const isVisibleOnDesktop = total >= 4 && screenSize === "desktop";
      return {
        x: xVal,
        z: screenSize === "desktop" ? -120 : -140,
        rotateY: screenSize === "desktop" ? 22 : 25,
        scale: screenSize === "desktop" ? 0.66 : 0.55,
        opacity: isVisibleOnDesktop ? 0.74 : 0,
        zIndex: 10,
        filter: "brightness(0.52) contrast(0.92)",
        pointerEvents: (isVisibleOnDesktop ? "auto" : "none") as any,
      };
    }

    if (offset >= 2) {
      // Far-right outer card
      const xVal = screenSize === "desktop" ? 365 : screenSize === "tablet" ? 305 : 210;
      const isVisibleOnDesktop = total >= 4 && screenSize === "desktop";
      return {
        x: xVal,
        z: screenSize === "desktop" ? -120 : -140,
        rotateY: screenSize === "desktop" ? -22 : -25,
        scale: screenSize === "desktop" ? 0.66 : 0.55,
        opacity: isVisibleOnDesktop ? 0.74 : 0,
        zIndex: 10,
        filter: "brightness(0.52) contrast(0.92)",
        pointerEvents: (isVisibleOnDesktop ? "auto" : "none") as any,
      };
    }

    // Off-screen for lists with more than 5 items
    return {
      x: offset < 0 ? -500 : 500,
      z: -200,
      rotateY: offset < 0 ? 30 : -30,
      scale: 0.5,
      opacity: 0,
      zIndex: 0,
      filter: "brightness(0.3)",
      pointerEvents: "none" as const,
    };
  };

  // Spring transition tuned for cinematic physical momentum
  const springTransition = shouldReduceMotion
    ? { duration: 0.25 }
    : {
        type: "spring" as const,
        stiffness: 220,
        damping: 26,
        mass: 0.9,
      };

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative w-full h-[100svh] min-h-[640px] bg-[#4B1718] overflow-hidden flex flex-col justify-between select-none"
    >
      {/* 1. CINEMATIC ARCHITECTURAL FULLSCREEN BACKGROUND */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none bg-[#23080A]">
        {/* Active Project Full-Viewport Blurred Image Crossfade */}
        <AnimatePresence mode="popLayout">
          <motion.div
            key={activeProject.id}
            initial={{ opacity: 0, scale: 1.14 }}
            animate={{
              opacity: screenSize === "mobile" ? 0.22 : 0.30,
              scale: 1.06,
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: shouldReduceMotion ? 0.35 : 1.25,
              ease: "easeInOut",
            }}
            className="absolute -inset-[8%] w-[116%] h-[116%] pointer-events-none"
          >
            <Image
              src={urlForImage(activeProject.cover_image || activeProject.cover_image_url)}
              alt={activeProject.title}
              fill
              priority
              sizes="100vw"
              className={`object-cover object-center ${
                screenSize === "mobile"
                  ? "filter blur-2xl saturate-[0.8] contrast-[1.12]"
                  : "filter blur-[70px] sm:blur-[95px] saturate-[0.8] contrast-[1.18]"
              }`}
            />
          </motion.div>
        </AnimatePresence>

        {/* Restrained Architectural Radial Glow behind Central Composition (Burgundy & Muted Terracotta) */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 68% 54% at 50% 46%, rgba(142, 45, 48, 0.44) 0%, rgba(184, 93, 70, 0.18) 36%, rgba(75, 23, 24, 0.65) 70%, rgba(28, 7, 9, 0.96) 100%)",
          }}
        />

        {/* Extremely Faint Architectural Drafting Geometry & Compass Crosshairs */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.038] mix-blend-screen overflow-hidden">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
            <defs>
              <pattern id="arch-draft-grid" width="72" height="72" patternUnits="userSpaceOnUse">
                <path d="M 72 0 L 0 0 0 72" fill="none" stroke="#F7E9C7" strokeWidth="0.7" />
                <circle cx="0" cy="0" r="1.25" fill="#DCC8A0" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#arch-draft-grid)" />
            {/* Center crosshair & concentric golden radius arcs */}
            <g transform="translate(50%, 46%)" stroke="#F7E9C7" strokeWidth="0.65" fill="none">
              <circle cx="0" cy="0" r="240" strokeDasharray="3 9" />
              <circle cx="0" cy="0" r="410" strokeDasharray="4 14" opacity="0.6" />
              <line x1="-560" y1="0" x2="560" y2="0" strokeDasharray="6 14" opacity="0.45" />
              <line x1="0" y1="-320" x2="0" y2="320" strokeDasharray="6 14" opacity="0.45" />
              {/* Precision framing marks */}
              <path d="M -24 -24 L -24 -10 M -24 -24 L -10 -24" />
              <path d="M 24 -24 L 24 -10 M 24 -24 L 10 -24" />
              <path d="M -24 24 L -24 10 M -24 24 L -10 24" />
              <path d="M 24 24 L 24 10 M 24 24 L 10 24" />
            </g>
          </svg>
        </div>

        {/* Fine Architectural Vellum Grain Texture */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.035] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
          }}
        />

        {/* Vertical Perimeter Vignette: protects header and footer cream typography */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#220709]/85 via-transparent to-[#1F0608]/95 pointer-events-none" />

        {/* Horizontal Edge Vignette: deepens left and right outer borders */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#200608]/75 via-transparent to-[#200608]/75 pointer-events-none" />
      </div>

      {/* 2. RESTRAINED LANDING NAVIGATION HEADER */}
      <header className="relative z-40 w-full px-6 sm:px-12 pt-7 pb-4 flex items-center justify-between">
        {/* Left: Brand Identity Emblem & Wordmark */}
        <Link
          href="/"
          className="group flex items-center gap-3.5 focus:outline-none"
          aria-label="Kairu Kala Landing"
        >
          <div className="relative w-9 h-9 sm:w-11 sm:h-11 transition-transform duration-500 group-hover:scale-105">
            <Image
              src="/images/logo-emblem.png"
              alt="KAIRU KALA Official Emblem"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-lg sm:text-xl font-medium tracking-[0.22em] text-[#F7E9C7] leading-none group-hover:text-[#DCC8A0] transition-colors">
              KAIRU KALA
            </span>
            <span className="text-[9px] uppercase tracking-[0.35em] text-[#DCC8A0]/75 font-sans font-light mt-1">
              Architecture Studio
            </span>
          </div>
        </Link>

        {/* Right: Public Navigation Links */}
        <nav className="flex items-center space-x-6 sm:space-x-10 text-xs sm:text-[13px] tracking-[0.25em] font-medium uppercase" aria-label="Landing Navigation">
          <Link
            href="/home"
            className="text-[#F7E9C7]/80 hover:text-[#F7E9C7] transition-colors py-1 relative group"
          >
            Home
            <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#F7E9C7] transition-all duration-300 group-hover:w-full" />
          </Link>
          <Link
            href="/projects"
            className="text-[#F7E9C7]/80 hover:text-[#F7E9C7] transition-colors py-1 relative group"
          >
            Projects
            <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#F7E9C7] transition-all duration-300 group-hover:w-full" />
          </Link>
          <Link
            href="/about"
            className="text-[#F7E9C7]/80 hover:text-[#F7E9C7] transition-colors py-1 relative group"
          >
            About
            <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#F7E9C7] transition-all duration-300 group-hover:w-full" />
          </Link>
          <Link
            href="/contact"
            className="text-[#F7E9C7]/80 hover:text-[#F7E9C7] transition-colors py-1 relative group"
          >
            Contact
            <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#F7E9C7] transition-all duration-300 group-hover:w-full" />
          </Link>
        </nav>
      </header>

      {/* 3. SIGNATURE FIVE-CARD 3D PERSPECTIVE CAROUSEL */}
      <main className="relative z-30 flex-grow flex flex-col items-center justify-center w-full px-4 sm:px-8 py-2 overflow-visible">
        
        {/* Layered Cards Carousel Container with hardware-accelerated 3D perspective */}
        <div 
          className="relative w-full max-w-7xl h-[430px] sm:h-[480px] md:h-[520px] lg:h-[560px] flex items-center justify-center overflow-visible pointer-events-none"
          style={{
            perspective: "1200px",
            perspectiveOrigin: "center center",
            transformStyle: "preserve-3d",
          }}
        >
          {projects.map((project, index) => {
            const offset = getRelativePosition(index, activeIndex);
            const isCenter = offset === 0;
            const transformProps = get3DTransform(offset);

            // Check if card wrapped around the circular boundary to prevent sliding through center
            const prevOffset = prevOffsetsRef.current[project.id];
            const isWrapping = prevOffset !== undefined && Math.abs(offset - prevOffset) > 1.5;

            // Card size calibrated responsively for the 5-card composition
            const cardWidth = screenSize === "desktop" ? "310px" : screenSize === "tablet" ? "270px" : "235px";
            const cardHeight = screenSize === "desktop" ? "470px" : screenSize === "tablet" ? "410px" : "355px";

            return (
              <motion.div
                key={project.id}
                initial={isMounted ? false : {
                  x: transformProps.x,
                  z: transformProps.z,
                  rotateY: transformProps.rotateY,
                  scale: transformProps.scale,
                  opacity: transformProps.opacity,
                  zIndex: transformProps.zIndex,
                }}
                animate={{
                  x: transformProps.x,
                  z: transformProps.z,
                  rotateY: transformProps.rotateY,
                  scale: transformProps.scale,
                  opacity: transformProps.opacity,
                  zIndex: transformProps.zIndex,
                }}
                transition={isWrapping ? { duration: 0 } : springTransition}
                drag={isCenter ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -50) handleNext();
                  else if (info.offset.x > 50) handlePrev();
                }}
                onTap={() => {
                  if (!isCenter) handleSelectIndex(index);
                }}
                onClick={() => {
                  if (!isCenter) handleSelectIndex(index);
                }}
                className={`absolute will-change-transform rounded-none overflow-hidden transition-shadow duration-500 pointer-events-auto ${
                  isCenter
                    ? "cursor-grab active:cursor-grabbing shadow-[0_28px_65px_rgba(20,5,6,0.7)] ring-1 ring-[#F7E9C7]/25"
                    : "cursor-pointer hover:ring-1 hover:ring-[#F7E9C7]/40 shadow-[0_16px_45px_rgba(20,5,6,0.5)]"
                }`}
                style={{
                  width: cardWidth,
                  height: cardHeight,
                  transformStyle: "preserve-3d",
                  filter: transformProps.filter,
                  pointerEvents: transformProps.pointerEvents,
                }}
              >
                {/* Image Surface with warm architectural color toning */}
                <div className="relative w-full h-full bg-[#300E0F]">
                  <Image
                    src={urlForImage(project.cover_image || project.cover_image_url)}
                    alt={project.title}
                    fill
                    sizes="(max-width: 640px) 240px, (max-width: 1024px) 280px, 320px"
                    priority={isCenter || Math.abs(offset) <= 1}
                    className="object-cover object-center pointer-events-none"
                  />
                  
                  {/* Subtle inner border for layered frame depth */}
                  <div className="absolute inset-0 ring-1 ring-inset ring-[#F7E9C7]/15 pointer-events-none" />
                  
                  {/* Center panel interactive hover overlay with project detail action */}
                  {isCenter && (
                    <div className="absolute inset-0 bg-gradient-to-t from-[#300E0F]/85 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6 z-20 pointer-events-none">
                      <Link
                        href={`/projects/${project.slug}`}
                        draggable={false}
                        className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#F7E9C7] font-medium bg-[#4B1718]/90 px-4 py-2 self-start border border-[#DCC8A0]/30 shadow-md transform translate-y-2 hover:translate-y-0 transition-transform duration-300 pointer-events-auto"
                        aria-label={`View full project details for ${project.title}`}
                      >
                        Explore Project <ArrowUpRight className="w-3.5 h-3.5 text-[#DCC8A0]" />
                      </Link>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* 4. ACTIVE PROJECT INFORMATION OVERLAY / IMMEDIATE METADATA */}
        <div className="relative z-30 mt-3 sm:mt-5 text-center max-w-2xl px-4 pointer-events-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeProject.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center"
            >
              {/* Category / Sub-header */}
              <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.35em] text-[#DCC8A0] font-sans font-medium mb-1.5">
                KAIRU KALA / SELECTED WORKS
              </span>

              {/* Project Title */}
              <Link
                href={`/projects/${activeProject.slug}`}
                className="group inline-flex items-center gap-2 text-xl sm:text-2xl md:text-3xl font-serif text-[#F7E9C7] tracking-wide font-light hover:text-[#DCC8A0] transition-colors"
              >
                <span>{activeProject.title}</span>
                <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 text-[#DCC8A0] transition-opacity duration-300" />
              </Link>

              {/* Location & Year */}
              <div className="flex items-center gap-2 mt-1.5 text-xs sm:text-sm tracking-[0.2em] text-[#DCC8A0]/80 font-sans font-light">
                <span>{activeProject.location}</span>
                <span>·</span>
                <span>{activeProject.year}</span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* 5. BALANCED FOOTER & CAROUSEL CONTROLS */}
      <footer className="relative z-40 w-full px-6 sm:px-12 py-5 flex items-center justify-between border-t border-[#DCC8A0]/10 bg-gradient-to-t from-[#300E0F]/80 to-transparent">
        {/* Left: Studio Location & Year Marker */}
        <div className="hidden sm:flex items-center gap-3 text-[11px] tracking-[0.25em] text-[#DCC8A0]/70 uppercase font-light">
          <span>Mangalore, India</span>
          <span>•</span>
          <span>Studio 2026</span>
        </div>

        {/* Center: Minimalist Previous / Next Arrows & Project Counter */}
        <div className="flex items-center gap-6 mx-auto sm:mx-0">
          <button
            onClick={handlePrev}
            disabled={total <= 1}
            className={`p-2 sm:p-2.5 rounded-full border border-[#DCC8A0]/25 text-[#F7E9C7] transition-all duration-300 focus:outline-none ${
              total <= 1
                ? "opacity-30 cursor-not-allowed"
                : "hover:border-[#F7E9C7] hover:bg-[#F7E9C7]/10 active:scale-95 focus:ring-1 focus:ring-[#F7E9C7]"
            }`}
            aria-label="Previous project"
          >
            <ChevronLeft className="w-5 h-5 text-[#F7E9C7]" />
          </button>

          {/* Project Counter: 01 / 05 */}
          <div className="text-xs sm:text-sm tracking-[0.3em] font-sans font-medium text-[#F7E9C7]">
            <span>{String(activeIndex + 1).padStart(2, "0")}</span>
            <span className="text-[#DCC8A0]/50 mx-2">/</span>
            <span className="text-[#DCC8A0]/80">{String(total).padStart(2, "0")}</span>
          </div>

          <button
            onClick={handleNext}
            disabled={total <= 1}
            className={`p-2 sm:p-2.5 rounded-full border border-[#DCC8A0]/25 text-[#F7E9C7] transition-all duration-300 focus:outline-none ${
              total <= 1
                ? "opacity-30 cursor-not-allowed"
                : "hover:border-[#F7E9C7] hover:bg-[#F7E9C7]/10 active:scale-95 focus:ring-1 focus:ring-[#F7E9C7]"
            }`}
            aria-label="Next project"
          >
            <ChevronRight className="w-5 h-5 text-[#F7E9C7]" />
          </button>
        </div>

        {/* Right: Autoplay Indicator & Admin Quick Link */}
        <div className="flex items-center gap-4 text-xs tracking-widest text-[#DCC8A0]/70">
          {settings?.autoplay_enabled && (
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] hover:text-[#F7E9C7] transition-colors"
              aria-label={isPaused ? "Resume autoplay" : "Pause autoplay"}
            >
              {isPaused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
              <span className="hidden md:inline">{isPaused ? "Paused" : "Autoplay"}</span>
            </button>
          )}

          <Link
            href="/admin"
            className="text-[10px] uppercase tracking-[0.2em] text-[#DCC8A0]/50 hover:text-[#DCC8A0] transition-colors py-1"
          >
            Studio CMS
          </Link>
        </div>
      </footer>
    </div>
  );
}
