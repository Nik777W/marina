"use client";

import Link from "next/link";
import { type ComponentType } from "react";
import * as Lucide from "lucide-react";

export function Navigation() {
  const InstagramIcon =
    (Lucide as Record<string, ComponentType<{ className?: string; strokeWidth?: number }>>).Instagram ??
    Lucide.Camera;
  const TelegramIcon =
    (Lucide as Record<string, ComponentType<{ className?: string; strokeWidth?: number }>>).Send ??
    Lucide.SendHorizontal;
  const MailIcon = Lucide.Mail;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-black/10 bg-white px-4 py-6 md:px-8">
      <nav className="mx-auto flex max-w-7xl items-center justify-between">
        <Link href="/" className="flex flex-col">
          <span className="font-serif text-2xl tracking-wide text-black md:text-3xl">
            Marina Koptyakova
          </span>
          <span className="font-sans text-xs font-light uppercase tracking-[0.2em] text-black md:text-sm">
            Lifestyle & Family Photographer
          </span>
        </Link>

        <div className="flex items-center gap-4 md:gap-6">
          <Link
            href="https://www.instagram.com/marikopt?igsh=bWY5Y2Y3amdocXUz&utm_source=qr"
            target="_blank"
            rel="noopener noreferrer"
            className="text-black transition-opacity duration-300 hover:opacity-70"
            aria-label="Instagram"
          >
            <InstagramIcon className="h-5 w-5 md:h-6 md:w-6" strokeWidth={1.5} />
          </Link>
          <Link
            href="https://t.me/mari_kopt"
            target="_blank"
            rel="noopener noreferrer"
            className="text-black transition-opacity duration-300 hover:opacity-70"
            aria-label="Telegram"
          >
            <TelegramIcon className="h-5 w-5 md:h-6 md:w-6" strokeWidth={1.5} />
          </Link>
          <Link
            href="mailto:contact@marinakoptyakova.com"
            className="text-black transition-opacity duration-300 hover:opacity-70"
            aria-label="Email"
          >
            <MailIcon className="h-5 w-5 md:h-6 md:w-6" strokeWidth={1.5} />
          </Link>
        </div>
      </nav>
    </header>
  );
}
