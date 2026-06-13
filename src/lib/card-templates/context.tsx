"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import type { CardTemplate } from "@/types";
import { createStorage, type CardTemplateStorage } from "./storage";
import { getBuiltinTemplates } from "./defaults";

interface TemplateContextValue {
  templates: CardTemplate[];
  loading: boolean;
  saveTemplate: (template: CardTemplate) => Promise<void>;
  deleteTemplate: (id: string) => Promise<void>;
  setDefaultTemplate: (id: string) => Promise<void>;
  getDefaultTemplate: () => CardTemplate | null;
}

const TemplateContext = createContext<TemplateContextValue | null>(null);

function mergeBuiltin(uploaded: CardTemplate[]): CardTemplate[] {
  const builtins = getBuiltinTemplates();
  const uploadedIds = new Set(uploaded.map((t) => t.id));
  const merged = [...uploaded];
  for (const b of builtins) {
    if (!uploadedIds.has(b.id)) {
      merged.push(b);
    }
  }
  return merged;
}

export function TemplateProvider({ children }: { children: ReactNode }) {
  const [templates, setTemplates] = useState<CardTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [storage, setStorage] = useState<CardTemplateStorage | null>(null);

  useEffect(() => {
    try {
      const s = createStorage();
      setStorage(s);
      s.getTemplates().then((uploaded) => {
        setTemplates(mergeBuiltin(uploaded));
        setLoading(false);
      });
    } catch {
      setTemplates(mergeBuiltin([]));
      setLoading(false);
    }
  }, []);

  const saveTemplate = useCallback(
    async (template: CardTemplate) => {
      if (storage) {
        await storage.saveTemplate(template);
        const uploaded = await storage.getTemplates();
        setTemplates(mergeBuiltin(uploaded));
      }
    },
    [storage]
  );

  const deleteTemplate = useCallback(
    async (id: string) => {
      if (storage) {
        await storage.deleteTemplate(id);
        const uploaded = await storage.getTemplates();
        setTemplates(mergeBuiltin(uploaded));
      }
    },
    [storage]
  );

  const setDefaultTemplate = useCallback(
    async (id: string) => {
      if (storage) {
        await storage.setDefaultTemplate(id);
        const uploaded = await storage.getTemplates();
        setTemplates(mergeBuiltin(uploaded));
      }
    },
    [storage]
  );

  const getDefaultTemplate = useCallback(() => {
    return templates.find((t) => t.isDefault) ?? null;
  }, [templates]);

  return (
    <TemplateContext.Provider
      value={{ templates, loading, saveTemplate, deleteTemplate, setDefaultTemplate, getDefaultTemplate }}
    >
      {children}
    </TemplateContext.Provider>
  );
}

export function useTemplates() {
  const ctx = useContext(TemplateContext);
  if (!ctx) throw new Error("useTemplates must be used within a TemplateProvider");
  return ctx;
}
