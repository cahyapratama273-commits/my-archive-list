import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

/**
 * GET /api/sync-user
 * Mengambil profil user (termasuk wishlist) dari DB.
 * Dipakai oleh halaman Wishlist & Setting untuk load data cloud.
 */
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized: Kamu belum login." },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User tidak ditemukan di database.", found: false },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, found: true, user });
  } catch (error: any) {
    console.error("[GET /api/sync-user] Error:", error);
    return NextResponse.json(
      {
        error: "Gagal mengambil data dari database.",
        detail: error?.message ?? "Unknown error",
        code: error?.code,
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/sync-user
 * Menyimpan/mengupdate profil user dan merge wishlist ke DB.
 */
export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized: Kamu belum login." },
        { status: 401 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const {
      wishlist: incomingWishlist,
    }: { wishlist?: { id: number; category: string }[] } = body;

    // Ambil user saat ini dari DB
    const existing = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    // Merge wishlist (hindari duplikat dengan composite key category-id)
    let finalWishlist: { id: number; category: string }[] = [];
    if (existing?.wishlist) {
      const dbList = (
        typeof existing.wishlist === "string"
          ? JSON.parse(existing.wishlist)
          : existing.wishlist
      ) as { id: number; category: string }[];
      const merged = new Map<string, { id: number; category: string }>();
      dbList.forEach((item) => merged.set(`${item.category}-${item.id}`, item));
      if (Array.isArray(incomingWishlist)) {
        incomingWishlist.forEach((item) =>
          merged.set(`${item.category}-${item.id}`, item)
        );
      }
      finalWishlist = Array.from(merged.values());
    } else if (Array.isArray(incomingWishlist)) {
      finalWishlist = incomingWishlist;
    }

    const googleId = session.user.id || session.user.email;

    const user = await prisma.user.upsert({
      where: { email: session.user.email },
      update: {
        id: googleId,
        name: session.user.name || existing?.name || "",
        image: session.user.image ?? existing?.image,
        wishlist: finalWishlist,
      },
      create: {
        id: googleId,
        email: session.user.email,
        name: session.user.name || "",
        image: session.user.image,
        wishlist: finalWishlist,
      },
    });

    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    console.error("[POST /api/sync-user] Error:", error);
    return NextResponse.json(
      {
        error: "Gagal menyimpan data ke database.",
        detail: error?.message ?? "Unknown error",
        code: error?.code,
      },
      { status: 500 }
    );
  }
}
