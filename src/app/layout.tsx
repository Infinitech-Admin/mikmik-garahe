import type { Metadata, Viewport } from "next";

import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";

import { AuthProvider } from "@/context/auth-context";
import { CartProvider } from "@/context/cart-context";
import ChatWidget from "@/components/chat-widget";
import FloatingSocial from "@/components/floating-social";
import AnimatedSplash from "@/components/animated-splash";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Mikmik's Garahe | Cars for Sale",
    template: "%s | Mikmik's Garahe",
  },

  description:
    "Discover quality vehicles for sale at Mikmik's Garahe. Browse premium cars, explore detailed specifications, view photos and videos, and inquire about your next vehicle.",

  keywords: [
    "Mikmik's Garahe",
    "cars for sale",
    "used cars",
    "pre-owned cars",
    "car dealership",
    "car trading",
    "vehicles for sale",
    "automotive",
    "premium cars",
  ],

  authors: [{ name: "Mikmik's Garahe" }],
  creator: "Mikmik's Garahe",
  publisher: "Mikmik's Garahe",

  robots: {
    index: true,
    follow: true,
  },

  manifest: "/manifest.json",

  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Mikmik's Garahe",
  },

  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Mikmik's Garahe | Cars for Sale",
    description:
      "Explore quality vehicles with detailed specifications, photos, videos, and easy inquiry options.",
    siteName: "Mikmik's Garahe",
  },

  twitter: {
    card: "summary_large_image",
    title: "Mikmik's Garahe | Cars for Sale",
    description:
      "Find your next vehicle. Browse our latest inventory and explore every car in detail.",
  },

  icons: {
    icon: "/favicon.ico",
    apple: "/icons/icon-192x192.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#39FF14",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#06030D] text-white">
        <AuthProvider>
          <CartProvider>
            {children}
            <AnimatedSplash />
            <FloatingSocial />
            <ChatWidget />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
