import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { prisma } from "@/app/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],
  trustHost: true,
  pages: {
    signIn: "/setting",
  },
  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (user) {
        token.id = user.id;
      }
      if (account && profile) {
        token.googleId = profile.sub;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id =
          (token.googleId as string) ||
          (token.id as string) ||
          (token.sub as string);
      }
      return session;
    },
  },
  events: {
    /**
     * Dipanggil server-side setiap kali user berhasil login.
     * Ini memastikan user selalu tersimpan di DB tanpa bergantung
     * pada kunjungan ke halaman /setting.
     */
    async signIn({ user, account, profile }) {
      try {
        if (!user.email) return;

        const googleId =
          (profile?.sub as string) || user.id || user.email;

        await prisma.user.upsert({
          where: { email: user.email },
          update: {
            id: googleId,
            name: user.name || "",
            image: user.image,
          },
          create: {
            id: googleId,
            email: user.email,
            name: user.name || "",
            image: user.image,
            wishlist: [],
          },
        });
      } catch (err) {
        // Jangan throw — agar login tidak gagal meski DB error
        console.error("[auth/events] Gagal upsert user ke DB:", err);
      }
    },
  },
});