import { groq } from "next-sanity";

// Common projection fragment for project images
const projectImageProjection = `
  "id": coalesce(id, _key),
  image_url,
  caption,
  alt_text,
  image_type,
  display_order,
  asset,
  crop,
  hotspot,
  image
`;

// All published projects (excluding drafts) with optional section filter
export const projectsQuery = groq`
  *[_type == "project" && !(_id in path("drafts.**")) && ($section != "carousel" || showInCarousel == true || (showInCarousel != false && is_featured == true)) && ($section != "home" || showOnHome == true) && ($section != "projects" || showOnProjectsPage == true)] | order(select($section == "carousel" => coalesce(carousel_order, display_order, 999), display_order) asc, display_order asc) {
    "id": _id,
    title,
    "slug": slug.current,
    category,
    location,
    year,
    area_sqft,
    client,
    status,
    short_description,
    full_description,
    key_features,
    cover_image,
    hero_image,
    images[] {
      ${projectImageProjection}
    },
    is_featured,
    is_published,
    showInCarousel,
    showOnHome,
    showOnProjectsPage,
    carousel_order,
    display_order,
    "created_at": _createdAt,
    "updated_at": _updatedAt
  }
`;

// Landing page carousel: strictly published projects where showInCarousel == true, ordered by carousel_order / display_order
export const carouselProjectsQuery = groq`
  *[_type == "project" && !(_id in path("drafts.**")) && (showInCarousel == true || (showInCarousel != false && is_featured == true))] | order(coalesce(carousel_order, display_order, 999) asc, display_order asc) {
    "id": _id,
    title,
    "slug": slug.current,
    category,
    location,
    year,
    area_sqft,
    client,
    status,
    short_description,
    full_description,
    key_features,
    cover_image,
    hero_image,
    images[] {
      ${projectImageProjection}
    },
    is_featured,
    is_published,
    showInCarousel,
    showOnHome,
    showOnProjectsPage,
    carousel_order,
    display_order,
    "created_at": _createdAt,
    "updated_at": _updatedAt
  }
`;

// Home page featured works: strictly published projects where showOnHome == true, ordered by display_order
export const homeProjectsQuery = groq`
  *[_type == "project" && !(_id in path("drafts.**")) && showOnHome == true] | order(display_order asc) {
    "id": _id,
    title,
    "slug": slug.current,
    category,
    location,
    year,
    area_sqft,
    client,
    status,
    short_description,
    full_description,
    key_features,
    cover_image,
    hero_image,
    images[] {
      ${projectImageProjection}
    },
    is_featured,
    is_published,
    showInCarousel,
    showOnHome,
    showOnProjectsPage,
    carousel_order,
    display_order,
    "created_at": _createdAt,
    "updated_at": _updatedAt
  }
`;

// Projects portfolio page: strictly published projects where showOnProjectsPage == true, ordered by display_order
export const portfolioProjectsQuery = groq`
  *[_type == "project" && !(_id in path("drafts.**")) && showOnProjectsPage == true] | order(display_order asc) {
    "id": _id,
    title,
    "slug": slug.current,
    category,
    location,
    year,
    area_sqft,
    client,
    status,
    short_description,
    full_description,
    key_features,
    cover_image,
    hero_image,
    images[] {
      ${projectImageProjection}
    },
    is_featured,
    is_published,
    showInCarousel,
    showOnHome,
    showOnProjectsPage,
    carousel_order,
    display_order,
    "created_at": _createdAt,
    "updated_at": _updatedAt
  }
`;

// Single project by slug: strictly published project, draft returns null
export const projectBySlugQuery = groq`
  *[_type == "project" && !(_id in path("drafts.**")) && slug.current == $slug][0] {
    "id": _id,
    title,
    "slug": slug.current,
    category,
    location,
    year,
    area_sqft,
    client,
    status,
    short_description,
    full_description,
    key_features,
    cover_image,
    hero_image,
    images[] {
      ${projectImageProjection}
    },
    is_featured,
    is_published,
    showInCarousel,
    showOnHome,
    showOnProjectsPage,
    carousel_order,
    display_order,
    "created_at": _createdAt,
    "updated_at": _updatedAt
  }
`;

// Single project by id: strictly published project
export const projectByIdQuery = groq`
  *[_type == "project" && !(_id in path("drafts.**")) && _id == $id][0] {
    "id": _id,
    title,
    "slug": slug.current,
    category,
    location,
    year,
    area_sqft,
    client,
    status,
    short_description,
    full_description,
    key_features,
    cover_image,
    hero_image,
    images[] {
      ${projectImageProjection}
    },
    is_featured,
    is_published,
    showInCarousel,
    showOnHome,
    showOnProjectsPage,
    carousel_order,
    display_order,
    "created_at": _createdAt,
    "updated_at": _updatedAt
  }
`;

// Carousel settings
export const carouselSettingsQuery = groq`
  *[_type == "carouselSettings"][0] {
    "id": _id,
    autoplay_enabled,
    autoplay_interval,
    initial_project_id,
    "updated_at": _updatedAt
  }
`;

// Founders
export const foundersQuery = groq`
  *[_type == "founder"] | order(display_order asc) {
    "id": _id,
    name,
    "role": coalesce(role, title),
    "biography": coalesce(biography, bio),
    "portrait_url": coalesce(portrait_url, image),
    image_asset,
    display_order
  }
`;

// Site content
export const siteContentQuery = groq`
  *[_type == "siteContent"] {
    key,
    value
  }
`;

// Contact inquiries
export const contactInquiriesQuery = groq`
  *[_type == "contactInquiry"] | order(_createdAt desc) {
    "id": _id,
    name,
    email,
    phone,
    project_type,
    location,
    budget,
    timeline,
    message,
    status,
    "created_at": _createdAt
  }
`;
