import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Playfair_Display, Outfit, Cinzel, Orbitron } from "next/font/google";
import "./globals.css";
// import { Header } from "@/components/layout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Utkarsh 2026 | Evolution through Heritage",
  description: "Annual Techno-Cultural Fest of our college.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${playfair.variable} ${outfit.variable} ${cinzel.variable} ${orbitron.variable} antialiased`}
      >
        {/* <Header /> */}
        {children}
      </body>
    </html>
  );
}
