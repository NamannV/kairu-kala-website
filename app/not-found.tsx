import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#4B1718] text-[#F7E9C7] flex flex-col items-center justify-center p-6 text-center bg-grid-pattern">
      <div className="relative w-20 h-20 mb-8 opacity-80">
        <Image
          src="/images/logo-emblem.png"
          alt="KAIRU KALA Emblem"
          fill
          className="object-contain"
        />
      </div>

      <span className="text-xs uppercase tracking-[0.4em] text-[#DCC8A0] font-sans font-medium block mb-3">
        404 — Void in Architectural Space
      </span>

      <h1 className="font-serif text-5xl sm:text-7xl font-light text-[#F7E9C7] mb-6">
        Page Not Found
      </h1>

      <p className="text-sm sm:text-base text-[#DCC8A0]/80 font-sans font-light max-w-md mx-auto leading-relaxed mb-10">
        The coordinates you entered do not correspond to any known room, blueprint, or project in the KAIRU KALA archives.
      </p>

      <Link
        href="/"
        className="inline-flex items-center gap-3 px-8 py-4 bg-[#F7E9C7] text-[#4B1718] font-sans text-xs uppercase tracking-[0.25em] font-bold hover:bg-[#DCC8A0] transition-colors shadow-lg"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Signature Gallery</span>
      </Link>
    </div>
  );
}
