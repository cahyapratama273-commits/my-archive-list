import { NextRequest, NextResponse } from "next/server";
import { searchAll } from "@/app/lib/data";

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("q") || "";
  return NextResponse.json(searchAll(query));
}