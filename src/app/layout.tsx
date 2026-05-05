import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import MainLayout from "@/components/MainLayout";

export const metadata: Metadata = {
  title: "UniHive — Akademik Yardımlaşma Platformu",
  description: "Üniversite öğrencileri için akademik soru-cevap ve yardımlaşma platformu.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body>
        <Providers>
          <MainLayout>
            {children}
          </MainLayout>
        </Providers>
      </body>
    </html>
  );
}
