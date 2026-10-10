"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  // Hide footer on initial splash landing page "/", "/admin", and Sanity Studio "/studio"
  if (pathname === "/" || pathname.startsWith("/admin") || pathname.startsWith("/studio")) {
    return null;
  }

  return (
    <footer className="bg-[#300E0F] text-[#F7E9C7] border-t border-[#DCC8A0]/15 relative overflow-hidden">
      {/* Geometric motif background from brand identity */}
      <div
        className="absolute inset-0 bg-kairu-pattern opacity-65 pointer-events-none"
        aria-hidden="true"
      />
      {/* Subtle depth gradient overlay to ensure perfect typography legibility */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-[#300E0F]/60 via-transparent to-[#220809]/80 pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-6 sm:px-12 py-16 sm:py-24 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16">
          {/* Col 1: Brand & Logo */}
          <div className="md:col-span-5 flex flex-col justify-between">
            <div>
              <Link href="/home" className="inline-flex items-center gap-4 group mb-6">
                <div className="relative w-12 h-12">
                  <Image
                    src="/images/logo-emblem.png"
                    alt="KAIRU KALA Official Emblem"
                    fill
                    className="object-contain"
                  />
                </div>
                <div>
                  <h3 className="font-serif text-2xl tracking-[0.2em] font-medium text-[#F7E9C7]">
                    KAIRU KALA
                  </h3>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-[#DCC8A0]/70 font-light">
                    Architecture & Design Studio
                  </p>
                </div>
              </Link>
              <p className="text-sm text-[#DCC8A0]/85 leading-relaxed max-w-md font-light">
                Architecture shaped by context, culture, and human experience. Creating timeless residential, cultural, and restorative spaces tailored to terrain and tradition.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-[#DCC8A0]/10 text-xs text-[#DCC8A0]/50 tracking-wider font-light flex items-center justify-between">
              <span>© {new Date().getFullYear()} KAIRU KALA. All Rights Reserved.</span>
              <Link href="/admin" className="hover:text-[#F7E9C7] transition-colors underline decoration-[#DCC8A0]/30">
                Studio CMS
              </Link>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div className="md:col-span-3">
            <h4 className="text-xs uppercase tracking-[0.3em] text-[#DCC8A0] font-semibold mb-6">
              Navigation
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/home"
                  className="text-[#F7E9C7]/80 hover:text-[#F7E9C7] transition-colors tracking-widest text-xs uppercase"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/projects"
                  className="text-[#F7E9C7]/80 hover:text-[#F7E9C7] transition-colors tracking-widest text-xs uppercase"
                >
                  Projects
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-[#F7E9C7]/80 hover:text-[#F7E9C7] transition-colors tracking-widest text-xs uppercase"
                >
                  About Studio
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-[#F7E9C7]/80 hover:text-[#F7E9C7] transition-colors tracking-widest text-xs uppercase"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Studio & Inquiries */}
          <div className="md:col-span-4">
            <h4 className="text-xs uppercase tracking-[0.3em] text-[#DCC8A0] font-semibold mb-6">
              Studio Locations
            </h4>
            <div className="space-y-4 text-xs leading-relaxed text-[#DCC8A0]/80 font-light">
              <div>
                <p className="font-medium text-[#F7E9C7] tracking-wider uppercase mb-0.5">Mangalore Office</p>
                <p>Kairu Kala Studio, 4th Floor, Coastal Crest, Kadri</p>
                <p>Mangalore, Karnataka 575003, India</p>
              </div>

              <div className="pt-2">
                <p className="font-medium text-[#F7E9C7] tracking-wider uppercase mb-0.5">Direct Inquiries</p>
                <p>
                  Email:{" "}
                  <a href="mailto:naman@kairukala.com" className="underline hover:text-[#F7E9C7]">
                    naman@kairukala.com
                  </a>
                </p>
                <p>
                  Phone:{" "}
                  <a href="tel:+919876543210" className="hover:text-[#F7E9C7]">
                    +91 98765 43210
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
