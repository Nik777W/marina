import type { Metadata, Viewport } from "next";
import { Navigation } from "@/components/navigation";
import "./globals.css";
import { Geist, Dancing_Script } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});
const handwriting = Dancing_Script({subsets:['latin'],variable:'--font-handwriting'});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Marina Koptyakova — Lifestyle & Family Photographer",
  description: "Professional lifestyle and family photography by Marina Koptyakova",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full antialiased", "font-sans", geist.variable, handwriting.variable)}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col">
        <Navigation />
        <main className="flex flex-1 flex-col pt-[56px] md:pt-[72px]">{children}</main>
      </body>
    </html>
  );
}
