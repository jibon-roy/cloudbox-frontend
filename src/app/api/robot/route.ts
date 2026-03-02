// src/app/api/robot/route.ts
import { NextResponse } from "next/server";

// Deprecated: this route previously served robots.txt. Keep as redirect to static file.
export async function GET() {
  return NextResponse.redirect("/robots.txt");
}
