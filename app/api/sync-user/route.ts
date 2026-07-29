// app/api/sync-user/route.ts
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/upsert.php`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": process.env.API_KEY!,
    },
    body: JSON.stringify({
      google_id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      image: session.user.image,
      ...body,
    }),
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}