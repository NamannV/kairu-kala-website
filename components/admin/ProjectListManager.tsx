"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Project } from "@/lib/types";
import {
  PlusCircle,
  Search,
  CheckCircle2,
  XCircle,
  Star,
  Edit,
  Trash2,
  ExternalLink,
  ArrowUpDown,
  AlertTriangle
} from "lucide-react";

interface ProjectListManagerProps {
  initialProjects: Project[];
}

export default function ProjectListManager({ initialProjects }: ProjectListManagerProps) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const filteredProjects = projects.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.location.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  const togglePublish = async (project: Project) => {
    setLoadingAction(`publish-${project.id}`);
    try {
      const res = await fetch(`/api/projects/${project.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_published: !project.is_published }),
      });
      if (res.ok) {
        const updated = await res.json();
        setProjects((prev) => prev.map((p) => (p.id === project.id ? updated : p)));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAction(null);
    }
  };

  const toggleFeatured = async (project: Project) => {
    setLoadingAction(`featured-${project.id}`);
    try {
      const res = await fetch(`/api/projects/${project.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_featured: !project.is_featured }),
      });
      if (res.ok) {
        const updated = await res.json();
        setProjects((prev) => prev.map((p) => (p.id === project.id ? updated : p)));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleDelete = async (id: string) => {
    setLoadingAction(`delete-${id}`);
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setProjects((prev) => prev.filter((p) => p.id !== id));
        setDeletingId(null);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#DCC8A0]/15">
        <div>
          <span className="text-xs uppercase tracking-[0.3em] text-[#DCC8A0] block mb-1">
            Portfolio Management
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#F7E9C7] font-light">
            All Projects ({projects.length})
          </h1>
        </div>

        <Link
          href="/admin/projects/new"
          className="inline-flex items-center gap-2 px-5 py-3 bg-[#F7E9C7] text-[#4B1718] font-sans text-xs uppercase tracking-[0.2em] font-bold hover:bg-[#DCC8A0] transition-colors self-start sm:self-auto shadow-md"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Project</span>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-[#DCC8A0]/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter by project title, location, or typology..."
          className="w-full bg-[#220809] border border-[#DCC8A0]/25 pl-10 pr-4 py-2.5 text-xs text-[#F7E9C7] placeholder-[#DCC8A0]/40 focus:outline-none focus:border-[#F7E9C7]"
        />
      </div>

      {/* Projects Table */}
      <div className="bg-[#220809] border border-[#DCC8A0]/15 overflow-x-auto shadow-xl">
        <table className="w-full text-left text-xs font-sans">
          <thead className="bg-[#300E0F] text-[#DCC8A0] uppercase tracking-wider border-b border-[#DCC8A0]/15">
            <tr>
              <th className="p-4">Cover</th>
              <th className="p-4">Title & Slug</th>
              <th className="p-4">Typology</th>
              <th className="p-4">Location / Year</th>
              <th className="p-4 text-center">Carousel</th>
              <th className="p-4 text-center">Publication</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#DCC8A0]/10 text-[#F7E9C7]">
            {filteredProjects.map((project) => (
              <tr key={project.id} className="hover:bg-[#300E0F]/40 transition-colors">
                <td className="p-4">
                  <div className="relative w-14 h-12 bg-[#300E0F] overflow-hidden border border-[#DCC8A0]/20">
                    <Image
                      src={project.cover_image_url}
                      alt={project.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </td>

                <td className="p-4">
                  <p className="font-medium text-sm text-[#F7E9C7]">{project.title}</p>
                  <p className="text-[10px] text-[#DCC8A0]/70 font-mono">/projects/{project.slug}</p>
                </td>

                <td className="p-4 text-[#DCC8A0]">{project.category}</td>
                <td className="p-4">
                  <p>{project.location}</p>
                  <p className="text-[10px] text-[#DCC8A0]/60">{project.year}</p>
                </td>

                {/* Toggle Featured in 3D Carousel */}
                <td className="p-4 text-center">
                  <button
                    onClick={() => toggleFeatured(project)}
                    disabled={loadingAction === `featured-${project.id}`}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 text-[10px] uppercase tracking-wider border transition-colors ${
                      project.is_featured
                        ? "bg-[#DCC8A0]/20 text-[#F7E9C7] border-[#DCC8A0]/50"
                        : "text-[#DCC8A0]/40 border-transparent hover:border-[#DCC8A0]/30"
                    }`}
                  >
                    <Star className={`w-3 h-3 ${project.is_featured ? "fill-[#DCC8A0] text-[#DCC8A0]" : ""}`} />
                    <span>{project.is_featured ? "Featured" : "No"}</span>
                  </button>
                </td>

                {/* Toggle Published */}
                <td className="p-4 text-center">
                  <button
                    onClick={() => togglePublish(project)}
                    disabled={loadingAction === `publish-${project.id}`}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 text-[10px] uppercase tracking-wider border transition-colors ${
                      project.is_published
                        ? "bg-emerald-950/60 text-emerald-300 border-emerald-500/40"
                        : "bg-amber-950/60 text-amber-300 border-amber-500/40"
                    }`}
                  >
                    {project.is_published ? (
                      <>
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        <span>Live</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3 h-3 text-amber-400" />
                        <span>Draft</span>
                      </>
                    )}
                  </button>
                </td>

                {/* Action Buttons */}
                <td className="p-4 text-right space-x-2">
                  <Link
                    href={`/projects/${project.slug}`}
                    target="_blank"
                    className="p-1.5 inline-block text-[#DCC8A0]/70 hover:text-[#F7E9C7] transition-colors"
                    title="View Public Page"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>

                  <Link
                    href={`/admin/projects/${project.id}/edit`}
                    className="p-1.5 inline-block text-[#DCC8A0] hover:text-[#F7E9C7] transition-colors"
                    title="Edit Project"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>

                  <button
                    onClick={() => setDeletingId(project.id)}
                    className="p-1.5 inline-block text-red-400/70 hover:text-red-300 transition-colors"
                    title="Delete Project"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredProjects.length === 0 && (
          <div className="p-8 text-center text-xs text-[#DCC8A0]/60">
            No projects found matching &ldquo;{search}&rdquo;.
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#300E0F] border border-red-500/40 p-6 sm:p-8 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-red-400">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="font-serif text-xl text-[#F7E9C7]">Confirm Project Deletion</h3>
            </div>
            <p className="text-xs text-[#DCC8A0] leading-relaxed">
              Are you sure you want to permanently delete this project from the database? This action will remove it from the portfolio and the landing carousel.
            </p>
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#DCC8A0]/15">
              <button
                onClick={() => setDeletingId(null)}
                className="px-4 py-2 border border-[#DCC8A0]/30 text-xs uppercase tracking-wider text-[#F7E9C7] hover:border-[#F7E9C7]"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deletingId)}
                disabled={loadingAction === `delete-${deletingId}`}
                className="px-4 py-2 bg-red-800 text-white text-xs uppercase tracking-wider font-bold hover:bg-red-700 disabled:opacity-50"
              >
                {loadingAction === `delete-${deletingId}` ? "Deleting..." : "Delete Permanently"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
