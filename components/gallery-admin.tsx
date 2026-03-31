"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

import type { GalleryAspectRatio, GalleryPhotoRow } from "@/lib/gallery";
import { getGalleryPublicUrl } from "@/lib/gallery";
import { createClient } from "@/lib/supabase/client";

const ASPECT_OPTIONS: GalleryAspectRatio[] = [
  "portrait",
  "landscape",
  "square",
  "tall",
];

export function GalleryAdmin() {
  const [rows, setRows] = useState<GalleryPhotoRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const supabase = createClient();
    setError(null);
    const { data, error: qErr } = await supabase
      .from("gallery_photos")
      .select("id, storage_path, alt_text, aspect_ratio, is_visible, sort_order, width, height")
      .order("sort_order", { ascending: true });

    if (qErr) {
      setError(qErr.message);
      setRows([]);
    } else {
      setRows((data ?? []) as GalleryPhotoRow[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function saveMeta(id: string, alt_text: string, aspect_ratio: GalleryAspectRatio) {
    const supabase = createClient();
    setError(null);
    const { error: uErr } = await supabase
      .from("gallery_photos")
      .update({ alt_text, aspect_ratio })
      .eq("id", id);
    if (uErr) setError(uErr.message);
    else await load();
  }

  async function toggleVisible(row: GalleryPhotoRow) {
    const supabase = createClient();
    setError(null);
    const { error: uErr } = await supabase
      .from("gallery_photos")
      .update({ is_visible: !row.is_visible })
      .eq("id", row.id);
    if (uErr) setError(uErr.message);
    else await load();
  }

  async function removeRow(row: GalleryPhotoRow) {
    if (!confirm("Удалить фото из галереи и из хранилища?")) return;
    const supabase = createClient();
    setError(null);
    const { error: stErr } = await supabase.storage
      .from("gallery")
      .remove([row.storage_path]);
    if (stErr) {
      setError(stErr.message);
      return;
    }
    const { error: dErr } = await supabase
      .from("gallery_photos")
      .delete()
      .eq("id", row.id);
    if (dErr) setError(dErr.message);
    await load();
  }

  async function move(index: number, direction: -1 | 1) {
    const j = index + direction;
    if (j < 0 || j >= rows.length) return;
    const supabase = createClient();
    const a = rows[index];
    const b = rows[j];
    const orderA = a.sort_order;
    const orderB = b.sort_order;
    setError(null);
    const { error: e1 } = await supabase
      .from("gallery_photos")
      .update({ sort_order: orderB })
      .eq("id", a.id);
    if (e1) {
      setError(e1.message);
      return;
    }
    const { error: e2 } = await supabase
      .from("gallery_photos")
      .update({ sort_order: orderA })
      .eq("id", b.id);
    if (e2) setError(e2.message);
    await load();
  }

  if (loading) {
    return <p className="text-sm text-black/60">Загрузка галереи…</p>;
  }

  return (
    <div className="flex w-full max-w-4xl flex-col gap-6">
      <div>
        <h1 className="text-lg font-medium text-black">Галерея</h1>
        <p className="text-sm text-black/50">
          Порядок, видимость на главной и подписи.
        </p>
      </div>

      {error && (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {error}
        </p>
      )}

      {rows.length === 0 ? (
        <p className="text-sm text-black/50">Пока нет фото. Загрузите первое.</p>
      ) : (
        <ul className="flex flex-col gap-4">
          {rows.map((row, index) => (
            <li
              key={row.id}
              className="flex flex-col gap-3 rounded-lg border border-black/10 bg-white p-4 sm:flex-row"
            >
              <div className="relative h-40 w-full shrink-0 overflow-hidden rounded-md bg-zinc-100 sm:h-32 sm:w-44">
                <Image
                  src={getGalleryPublicUrl(row.storage_path)}
                  alt={row.alt_text || "preview"}
                  fill
                  className="object-cover"
                  sizes="200px"
                />
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <label className="flex items-center gap-2 text-sm text-black/70">
                    <input
                      type="checkbox"
                      checked={row.is_visible}
                      onChange={() => void toggleVisible(row)}
                    />
                    На главной
                  </label>
                  {!row.is_visible && (
                    <span className="text-xs text-amber-700">скрыто</span>
                  )}
                </div>
                <div className="text-xs text-black/40">
                  {row.width && row.height ? `${row.width}×${row.height}px` : "Размеры не определены"}
                </div>
                <input
                  type="text"
                  defaultValue={row.alt_text}
                  placeholder="Подпись (alt)"
                  className="w-full rounded border border-black/15 px-2 py-1 text-sm"
                  key={`${row.id}-alt-${row.alt_text}`}
                  onBlur={(e) => {
                    const v = e.target.value;
                    if (v !== row.alt_text) {
                      void saveMeta(row.id, v, row.aspect_ratio);
                    }
                  }}
                />
                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={row.aspect_ratio}
                    className="rounded border border-black/15 px-2 py-1 text-sm"
                    onChange={(e) => {
                      const ar = e.target.value as GalleryAspectRatio;
                      void saveMeta(row.id, row.alt_text, ar);
                    }}
                  >
                    {ASPECT_OPTIONS.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      disabled={index === 0}
                      className="rounded border border-black/15 px-2 py-1 text-xs disabled:opacity-40"
                      onClick={() => void move(index, -1)}
                    >
                      Вверх
                    </button>
                    <button
                      type="button"
                      disabled={index === rows.length - 1}
                      className="rounded border border-black/15 px-2 py-1 text-xs disabled:opacity-40"
                      onClick={() => void move(index, 1)}
                    >
                      Вниз
                    </button>
                    <button
                      type="button"
                      className="rounded border border-red-200 px-2 py-1 text-xs text-red-700 hover:bg-red-50"
                      onClick={() => void removeRow(row)}
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
