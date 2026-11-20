import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ base: "USD", rates: { USD: 1, INR: 86.5 } });
}
