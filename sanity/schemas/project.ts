export default {
  name: "project",
  title: "Project",
  type: "document",
  fieldsets: [
    {
      name: "displaySettings",
      title: "Website Display Settings",
      options: { collapsible: true, collapsed: false },
    },
  ],
  fields: [
    {
      name: "title",
      title: "Project Title",
      type: "string",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "category",
      title: "Typology / Category",
      type: "string",
      options: {
        list: [
          { title: "Residential", value: "Residential" },
          { title: "Coastal Residences", value: "Coastal Residences" },
          { title: "Heritage Restoration", value: "Heritage Restoration" },
          { title: "Cultural & Public", value: "Cultural & Public" },
          { title: "Hospitality & Retreat", value: "Hospitality & Retreat" },
          { title: "Interior Architecture", value: "Interior Architecture" },
        ],
      },
    },
    {
      name: "location",
      title: "Location",
      type: "string",
    },
    {
      name: "year",
      title: "Year of Completion / Design",
      type: "string",
    },
    {
      name: "area_sqft",
      title: "Built-up Area (Sq. Ft.)",
      type: "string",
    },
    {
      name: "client",
      title: "Client / Patron",
      type: "string",
    },
    {
      name: "status",
      title: "Project Status",
      type: "string",
      options: {
        list: [
          { title: "Completed", value: "Completed" },
          { title: "In Progress", value: "In Progress" },
          { title: "Under Construction", value: "Under Construction" },
          { title: "Concept / Planning", value: "Concept" },
        ],
      },
      initialValue: "Completed",
    },
    {
      name: "short_description",
      title: "Short Architectural Summary",
      type: "text",
      rows: 3,
    },
    {
      name: "full_description",
      title: "Full Narrative & Design Philosophy",
      type: "text",
      rows: 6,
    },
    {
      name: "key_features",
      title: "Key Architectural Highlights",
      type: "array",
      of: [{ type: "string" }],
    },
    {
      name: "cover_image",
      title: "Cover / Hero Photograph (Sanity Upload)",
      type: "image",
      description: "Upload high-resolution architectural photograph. Supports hotspot and focal-point cropping.",
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alternative Text / Description",
        },
      ],
    },
    {
      name: "hero_image",
      title: "Fallback Cover Image URL (Legacy / External)",
      type: "string",
      description: "Direct local path (e.g. /images/projects/...) or external URL when not uploading an asset above",
    },
    {
      name: "images",
      title: "Project Image Gallery",
      type: "array",
      of: [
        {
          type: "image",
          title: "Gallery Image (Upload)",
          options: {
            hotspot: true,
          },
          fields: [
            { name: "caption", title: "Caption / Architectural Note", type: "string" },
            { name: "alt_text", title: "Alt Text", type: "string" },
            {
              name: "image_type",
              title: "Image Classification",
              type: "string",
              options: {
                list: [
                  { title: "Photographic Gallery", value: "gallery" },
                  { title: "Architectural Drawing / Plan", value: "drawing" },
                  { title: "Tectonic / Material Detail", value: "detail" },
                ],
              },
              initialValue: "gallery",
            },
            { name: "display_order", title: "Display Order", type: "number" },
          ],
        },
        {
          type: "object",
          title: "Gallery Item (External / Legacy URL)",
          fields: [
            { name: "id", title: "ID", type: "string" },
            {
              name: "image",
              title: "Image Asset",
              type: "image",
              options: { hotspot: true },
            },
            { name: "image_url", title: "Image URL", type: "string" },
            { name: "caption", title: "Caption", type: "string" },
            { name: "alt_text", title: "Alt Text", type: "string" },
            {
              name: "image_type",
              title: "Image Classification",
              type: "string",
              options: {
                list: [
                  { title: "Photographic Gallery", value: "gallery" },
                  { title: "Architectural Drawing / Plan", value: "drawing" },
                  { title: "Tectonic / Material Detail", value: "detail" },
                ],
              },
            },
            { name: "display_order", title: "Display Order", type: "number" },
          ],
        },
      ],
    },
    // --- WEBSITE DISPLAY SETTINGS ---
    {
      name: "showInCarousel",
      title: "Show in Landing Page Carousel",
      type: "boolean",
      description: "Display this project in the signature 3D perspective landing carousel (/)",
      fieldset: "displaySettings",
      initialValue: false,
    },
    {
      name: "showOnHome",
      title: "Show in Home Page Featured Works",
      type: "boolean",
      description: "Display this project in the curated architectural highlights section on the home page (/home)",
      fieldset: "displaySettings",
      initialValue: false,
    },
    {
      name: "showOnProjectsPage",
      title: "Show on Projects Portfolio",
      type: "boolean",
      description: "Display this project in the main architecture portfolio catalog (/projects)",
      fieldset: "displaySettings",
      initialValue: false,
    },
    {
      name: "carousel_order",
      title: "Carousel Order Priority",
      type: "number",
      description: "Optional custom ordering in the 3D landing carousel (falls back to Display Order if left blank)",
      fieldset: "displaySettings",
    },
    {
      name: "display_order",
      title: "Display Order Priority",
      type: "number",
      description: "Standard sort order for Home and Projects Portfolio pages (1 = first)",
      fieldset: "displaySettings",
      initialValue: 1,
    },
    {
      name: "is_featured",
      title: "Feature on Carousel / Homepage (Legacy)",
      type: "boolean",
      description: "Legacy flag; use the Website Display Settings above for granular control.",
      hidden: true,
      initialValue: true,
    },
    {
      name: "is_published",
      title: "Published (Visible to Public) (Legacy)",
      type: "boolean",
      description: "Legacy flag; native Sanity publish/draft states control public visibility.",
      hidden: true,
      initialValue: true,
    },
  ],
  orderings: [
    {
      title: "Display Order",
      name: "displayOrderAsc",
      by: [{ field: "display_order", direction: "asc" }],
    },
    {
      title: "Carousel Order",
      name: "carouselOrderAsc",
      by: [
        { field: "carousel_order", direction: "asc" },
        { field: "display_order", direction: "asc" },
      ],
    },
  ],
};
