import { prisma } from "./prisma";
import { Category } from "./type";

interface SyncProfilePayload {
  google_id: string;
  email: string;
  name: string;
  image?: string | null;
  wishlist?: { id: number; category: Category }[];
}

/**
 * Menyinkronkan profil user dan wishlist langsung ke database PostgreSQL menggunakan Prisma
 */
export async function syncUserProfileToCloud(payload: SyncProfilePayload) {
  try {
    const { google_id, email, name, image, wishlist } = payload;

    // Cari user berdasarkan email
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      // Gabungkan wishlist. Mengirimkan data wishlist
      let updatedWishlist = existingUser.wishlist || [];
      if (Array.isArray(wishlist) && wishlist.length > 0) {
        const mergedMap = new Map<string, { id: number; category: Category }>();
        const dbWishlist = (typeof updatedWishlist === "string" 
          ? JSON.parse(updatedWishlist) 
          : updatedWishlist) as { id: number; category: Category }[];

        dbWishlist.forEach((item) => mergedMap.set(`${item.category}-${item.id}`, item));
        wishlist.forEach((item) => mergedMap.set(`${item.category}-${item.id}`, item));

        updatedWishlist = Array.from(mergedMap.values());
      }

      const user = await prisma.user.update({
        where: { email },
        data: {
          id: google_id, // Update ID agar sinkron dengan ID Google
          name,
          image: image || existingUser.image,
          wishlist: updatedWishlist,
        },
      });

      return { success: true, user };
    } else {
      // Membuat user baru
      const user = await prisma.user.create({
        data: {
          id: google_id,
          email,
          name,
          image,
          wishlist: wishlist || [],
        },
      });

      return { success: true, user };
    }
  } catch (error) {
    console.error("Gagal menyinkronkan profil ke database:", error);
    throw error;
  }
}

/**
 * Mengambil data profil pengguna dari database PostgreSQL menggunakan Prisma
 */
export async function getCloudUserProfile(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    return user;
  } catch (error) {
    console.error("Gagal mengambil profil dari database:", error);
    return null;
  }
}
