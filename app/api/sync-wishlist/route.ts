import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

/**
 * POST /api/sync-wishlist
 * Menyimpan wishlist user ke DB (replace penuh — bukan merge).
 * Dipanggil setiap kali user tambah/hapus item dari wishlist.
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

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Request body tidak valid (bukan JSON)." },
        { status: 400 }
      );
    }

    const { wishlist } = body as { wishlist?: unknown };

    if (!Array.isArray(wishlist)) {
      return NextResponse.json(
        { error: "Field 'wishlist' harus berupa array." },
        { status: 400 }
      );
    }

    const googleId = session.user.id || session.user.email;

    // Upsert user + replace wishlist penuh
    const user = await prisma.user.upsert({
      where: { email: session.user.email },
      update: {
        wishlist: wishlist,
      },
      create: {
        id: googleId!,
        email: session.user.email,
        name: session.user.name || "",
        image: session.user.image,
        wishlist: wishlist,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Wishlist berhasil disimpan ke database.",
      count: wishlist.length,
      user,
    });
  } catch (error: any) {
    console.error("[POST /api/sync-wishlist] Error:", error);
    return NextResponse.json(
      {
        error: "Gagal menyimpan wishlist ke database.",
        detail: error?.message ?? "Unknown error",
        code: error?.code,
      },
      { status: 500 }
    );
  }
}
