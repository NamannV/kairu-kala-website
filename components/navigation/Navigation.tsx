"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const NAV_ITEMS = [
  { label: "HOME", href: "/home" },
  { label: "PROJECTS", href: "/projects" },
  { label: "ABOUT", href: "/about" },
  { label: "CONTACT", href: "/contact" },
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // Hide global navigation on the signature landing page "/", "/admin", and Sanity Studio "/studio"
  const hideNavigation = pathname === "/" || pathname.startsWith("/admin") || pathname.startsWith("/studio");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  if (hideNavigation) {
    return null;
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-[#4B1718]/95 backdrop-blur-md py-4 border-b border-[#DCC8A0]/15 shadow-xl"
            : "bg-gradient-to-b from-[#4B1718]/90 via-[#4B1718]/50 to-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-12 flex items-center justify-between">
          {/* Brand Logo & Wordmark */}
          <Link
            href="/home"
            className="group flex items-center gap-3.5 focus:outline-none"
            aria-label="KAIRU KALA Home"
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

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-10" aria-label="Desktop Navigation">
            {NAV_ITEMS.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href === "/projects" && pathname.startsWith("/projects"));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative text-xs tracking-[0.25em] font-medium uppercase py-1 transition-colors duration-300 ${
                    isActive ? "text-[#F7E9C7]" : "text-[#F7E9C7]/75 hover:text-[#F7E9C7]"
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <motion.div
                      layoutId="navIndicator"
                      className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#F7E9C7]"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden relative z-50 p-2 text-[#F7E9C7] hover:text-[#DCC8A0] transition-colors focus:outline-none"
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Fullscreen Mobile Navigation Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="fixed inset-0 z-40 bg-[#4B1718] flex flex-col justify-between p-8 sm:p-12 md:hidden bg-grid-pattern"
          >
            {/* Top Emblem Watermark */}
            <div className="pt-20 flex justify-center">
              <div className="relative w-24 h-24 opacity-25">
                <Image
                  src="/images/logo-emblem.png"
                  alt="KAIRU KALA Emblem Background"
                  fill
                  className="object-contain"
                />
              </div>
            </div>

            {/* Mobile Nav Links */}
            <nav className="flex flex-col space-y-7 text-center my-auto">
              {NAV_ITEMS.map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.3, delay: index * 0.06 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="font-serif text-3xl sm:text-4xl text-[#F7E9C7] tracking-[0.15em] font-light hover:text-[#DCC8A0] transition-colors"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* Mobile Footer Info */}
            <div className="text-center pb-8 border-t border-[#DCC8A0]/15 pt-6">
              <p className="text-xs tracking-widest text-[#DCC8A0]/80 uppercase mb-1">KAIRU KALA ARCHITECTURE</p>
              <p className="text-[11px] text-[#DCC8A0]/50 font-light">Mangalore • India</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
