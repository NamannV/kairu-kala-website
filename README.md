# KAIRU KALA — Architectural Practice Website & Studio CMS

A bespoke, high-performance architecture studio website built for **Kairu Kala**, featuring a signature 3D perspective project carousel, an editorial portfolio system, and a full-featured owner administration CMS.

---

## 1. Visual & Brand Identity

The visual identity is derived directly from the official **Kairu Kala** brand emblem and wordmark:

* **Deep Maroon:** `#4B1718`
* **Warm Ivory / Cream:** `#F7E9C7`
* **Muted Sand:** `#DCC8A0`
* **Charcoal:** `#282522`
* **Off-White:** `#FCFAF4`

### Typography Pairing
* **Cormorant Garamond:** Large editorial titles, project headings, and philosophy statements.
* **Inter:** Clean, restrained sans-serif for metadata, labels, technical specifications, and administration interfaces.

---

## 2. Architecture & Pages

### Public Experience
1. **`/` — Signature Landing Page:**
   * Centered 3D layered architectural project carousel with continuous perspective depth transforms.
   * Atmospheric fullscreen backdrop derived from the active project with dynamic blur and smooth crossfade.
   * Full viewport composition (`100svh`) with restrained brand header, project counter, arrow navigation, drag/swipe controls, and keyboard interaction.
   * Dynamically adapts to 3 initial projects or expands up to 5 perspective positions when more projects are added in the CMS.
2. **`/home` — Studio Homepage:**
   * Editorial hero photograph, studio introduction, database-driven featured projects grid, architectural philosophy, and contact call-to-action.
3. **`/projects` — Complete Architectural Portfolio:**
   * Responsive editorial grid with category filtering (Residential, Cultural, Commercial, Heritage Restoration) and year sorting.
4. **`/projects/[slug]` — Project Detail Pages:**
   * Dynamic slug routing, high-resolution imagery, spatial specifications, conceptual narrative, documentation gallery, floor plans / architectural drawings, and prev/next project pagination.
5. **`/about` — Studio Philosophy & Founder:**
   * Design ethos, four pillars of inquiry (Context, Light & Shade, Materiality, Spatial Stillness), and editable founder profile with authentic portraiture.
6. **`/contact` — Direct Studio Dialogue:**
   * Architectural inquiry form with client-side & server-side validation, spam honeypot trap, studio coordinates in Mangalore, and direct email/phone details.

### Studio CMS Administration
1. **`/admin/login` — Secure CMS Authentication:**
   * Secure credential authentication with HTTP-only signed session cookies.
2. **`/admin` — CMS Dashboard:**
   * Real-time metrics (Total Projects, Carousel Items, Autoplay State, Client Inquiries) and recent submissions.
3. **`/admin/projects` — Portfolio Manager:**
   * Full project table with search, publish/draft toggle, carousel featured toggle, edit, and deletion with confirmation modal.
4. **`/admin/projects/new` — Project Creator:**
   * Title, auto-slug generator, typology, location, year, short & full descriptions, specifications builder, cover image file uploader, and gallery/drawings uploader.
5. **`/admin/projects/[id]/edit` — Project Editor:**
   * Update any project field, add new drawings, reorder images, and save drafts or publish live.
6. **`/admin/settings` — 3D Carousel Settings:**
   * Autoplay toggle, interval slider (3s–15s), initial active project selector, and featured projects selector.
7. **`/admin/content` — Site Narrative & Founder Management:**
   * Edit studio headline, philosophy statements, founder names/roles/portraits/biographies, and contact coordinates.

---

## 3. Technology Stack

* **Framework:** Next.js (App Router, Server & Client Components)
* **Language:** TypeScript
* **Styling:** Tailwind CSS with custom Kairu Kala design tokens
* **Animations:** Framer Motion (perspective transforms, carousel motion curves, AnimatePresence)
* **Icons:** Lucide React
* **Database & CMS:** Sanity.io Headless CMS & Structured Content:
  * **Sanity Client & GROQ:** Fast, typed queries with CDN caching for projects, founders, and site configuration.
  * **Embedded Studio:** Sanity Studio mounted at `/studio` for intuitive visual editing.
  * **Zero-Config Local Mode:** Graceful local JSON persistence (`data/db.json` and `public/uploads/`) so the app works immediately out of the box even before Sanity credentials are provided.

---

## 4. Local Development

### Prerequisites
* Node.js 18+ (tested with Node 20 / 22 / 24)
* npm

### Running Locally
```bash
# 1. Install dependencies (if not already installed)
npm install

# 2. Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the signature landing page.

---

## 5. Administration & CMS

* **Studio Administration Panel:** [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
  * Default Email: `admin@kairukala.com`
  * Default Password: `kairukala2026`
* **Embedded Sanity Studio:** [http://localhost:3000/studio](http://localhost:3000/studio)

---

## 6. Sanity.io Setup

To connect your project to Sanity.io:

1. Create a project at [sanity.io/manage](https://sanity.io/manage).
2. Copy your Project ID and dataset name (usually `production`) into `.env.local`:
   ```bash
   NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
   NEXT_PUBLIC_SANITY_DATASET=production
   NEXT_PUBLIC_SANITY_API_VERSION=2024-03-01
   SANITY_API_TOKEN=your-editor-token
   ```
3. Restart the development server. The data layer will automatically use Sanity.io for queries, mutations, and media asset storage!

---

## 7. Build & Production Deployment

To create an optimized production build:
```bash
npm run build
npm run start
```
The application is ready for instant deployment on **Vercel**, **Netlify**, or any containerized Node.js environment.
