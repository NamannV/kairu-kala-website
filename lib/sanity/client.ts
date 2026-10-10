import { createClient } from "next-sanity";
import { projectId, dataset, apiVersion, token, isSanityConfigured } from "./config";

// Read client (uses CDN in production for fast edge cached delivery)
export const sanityClient = isSanityConfigured()
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: process.env.NODE_ENV === "production",
      perspective: "published",
    })
  : null;

// Write client (authenticated for mutations and fresh server-side reads)
export const sanityWriteClient = isSanityConfigured() && token
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      token,
      useCdn: false,
    })
  : sanityClient;

export { isSanityConfigured };
