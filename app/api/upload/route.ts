import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { sanityWriteClient, isSanityConfigured } from "@/lib/sanity/client";
import fs from "fs";
import path from "path";

export async function POST(request: Request) {
  try {
    const authed = await isAuthenticated();
    if (!authed) {
      return NextResponse.json({ error: "Unauthorized upload request." }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = path.extname(file.name) || ".jpg";
    const cleanBaseName = path.basename(file.name, ext).replace(/[^a-zA-Z0-9_-]/g, "_");
    const fileName = `${cleanBaseName}_${Date.now()}${ext}`;

    // If Sanity write client is configured, upload directly to Sanity Asset CDN
    if (isSanityConfigured() && sanityWriteClient) {
      try {
        const asset = await sanityWriteClient.assets.upload("image", buffer, {
          filename: file.name,
          contentType: file.type || "image/jpeg",
        });

        if (asset && asset.url) {
          return NextResponse.json({
            url: asset.url,
            assetId: asset._id,
            fileName: file.name,
          });
        }
      } catch (err) {
        console.warn("Sanity asset upload failed, falling back to local storage:", err);
      }
    }

    // Local disk upload fallback
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const filePath = path.join(uploadsDir, fileName);
    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/${fileName}`;
    return NextResponse.json({ url: publicUrl, fileName });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "File upload failed." }, { status: 500 });
  }
}
