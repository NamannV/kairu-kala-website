"use client";

import { useState, FormEvent } from "react";
import Image from "next/image";
import { Project, CarouselSettings } from "@/lib/types";
import { Sliders, Save, CheckCircle2, AlertCircle, Play, Pause, Star } from "lucide-react";

interface CarouselSettingsManagerProps {
  initialSettings: CarouselSettings;
  projects: Project[];
}

export default function CarouselSettingsManager({
  initialSettings,
  projects,
}: CarouselSettingsManagerProps) {
  const [settings, setSettings] = useState<CarouselSettings>(initialSettings);
  const [projectList, setProjectList] = useState<Project[]>(projects);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const toggleFeatured = async (project: Project) => {
    const newFeatured = !project.is_featured;
    try {
      const res = await fetch(`/api/projects/${project.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_featured: newFeatured }),
      });
      if (res.ok) {
        const updated = await res.json();
        setProjectList((prev) => prev.map((p) => (p.id === project.id ? updated : p)));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess(false);

    try {
      const res = await fetch("/api/carousel-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (!res.ok) throw new Error("Failed to update carousel settings.");

      const updated = await res.json();
      setSettings(updated);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to update settings.");
    } finally {
      setSaving(false);
    }
  };

  const featuredProjects = projectList.filter((p) => p.is_featured);

  return (
    <div className="space-y-10 max-w-4xl">
      {/* Header */}
      <div className="pb-6 border-b border-[#DCC8A0]/15">
        <span className="text-xs uppercase tracking-[0.3em] text-[#DCC8A0] block mb-1">
          Signature Interaction Control
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#F7E9C7] font-light">
          3D Perspective Carousel Settings
        </h1>
        <p className="text-xs sm:text-sm text-[#DCC8A0]/80 mt-2 font-sans">
          Configure how the landing page layered architectural carousel behaves, plays, and displays projects.
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
          <span>Carousel settings updated and saved to database!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Playback Controls */}
        <div className="bg-[#220809] border border-[#DCC8A0]/15 p-6 sm:p-8 space-y-6">
          <h2 className="font-serif text-xl text-[#F7E9C7] border-b border-[#DCC8A0]/15 pb-3">
            Playback & Interaction Timing
          </h2>

          <div className="flex items-center justify-between p-4 bg-[#191715] border border-[#DCC8A0]/15">
            <div>
              <span className="text-xs uppercase tracking-wider text-[#F7E9C7] block font-medium">
                Autoplay Transition
              </span>
              <span className="text-[11px] text-[#DCC8A0]/70">
                Automatically advance between architectural panels when the user is idle
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.autoplay_enabled}
                onChange={(e) => setSettings({ ...settings, autoplay_enabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-[#300E0F] peer-focus:outline-none peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#F7E9C7] after:border-gray-300 after:border after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4B1718]"></div>
            </label>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs uppercase tracking-widest text-[#DCC8A0] font-sans">
                Autoplay Interval (Seconds)
              </label>
              <span className="text-xs font-mono text-[#F7E9C7]">
                {(settings.autoplay_interval / 1000).toFixed(1)} seconds
              </span>
            </div>
            <input
              type="range"
              min="3000"
              max="15000"
              step="500"
              value={settings.autoplay_interval}
              onChange={(e) =>
                setSettings({ ...settings, autoplay_interval: parseInt(e.target.value, 10) })
              }
              className="w-full accent-[#DCC8A0] bg-[#191715]"
            />
            <div className="flex justify-between text-[10px] text-[#DCC8A0]/50 font-mono mt-1">
              <span>3.0s</span>
              <span>6.0s</span>
              <span>10.0s</span>
              <span>15.0s</span>
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-[#DCC8A0] font-sans mb-2">
              Initial Active Project Upon Page Load
            </label>
            <select
              value={settings.initial_project_id || ""}
              onChange={(e) => setSettings({ ...settings, initial_project_id: e.target.value })}
              className="w-full bg-[#191715] border border-[#DCC8A0]/25 px-4 py-3 text-sm text-[#F7E9C7] focus:outline-none"
            >
              <option value="">Default (First in Order)</option>
              {projectList.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title} ({p.location})
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#F7E9C7] text-[#4B1718] font-sans text-xs uppercase tracking-[0.2em] font-bold hover:bg-[#DCC8A0] transition-colors disabled:opacity-50 cursor-pointer shadow-md"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Saving Settings..." : "Save Carousel Settings"}</span>
          </button>
        </div>

        {/* Featured Projects Selection in 3D Carousel */}
        <div className="bg-[#220809] border border-[#DCC8A0]/15 p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-[#DCC8A0]/15 pb-3">
            <div>
              <h2 className="font-serif text-xl text-[#F7E9C7]">
                Featured Projects Selection
              </h2>
              <p className="text-xs text-[#DCC8A0]/70 mt-1">
                Currently featuring {featuredProjects.length} projects. (3 to 5 projects recommended for the signature perspective composition)
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {projectList.map((project) => (
              <div
                key={project.id}
                className="flex items-center justify-between p-3.5 bg-[#191715] border border-[#DCC8A0]/15 hover:border-[#DCC8A0]/30 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="relative w-12 h-10 bg-[#300E0F] overflow-hidden border border-[#DCC8A0]/20 shrink-0">
                    <Image
                      src={project.cover_image_url}
                      alt={project.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium text-xs sm:text-sm text-[#F7E9C7]">{project.title}</p>
                    <p className="text-[10px] text-[#DCC8A0]/70">
                      {project.category} · {project.location} · {project.year}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => toggleFeatured(project)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] uppercase tracking-wider border transition-colors cursor-pointer ${
                    project.is_featured
                      ? "bg-[#DCC8A0] text-[#4B1718] border-[#DCC8A0] font-bold"
                      : "bg-transparent text-[#DCC8A0]/60 border-[#DCC8A0]/30 hover:border-[#DCC8A0]"
                  }`}
                >
                  <Star className={`w-3.5 h-3.5 ${project.is_featured ? "fill-[#4B1718]" : ""}`} />
                  <span>{project.is_featured ? "Featured" : "Add to Carousel"}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
}
