"use client";

import { useState, FormEvent } from "react";
import Image from "next/image";
import { Mail, Phone, MapPin, CheckCircle2, ArrowRight, AlertCircle } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    inquiry_type: "Residential",
    message: "",
    honeypot: "", // Spam protection honeypot
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    // Spam honeypot trap
    if (formData.honeypot) {
      setSubmitted(true);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          inquiry_type: formData.inquiry_type,
          message: formData.message,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Submission could not be completed.");
      }

      setSubmitted(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        inquiry_type: "Residential",
        message: "",
        honeypot: "",
      });
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to submit inquiry. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#4B1718] text-[#F7E9C7] pt-32 sm:pt-40 pb-28 sm:pb-40 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 sm:px-12">
        {/* Header */}
        <div className="mb-16 sm:mb-24 pb-8 border-b border-[#DCC8A0]/15">
          <span className="text-xs uppercase tracking-[0.35em] text-[#DCC8A0] font-sans font-medium block mb-3">
            Direct Dialogue
          </span>
          <h1 className="font-serif text-5xl sm:text-7xl font-light text-[#F7E9C7] leading-none mb-6">
            Contact the Studio
          </h1>
          <p className="text-base sm:text-xl text-[#F7E9C7]/80 font-serif font-light max-w-2xl leading-relaxed">
            Whether inquiring about a residential sanctuary, a cultural commission, or a site consultation, we welcome your dialogue.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Column: Contact Details & Office Info */}
          <div className="lg:col-span-5 space-y-10">
            <div className="bg-[#300E0F] border border-[#DCC8A0]/20 p-8 sm:p-10 space-y-8 shadow-xl">
              <div className="flex items-center gap-4 border-b border-[#DCC8A0]/15 pb-6">
                <div className="relative w-12 h-12">
                  <Image src="/images/logo-emblem.png" alt="KAIRU KALA Emblem" fill className="object-contain" />
                </div>
                <div>
                  <h3 className="font-serif text-2xl text-[#F7E9C7] font-normal tracking-wide">
                    KAIRU KALA
                  </h3>
                  <span className="text-[10px] uppercase tracking-[0.25em] text-[#DCC8A0]/70 font-sans">
                    Architecture Studio
                  </span>
                </div>
              </div>

              <div className="space-y-6 text-sm font-sans font-light">
                <div className="flex items-start gap-4">
                  <MapPin className="w-5 h-5 text-[#DCC8A0] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs uppercase tracking-widest text-[#DCC8A0]/60 block mb-1">
                      Studio Address
                    </span>
                    <p className="text-[#F7E9C7]">
                      Kairu Kala Studio, 4th Floor, Coastal Crest, Kadri,<br />
                      Mangalore, Karnataka 575003, India
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Mail className="w-5 h-5 text-[#DCC8A0] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs uppercase tracking-widest text-[#DCC8A0]/60 block mb-1">
                      Direct Email
                    </span>
                    <a href="mailto:naman@kairukala.com" className="text-[#F7E9C7] hover:underline">
                      naman@kairukala.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Phone className="w-5 h-5 text-[#DCC8A0] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs uppercase tracking-widest text-[#DCC8A0]/60 block mb-1">
                      Telephone
                    </span>
                    <a href="tel:+919876543210" className="text-[#F7E9C7] hover:underline">
                      +91 98765 43210
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Architectural Coordinates */}
            <div className="relative aspect-[16/9] w-full bg-[#300E0F] border border-[#DCC8A0]/20 overflow-hidden flex items-center justify-center p-6 text-center">
              <div className="absolute inset-0 opacity-20 bg-grid-pattern pointer-events-none" />
              <div className="relative z-10 space-y-2">
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#DCC8A0] font-sans block">
                  Studio Coordinates
                </span>
                <p className="font-serif text-xl sm:text-2xl text-[#F7E9C7]">
                  12.8702° N, 74.8806° E
                </p>
                <p className="text-xs text-[#DCC8A0]/70 font-sans">
                  Mangalore Coastal District • Karnataka, India
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Inquiry Form */}
          <div className="lg:col-span-7 bg-[#300E0F] border border-[#DCC8A0]/20 p-8 sm:p-12 shadow-xl">
            {submitted ? (
              <div className="py-16 text-center space-y-6">
                <CheckCircle2 className="w-16 h-16 text-[#F7E9C7] mx-auto" />
                <h3 className="font-serif text-3xl text-[#F7E9C7] font-light">
                  Your inquiry has been recorded.
                </h3>
                <p className="text-sm sm:text-base text-[#DCC8A0] font-sans max-w-md mx-auto leading-relaxed">
                  Thank you for contacting Kairu Kala. Our architectural team has logged your inquiry in the studio registry and will respond within 24–48 hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-6 px-8 py-3 bg-[#4B1718] border border-[#DCC8A0]/40 text-[#F7E9C7] text-xs uppercase tracking-[0.25em] font-sans hover:border-[#F7E9C7] transition-colors"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <h3 className="font-serif text-2xl text-[#F7E9C7] font-normal mb-6">
                  Architectural Inquiry
                </h3>

                {errorMessage && (
                  <div className="p-4 bg-red-950/60 border border-red-500/40 text-red-200 text-xs sm:text-sm flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 shrink-0 text-red-400" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Honeypot hidden input */}
                <input
                  type="text"
                  name="honeypot"
                  value={formData.honeypot}
                  onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-[#DCC8A0] font-sans mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Ananya Rao"
                      className="w-full bg-[#4B1718] border border-[#DCC8A0]/30 px-4 py-3.5 text-sm text-[#F7E9C7] placeholder-[#DCC8A0]/40 focus:outline-none focus:border-[#F7E9C7]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-widest text-[#DCC8A0] font-sans mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. ananya@example.com"
                      className="w-full bg-[#4B1718] border border-[#DCC8A0]/30 px-4 py-3.5 text-sm text-[#F7E9C7] placeholder-[#DCC8A0]/40 focus:outline-none focus:border-[#F7E9C7]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-[#DCC8A0] font-sans mb-2">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full bg-[#4B1718] border border-[#DCC8A0]/30 px-4 py-3.5 text-sm text-[#F7E9C7] placeholder-[#DCC8A0]/40 focus:outline-none focus:border-[#F7E9C7]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-widest text-[#DCC8A0] font-sans mb-2">
                      Inquiry Typology *
                    </label>
                    <select
                      value={formData.inquiry_type}
                      onChange={(e) => setFormData({ ...formData, inquiry_type: e.target.value as any })}
                      className="w-full bg-[#4B1718] border border-[#DCC8A0]/30 px-4 py-3.5 text-sm text-[#F7E9C7] focus:outline-none focus:border-[#F7E9C7]"
                    >
                      <option value="Residential">Residential Villa / Sanctuary</option>
                      <option value="Cultural">Cultural / Public Institution</option>
                      <option value="Commercial">Commercial / Hospitality</option>
                      <option value="Heritage Restoration">Heritage Restoration</option>
                      <option value="General">General Consultation</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-[#DCC8A0] font-sans mb-2">
                    Project Vision & Spatial Requirements *
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe your site context, geographic location, approximate timeline, and spatial intentions..."
                    className="w-full bg-[#4B1718] border border-[#DCC8A0]/30 p-4 text-sm text-[#F7E9C7] placeholder-[#DCC8A0]/40 focus:outline-none focus:border-[#F7E9C7] resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full group inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#F7E9C7] text-[#4B1718] hover:bg-[#DCC8A0] transition-all duration-300 font-sans text-xs uppercase tracking-[0.3em] font-bold disabled:opacity-50 cursor-pointer shadow-lg"
                >
                  <span>{loading ? "Transmitting..." : "Submit Architectural Inquiry"}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
