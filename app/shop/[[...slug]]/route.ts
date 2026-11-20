import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug } = await params;
  
  // If /shop/prints, serve the 3D gallery (index.html)
  if (!slug || slug.length === 0 || (slug.length === 1 && slug[0] === "prints")) {
    const filePath = path.join(process.cwd(), "public", "shutabug", "index.html");
    const html = fs.readFileSync(filePath, "utf-8");
    return new NextResponse(html, {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  // If /shop/prints/[collection]/[product], serve dossier.html
  const filePath = path.join(process.cwd(), "public", "shutabug", "dossier.html");
  const html = fs.readFileSync(filePath, "utf-8");
  return new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
