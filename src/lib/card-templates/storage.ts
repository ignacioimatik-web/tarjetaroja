import type { CardTemplate, LayoutConfig } from "@/types";

const DB_NAME = "card-templates";
const DB_VERSION = 1;
const STORE_NAME = "templates";

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export const DEFAULT_LAYOUT: LayoutConfig = {
  playerImage: { x: 0, y: 0, scale: 1 },
  overall: { x: 0, y: 0 },
  position: { x: 0, y: 0 },
  name: { x: 0, y: 0 },
  stats: { x: 0, y: 0 },
};

export interface CardTemplateStorage {
  getTemplates(): Promise<CardTemplate[]>;
  saveTemplate(template: CardTemplate): Promise<void>;
  deleteTemplate(templateId: string): Promise<void>;
  setDefaultTemplate(templateId: string): Promise<void>;
  getDefaultTemplate(): Promise<CardTemplate | null>;
}

export class IndexedDBTemplateStorage implements CardTemplateStorage {
  async getTemplates(): Promise<CardTemplate[]> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async saveTemplate(template: CardTemplate): Promise<void> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const request = store.put(template);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async deleteTemplate(templateId: string): Promise<void> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const request = store.delete(templateId);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async setDefaultTemplate(templateId: string): Promise<void> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const getAll = store.getAll();
      getAll.onsuccess = () => {
        const templates = getAll.result;
        for (const t of templates) {
          t.isDefault = t.id === templateId;
          store.put(t);
        }
      };
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  async getDefaultTemplate(): Promise<CardTemplate | null> {
    const templates = await this.getTemplates();
    return templates.find((t) => t.isDefault) ?? null;
  }
}

export class LocalStorageTemplateStorage implements CardTemplateStorage {
  private key = "card-templates";

  private read(): CardTemplate[] {
    try {
      return JSON.parse(localStorage.getItem(this.key) || "[]");
    } catch {
      return [];
    }
  }

  private write(templates: CardTemplate[]): void {
    localStorage.setItem(this.key, JSON.stringify(templates));
  }

  async getTemplates(): Promise<CardTemplate[]> {
    return this.read();
  }

  async saveTemplate(template: CardTemplate): Promise<void> {
    const templates = this.read();
    const idx = templates.findIndex((t) => t.id === template.id);
    if (idx >= 0) {
      templates[idx] = template;
    } else {
      templates.push(template);
    }
    this.write(templates);
  }

  async deleteTemplate(templateId: string): Promise<void> {
    const templates = this.read().filter((t) => t.id !== templateId);
    this.write(templates);
  }

  async setDefaultTemplate(templateId: string): Promise<void> {
    const templates = this.read().map((t) => ({
      ...t,
      isDefault: t.id === templateId,
    }));
    this.write(templates);
  }

  async getDefaultTemplate(): Promise<CardTemplate | null> {
    const templates = this.read();
    return templates.find((t) => t.isDefault) ?? null;
  }
}

export function createStorage(): CardTemplateStorage {
  if (typeof indexedDB !== "undefined") {
    return new IndexedDBTemplateStorage();
  }
  if (typeof localStorage !== "undefined") {
    return new LocalStorageTemplateStorage();
  }
  throw new Error("No storage available");
}
