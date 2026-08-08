"use client";

import { SessionProvider } from "next-auth/react";
import ApiAlert from "./ApiAlert";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      {/* Global HTTP Error Alert — muncul di pojok kanan bawah */}
      <ApiAlert />
    </SessionProvider>
  );
}