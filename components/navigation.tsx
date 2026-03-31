"use client";

import Link from "next/link";
import { type ComponentType } from "react";
import * as Lucide from "lucide-react";

export function Navigation() {
  type IconComponent = ComponentType<{
    className?: string;
    strokeWidth?: number;
  }>;

  // Custom Instagram icon that looks more like the real Instagram logo
  const InstagramIcon = ({ className, strokeWidth = 1.5 }: { className?: string; strokeWidth?: number }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="2" y="2" width="20" height="20" rx="6" ry="6" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="18" cy="6" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );

  const TelegramIcon = (Lucide as any).Send
    ? ((Lucide as any).Send as IconComponent)
    : ((Lucide as any).SendHorizontal as IconComponent);

  const MailIcon = (Lucide as any).Mail as IconComponent;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full border-b border-black/10 bg-white px-4 py-2 md:py-4 md:px-8">
      <nav className="mx-auto flex max-w-7xl flex-col md:flex-row items-center justify-between gap-2 md:gap-0">
        {/* Mobile: Row 1 - Title + Icons */}
        <div className="flex w-full items-center justify-between md:hidden">
          <Link href="/" className="flex flex-col items-start">
            <span className="font-serif text-xl tracking-wide text-black">
              Marina Koptyakova
            </span>
            <span className="mt-1 font-sans text-[10px] font-light uppercase tracking-[0.15em] text-black max-w-full truncate">
              Lifestyle & Family Photographer
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="https://www.instagram.com/marikopt?igsh=bWY5Y2Y3amdocXUz&utm_source=qr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-black transition-opacity duration-300 hover:opacity-70"
              aria-label="Instagram"
            >
              <InstagramIcon className="h-5 w-5" strokeWidth={1.5} />
            </Link>
            <Link
              href="https://t.me/mari_kopt"
              target="_blank"
              rel="noopener noreferrer"
              className="text-black transition-opacity duration-300 hover:opacity-70"
              aria-label="Telegram"
            >
              <TelegramIcon className="h-5 w-5" strokeWidth={1.5} />
            </Link>
            <Link
              href="mailto:contact@marinakoptyakova.com"
              className="text-black transition-opacity duration-300 hover:opacity-70"
              aria-label="Email"
            >
              <MailIcon className="h-5 w-5" strokeWidth={1.5} />
            </Link>
          </div>
        </div>

        {/* Mobile: Nav links below - aligned right under icons */}
        <nav className="flex md:hidden gap-4 text-xs w-full justify-end">
          <a href="#about" className="text-black/60 hover:text-black transition-colors">Sobre mí</a>
          <a href="#pricing" className="text-black/60 hover:text-black transition-colors">Precios</a>
        </nav>

        {/* Desktop: Title left, Nav + Icons right */}
        <Link href="/" className="hidden md:flex flex-col items-start">
          <span className="font-serif text-2xl lg:text-3xl tracking-wide text-black">
            Marina Koptyakova
          </span>
          <span className="mt-1 font-sans text-xs font-light uppercase tracking-[0.2em] text-black max-w-full truncate">
            Lifestyle & Family Photographer
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <nav className="flex gap-6 mr-4">
            <a href="#about" className="text-sm text-black/60 hover:text-black transition-colors">Sobre mí</a>
            <a href="#pricing" className="text-sm text-black/60 hover:text-black transition-colors">Precios</a>
          </nav>
          <Link
            href="https://www.instagram.com/marikopt?igsh=bWY5Y2Y3amdocXUz&utm_source=qr"
            target="_blank"
            rel="noopener noreferrer"
            className="text-black transition-opacity duration-300 hover:opacity-70"
            aria-label="Instagram"
          >
            <InstagramIcon className="h-6 w-6" strokeWidth={1.5} />
          </Link>
          <Link
            href="https://t.me/mari_kopt"
            target="_blank"
            rel="noopener noreferrer"
            className="text-black transition-opacity duration-300 hover:opacity-70"
            aria-label="Telegram"
          >
            <TelegramIcon className="h-6 w-6" strokeWidth={1.5} />
          </Link>
          <Link
            href="mailto:contact@marinakoptyakova.com"
            className="text-black transition-opacity duration-300 hover:opacity-70"
            aria-label="Email"
          >
            <MailIcon className="h-6 w-6" strokeWidth={1.5} />
          </Link>
        </div>
      </nav>
    </header>
  );
}
