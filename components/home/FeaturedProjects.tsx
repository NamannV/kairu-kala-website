"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Project } from "@/lib/types";
import { urlForImage } from "@/lib/sanity/image";

interface FeaturedProjectsProps {
  projects?: Project[];
}

export default function FeaturedProjects({ projects = [] }: FeaturedProjectsProps) {
  const featured = projects.length > 0 ? projects.slice(0, 4) : [];

  if (featured.length === 0) return null;

  return (
    <section className="py-24 sm:py-36 bg-[#4B1718] text-[#F7E9C7] border-t border-[#DCC8A0]/15">
      <div className="max-w-7xl mx-auto px-6 sm:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 sm:mb-24 pb-8 border-b border-[#DCC8A0]/15">
          <div>
            <span className="text-xs uppercase tracking-[0.35em] text-[#DCC8A0] font-sans font-medium block mb-3">
              Selected Works
            </span>
            <h2 className="font-serif text-4xl sm:text-6xl font-light text-[#F7E9C7]">
              Featured Projects
            </h2>
          </div>
          <Link
            href="/projects"
            className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#DCC8A0] hover:text-[#F7E9C7] transition-colors mt-6 md:mt-0 font-sans font-medium"
          >
            <span>View All Projects</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </Link>
        </div>

        {/* Editorial Non-Uniform Composition */}
        <div className="space-y-24 sm:space-y-36">
          {/* Project 1: Large Left Image with Right Metadata */}
          {featured[0] && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center group"
            >
              <div className="lg:col-span-8 overflow-hidden relative aspect-[16/10] bg-[#300E0F]">
                <Link href={`/projects/${featured[0].slug}`}>
                  <Image
                    src={urlForImage(featured[0].cover_image || featured[0].cover_image_url)}
                    alt={featured[0].title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 66vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  />
                </Link>
              </div>
              <div className="lg:col-span-4 lg:pl-6 space-y-4">
                <div className="flex items-center justify-between text-xs tracking-widest text-[#DCC8A0]/80 uppercase font-sans border-b border-[#DCC8A0]/15 pb-3">
                  <span>{featured[0].category}</span>
                  <span>{featured[0].year}</span>
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl font-normal text-[#F7E9C7] group-hover:text-[#DCC8A0] transition-colors">
                  <Link href={`/projects/${featured[0].slug}`}>
                    {featured[0].title}
                  </Link>
                </h3>
                <p className="text-xs uppercase tracking-[0.2em] text-[#DCC8A0]/70 font-sans">
                  {featured[0].location}
                </p>
                <p className="text-sm text-[#F7E9C7]/80 font-light leading-relaxed line-clamp-3 pt-2">
                  {featured[0].short_description || featured[0].description}
                </p>
                <div className="pt-4">
                  <Link
                    href={`/projects/${featured[0].slug}`}
                    className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#F7E9C7] font-sans font-medium border-b border-[#F7E9C7]/40 hover:border-[#F7E9C7] pb-1"
                  >
                    <span>Read Study</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </motion.div>
          )}

          {/* Project 2 & 3: Two Offset Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {featured[1] && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="lg:col-span-6 group space-y-4"
              >
                <div className="overflow-hidden relative aspect-[4/3] bg-[#300E0F]">
                  <Link href={`/projects/${featured[1].slug}`}>
                    <Image
                      src={urlForImage(featured[1].cover_image || featured[1].cover_image_url)}
                      alt={featured[1].title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    />
                  </Link>
                </div>
                <div className="flex items-center justify-between text-xs tracking-widest text-[#DCC8A0]/80 uppercase font-sans border-b border-[#DCC8A0]/15 pb-2">
                  <span>{featured[1].category}</span>
                  <span>{featured[1].year}</span>
                </div>
                <h3 className="font-serif text-2xl font-normal text-[#F7E9C7] group-hover:text-[#DCC8A0] transition-colors">
                  <Link href={`/projects/${featured[1].slug}`}>
                    {featured[1].title}
                  </Link>
                </h3>
                <p className="text-xs uppercase tracking-[0.2em] text-[#DCC8A0]/70 font-sans">
                  {featured[1].location}
                </p>
              </motion.div>
            )}

            {featured[2] && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="lg:col-span-6 lg:mt-16 group space-y-4"
              >
                <div className="overflow-hidden relative aspect-[4/3] bg-[#300E0F]">
                  <Link href={`/projects/${featured[2].slug}`}>
                    <Image
                      src={urlForImage(featured[2].cover_image || featured[2].cover_image_url)}
                      alt={featured[2].title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    />
                  </Link>
                </div>
                <div className="flex items-center justify-between text-xs tracking-widest text-[#DCC8A0]/80 uppercase font-sans border-b border-[#DCC8A0]/15 pb-2">
                  <span>{featured[2].category}</span>
                  <span>{featured[2].year}</span>
                </div>
                <h3 className="font-serif text-2xl font-normal text-[#F7E9C7] group-hover:text-[#DCC8A0] transition-colors">
                  <Link href={`/projects/${featured[2].slug}`}>
                    {featured[2].title}
                  </Link>
                </h3>
                <p className="text-xs uppercase tracking-[0.2em] text-[#DCC8A0]/70 font-sans">
                  {featured[2].location}
                </p>
              </motion.div>
            )}
          </div>

          {/* Project 4: Full Width Panoramic Banner */}
          {featured[3] && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="group space-y-6"
            >
              <div className="overflow-hidden relative aspect-[21/9] bg-[#300E0F]">
                <Link href={`/projects/${featured[3].slug}`}>
                  <Image
                    src={urlForImage(featured[3].cover_image || featured[3].cover_image_url)}
                    alt={featured[3].title}
                    fill
                    sizes="100vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  />
                </Link>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DCC8A0]/15 pb-4">
                <div>
                  <h3 className="font-serif text-3xl font-light text-[#F7E9C7] group-hover:text-[#DCC8A0] transition-colors">
                    <Link href={`/projects/${featured[3].slug}`}>
                      {featured[3].title}
                    </Link>
                  </h3>
                  <p className="text-xs uppercase tracking-[0.2em] text-[#DCC8A0]/70 font-sans mt-1">
                    {featured[3].location} • {featured[3].year}
                  </p>
                </div>
                <Link
                  href={`/projects/${featured[3].slug}`}
                  className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#F7E9C7] font-sans font-medium"
                >
                  <span>Explore Project</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
