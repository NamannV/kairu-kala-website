import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, MapPin, Calendar, Layers, CheckCircle2 } from "lucide-react";
import { getProjectBySlug, getProjects } from "@/lib/db";
import { urlForImage } from "@/lib/sanity/image";

export const revalidate = 0;

interface ProjectDetailProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ProjectDetailProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return {
      title: "Project Not Found — KAIRU KALA",
    };
  }

  return {
    title: `${project.title} — KAIRU KALA Architecture`,
    description: project.short_description || project.description.slice(0, 160),
    openGraph: {
      title: `${project.title} | KAIRU KALA`,
      description: project.short_description || project.description.slice(0, 160),
      images: [{ url: urlForImage(project.cover_image || project.cover_image_url) }],
    },
  };
}

export default async function ProjectDetailPage({ params }: ProjectDetailProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  // Get all published projects for prev/next navigation
  const allProjects = await getProjects({ onlyPublished: true });
  const currentIndex = allProjects.findIndex((p) => p.slug === slug);
  const prevProject =
    allProjects.length > 1
      ? allProjects[(currentIndex - 1 + allProjects.length) % allProjects.length]
      : null;
  const nextProject =
    allProjects.length > 1 ? allProjects[(currentIndex + 1) % allProjects.length] : null;

  // Process specifications array or object
  const specs = Array.isArray(project.specifications)
    ? project.specifications
    : typeof project.specifications === "object" && project.specifications !== null
    ? Object.entries(project.specifications).map(([k, v]) => `${k}: ${v}`)
    : [];

  const galleryImages = project.images?.filter((img) => img.image_type === "gallery") || [];
  const drawingImages = project.images?.filter((img) => img.image_type === "drawing" || img.image_type === "plan") || [];

  return (
    <article className="bg-[#4B1718] text-[#F7E9C7] pt-32 sm:pt-40 pb-28 sm:pb-40 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 sm:px-12">
        {/* Back button navigation */}
        <div className="mb-10">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#DCC8A0] hover:text-[#F7E9C7] transition-colors font-sans font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Portfolio</span>
          </Link>
        </div>

        {/* Header Metadata Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-12 border-b border-[#DCC8A0]/15">
          <div className="lg:col-span-8">
            <span className="text-xs uppercase tracking-[0.35em] text-[#DCC8A0] font-sans font-medium block mb-3">
              {project.category} Architecture
            </span>
            <h1 className="font-serif text-4xl sm:text-6xl font-light text-[#F7E9C7] leading-tight mb-4">
              {project.title}
            </h1>
            {project.short_description && (
              <p className="font-serif text-xl sm:text-2xl text-[#DCC8A0] font-light leading-relaxed">
                {project.short_description}
              </p>
            )}
          </div>

          {/* Right Meta Column */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-6 text-xs uppercase tracking-[0.2em] font-sans border-t lg:border-t-0 lg:border-l border-[#DCC8A0]/15 pt-6 lg:pt-0 lg:pl-8">
            <div>
              <span className="text-[#DCC8A0]/60 block mb-1 text-[10px] flex items-center gap-1">
                <MapPin className="w-3 h-3" /> Location
              </span>
              <span className="text-[#F7E9C7] font-medium">{project.location}</span>
            </div>
            <div>
              <span className="text-[#DCC8A0]/60 block mb-1 text-[10px] flex items-center gap-1">
                <Calendar className="w-3 h-3" /> Year
              </span>
              <span className="text-[#F7E9C7] font-medium">{project.year}</span>
            </div>
            <div>
              <span className="text-[#DCC8A0]/60 block mb-1 text-[10px] flex items-center gap-1">
                <Layers className="w-3 h-3" /> Typology
              </span>
              <span className="text-[#F7E9C7] font-medium">{project.category}</span>
            </div>
            <div>
              <span className="text-[#DCC8A0]/60 block mb-1 text-[10px]">Status</span>
              <span className="text-[#F7E9C7] font-medium">Completed</span>
            </div>
          </div>
        </div>

        {/* Hero Architectural Cover Photograph */}
        <div className="my-12 sm:my-16 overflow-hidden relative aspect-[16/9] bg-[#300E0F] shadow-2xl">
          <Image
            src={urlForImage(project.cover_image || project.cover_image_url)}
            alt={project.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>

        {/* Editorial Text & Specifications Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 py-12 border-y border-[#DCC8A0]/15">
          {/* Specifications Sidebar */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <h2 className="font-serif text-3xl font-light text-[#F7E9C7] mb-4">
                Spatial Details
              </h2>
              <p className="text-sm text-[#DCC8A0]/80 font-sans leading-relaxed">
                Tectonic parameters and architectural specifications calibrated to environmental and cultural conditions.
              </p>
            </div>

            {specs.length > 0 && (
              <div className="pt-4 border-t border-[#DCC8A0]/15">
                <h3 className="text-xs uppercase tracking-[0.25em] text-[#DCC8A0] font-sans font-semibold mb-4">
                  Project Specifications
                </h3>
                <ul className="space-y-3 text-xs sm:text-sm text-[#F7E9C7]/90 font-sans tracking-wide">
                  {specs.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#DCC8A0] shrink-0 mt-0.5" />
                      <span>{typeof item === "string" ? item : (item as any)?.value ? `${(item as any).label ? (item as any).label + ': ' : ''}${(item as any).value}` : JSON.stringify(item)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Full Project Description */}
          <div className="lg:col-span-7 space-y-6 text-base sm:text-lg text-[#F7E9C7]/90 font-light leading-relaxed">
            <h2 className="font-serif text-3xl font-light text-[#F7E9C7] mb-2">
              Architectural Concept
            </h2>
            <div className="whitespace-pre-line space-y-4">
              {project.description}
            </div>
          </div>
        </div>

        {/* Photographic Documentation Gallery */}
        {galleryImages.length > 0 && (
          <div className="my-16 space-y-8">
            <h2 className="font-serif text-3xl font-light text-[#F7E9C7]">
              Photographic Documentation
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {galleryImages.map((img) => (
                <div key={img.id} className="relative aspect-[4/3] bg-[#300E0F] overflow-hidden group">
                  <Image
                    src={urlForImage(img.asset ? img : img.image_url)}
                    alt={img.alt_text || project.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {img.caption && (
                    <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-[#300E0F]/90 to-transparent text-xs text-[#DCC8A0] font-sans">
                      {img.caption}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Architectural Drawings / Floor Plans Section */}
        {drawingImages.length > 0 && (
          <div className="my-16 space-y-8 pt-8 border-t border-[#DCC8A0]/15">
            <h2 className="font-serif text-3xl font-light text-[#F7E9C7]">
              Architectural Plans & Section Drawings
            </h2>
            <div className="grid grid-cols-1 gap-8">
              {drawingImages.map((img) => (
                <div key={img.id} className="relative aspect-[16/9] bg-[#300E0F] p-4 border border-[#DCC8A0]/20">
                  <Image
                    src={urlForImage(img.asset ? img : img.image_url)}
                    alt={img.alt_text || "Architectural Drawing"}
                    fill
                    sizes="100vw"
                    className="object-contain"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Prev / Next Project Navigation */}
        {(prevProject || nextProject) && (
          <div className="pt-16 border-t border-[#DCC8A0]/15 grid grid-cols-1 sm:grid-cols-2 gap-8">
            {prevProject && (
              <Link
                href={`/projects/${prevProject.slug}`}
                className="group flex flex-col p-6 border border-[#DCC8A0]/20 hover:border-[#F7E9C7] transition-all bg-[#300E0F]"
              >
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#DCC8A0] font-sans flex items-center gap-2 mb-2">
                  <ArrowLeft className="w-3.5 h-3.5" /> Previous Project
                </span>
                <span className="font-serif text-xl text-[#F7E9C7] group-hover:text-[#DCC8A0] transition-colors">
                  {prevProject.title}
                </span>
              </Link>
            )}

            {nextProject && (
              <Link
                href={`/projects/${nextProject.slug}`}
                className="group flex flex-col p-6 border border-[#DCC8A0]/20 hover:border-[#F7E9C7] transition-all bg-[#300E0F] text-right"
              >
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#DCC8A0] font-sans flex items-center justify-end gap-2 mb-2">
                  Next Project <ArrowRight className="w-3.5 h-3.5" />
                </span>
                <span className="font-serif text-xl text-[#F7E9C7] group-hover:text-[#DCC8A0] transition-colors">
                  {nextProject.title}
                </span>
              </Link>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
