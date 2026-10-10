"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, ArrowUpDown, Filter } from "lucide-react";
import { Project } from "@/lib/types";
import { urlForImage } from "@/lib/sanity/image";

interface ProjectsPortfolioProps {
  initialProjects: Project[];
}

export default function ProjectsPortfolio({ initialProjects }: ProjectsPortfolioProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  // Extract unique categories dynamically from projects
  const categories = useMemo(() => {
    const set = new Set<string>();
    initialProjects.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return ["ALL", ...Array.from(set)];
  }, [initialProjects]);

  const filteredAndSortedProjects = useMemo(() => {
    let list = selectedCategory === "ALL"
      ? [...initialProjects]
      : initialProjects.filter((p) => p.category === selectedCategory);

    list.sort((a, b) => {
      const yearA = parseInt(a.year, 10) || 0;
      const yearB = parseInt(b.year, 10) || 0;
      return sortOrder === "newest" ? yearB - yearA : yearA - yearB;
    });

    return list;
  }, [initialProjects, selectedCategory, sortOrder]);

  return (
    <div className="bg-[#4B1718] text-[#F7E9C7] pt-32 sm:pt-40 pb-28 sm:pb-40 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 sm:px-12">
        {/* Page Header */}
        <div className="mb-14 sm:mb-20 pb-8 border-b border-[#DCC8A0]/15">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <span className="text-xs uppercase tracking-[0.35em] text-[#DCC8A0] font-sans font-medium block mb-3">
                Selected Portfolio
              </span>
              <h1 className="font-serif text-5xl sm:text-7xl font-light text-[#F7E9C7] leading-none mb-4">
                Architectural Works
              </h1>
              <p className="text-base sm:text-xl text-[#F7E9C7]/80 font-serif font-light max-w-2xl leading-relaxed">
                A database-driven portfolio of built forms, spatial sanctuaries, and restored ancestral spaces.
              </p>
            </div>

            {/* Sort Controls */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSortOrder(prev => prev === "newest" ? "oldest" : "newest")}
                className="inline-flex items-center gap-2 px-4 py-2.5 border border-[#DCC8A0]/30 text-xs uppercase tracking-[0.2em] font-sans text-[#F7E9C7] hover:border-[#F7E9C7] transition-colors"
                aria-label={`Sort by year: currently ${sortOrder}`}
              >
                <ArrowUpDown className="w-3.5 h-3.5 text-[#DCC8A0]" />
                <span>Year: {sortOrder === "newest" ? "Newest First" : "Oldest First"}</span>
              </button>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2.5 mt-8">
            <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.2em] text-[#DCC8A0]/60 mr-2 font-sans">
              <Filter className="w-3 h-3" /> Filter:
            </span>
            {categories.map((category) => {
              const isActive = selectedCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 sm:px-5 py-2 text-xs uppercase tracking-[0.2em] font-sans font-medium transition-all duration-300 border ${
                    isActive
                      ? "bg-[#F7E9C7] text-[#4B1718] border-[#F7E9C7] shadow-md"
                      : "bg-transparent text-[#F7E9C7]/75 border-[#DCC8A0]/25 hover:border-[#F7E9C7] hover:text-[#F7E9C7]"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Project Portfolio Grid */}
        {filteredAndSortedProjects.length === 0 ? (
          <div className="py-24 text-center">
            <p className="font-serif text-2xl text-[#DCC8A0]">No projects found matching the selected filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 sm:gap-14">
            <AnimatePresence mode="popLayout">
              {filteredAndSortedProjects.map((project, index) => {
                // Editorial composition: First is wide (12 cols), next two are half (6 cols each)
                const isLarge = index % 3 === 0;
                const spanClass = isLarge ? "md:col-span-12" : "md:col-span-6";
                const aspectClass = isLarge ? "aspect-[21/9]" : "aspect-[4/3]";

                return (
                  <motion.article
                    key={project.id}
                    layout
                    initial={{ opacity: 0, y: 25 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    className={`${spanClass} group cursor-pointer`}
                  >
                    <Link href={`/projects/${project.slug}`} className="block space-y-4">
                      {/* Image Container with Hover Scale */}
                      <div className={`overflow-hidden relative ${aspectClass} bg-[#300E0F]`}>
                        <Image
                          src={urlForImage(project.cover_image || project.cover_image_url)}
                          alt={project.title}
                          fill
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                          sizes={isLarge ? "100vw" : "(max-width: 768px) 100vw, 50vw"}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#4B1718]/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        {/* Corner Indicator */}
                        <div className="absolute top-4 right-4 bg-[#4B1718]/90 border border-[#DCC8A0]/30 p-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <ArrowUpRight className="w-4 h-4 text-[#F7E9C7]" />
                        </div>
                      </div>

                      {/* Metadata & Title */}
                      <div className="space-y-2 group-hover:translate-x-1 transition-transform duration-300">
                        <div className="flex items-center justify-between text-xs tracking-widest text-[#DCC8A0]/80 uppercase font-sans border-b border-[#DCC8A0]/15 pb-2">
                          <span>{project.category}</span>
                          <span>{project.year}</span>
                        </div>

                        <div className="flex items-baseline justify-between pt-1">
                          <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#F7E9C7] group-hover:text-[#DCC8A0] transition-colors">
                            {project.title}
                          </h2>
                        </div>

                        <div className="flex items-center justify-between text-xs tracking-[0.2em] text-[#DCC8A0]/70 font-sans">
                          <span>{project.location}</span>
                          {project.is_featured && (
                            <span className="text-[10px] uppercase tracking-[0.25em] text-[#F7E9C7] bg-[#300E0F] px-2 py-0.5 border border-[#DCC8A0]/20">
                              Featured
                            </span>
                          )}
                        </div>

                        {project.short_description && (
                          <p className="text-xs sm:text-sm text-[#F7E9C7]/70 font-light line-clamp-2 pt-1">
                            {project.short_description}
                          </p>
                        )}
                      </div>
                    </Link>
                  </motion.article>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
