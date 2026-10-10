"use client";

import { useState, FormEvent } from "react";
import Image from "next/image";
import { Founder } from "@/lib/types";
import { Save, CheckCircle2, AlertCircle, PlusCircle, Trash2, User } from "lucide-react";

interface SiteContentManagerProps {
  initialContent: Record<string, any>;
  initialFounders: Founder[];
}

export default function SiteContentManager({
  initialContent,
  initialFounders,
}: SiteContentManagerProps) {
  const [content, setContent] = useState<Record<string, any>>(initialContent);
  const [founders, setFounders] = useState<Founder[]>(initialFounders);
  const [savingSection, setSavingSection] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Studio Intro form state
  const [intro, setIntro] = useState({
    headline: content.studio_intro?.headline || "Architecture shaped by context, culture and human experience.",
    tagline: content.studio_intro?.tagline || "KAIRU KALA / CONTEMPORARY ARCHITECTURE",
    location: content.studio_intro?.location || "Mangalore, India",
    description: content.studio_intro?.description || "At Kairu Kala, we believe built spaces must emerge from their geographical and cultural soil.",
  });

  // Philosophy form state
  const [philosophy, setPhilosophy] = useState({
    title: content.philosophy?.title || "Architectural Philosophy",
    subtitle: content.philosophy?.subtitle || "Materiality, Atmosphere, and Stillness",
    body: content.philosophy?.body || "Every project begins with a careful reading of climate, topography, and memory.",
  });

  // Contact info form state
  const [contact, setContact] = useState({
    email: content.contact?.email || "naman@kairukala.com",
    phone: content.contact?.phone || "+91 98765 43210",
    address: content.contact?.address || "Kairu Kala Studio, 4th Floor, Coastal Crest, Kadri, Mangalore, Karnataka 575003, India",
    instagram: content.contact?.instagram || "https://instagram.com/kairukala",
    linkedin: content.contact?.linkedin || "https://linkedin.com/company/kairukala",
  });

  // Save specific site section
  const handleSaveSection = async (key: string, data: any) => {
    setSavingSection(key);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("/api/site-content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, content: data }),
      });

      if (!res.ok) throw new Error("Failed to save content section.");

      setSuccess(`Saved ${key.replace("_", " ")} successfully!`);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || "Error saving content.");
    } finally {
      setSavingSection(null);
    }
  };

  // Save founder
  const handleSaveFounder = async (founder: Founder) => {
    setSavingSection(`founder-${founder.id}`);
    try {
      const res = await fetch("/api/founders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(founder),
      });
      if (res.ok) {
        setSuccess(`Saved founder profile for ${founder.name}!`);
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSavingSection(null);
    }
  };

  const updateFounderField = (id: string, field: keyof Founder, value: any) => {
    setFounders((prev) =>
      prev.map((f) => (f.id === id ? { ...f, [field]: value } : f))
    );
  };

  return (
    <div className="space-y-12 max-w-4xl">
      {/* Header */}
      <div className="pb-6 border-b border-[#DCC8A0]/15">
        <span className="text-xs uppercase tracking-[0.3em] text-[#DCC8A0] block mb-1">
          Brand Narrative & Information
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#F7E9C7] font-light">
          Site Content & Founder Management
        </h1>
        <p className="text-xs sm:text-sm text-[#DCC8A0]/80 mt-2 font-sans">
          Manage the public editorial statements, founder profiles, philosophy, and studio contact coordinates.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-950/80 border border-red-500/50 text-red-200 text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>{success}</span>
        </div>
      )}

      {/* 1. Studio Introduction Section */}
      <div className="bg-[#220809] border border-[#DCC8A0]/15 p-6 sm:p-8 space-y-5">
        <div className="flex items-center justify-between border-b border-[#DCC8A0]/15 pb-3">
          <h2 className="font-serif text-xl text-[#F7E9C7]">Studio Introduction & Taglines</h2>
          <button
            onClick={() => handleSaveSection("studio_intro", intro)}
            disabled={savingSection === "studio_intro"}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#F7E9C7] text-[#4B1718] font-sans text-xs uppercase tracking-wider font-bold hover:bg-[#DCC8A0] transition-colors cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{savingSection === "studio_intro" ? "Saving..." : "Save Intro"}</span>
          </button>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-widest text-[#DCC8A0] font-sans mb-1.5">
            Main Headline
          </label>
          <input
            type="text"
            value={intro.headline}
            onChange={(e) => setIntro({ ...intro, headline: e.target.value })}
            className="w-full bg-[#191715] border border-[#DCC8A0]/25 px-4 py-2.5 text-sm text-[#F7E9C7] focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-widest text-[#DCC8A0] font-sans mb-1.5">
            Detailed Studio Summary (Home & About)
          </label>
          <textarea
            rows={3}
            value={intro.description}
            onChange={(e) => setIntro({ ...intro, description: e.target.value })}
            className="w-full bg-[#191715] border border-[#DCC8A0]/25 p-3 text-sm text-[#F7E9C7] focus:outline-none resize-none"
          />
        </div>
      </div>

      {/* 2. Architectural Philosophy Section */}
      <div className="bg-[#220809] border border-[#DCC8A0]/15 p-6 sm:p-8 space-y-5">
        <div className="flex items-center justify-between border-b border-[#DCC8A0]/15 pb-3">
          <h2 className="font-serif text-xl text-[#F7E9C7]">Architectural Philosophy</h2>
          <button
            onClick={() => handleSaveSection("philosophy", philosophy)}
            disabled={savingSection === "philosophy"}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#F7E9C7] text-[#4B1718] font-sans text-xs uppercase tracking-wider font-bold hover:bg-[#DCC8A0] transition-colors cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{savingSection === "philosophy" ? "Saving..." : "Save Philosophy"}</span>
          </button>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-widest text-[#DCC8A0] font-sans mb-1.5">
            Philosophy Heading
          </label>
          <input
            type="text"
            value={philosophy.subtitle}
            onChange={(e) => setPhilosophy({ ...philosophy, subtitle: e.target.value })}
            className="w-full bg-[#191715] border border-[#DCC8A0]/25 px-4 py-2.5 text-sm text-[#F7E9C7] focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-widest text-[#DCC8A0] font-sans mb-1.5">
            Philosophy Narrative
          </label>
          <textarea
            rows={4}
            value={philosophy.body}
            onChange={(e) => setPhilosophy({ ...philosophy, body: e.target.value })}
            className="w-full bg-[#191715] border border-[#DCC8A0]/25 p-3 text-sm text-[#F7E9C7] focus:outline-none"
          />
        </div>
      </div>

      {/* 3. Founder Profiles Section */}
      <div className="bg-[#220809] border border-[#DCC8A0]/15 p-6 sm:p-8 space-y-6">
        <div className="border-b border-[#DCC8A0]/15 pb-3">
          <h2 className="font-serif text-xl text-[#F7E9C7]">Founder & Leadership Profiles</h2>
          <p className="text-xs text-[#DCC8A0]/70 mt-1">
            Editable founder profiles supporting name, role, portrait image, and biography.
          </p>
        </div>

        {founders.map((founder) => (
          <div key={founder.id} className="p-6 bg-[#191715] border border-[#DCC8A0]/15 space-y-4">
            <div className="flex items-center gap-4 border-b border-[#DCC8A0]/10 pb-4">
              <div className="relative w-14 h-16 bg-[#300E0F] overflow-hidden border border-[#DCC8A0]/20 shrink-0">
                <Image
                  src={founder.portrait_url}
                  alt={founder.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-grow">
                <p className="font-serif text-lg text-[#F7E9C7]">{founder.name}</p>
                <p className="text-xs text-[#DCC8A0]">{founder.role}</p>
              </div>
              <button
                onClick={() => handleSaveFounder(founder)}
                disabled={savingSection === `founder-${founder.id}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#F7E9C7] text-[#4B1718] font-sans text-xs uppercase tracking-wider font-bold hover:bg-[#DCC8A0] transition-colors cursor-pointer"
              >
                <Save className="w-3 h-3" />
                <span>Save</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#DCC8A0] mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={founder.name}
                  onChange={(e) => updateFounderField(founder.id, "name", e.target.value)}
                  className="w-full bg-[#220809] border border-[#DCC8A0]/20 px-3 py-2 text-xs text-[#F7E9C7] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#DCC8A0] mb-1">
                  Role / Title
                </label>
                <input
                  type="text"
                  value={founder.role}
                  onChange={(e) => updateFounderField(founder.id, "role", e.target.value)}
                  className="w-full bg-[#220809] border border-[#DCC8A0]/20 px-3 py-2 text-xs text-[#F7E9C7] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#DCC8A0] mb-1">
                Portrait Image URL
              </label>
              <input
                type="text"
                value={founder.portrait_url}
                onChange={(e) => updateFounderField(founder.id, "portrait_url", e.target.value)}
                className="w-full bg-[#220809] border border-[#DCC8A0]/20 px-3 py-2 text-xs text-[#F7E9C7] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#DCC8A0] mb-1">
                Biography
              </label>
              <textarea
                rows={4}
                value={founder.biography}
                onChange={(e) => updateFounderField(founder.id, "biography", e.target.value)}
                className="w-full bg-[#220809] border border-[#DCC8A0]/20 p-3 text-xs text-[#F7E9C7] focus:outline-none"
              />
            </div>
          </div>
        ))}
      </div>

      {/* 4. Studio Coordinates & Contact Details */}
      <div className="bg-[#220809] border border-[#DCC8A0]/15 p-6 sm:p-8 space-y-5">
        <div className="flex items-center justify-between border-b border-[#DCC8A0]/15 pb-3">
          <h2 className="font-serif text-xl text-[#F7E9C7]">Contact Information & Social Links</h2>
          <button
            onClick={() => handleSaveSection("contact", contact)}
            disabled={savingSection === "contact"}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#F7E9C7] text-[#4B1718] font-sans text-xs uppercase tracking-wider font-bold hover:bg-[#DCC8A0] transition-colors cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{savingSection === "contact" ? "Saving..." : "Save Contact Info"}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-widest text-[#DCC8A0] font-sans mb-1.5">
              Inquiry Email
            </label>
            <input
              type="email"
              value={contact.email}
              onChange={(e) => setContact({ ...contact, email: e.target.value })}
              className="w-full bg-[#191715] border border-[#DCC8A0]/25 px-4 py-2.5 text-sm text-[#F7E9C7] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-[#DCC8A0] font-sans mb-1.5">
              Telephone
            </label>
            <input
              type="text"
              value={contact.phone}
              onChange={(e) => setContact({ ...contact, phone: e.target.value })}
              className="w-full bg-[#191715] border border-[#DCC8A0]/25 px-4 py-2.5 text-sm text-[#F7E9C7] focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-widest text-[#DCC8A0] font-sans mb-1.5">
            Physical Studio Address
          </label>
          <input
            type="text"
            value={contact.address}
            onChange={(e) => setContact({ ...contact, address: e.target.value })}
            className="w-full bg-[#191715] border border-[#DCC8A0]/25 px-4 py-2.5 text-sm text-[#F7E9C7] focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-widest text-[#DCC8A0] font-sans mb-1.5">
              Instagram Profile URL
            </label>
            <input
              type="text"
              value={contact.instagram}
              onChange={(e) => setContact({ ...contact, instagram: e.target.value })}
              className="w-full bg-[#191715] border border-[#DCC8A0]/25 px-4 py-2.5 text-sm text-[#F7E9C7] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-[#DCC8A0] font-sans mb-1.5">
              LinkedIn Profile URL
            </label>
            <input
              type="text"
              value={contact.linkedin}
              onChange={(e) => setContact({ ...contact, linkedin: e.target.value })}
              className="w-full bg-[#191715] border border-[#DCC8A0]/25 px-4 py-2.5 text-sm text-[#F7E9C7] focus:outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
