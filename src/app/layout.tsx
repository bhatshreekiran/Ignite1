import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ignite AI – Logo Reveal",
  description: "Ignite AI Club – Department of AI & Data Science. Exclusive logo reveal experience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Outfit:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased scanlines">
        {/* Mesh gradient background */}
        <div className="mesh-gradient" aria-hidden="true" />

        {/* Floating orbs */}
        <div className="orb orb-1" aria-hidden="true" />
        <div className="orb orb-2" aria-hidden="true" />
        <div className="orb orb-3" aria-hidden="true" />

        {/* Grid + noise overlays */}
        <div className="fixed inset-0 bg-grid pointer-events-none z-0" aria-hidden="true" />
        <div className="noise-overlay" aria-hidden="true" />

        {/* Main content */}
        <main className="relative z-10">
          {children}
        </main>
      </body>
    </html>
  );
}
