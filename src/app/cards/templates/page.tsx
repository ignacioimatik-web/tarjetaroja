"use client";

import { useState, useRef, useCallback } from "react";
import { ImagePlus, Trash2, Star, Check, Upload, AlertCircle, ImageOff } from "lucide-react";
import Link from "next/link";
import { cn, generateId } from "@/lib/utils";
import { useTemplates } from "@/lib/card-templates/context";
import { DEFAULT_LAYOUT } from "@/lib/card-templates/storage";
import type { CardTemplate, TemplateRarity } from "@/types";

const VALID_TYPES = ["image/png", "image/jpeg", "image/webp"];
const VALID_EXTENSIONS = [".png", ".jpg", ".jpeg", ".webp"];
const MAX_SIZE = 10 * 1024 * 1024;
const RECOMMENDED_RATIO = 2 / 3;

const rarityOptions: { value: TemplateRarity; label: string }[] = [
  { value: "common", label: "Common" },
  { value: "rare", label: "Rare" },
  { value: "epic", label: "Epic" },
  { value: "legendary", label: "Legendary" },
  { value: "mythic", label: "Mythic" },
  { value: "custom", label: "Custom" },
];

export default function TemplatesPage() {
  const { templates, loading, saveTemplate, deleteTemplate, setDefaultTemplate } = useTemplates();
  const [uploadState, setUploadState] = useState<"idle" | "dragging" | "preview">("idle");
  const [error, setError] = useState("");
  const [warning, setWarning] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [templateName, setTemplateName] = useState("");
  const [templateRarity, setTemplateRarity] = useState<TemplateRarity>("custom");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  function validateFile(file: File): boolean {
    setError("");
    setWarning("");

    const ext = "." + file.name.split(".").pop()?.toLowerCase();
    if (!VALID_TYPES.includes(file.type) && !VALID_EXTENSIONS.includes(ext)) {
      setError(`Formato no válido: ${file.type || ext}. Usa PNG, JPG, JPEG o WEBP.`);
      return false;
    }

    if (file.size > MAX_SIZE) {
      setError(`La imagen pesa ${(file.size / 1024 / 1024).toFixed(1)} MB. El máximo es 10 MB.`);
      return false;
    }

    return true;
  }

  function checkAspectRatio(w: number, h: number) {
    const ratio = w / h;
    const diff = Math.abs(ratio - RECOMMENDED_RATIO);
    if (diff > 0.15) {
      setWarning(`La proporción ${w}×${h} (${ratio.toFixed(2)}) no es 2:3 (0.667). Se recomienda 512×768, 768×1152 o 1024×1536.`);
    }
  }

  function handleFile(file: File) {
    if (!validateFile(file)) return;

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setTemplateName(file.name.replace(/\.[^/.]+$/, ""));
    setTemplateRarity("custom");

    const img = new Image();
    img.onload = () => {
      checkAspectRatio(img.width, img.height);
      URL.revokeObjectURL(img.src);
    };
    img.src = url;

    setUploadState("preview");
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setUploadState("idle");
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setUploadState("dragging");
  }

  function handleDragLeave() {
    setUploadState("idle");
  }

  async function handleSave() {
    if (!templateName.trim() || !previewUrl) return;
    setSaving(true);
    setError("");

    try {
      const resp = await fetch(previewUrl);
      const blob = await resp.blob();
      const reader = new FileReader();
      const dataUrl = await new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });

      const template: CardTemplate = {
        id: generateId(),
        name: templateName.trim(),
        rarity: templateRarity,
        imageUrl: dataUrl,
        createdAt: new Date().toISOString(),
        isDefault: false,
        source: "uploaded",
        layoutConfig: { ...DEFAULT_LAYOUT },
      };

      await saveTemplate(template);
      setUploadState("idle");
      setPreviewUrl("");
      setTemplateName("");
      setTemplateRarity("custom");
      setWarning("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar la plantilla");
    } finally {
      setSaving(false);
    }
  }

  function handleCancel() {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl("");
    setTemplateName("");
    setTemplateRarity("custom");
    setUploadState("idle");
    setError("");
    setWarning("");
  }

  async function handleDelete(template: CardTemplate) {
    if (template.source !== "uploaded") return;
    setDeleting(template.id);
    try {
      await deleteTemplate(template.id);
    } catch {
      setError("Error al eliminar la plantilla");
    } finally {
      setDeleting(null);
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
          <ImagePlus className="w-5 h-5 text-violet-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Plantillas de Tarjeta</h1>
          <p className="text-sm text-muted-foreground">Sube imágenes de fondo para tus fichas de jugador</p>
        </div>
      </div>

      {/* Upload section */}
      <div className="glass rounded-xl p-6 mb-8">
        <h2 className="text-sm font-semibold text-white mb-4">Subir nueva plantilla</h2>

        {uploadState === "preview" ? (
          <div className="space-y-4">
            <div className="flex items-start gap-6">
              <div className="w-32 h-44 rounded-lg overflow-hidden border border-border shrink-0 bg-black/40">
                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 space-y-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Nombre de la plantilla</label>
                  <input
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-black/40 border border-border text-sm text-white focus:outline-none focus:border-violet-500/50"
                    placeholder="Ej: Legendary Dark"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Rareza / Tipo</label>
                  <select
                    value={templateRarity}
                    onChange={(e) => setTemplateRarity(e.target.value as TemplateRarity)}
                    className="w-full px-3 py-2 rounded-lg bg-black/40 border border-border text-sm text-white focus:outline-none focus:border-violet-500/50"
                  >
                    {rarityOptions.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
                {warning && (
                  <div className="flex items-start gap-2 text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2">
                    <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                    <span>{warning}</span>
                  </div>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    disabled={saving || !templateName.trim()}
                    className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-violet-600 to-blue-600 text-white text-sm font-semibold rounded-lg hover:from-violet-500 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {saving ? (
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                    ) : (
                      <Upload className="w-4 h-4" />
                    )}
                    Guardar plantilla
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 bg-white/5 text-white/70 text-sm font-medium rounded-lg hover:bg-white/10 border border-border transition-all"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              "border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all",
              uploadState === "dragging"
                ? "border-violet-500 bg-violet-500/5"
                : "border-border hover:border-violet-500/50 hover:bg-white/[0.02]"
            )}
          >
            <ImagePlus className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
            <p className="text-sm text-white/80 font-medium mb-1">
              Arrastra una imagen aquí o haz clic para seleccionar
            </p>
            <p className="text-xs text-muted-foreground">
              PNG, JPG o WEBP · Máx 10 MB · Proporción recomendada 2:3
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".png,.jpg,.jpeg,.webp"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file);
                e.target.value = "";
              }}
            />
          </div>
        )}

        {error && (
          <div className="flex items-start gap-2 text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 mt-4">
            <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Gallery */}
      <div>
        <h2 className="text-sm font-semibold text-white mb-4">
          Galería de plantillas ({templates.length})
        </h2>
        {templates.length === 0 ? (
          <div className="glass rounded-xl p-12 text-center">
            <ImageOff className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No hay plantillas. Sube la primera usando el formulario de arriba.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {templates.map((template) => (
              <div
                key={template.id}
                className={cn(
                  "glass rounded-xl overflow-hidden group relative",
                  template.isDefault && "ring-2 ring-violet-500"
                )}
              >
                <div className="aspect-[2/3] bg-black/40 relative">
                  <img
                    src={template.imageUrl}
                    alt={template.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                  {template.isDefault && (
                    <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 bg-violet-600/90 text-white text-[9px] font-bold rounded">
                      <Star className="w-2.5 h-2.5" /> Default
                    </div>
                  )}
                  {template.source === "builtin" && (
                    <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-white/10 text-white/50 text-[8px] rounded">
                      built-in
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <p className="text-xs font-semibold text-white truncate">{template.name}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className={cn(
                      "text-[9px] px-1.5 py-0.5 rounded font-bold",
                      template.rarity === "legendary" ? "bg-amber-900/60 text-amber-300" :
                      template.rarity === "epic" ? "bg-violet-900/60 text-violet-300" :
                      template.rarity === "mythic" ? "bg-pink-900/60 text-pink-300" :
                      template.rarity === "rare" ? "bg-blue-900/60 text-blue-300" :
                      template.rarity === "common" ? "bg-zinc-800/60 text-zinc-300" :
                      "bg-white/5 text-white/50"
                    )}>
                      {template.rarity}
                    </span>
                    <span className={cn(
                      "text-[8px] px-1 py-0.5 rounded font-medium",
                      template.source === "uploaded" ? "bg-green-900/40 text-green-300" : "bg-white/5 text-white/30"
                    )}>
                      {template.source === "uploaded" ? "subida" : "integrada"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 mt-2">
                    {template.source === "uploaded" && (
                      <>
                        <button
                          onClick={() => handleDelete(template)}
                          disabled={deleting === template.id}
                          className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded bg-red-500/10 text-red-400 text-[10px] font-medium hover:bg-red-500/20 transition-all disabled:opacity-50"
                        >
                          {deleting === template.id ? (
                            <div className="animate-spin w-3 h-3 border-2 border-red-400 border-t-transparent rounded-full" />
                          ) : (
                            <Trash2 className="w-3 h-3" />
                          )}
                          Eliminar
                        </button>
                        {!template.isDefault && (
                          <button
                            onClick={() => setDefaultTemplate(template.id)}
                            className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded bg-violet-500/10 text-violet-400 text-[10px] font-medium hover:bg-violet-500/20 transition-all"
                          >
                            <Star className="w-3 h-3" />
                            Default
                          </button>
                        )}
                        {template.isDefault && (
                          <div className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded bg-violet-500/10 text-violet-400 text-[10px] font-medium">
                            <Check className="w-3 h-3" />
                            Predet.
                          </div>
                        )}
                      </>
                    )}
                    {template.source === "builtin" && (
                      <div className="flex-1 text-center text-[10px] text-muted-foreground">
                         {template.isDefault ? "Predeterminada" : ""}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom nav */}
      <div className="mt-8 flex items-center justify-center gap-4">
        <Link
          href="/cards/create"
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-600 to-blue-600 text-white text-sm font-semibold rounded-xl hover:from-violet-500 hover:to-blue-500 transition-all"
        >
          <ImagePlus className="w-4 h-4" />
          Crear ficha con plantilla
        </Link>
      </div>
    </div>
  );
}
