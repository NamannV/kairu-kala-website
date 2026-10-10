export interface Project {
  slug: string;
  title: string;
  subtitle: string;
  location: string;
  year: string;
  category: "Residential" | "Cultural" | "Commercial" | "Heritage Restoration";
  area: string;
  heroImage: string;
  secondaryImage: string;
  gallery: string[];
  description: string;
  philosophy: string;
  approach: string[];
  materials: string[];
  featured?: boolean;
}

export const PROJECTS: Project[] = [
  {
    slug: "coastal-sanctuary",
    title: "Residence 01 — Coastal Sanctuary",
    subtitle: "A modern cantilevered sanctuary overlooking the Arabian sea",
    location: "Mangalore, India",
    year: "2026",
    category: "Residential",
    area: "4,800 sq.ft",
    heroImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2000&auto=format&fit=crop",
    secondaryImage: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1600&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600585152220-90363fe7e115?q=80&w=1600&auto=format&fit=crop"
    ],
    description: "Perched atop a coastal ridge in Mangalore, Coastal Sanctuary was conceived as an ode to maritime winds and tropical sunshine. The dwelling balances heavy board-formed concrete slabs with light, kinetic timber screens that filter the harsh afternoon light into gentle geometric patterns across polished terrazzo floors.",
    philosophy: "Architecture should act as a quiet lens for nature rather than an imposition upon it. Every space opens toward framed oceanic horizon lines or quiet internal courtyards.",
    approach: [
      "Subterranean passive cooling system drawing sea breezes through basalt floor ducts.",
      "Custom deep burgundy terracotta screen walls echoing regional coastal clay traditions.",
      "Dual-level reflection pools framing celestial light movements throughout the day."
    ],
    materials: ["Board-formed raw concrete", "Burnt clay terracotta", "Reclaimed teakwood", "Local basalt stone"],
    featured: true
  },
  {
    slug: "brick-courtyard-pavilion",
    title: "The Brick & Courtyard Pavilion",
    subtitle: "A cultural arts space rooted in traditional South Indian geometry",
    location: "Hampi, India",
    year: "2025",
    category: "Cultural",
    area: "8,200 sq.ft",
    heroImage: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=2000&auto=format&fit=crop",
    secondaryImage: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1600&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600566752355-35792bedcfea?q=80&w=1600&auto=format&fit=crop"
    ],
    description: "Set against the granite boulder landscape of Hampi, the Brick Pavilion serves as a contemporary sanctuary for performance arts and artisan exhibitions. The design draws heavily from the sacred geometry of Vijayanagara temples, reinterpreting ancient columned halls into a breathable brick rhythm.",
    philosophy: "Heritage is not preserved by mere imitation, but by evolving historic spatial wisdom into modern physical form.",
    approach: [
      "Over 120,000 locally hand-molded bricks arranged in acoustic step-corbelled patterns.",
      "Central open-air atrium acting as a natural thermal chimney.",
      "Custom brass hardware cast by local traditional metallurgists."
    ],
    materials: ["Hand-molded red brick", "Hampi granite masonry", "Patinated brass", "Lime plaster"],
    featured: true
  },
  {
    slug: "studio-monolith",
    title: "Studio Monolith",
    subtitle: "Subterranean architectural workspace bathed in sculptured shafts of light",
    location: "Bangalore, India",
    year: "2025",
    category: "Commercial",
    area: "6,500 sq.ft",
    heroImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2000&auto=format&fit=crop",
    secondaryImage: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=1600&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1600&auto=format&fit=crop"
    ],
    description: "Designed as an inspiring haven for creative minds, Studio Monolith strips away urban chaos in favor of quiet materiality. The building's exterior presents a monolithic burgundy-pigmented concrete facade, which opens internally to double-height creative bays around sunken garden courtyards.",
    philosophy: "A workspace should be a vessel of focus, where silence, shadow, and tactile surface inspire meaningful creation.",
    approach: [
      "Pigmented deep burgundy concrete walls blended with local volcanic earth.",
      "Acoustic acoustic timber baffles paired with custom brass task lights.",
      "Central skylight array calibrated to capture northern diffuse workspace light."
    ],
    materials: ["Burgundy pigmented concrete", "Smoked oak wood", "Brushed copper", "Acoustic fabric"],
    featured: true
  },
  {
    slug: "house-of-four-lights",
    title: "House of Four Lights",
    subtitle: "A misty mountain residence responding to quadrangle sacred proportions",
    location: "Coorg, India",
    year: "2026",
    category: "Residential",
    area: "3,600 sq.ft",
    heroImage: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=2000&auto=format&fit=crop",
    secondaryImage: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=1600&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1600&auto=format&fit=crop"
    ],
    description: "Nestled in the lush coffee hills of Coorg, the House of Four Lights is structured around a modernized 'Nalukettu' (four-sided traditional central quadrangle). Slender steel columns support deeply overhang eaves, keeping monsoon downpours away while letting cool mountain fog drift through interior corridors.",
    philosophy: "Harmonizing the domestic ritual with forest ecology through tectonic lightness and shelter.",
    approach: [
      "Floating structural foundation minimizing earthwork disturbance to coffee flora.",
      "Custom rain-harvesting copper downspouts feeding a meditative central basin.",
      "Thermally insulated timber-laminated roof structures."
    ],
    materials: ["Structural dark steel", "Coorg teakwood", "Patinated copper", "Raw slate tile"],
    featured: true
  },
  {
    slug: "heritage-restoration-house",
    title: "Ancestral Mansion Restoration",
    subtitle: "Sensitive revival of a 120-year-old coastal Gutthu manor",
    location: "Udupi, India",
    year: "2024",
    category: "Heritage Restoration",
    area: "5,200 sq.ft",
    heroImage: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2000&auto=format&fit=crop",
    secondaryImage: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1600&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600566752355-35792bedcfea?q=80&w=1600&auto=format&fit=crop"
    ],
    description: "A meticulous historic restoration of a traditional coastal mansion. Over decades of weathering, the original timber joinery had deteriorated. KAIRU KALA engaged master woodcarvers and stone masons to restore original teak pillars while inserting hidden climate controls, modern bathrooms, and seamless glass enclosures.",
    philosophy: "Restoration is a delicate art of listening to what a building has survived, retaining its soul while breathing modern comfort into its bones.",
    approach: [
      "Hand-restored 100-year-old jackwood and teak pillar capitals.",
      "Installation of subterranean radiant floor cooling system.",
      "Custom frameless glass panels inserted behind historic carved timber grilles."
    ],
    materials: ["Historic teakwood", "Clay roof tiles", "Hand-cut laterite stone", "Red oxide flooring"],
    featured: false
  }
];

export function getProjectBySlug(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}
