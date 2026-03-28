"use client";

import Link from "next/link";
import { type ComponentType } from "react";
import * as Lucide from "lucide-react";

type IconComponent = ComponentType<{
  className?: string;
  strokeWidth?: number;
}>;

export function Footer() {
  const currentYear = new Date().getFullYear();

  const InstagramIcon = (Lucide as any).Instagram
    ? ((Lucide as any).Instagram as IconComponent)
    : ((Lucide as any).Camera as IconComponent);

  const TelegramIcon = (Lucide as any).Send
    ? ((Lucide as any).Send as IconComponent)
    : ((Lucide as any).SendHorizontal as IconComponent);

  const MailIcon = (Lucide as any).Mail as IconComponent;

  const LoginIcon = (Lucide as any).LogIn
    ? ((Lucide as any).LogIn as IconComponent)
    : ((Lucide as any).UserRound as IconComponent);

  return (
    <footer className="w-full border-t border-black/10 bg-white px-4 py-12 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-center gap-6">
          <Link
            href="/"
            className="flex flex-col items-center text-black/50 transition-colors duration-300 hover:text-black/70"
          >
            <span className="font-serif text-xl tracking-wide md:text-2xl">
              Marina Koptyakova
            </span>
            <span className="mt-1 font-sans text-xs font-light uppercase tracking-[0.2em]">
              Lifestyle & Family Photographer
            </span>
          </Link>

          <div className="flex items-center gap-6">
            <Link
              href="https://www.instagram.com/marikopt?igsh=bWY5Y2Y3amdocXUz&utm_source=qr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-black/50 transition-colors duration-300 hover:text-black/70"
              aria-label="Instagram"
            >
              <InstagramIcon className="h-5 w-5" strokeWidth={1.5} />
            </Link>
            <Link
              href="https://t.me/mari_kopt"
              target="_blank"
              rel="noopener noreferrer"
              className="text-black/50 transition-colors duration-300 hover:text-black/70"
              aria-label="Telegram"
            >
              <TelegramIcon className="h-5 w-5" strokeWidth={1.5} />
            </Link>
            <Link
              href="mailto:contact@marinakoptyakova.com"
              className="text-black/50 transition-colors duration-300 hover:text-black/70"
              aria-label="Email"
            >
              <MailIcon className="h-5 w-5" strokeWidth={1.5} />
            </Link>
            <Link
              href="/auth/login"
              className="text-black/50 transition-colors duration-300 hover:text-black/70"
              aria-label="Войти"
            >
              <LoginIcon className="h-4 w-4" strokeWidth={1.5} />
            </Link>
          </div>

          <div className="w-full max-w-md border-t border-black/10 pt-4 text-center">
            <p className="font-sans text-sm font-light text-black/50">
              &copy; {currentYear} Marina Koptyakova. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
