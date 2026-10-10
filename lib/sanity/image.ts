import { createImageUrlBuilder } from "@sanity/image-url";
import { sanityClient } from "./client";
import { projectId, dataset } from "./config";

// Active Sanity project credentials
const targetProjectId = projectId || "zb0x0sgn";
const targetDataset = dataset || "production";

// Initialize Sanity image builder using client if available, or direct config
export const imageBuilder = sanityClient
  ? createImageUrlBuilder(sanityClient)
  : createImageUrlBuilder({
      projectId: targetProjectId,
      dataset: targetDataset,
    });

export interface ImageUrlOptions {
  width?: number;
  height?: number;
  quality?: number;
  fit?: "clip" | "crop" | "fill" | "fillmax" | "max" | "scale" | "min";
  auto?: "format";
}

/**
 * Reusable urlFor() helper that generates image URLs from Sanity image assets.
 * Fully respects crop and hotspot settings when provided with a Sanity image object.
 * Returns an ImageUrlBuilder instance, or a chainable fallback if given a string/local URL.
 */
export function urlFor(source: any): any {
  if (!source) {
    const emptyChain: any = {
      width: () => emptyChain,
      height: () => emptyChain,
      auto: () => emptyChain,
      fit: () => emptyChain,
      quality: () => emptyChain,
      rect: () => emptyChain,
      url: () => "",
    };
    return emptyChain;
  }

  // If source is already a string URL or local path
  if (typeof source === "string") {
    // If it's a Sanity asset reference string like "image-Tb9qssmk..."
    if (source.startsWith("image-")) {
      return imageBuilder.image(source);
    }
    const stringChain: any = {
      width: () => stringChain,
      height: () => stringChain,
      auto: () => stringChain,
      fit: () => stringChain,
      quality: () => stringChain,
      rect: () => stringChain,
      url: () => source,
    };
    return stringChain;
  }

  // If source is a plain object with image_url / url and no asset
  if (typeof source === "object" && !source.asset && !source._ref && !source._id) {
    const raw = source.image_url || source.url;
    if (typeof raw === "string" && !raw.startsWith("image-")) {
      const objChain: any = {
        width: () => objChain,
        height: () => objChain,
        auto: () => objChain,
        fit: () => objChain,
        quality: () => objChain,
        rect: () => objChain,
        url: () => raw,
      };
      return objChain;
    }
  }

  // Standard Sanity Image source (with asset, crop, hotspot)
  return imageBuilder.image(source);
}

/**
 * Helper to build responsive, format-optimized image URLs from Sanity image assets,
 * crop/hotspot objects, or fallback static/remote URLs.
 */
export function urlForImage(source: any, options?: ImageUrlOptions): string {
  if (!source) return "";

  // If it's a plain string URL or local asset path
  if (typeof source === "string") {
    if (!source.startsWith("image-")) {
      return source;
    }
  }

  // If it's an object with just image_url / url without asset
  if (typeof source === "object" && !source.asset && !source._ref && !source._id) {
    const raw = source.image_url || source.url;
    if (typeof raw === "string" && !raw.startsWith("image-")) {
      return raw;
    }
  }

  try {
    let builderInstance = urlFor(source).auto("format");

    if (options?.width) builderInstance = builderInstance.width(options.width);
    if (options?.height) builderInstance = builderInstance.height(options.height);
    if (options?.quality) builderInstance = builderInstance.quality(options.quality);
    if (options?.fit) builderInstance = builderInstance.fit(options.fit);

    return builderInstance.url() || "";
  } catch (err) {
    console.warn("Failed to generate Sanity image URL:", err);
    return typeof source === "string" ? source : source?.url || source?.image_url || "";
  }
}

/**
 * Resolves any image source to a valid URL string, falling back to a default architectural image.
 */
export function resolveSanityImageUrl(
  source: any,
  fallback: string = "/images/projects/coastal-cantilever.jpg"
): string {
  const url = urlForImage(source);
  if (!url) return fallback;
  if (url.startsWith("/") || url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  return fallback;
}
