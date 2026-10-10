"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Layers,
  Sliders,
  FileText,
  LogOut,
  ExternalLink,
  PlusCircle,
  FolderOpen
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  // On login page, render full screen without admin chrome
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch (e) {
      console.error("Logout error", e);
    }
  };

  const navLinks = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "All Projects", href: "/admin/projects", icon: FolderOpen },
    { label: "Add Project", href: "/admin/projects/new", icon: PlusCircle },
    { label: "Carousel Settings", href: "/admin/settings", icon: Sliders },
    { label: "Site Content", href: "/admin/content", icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-[#191715] text-[#F7E9C7] flex flex-col md:flex-row font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-[#220809] border-b md:border-b-0 md:border-r border-[#DCC8A0]/15 flex flex-col justify-between shrink-0">
        <div>
          {/* Admin Header / Logo */}
          <div className="p-6 border-b border-[#DCC8A0]/15 flex items-center justify-between">
            <Link href="/admin" className="flex items-center gap-3">
              <div className="relative w-8 h-8">
                <Image
                  src="/images/logo-emblem.png"
                  alt="KAIRU KALA Emblem"
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <span className="font-serif text-lg tracking-widest text-[#F7E9C7] block leading-none">
                  KAIRU KALA
                </span>
                <span className="text-[9px] uppercase tracking-[0.25em] text-[#DCC8A0]/70 font-sans">
                  Studio CMS
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5" aria-label="Admin Navigation">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-[0.2em] font-medium transition-colors ${
                    isActive
                      ? "bg-[#4B1718] text-[#F7E9C7] border-l-2 border-[#F7E9C7]"
                      : "text-[#DCC8A0]/75 hover:bg-[#300E0F] hover:text-[#F7E9C7]"
                  }`}
                >
                  <Icon className="w-4 h-4 text-[#DCC8A0]" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-[#DCC8A0]/15 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between w-full px-4 py-2.5 text-xs uppercase tracking-widest text-[#DCC8A0]/80 hover:text-[#F7E9C7] hover:bg-[#300E0F] transition-colors"
          >
            <span>Live Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-2.5 text-xs uppercase tracking-widest text-red-300/80 hover:text-red-200 hover:bg-red-950/40 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Workspace Content */}
      <main className="flex-grow p-6 sm:p-10 lg:p-12 overflow-y-auto max-w-7xl">
        {children}
      </main>
    </div>
  );
}
