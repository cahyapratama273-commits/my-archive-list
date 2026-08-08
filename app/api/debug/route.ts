import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

/**
 * GET /api/debug
 * Endpoint diagnostik untuk mengecek:
 * - Apakah DATABASE_URL ada
 * - Apakah Prisma bisa konek ke DB
 * - Apakah user yang sedang login sudah ada di DB
 *
 * HANYA aktif di non-production environment.
 */
export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "Debug endpoint tidak tersedia di production." },
      { status: 403 }
    );
  }

  const report: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    env: {
      DATABASE_URL: process.env.DATABASE_URL
        ? `✅ Ada (${process.env.DATABASE_URL.substring(0, 30)}...)`
        : "❌ TIDAK ADA — ini penyebab utama sync gagal!",
      AUTH_SECRET: process.env.AUTH_SECRET ? "✅ Ada" : "❌ TIDAK ADA",
      AUTH_GOOGLE_ID: process.env.AUTH_GOOGLE_ID ? "✅ Ada" : "❌ TIDAK ADA",
    },
  };

  // Test koneksi Prisma
  try {
    await prisma.$queryRaw`SELECT 1`;
    report.database = "✅ Koneksi Prisma berhasil";
  } catch (err: any) {
    report.database = `❌ Koneksi Prisma GAGAL: ${err?.message}`;
    report.databaseError = err?.message;
    return NextResponse.json(report, { status: 500 });
  }

  // Cek session user
  try {
    const session = await auth();
    if (session?.user?.email) {
      report.session = `✅ Login sebagai: ${session.user.email}`;

      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
      });

      if (user) {
        const wishlistArr = Array.isArray(user.wishlist)
          ? user.wishlist
          : typeof user.wishlist === "string"
          ? JSON.parse(user.wishlist)
          : [];

        report.userInDb = {
          status: "✅ User ditemukan di database",
          id: user.id,
          email: user.email,
          name: user.name,
          createdAt: user.createdAt,
          wishlistCount: wishlistArr.length,
        };
      } else {
        report.userInDb =
          "❌ User TIDAK ditemukan di database — sync belum berjalan";
      }
    } else {
      report.session = "ℹ️ Tidak ada sesi login aktif";
      report.userInDb = "N/A (belum login)";
    }
  } catch (err: any) {
    report.session = `❌ Error saat cek session: ${err?.message}`;
  }

  return NextResponse.json(report, { status: 200 });
}
