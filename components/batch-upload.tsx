"use client";

import { useCallback, useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

interface BatchUploadProps {
  onUploadComplete?: () => void;
}

interface FileWithPreview {
  file: File;
  id: string;
  status: "pending" | "uploading" | "completed" | "error";
  error?: string;
  width?: number;
  height?: number;
}

const ACCEPTED_TYPES = "image/jpeg,image/png,image/webp,image/gif";

// Simple UUID generator compatible with SSR
function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function BatchUpload({ onUploadComplete }: BatchUploadProps) {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ completed: 0, total: 0 });
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const addFiles = useCallback((fileList: FileList | null) => {
    if (!fileList) return;

    Array.from(fileList).forEach((file) => {
      if (file.type.startsWith("image/")) {
        const id = generateUUID();
        const newFile: FileWithPreview = {
          file,
          id,
          status: "pending",
        };

        // Read image dimensions
        const img = new Image();
        const objectUrl = URL.createObjectURL(file);
        img.onload = () => {
          URL.revokeObjectURL(objectUrl);
          setFiles((prev) =>
            prev.map((f) =>
              f.id === id
                ? { ...f, width: img.naturalWidth, height: img.naturalHeight }
                : f
            )
          );
        };
        img.src = objectUrl;

        setFiles((prev) => [...prev, newFile]);
      }
    });
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      addFiles(e.dataTransfer.files);
    },
    [addFiles]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      addFiles(e.target.files);
      e.target.value = "";
    },
    [addFiles]
  );

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setFiles([]);
    setUploadProgress({ completed: 0, total: 0 });
  }, []);

  const handleUpload = useCallback(async () => {
    if (files.length === 0) return;

    const supabase = createClient();
    setIsUploading(true);
    setUploadProgress({ completed: 0, total: files.length });

    const pendingFiles = files.filter((f) => f.status === "pending");
    let completedCount = 0;

    try {
      const { data: topRow } = await supabase
        .from("gallery_photos")
        .select("sort_order")
        .order("sort_order", { ascending: false })
        .limit(1)
        .maybeSingle();
      let maxOrder = topRow?.sort_order ?? 0;

      for (const fileWithPreview of pendingFiles) {
        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileWithPreview.id ? { ...f, status: "uploading" } : f
          )
        );

        try {
          const file = fileWithPreview.file;
          const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
          const path = `${generateUUID()}.${ext}`;

          const { error: upErr } = await supabase.storage
            .from("gallery")
            .upload(path, file, { cacheControl: "3600", upsert: false });

          if (upErr) throw upErr;

          maxOrder += 10;
          const { error: insErr } = await supabase.from("gallery_photos").insert({
            storage_path: path,
            alt_text: "",
            aspect_ratio: "portrait",
            is_visible: true,
            sort_order: maxOrder,
            width: fileWithPreview.width ?? null,
            height: fileWithPreview.height ?? null,
          });

          if (insErr) throw insErr;

          completedCount++;
          setUploadProgress({ completed: completedCount, total: files.length });
          setFiles((prev) =>
            prev.map((f) =>
              f.id === fileWithPreview.id ? { ...f, status: "completed" } : f
            )
          );
        } catch (error: unknown) {
          const errorMsg = error instanceof Error ? error.message : "Upload failed";
          setFiles((prev) =>
            prev.map((f) =>
              f.id === fileWithPreview.id
                ? { ...f, status: "error", error: errorMsg }
                : f
            )
          );
        }
      }

      const hasErrors = files.some((f) => f.status === "error");
      if (!hasErrors && completedCount > 0) {
        setTimeout(() => {
          clearAll();
          onUploadComplete?.();
        }, 500);
      }
    } finally {
      setIsUploading(false);
    }
  }, [files, clearAll, onUploadComplete]);

  const pendingCount = files.filter((f) => f.status === "pending").length;

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-black/10 bg-white p-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-medium text-black">Групповая загрузка</h2>
          <p className="text-sm text-black/50">
            Перетащите фото или выберите файлы
          </p>
        </div>
        {files.length > 0 && !isUploading && (
          <button
            onClick={clearAll}
            className="text-sm text-black/50 hover:text-black"
          >
            Очистить все
          </button>
        )}
      </div>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors",
          isDragging
            ? "border-black bg-black/5"
            : "border-black/20 hover:border-black/40"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_TYPES}
          multiple
          className="hidden"
          onChange={handleFileSelect}
        />
        <p className="text-sm text-black/60">
          {isDragging
            ? "Отпустите файлы для загрузки"
            : "Перетащите сюда фото или кликните для выбора"}
        </p>
        <p className="mt-1 text-xs text-black/40">
          JPG, PNG, WebP, GIF
        </p>
      </div>

      {files.length > 0 && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-black/70">
              Выбрано: {files.length} файл{files.length !== 1 ? "ов" : ""}
              {pendingCount !== files.length &&
                ` (${files.filter((f) => f.status === "completed").length} загружено)`}
            </span>
            {isUploading && (
              <span className="text-black/70">
                {uploadProgress.completed} из {uploadProgress.total}
              </span>
            )}
          </div>

          <ul className="flex max-h-48 flex-col gap-2 overflow-y-auto">
            {files.map((fileWithPreview) => (
              <li
                key={fileWithPreview.id}
                className="flex items-center justify-between rounded border border-black/10 px-3 py-2 text-sm"
              >
                <div className="flex min-w-0 items-center gap-2">
                  <span
                    className={cn(
                      "h-2 w-2 shrink-0 rounded-full",
                      fileWithPreview.status === "pending" && "bg-amber-400",
                      fileWithPreview.status === "uploading" && "bg-blue-500",
                      fileWithPreview.status === "completed" && "bg-green-500",
                      fileWithPreview.status === "error" && "bg-red-500"
                    )}
                  />
                  <span className="truncate text-black/80">
                    {fileWithPreview.file.name}
                  </span>
                  <span className="shrink-0 text-xs text-black/40">
                    {(fileWithPreview.file.size / 1024 / 1024).toFixed(1)} MB
                  </span>
                </div>
                {fileWithPreview.status === "error" && (
                  <span className="shrink-0 text-xs text-red-600">
                    Ошибка
                  </span>
                )}
                {!isUploading && fileWithPreview.status !== "completed" && (
                  <button
                    onClick={() => removeFile(fileWithPreview.id)}
                    className="shrink-0 text-xs text-red-600 hover:text-red-700"
                  >
                    Удалить
                  </button>
                )}
              </li>
            ))}
          </ul>

          {isUploading && (
            <div className="h-2 w-full overflow-hidden rounded-full bg-black/10">
              <div
                className="h-full bg-black transition-all duration-300"
                style={{
                  width: `${(uploadProgress.completed / uploadProgress.total) * 100}%`,
                }}
              />
            </div>
          )}

          {pendingCount > 0 && !isUploading && (
            <button
              onClick={handleUpload}
              className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-black/85"
            >
              Загрузить {pendingCount} файл{pendingCount !== 1 ? "а" : ""}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
