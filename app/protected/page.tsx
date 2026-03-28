import Link from "next/link";
import { redirect } from "next/navigation";

import { GalleryAdmin } from "@/components/gallery-admin";
import { LogoutButton } from "@/components/logout-button";
import { createClient } from "@/lib/supabase/server";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  return (
    <div className="min-h-svh w-full bg-zinc-50 px-4 py-8 text-black md:px-8">
      <div className="mx-auto flex max-w-4xl flex-col gap-8">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-black/10 pb-4">
          <div>
            <p className="text-sm text-black/50">Личный кабинет</p>
            <p className="font-medium">{String(data.claims.email ?? "")}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/"
              className="rounded-md border border-black/15 px-3 py-1.5 text-sm hover:bg-white"
            >
              На главную
            </Link>
            <LogoutButton />
          </div>
        </header>
        <GalleryAdmin />
      </div>
    </div>
  );
}
