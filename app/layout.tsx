import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SIMASIP JU 2 | Sistem Manajemen Arsip",
  description: "Sistem Manajemen Arsip Suku Dinas Pendidikan Wilayah II Kota Administrasi Jakarta Utara",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning data-theme="light">
      <body>{children}</body>
    </html>
  );
}
