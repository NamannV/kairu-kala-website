import fs from "fs";
import path from "path";
import { Project, Founder, CarouselSettings, SiteContent, ContactInquiry } from "./types";
import { sanityClient, sanityWriteClient, isSanityConfigured } from "./sanity/client";
import { resolveSanityImageUrl } from "./sanity/image";
import {
  projectsQuery,
  carouselProjectsQuery,
  homeProjectsQuery,
  portfolioProjectsQuery,
  projectBySlugQuery,
  projectByIdQuery,
  carouselSettingsQuery,
  foundersQuery,
  siteContentQuery,
  contactInquiriesQuery,
} from "./sanity/queries";

const DB_PATH = path.join(process.cwd(), "data", "db.json");

export { isSanityConfigured };

// Helper to normalize Sanity Project document into application Project format
function mapSanityProject(doc: any): Project {
  const coverSource = doc.cover_image || doc.hero_image;
  const coverImageUrl = resolveSanityImageUrl(coverSource, "/images/projects/coastal-cantilever.jpg");

  return {
    id: doc.id || doc._id,
    title: doc.title || "Untitled Project",
    slug: doc.slug || (typeof doc.slug === "object" ? doc.slug.current : "untitled"),
    location: doc.location || "Mangalore, India",
    year: doc.year || new Date().getFullYear().toString(),
    category: doc.category || "Residential",
    short_description: doc.short_description || "",
    description: doc.full_description || doc.description || "",
    cover_image_url: coverImageUrl,
    cover_image: doc.cover_image || doc.hero_image,
    specifications: Array.isArray(doc.key_features) && doc.key_features.length > 0
      ? doc.key_features.map((feat: any) => (typeof feat === "string" ? feat : `${feat.label || ""}: ${feat.value || ""}`.trim()))
      : Array.isArray(doc.specifications)
      ? doc.specifications.map((feat: any) => (typeof feat === "string" ? feat : `${feat.label || ""}: ${feat.value || ""}`.trim()))
      : [],
    is_featured: doc.is_featured ?? true,
    is_published: doc.is_published ?? true,
    showInCarousel: Boolean(doc.showInCarousel),
    showOnHome: Boolean(doc.showOnHome),
    showOnProjectsPage: Boolean(doc.showOnProjectsPage),
    carousel_order: doc.carousel_order ?? doc.display_order ?? 1,
    display_order: doc.display_order ?? 1,
    created_at: doc.created_at || doc._createdAt || new Date().toISOString(),
    updated_at: doc.updated_at || doc._updatedAt || new Date().toISOString(),
    images: Array.isArray(doc.images)
      ? doc.images.map((img: any, idx: number) => {
          const imageSource = img.asset
            ? img
            : img.image?.asset
            ? img.image
            : img.image_url || img.url || img;
          const resolvedUrl = resolveSanityImageUrl(
            imageSource,
            "/images/projects/coastal-cantilever.jpg"
          );

          return {
            id: img.id || img._key || `img-${idx}`,
            project_id: doc.id || doc._id,
            image_url: resolvedUrl,
            alt_text: img.alt_text || img.caption || doc.title || "Architectural photograph",
            caption: img.caption || "",
            image_type: img.image_type || "gallery",
            display_order: img.display_order ?? idx + 1,
            asset: img.asset || img.image?.asset,
            crop: img.crop || img.image?.crop,
            hotspot: img.hotspot || img.image?.hotspot,
          };
        })
      : [],
  };
}

// Helper to read local JSON database
function readLocalDb(): {
  projects: Project[];
  founders: Founder[];
  carousel_settings: CarouselSettings;
  site_content: Record<string, any>;
  inquiries: ContactInquiry[];
} {
  try {
    if (!fs.existsSync(DB_PATH)) {
      return {
        projects: [],
        founders: [],
        carousel_settings: {
          id: "carousel-cfg",
          autoplay_enabled: false,
          autoplay_interval: 5000,
          updated_at: new Date().toISOString()
        },
        site_content: {},
        inquiries: []
      };
    }
    const data = fs.readFileSync(DB_PATH, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading local db:", error);
    return {
      projects: [],
      founders: [],
      carousel_settings: {
        id: "carousel-cfg",
        autoplay_enabled: false,
        autoplay_interval: 5000,
        updated_at: new Date().toISOString()
      },
      site_content: {},
      inquiries: []
    };
  }
}

// Helper to write to local JSON database
function writeLocalDb(data: any): boolean {
  try {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
    return true;
  } catch (error) {
    console.error("Error writing to local db:", error);
    return false;
  }
}

// ==========================================
// PROJECTS API (SANITY.IO WITH LOCAL FALLBACK)
// ==========================================

export async function getProjects(options?: {
  section?: "carousel" | "home" | "projects" | "all";
  onlyPublished?: boolean;
  featuredOnly?: boolean;
}): Promise<Project[]> {
  if (isSanityConfigured() && sanityClient) {
    try {
      let queryToUse = projectsQuery;
      if (options?.section === "carousel") {
        queryToUse = carouselProjectsQuery;
      } else if (options?.section === "home") {
        queryToUse = homeProjectsQuery;
      } else if (options?.section === "projects") {
        queryToUse = portfolioProjectsQuery;
      }

      const data = await sanityClient.fetch(
        queryToUse,
        {
          section: options?.section || null,
          onlyPublished: !!options?.onlyPublished,
          featuredOnly: !!options?.featuredOnly,
        },
        {
          next: { revalidate: 0 },
          cache: "no-store",
        }
      );

      // Temporary development-only diagnostic logging (no tokens or secrets)
      if (process.env.NODE_ENV !== "production" && options?.section === "carousel") {
        try {
          const allPublished = await sanityClient.fetch(
            `*[_type == "project" && !(_id in path("drafts.**"))]{
              _id,
              title,
              showInCarousel,
              is_featured,
              carousel_order,
              display_order
            }`,
            {},
            { next: { revalidate: 0 }, cache: "no-store" }
          );

          console.log(`\n[Sanity CMS Carousel Debug] Total published projects in dataset: ${allPublished.length}`);
          allPublished.forEach((p: any) => {
            const isEligible = p.showInCarousel === true || (p.showInCarousel !== false && p.is_featured === true);
            if (isEligible) {
              console.log(`  ✓ INCLUDED: "${p.title}" (ID: ${p._id}) — carousel_order: ${p.carousel_order ?? p.display_order ?? "default"}`);
            } else {
              console.log(`  ✗ EXCLUDED: "${p.title}" (ID: ${p._id}) — reason: showInCarousel is false`);
            }
          });
          console.log(`[Sanity CMS Carousel Debug] Total projects delivered to landing carousel: ${Array.isArray(data) ? data.length : 0}\n`);
        } catch {
          // Dev-only logging helper
        }
      }

      if (Array.isArray(data)) {
        return data.map(mapSanityProject);
      }
    } catch (e) {
      console.warn("Sanity getProjects query failed, falling back to local DB:", e);
    }
  }

  // Local fallback
  const db = readLocalDb();
  let list = db.projects || [];

  if (options?.section === "carousel") {
    list = list.filter((p) => p.showInCarousel === true || (p.showInCarousel !== false && p.is_featured === true));
    return list.sort((a, b) => (a.carousel_order ?? a.display_order) - (b.carousel_order ?? b.display_order));
  }
  if (options?.section === "home") {
    list = list.filter((p) => p.showOnHome === true);
    return list.sort((a, b) => a.display_order - b.display_order);
  }
  if (options?.section === "projects") {
    list = list.filter((p) => p.showOnProjectsPage === true);
    return list.sort((a, b) => a.display_order - b.display_order);
  }

  if (options?.onlyPublished) {
    list = list.filter((p) => p.is_published);
  }
  if (options?.featuredOnly) {
    list = list.filter((p) => p.is_featured);
  }
  return list.sort((a, b) => a.display_order - b.display_order);
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  if (isSanityConfigured() && sanityClient) {
    try {
      const doc = await sanityClient.fetch(projectBySlugQuery, { slug });
      if (doc) return mapSanityProject(doc);
    } catch (e) {
      console.warn("Sanity getProjectBySlug failed, falling back to local DB:", e);
    }
  }

  const db = readLocalDb();
  return db.projects.find((p) => p.slug === slug) || null;
}

export async function getProjectById(id: string): Promise<Project | null> {
  if (isSanityConfigured() && sanityClient) {
    try {
      const doc = await sanityClient.fetch(projectByIdQuery, { id });
      if (doc) return mapSanityProject(doc);
    } catch (e) {
      console.warn("Sanity getProjectById failed, falling back to local DB:", e);
    }
  }

  const db = readLocalDb();
  return db.projects.find((p) => p.id === id) || null;
}

export async function saveProject(projectData: Partial<Project>): Promise<Project> {
  const now = new Date().toISOString();

  // Try Sanity mutation if token and write client exist
  if (isSanityConfigured() && sanityWriteClient) {
    try {
      const doc: Record<string, any> = {
        _type: "project",
        title: projectData.title,
        slug: { _type: "slug", current: projectData.slug || "project-" + Date.now() },
        category: projectData.category,
        location: projectData.location,
        year: projectData.year,
        short_description: projectData.short_description,
        full_description: projectData.description,
        hero_image: projectData.cover_image_url,
        showInCarousel: projectData.showInCarousel ?? false,
        showOnHome: projectData.showOnHome ?? false,
        showOnProjectsPage: projectData.showOnProjectsPage ?? false,
        carousel_order: projectData.carousel_order ?? projectData.display_order ?? 1,
        is_featured: projectData.is_featured ?? false,
        is_published: projectData.is_published ?? true,
        display_order: projectData.display_order ?? 1,
        images: projectData.images?.map((img, idx) => ({
          _key: `img_${idx}_${Date.now()}`,
          id: img.id,
          image_url: img.image_url,
          caption: img.caption || "",
          display_order: img.display_order || idx + 1,
        })),
      };

      if (projectData.id && !projectData.id.startsWith("proj-")) {
        const updated = await sanityWriteClient.patch(projectData.id).set(doc).commit();
        if (updated) {
          projectData.id = updated._id;
        }
      } else {
        const created = await (sanityWriteClient as any).create(doc);
        if (created) {
          projectData.id = created._id;
        }
      }
    } catch (e) {
      console.warn("Sanity saveProject mutation failed, syncing with local DB:", e);
    }
  }

  // Always keep local DB synced for instant responsiveness and resilience
  const db = readLocalDb();
  let project: Project;

  if (projectData.id) {
    const idx = db.projects.findIndex((p) => p.id === projectData.id);
    if (idx !== -1) {
      project = { ...db.projects[idx], ...projectData, updated_at: now } as Project;
      db.projects[idx] = project;
    } else {
      project = { ...projectData, id: projectData.id, created_at: now, updated_at: now } as Project;
      db.projects.push(project);
    }
  } else {
    project = {
      id: "proj-" + Date.now(),
      title: projectData.title || "Untitled Project",
      slug: projectData.slug || "untitled-" + Date.now(),
      location: projectData.location || "Mangalore, India",
      year: projectData.year || new Date().getFullYear().toString(),
      category: projectData.category || "Residential",
      short_description: projectData.short_description || "",
      description: projectData.description || "",
      cover_image_url: projectData.cover_image_url || "/images/projects/coastal-cantilever.jpg",
      specifications: projectData.specifications || [],
      is_featured: projectData.is_featured ?? false,
      is_published: projectData.is_published ?? true,
      showInCarousel: projectData.showInCarousel ?? false,
      showOnHome: projectData.showOnHome ?? false,
      showOnProjectsPage: projectData.showOnProjectsPage ?? false,
      carousel_order: projectData.carousel_order ?? projectData.display_order ?? (db.projects.length + 1),
      display_order: projectData.display_order ?? (db.projects.length + 1),
      created_at: now,
      updated_at: now,
      images: projectData.images || []
    };
    db.projects.push(project);
  }

  writeLocalDb(db);
  return project;
}

export async function deleteProject(id: string): Promise<boolean> {
  if (isSanityConfigured() && sanityWriteClient && !id.startsWith("proj-")) {
    try {
      await sanityWriteClient.delete(id);
    } catch (e) {
      console.warn("Sanity deleteProject failed:", e);
    }
  }

  const db = readLocalDb();
  const initialLength = db.projects.length;
  db.projects = db.projects.filter((p) => p.id !== id);
  writeLocalDb(db);
  return db.projects.length < initialLength;
}

// ==========================================
// CAROUSEL SETTINGS API
// ==========================================

export async function getCarouselSettings(): Promise<CarouselSettings> {
  if (isSanityConfigured() && sanityClient) {
    try {
      const data = await sanityClient.fetch(carouselSettingsQuery);
      if (data) return data as CarouselSettings;
    } catch (e) {
      console.warn("Sanity getCarouselSettings failed, falling back to local DB:", e);
    }
  }

  const db = readLocalDb();
  return db.carousel_settings || {
    id: "carousel-cfg",
    autoplay_enabled: false,
    autoplay_interval: 5000,
    updated_at: new Date().toISOString()
  };
}

export async function updateCarouselSettings(settings: Partial<CarouselSettings>): Promise<CarouselSettings> {
  const now = new Date().toISOString();

  if (isSanityConfigured() && sanityWriteClient) {
    try {
      await sanityWriteClient.createOrReplace({
        _id: "carouselSettings",
        _type: "carouselSettings",
        ...settings,
      });
    } catch (e) {
      console.warn("Sanity updateCarouselSettings failed:", e);
    }
  }

  const db = readLocalDb();
  db.carousel_settings = {
    ...db.carousel_settings,
    ...settings,
    updated_at: now
  };
  writeLocalDb(db);
  return db.carousel_settings;
}

// ==========================================
// SITE CONTENT API
// ==========================================

export async function getSiteContent(): Promise<Record<string, any>> {
  if (isSanityConfigured() && sanityClient) {
    try {
      const data = await sanityClient.fetch(siteContentQuery);
      if (Array.isArray(data) && data.length > 0) {
        const contentMap: Record<string, any> = {};
        data.forEach((row: any) => {
          try {
            contentMap[row.key] = JSON.parse(row.value);
          } catch {
            contentMap[row.key] = row.value;
          }
        });
        return contentMap;
      }
    } catch (e) {
      console.warn("Sanity getSiteContent failed, falling back to local DB:", e);
    }
  }

  const db = readLocalDb();
  return db.site_content || {};
}

export async function updateSiteContent(key: string, content: any): Promise<boolean> {
  if (isSanityConfigured() && sanityWriteClient) {
    try {
      const valStr = typeof content === "string" ? content : JSON.stringify(content);
      await sanityWriteClient.createOrReplace({
        _id: `siteContent-${key}`,
        _type: "siteContent",
        key,
        value: valStr,
      });
    } catch (e) {
      console.warn("Sanity updateSiteContent failed:", e);
    }
  }

  const db = readLocalDb();
  if (!db.site_content) db.site_content = {};
  db.site_content[key] = content;
  return writeLocalDb(db);
}

// ==========================================
// FOUNDERS API
// ==========================================

export async function getFounders(): Promise<Founder[]> {
  if (isSanityConfigured() && sanityClient) {
    try {
      const data = await sanityClient.fetch(foundersQuery);
      if (Array.isArray(data) && data.length > 0) {
        return data.map((f: any) => ({
          id: f.id || f._id,
          name: f.name || "Naman V",
          role: f.role || "Founder & Principal Architect",
          biography: f.biography || "",
          portrait_url: resolveSanityImageUrl(f.image_asset || f.portrait_url, "/images/founder-naman.jpg"),
          display_order: f.display_order ?? 1,
        }));
      }
    } catch (e) {
      console.warn("Sanity getFounders failed, falling back to local DB:", e);
    }
  }

  const db = readLocalDb();
  return db.founders || [];
}

export async function saveFounder(founderData: Partial<Founder>): Promise<Founder> {
  if (isSanityConfigured() && sanityWriteClient) {
    try {
      const doc = {
        _type: "founder",
        name: founderData.name,
        title: founderData.role || "Principal Architect",
        bio: founderData.biography,
        image: founderData.portrait_url,
        display_order: founderData.display_order ?? 1,
      };

      if (founderData.id && !founderData.id.startsWith("founder-")) {
        await sanityWriteClient.patch(founderData.id).set(doc).commit();
      } else {
        const created = await (sanityWriteClient as any).create(doc);
        if (created) founderData.id = created._id;
      }
    } catch (e) {
      console.warn("Sanity saveFounder failed:", e);
    }
  }

  const db = readLocalDb();
  let founder: Founder;
  if (founderData.id) {
    const idx = db.founders.findIndex((f) => f.id === founderData.id);
    if (idx !== -1) {
      founder = { ...db.founders[idx], ...founderData } as Founder;
      db.founders[idx] = founder;
    } else {
      founder = { ...founderData, id: founderData.id } as Founder;
      db.founders.push(founder);
    }
  } else {
    founder = {
      id: "founder-" + Date.now(),
      name: founderData.name || "Principal Architect",
      role: founderData.role || "Founder & Design Director",
      biography: founderData.biography || "",
      portrait_url: founderData.portrait_url || "/images/founder-naman.jpg",
      display_order: founderData.display_order ?? (db.founders.length + 1)
    };
    db.founders.push(founder);
  }

  writeLocalDb(db);
  return founder;
}

// ==========================================
// CONTACT INQUIRIES API
// ==========================================

export async function saveInquiry(inquiry: Omit<ContactInquiry, "id" | "created_at">): Promise<ContactInquiry> {
  const item: ContactInquiry = {
    ...inquiry,
    id: "inq-" + Date.now(),
    created_at: new Date().toISOString()
  };

  if (isSanityConfigured() && sanityWriteClient) {
    try {
      const created = await (sanityWriteClient as any).create({
        _type: "contactInquiry",
        ...item,
      });
      if (created) item.id = created._id;
    } catch (e) {
      console.warn("Sanity saveInquiry failed:", e);
    }
  }

  const db = readLocalDb();
  if (!db.inquiries) db.inquiries = [];
  db.inquiries.unshift(item);
  writeLocalDb(db);
  return item;
}

export async function getInquiries(): Promise<ContactInquiry[]> {
  if (isSanityConfigured() && sanityClient) {
    try {
      const data = await sanityClient.fetch(contactInquiriesQuery);
      if (Array.isArray(data) && data.length > 0) {
        return data as ContactInquiry[];
      }
    } catch (e) {
      console.warn("Sanity getInquiries failed:", e);
    }
  }

  const db = readLocalDb();
  return db.inquiries || [];
}
