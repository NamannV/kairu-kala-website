import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/navigation/Navigation";
import Footer from "@/components/layout/Footer";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "KAIRU KALA — Contemporary Architecture & Design Studio",
  description: "KAIRU KALA is a bespoke architecture and design studio creating timeless, culturally resonant, and contextually shaped spaces.",
  keywords: [
    "KAIRU KALA",
    "Architecture Firm",
    "Architecture Studio",
    "Bespoke Residential Design",
    "Cultural Architecture",
    "Mangalore Architecture",
    "Contemporary Indian Architecture",
    "Interior Architecture",
  ],
  authors: [{ name: "KAIRU KALA" }],
  openGraph: {
    title: "KAIRU KALA — Contemporary Architecture & Design Studio",
    description: "Architecture shaped by context, culture, and human experience.",
    url: "https://kairukala.com",
    siteName: "KAIRU KALA",
    images: [
      {
        url: "/logo-emblem.png",
        width: 1200,
        height: 1200,
        alt: "KAIRU KALA Architectural Emblem",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#441515] text-[#F5E6C5] selection:bg-[#F5E6C5] selection:text-[#441515]">
        <Navigation />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
