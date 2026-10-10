"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Project, ProjectCategory, ProjectImage } from "@/lib/types";
import {
  ArrowLeft,
  Upload,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Eye,
  Save,
  Image as ImageIcon
} from "lucide-react";

interface ProjectFormProps {
  initialProject?: Project;
  isEditing?: boolean;
}

export default function ProjectForm({ initialProject, isEditing = false }: ProjectFormProps) {
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: initialProject?.title || "",
    slug: initialProject?.slug || "",
    location: initialProject?.location || "Mangalore, India",
    year: initialProject?.year || new Date().getFullYear().toString(),
    category: (initialProject?.category || "Residential") as ProjectCategory,
    short_description: initialProject?.short_description || "",
    description: initialProject?.description || "",
    cover_image_url: initialProject?.cover_image_url || "/images/projects/coastal-cantilever.jpg",
    is_featured: initialProject?.is_featured ?? false,
    is_published: initialProject?.is_published ?? true,
    display_order: initialProject?.display_order || 1,
  });

  // Specifications list
  const [specs, setSpecs] = useState<string[]>(
    Array.isArray(initialProject?.specifications)
      ? (initialProject?.specifications as string[])
      : [
          "Area: 5,000 sq.ft",
          "Structure: Post-tensioned board-formed concrete",
          "Finishes: Regional terracotta & basalt stone",
        ]
  );
  const [newSpec, setNewSpec] = useState("");

  // Gallery and drawings images
  const [images, setImages] = useState<ProjectImage[]>(initialProject?.images || []);

  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Auto-generate slug from title if new project
  const handleTitleChange = (val: string) => {
    setFormData((prev) => {
      const updated = { ...prev, title: val };
      if (!isEditing) {
        updated.slug = val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "");
      }
      return updated;
    });
  };

  // Upload cover image
  const handleCoverUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCover(true);
    setError("");

    try {
      const data = new FormData();
      data.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: data,
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Upload failed");

      setFormData((prev) => ({ ...prev, cover_image_url: json.url }));
    } catch (err: any) {
      setError("Cover image upload failed: " + err.message);
    } finally {
      setUploadingCover(false);
    }
  };

  // Upload gallery image
  const handleGalleryUpload = async (e: ChangeEvent<HTMLInputElement>, imageType: "gallery" | "drawing" = "gallery") => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingGallery(true);
    setError("");

    try {
      const data = new FormData();
      data.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: data,
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Upload failed");

      const newImage: ProjectImage = {
        id: "img-" + Date.now(),
        project_id: initialProject?.id || "",
        image_url: json.url,
        alt_text: formData.title,
        caption: "",
        image_type: imageType,
        display_order: images.length + 1,
      };

      setImages((prev) => [...prev, newImage]);
    } catch (err: any) {
      setError("Image upload failed: " + err.message);
    } finally {
      setUploadingGallery(false);
    }
  };

  const removeImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const addSpec = () => {
    if (!newSpec.trim()) return;
    setSpecs((prev) => [...prev, newSpec.trim()]);
    setNewSpec("");
  };

  const removeSpec = (index: number) => {
    setSpecs((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess(false);

    try {
      const payload = {
        ...formData,
        specifications: specs,
        images,
      };

      const url = isEditing && initialProject?.id
        ? `/api/projects/${initialProject.id}`
        : "/api/projects";

      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to save project");

      setSuccess(true);
      setTimeout(() => {
        router.push("/admin/projects");
        router.refresh();
      }, 800);
    } catch (err: any) {
      setError(err.message || "Failed to save project.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-10 max-w-5xl">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#DCC8A0]/15">
        <div>
          <Link
            href="/admin/projects"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#DCC8A0] hover:text-[#F7E9C7] transition-colors mb-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Project List
          </Link>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#F7E9C7] font-light">
            {isEditing ? `Edit: ${initialProject?.title}` : "Add New Project"}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#F7E9C7] text-[#4B1718] font-sans text-xs uppercase tracking-[0.2em] font-bold hover:bg-[#DCC8A0] transition-colors disabled:opacity-50 cursor-pointer shadow-md"
          >
            <Save className="w-4 h-4" />
            <span>{submitting ? "Saving Changes..." : isEditing ? "Update Project" : "Create Project"}</span>
          </button>
        </div>
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
          <span>Project saved successfully! Redirecting...</span>
        </div>
      )}

      {/* Grid: Main Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Core Fields */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-[#220809] border border-[#DCC8A0]/15 p-6 sm:p-8 space-y-5">
            <h2 className="font-serif text-xl text-[#F7E9C7] border-b border-[#DCC8A0]/15 pb-3">
              Core Architectural Details
            </h2>

            <div>
              <label className="block text-xs uppercase tracking-widest text-[#DCC8A0] font-sans mb-2">
                Project Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. Residence 01 — Coastal Cantilever"
                className="w-full bg-[#191715] border border-[#DCC8A0]/25 px-4 py-3 text-sm text-[#F7E9C7] focus:outline-none focus:border-[#F7E9C7]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-widest text-[#DCC8A0] font-sans mb-2">
                  URL Slug *
                </label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="coastal-cantilever"
                  className="w-full bg-[#191715] border border-[#DCC8A0]/25 px-4 py-3 text-sm text-[#F7E9C7] font-mono focus:outline-none focus:border-[#F7E9C7]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-[#DCC8A0] font-sans mb-2">
                  Typology *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as ProjectCategory })}
                  className="w-full bg-[#191715] border border-[#DCC8A0]/25 px-4 py-3 text-sm text-[#F7E9C7] focus:outline-none focus:border-[#F7E9C7]"
                >
                  <option value="Residential">Residential</option>
                  <option value="Cultural">Cultural</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Heritage Restoration">Heritage Restoration</option>
                  <option value="Hospitality">Hospitality</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-widest text-[#DCC8A0] font-sans mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g. Mangalore, India"
                  className="w-full bg-[#191715] border border-[#DCC8A0]/25 px-4 py-3 text-sm text-[#F7E9C7] focus:outline-none focus:border-[#F7E9C7]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-[#DCC8A0] font-sans mb-2">
                  Year of Completion *
                </label>
                <input
                  type="text"
                  required
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  placeholder="2026"
                  className="w-full bg-[#191715] border border-[#DCC8A0]/25 px-4 py-3 text-sm text-[#F7E9C7] focus:outline-none focus:border-[#F7E9C7]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-[#DCC8A0] font-sans mb-2">
                Short Description (Carousel & Cards)
              </label>
              <textarea
                rows={2}
                value={formData.short_description}
                onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                placeholder="A brief 1-2 sentence synopsis of the spatial intention..."
                className="w-full bg-[#191715] border border-[#DCC8A0]/25 p-3 text-sm text-[#F7E9C7] focus:outline-none focus:border-[#F7E9C7] resize-none"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-[#DCC8A0] font-sans mb-2">
                Full Architectural Description
              </label>
              <textarea
                rows={6}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Comprehensive text detailing the concept, site context, passive strategies, and materiality..."
                className="w-full bg-[#191715] border border-[#DCC8A0]/25 p-3 text-sm text-[#F7E9C7] focus:outline-none focus:border-[#F7E9C7]"
              />
            </div>
          </div>

          {/* Specifications Builder */}
          <div className="bg-[#220809] border border-[#DCC8A0]/15 p-6 sm:p-8 space-y-4">
            <h2 className="font-serif text-xl text-[#F7E9C7] border-b border-[#DCC8A0]/15 pb-3">
              Spatial Specifications & Materiality
            </h2>

            <div className="space-y-2">
              {specs.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 bg-[#191715] border border-[#DCC8A0]/15 text-xs">
                  <span>{item}</span>
                  <button
                    type="button"
                    onClick={() => removeSpec(idx)}
                    className="text-red-400 hover:text-red-300 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-2">
              <input
                type="text"
                value={newSpec}
                onChange={(e) => setNewSpec(e.target.value)}
                placeholder="e.g. Area: 4,800 sq.ft or Material: Reclaimed Teak"
                className="flex-grow bg-[#191715] border border-[#DCC8A0]/25 px-3 py-2 text-xs text-[#F7E9C7] focus:outline-none focus:border-[#F7E9C7]"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addSpec();
                  }
                }}
              />
              <button
                type="button"
                onClick={addSpec}
                className="px-4 py-2 bg-[#300E0F] border border-[#DCC8A0]/30 text-xs text-[#F7E9C7] hover:bg-[#4B1718]"
              >
                Add Spec
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Imagery & Publishing Controls */}
        <div className="lg:col-span-4 space-y-6">
          {/* Publication Status & Carousel Toggle */}
          <div className="bg-[#220809] border border-[#DCC8A0]/15 p-6 space-y-4">
            <h3 className="font-serif text-lg text-[#F7E9C7] border-b border-[#DCC8A0]/15 pb-2">
              Status & Visibility
            </h3>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_published}
                onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                className="w-4 h-4 rounded border-[#DCC8A0]/30 text-[#4B1718] focus:ring-0"
              />
              <div>
                <span className="text-xs uppercase tracking-wider text-[#F7E9C7] block">Publish Publicly</span>
                <span className="text-[10px] text-[#DCC8A0]/60">Make visible on /projects portfolio</span>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer pt-2 border-t border-[#DCC8A0]/10">
              <input
                type="checkbox"
                checked={formData.is_featured}
                onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                className="w-4 h-4 rounded border-[#DCC8A0]/30 text-[#4B1718] focus:ring-0"
              />
              <div>
                <span className="text-xs uppercase tracking-wider text-[#F7E9C7] block">Feature in 3D Carousel</span>
                <span className="text-[10px] text-[#DCC8A0]/60">Display on signature landing page</span>
              </div>
            </label>

            <div className="pt-2 border-t border-[#DCC8A0]/10">
              <label className="block text-xs uppercase tracking-widest text-[#DCC8A0] font-sans mb-1">
                Display Order Sequence
              </label>
              <input
                type="number"
                value={formData.display_order}
                onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value, 10) || 1 })}
                className="w-full bg-[#191715] border border-[#DCC8A0]/25 px-3 py-2 text-xs text-[#F7E9C7] focus:outline-none"
              />
            </div>
          </div>

          {/* Cover Image Uploader */}
          <div className="bg-[#220809] border border-[#DCC8A0]/15 p-6 space-y-4">
            <h3 className="font-serif text-lg text-[#F7E9C7] border-b border-[#DCC8A0]/15 pb-2">
              Cover Image *
            </h3>

            {formData.cover_image_url ? (
              <div className="relative aspect-[4/3] w-full bg-[#191715] overflow-hidden border border-[#DCC8A0]/25">
                <Image
                  src={formData.cover_image_url}
                  alt="Cover Preview"
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="aspect-[4/3] w-full bg-[#191715] border border-dashed border-[#DCC8A0]/30 flex flex-col items-center justify-center text-xs text-[#DCC8A0]/50 p-4 text-center">
                <ImageIcon className="w-8 h-8 mb-2" />
                <span>No cover image selected</span>
              </div>
            )}

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#DCC8A0] mb-1">
                Upload New Image File:
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleCoverUpload}
                disabled={uploadingCover}
                className="w-full text-xs text-[#DCC8A0] file:mr-3 file:py-1.5 file:px-3 file:border-0 file:text-xs file:bg-[#300E0F] file:text-[#F7E9C7] hover:file:bg-[#4B1718] cursor-pointer"
              />
              {uploadingCover && <p className="text-[10px] text-[#DCC8A0] mt-1">Uploading...</p>}
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#DCC8A0] mb-1">
                Or Paste Image URL:
              </label>
              <input
                type="text"
                value={formData.cover_image_url}
                onChange={(e) => setFormData({ ...formData, cover_image_url: e.target.value })}
                className="w-full bg-[#191715] border border-[#DCC8A0]/25 px-3 py-2 text-xs text-[#F7E9C7]"
              />
            </div>
          </div>

          {/* Gallery Images List */}
          <div className="bg-[#220809] border border-[#DCC8A0]/15 p-6 space-y-4">
            <h3 className="font-serif text-lg text-[#F7E9C7] border-b border-[#DCC8A0]/15 pb-2">
              Gallery Images & Drawings ({images.length})
            </h3>

            <div className="space-y-3 max-h-64 overflow-y-auto">
              {images.map((img) => (
                <div key={img.id} className="flex items-center gap-3 p-2 bg-[#191715] border border-[#DCC8A0]/15">
                  <div className="relative w-12 h-10 bg-[#300E0F] shrink-0">
                    <Image src={img.image_url} alt="Gallery item" fill className="object-cover" />
                  </div>
                  <div className="flex-grow overflow-hidden text-[10px]">
                    <span className="uppercase tracking-wider text-[#DCC8A0] block">{img.image_type}</span>
                    <span className="text-[#F7E9C7]/70 truncate block">{img.image_url}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeImage(img.id)}
                    className="text-red-400 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="space-y-2 pt-2 border-t border-[#DCC8A0]/10">
              <label className="block text-[11px] uppercase tracking-wider text-[#DCC8A0]">
                Add Gallery Photo:
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleGalleryUpload(e, "gallery")}
                disabled={uploadingGallery}
                className="w-full text-xs text-[#DCC8A0] file:mr-3 file:py-1.5 file:px-3 file:border-0 file:text-xs file:bg-[#300E0F] file:text-[#F7E9C7] hover:file:bg-[#4B1718] cursor-pointer"
              />

              <label className="block text-[11px] uppercase tracking-wider text-[#DCC8A0] pt-2">
                Add Floor Plan / Drawing:
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleGalleryUpload(e, "drawing")}
                disabled={uploadingGallery}
                className="w-full text-xs text-[#DCC8A0] file:mr-3 file:py-1.5 file:px-3 file:border-0 file:text-xs file:bg-[#300E0F] file:text-[#F7E9C7] hover:file:bg-[#4B1718] cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
