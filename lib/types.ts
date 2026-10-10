export type ProjectCategory = 
  | "Residential" 
  | "Cultural" 
  | "Commercial" 
  | "Heritage Restoration" 
  | "Hospitality";

export interface ProjectImage {
  id: string;
  project_id: string;
  image_url: string;
  alt_text: string;
  caption?: string;
  image_type: "gallery" | "drawing" | "detail" | "plan";
  display_order: number;
  asset?: any;
  crop?: any;
  hotspot?: any;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  location: string;
  year: string;
  category: ProjectCategory;
  short_description: string;
  description: string;
  cover_image_url: string;
  cover_image?: any;
  specifications: Record<string, string> | string[];
  is_featured: boolean;
  is_published: boolean;
  showInCarousel?: boolean;
  showOnHome?: boolean;
  showOnProjectsPage?: boolean;
  carousel_order?: number;
  display_order: number;
  created_at: string;
  updated_at: string;
  images?: ProjectImage[];
}

export interface Founder {
  id: string;
  name: string;
  role: string;
  biography: string;
  portrait_url: string;
  display_order: number;
}

export interface CarouselSettings {
  id: string;
  autoplay_enabled: boolean;
  autoplay_interval: number; // in milliseconds
  initial_project_id?: string;
  updated_at: string;
}

export interface SiteContent {
  id: string;
  key: string;
  content: Record<string, any>;
  updated_at: string;
}

export interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  inquiry_type: "Residential" | "Commercial" | "Cultural" | "General";
  message: string;
  created_at: string;
}
