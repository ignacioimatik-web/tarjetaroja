# ADRENALYN CUP ⚽🏆

**World Clubs & Nations Championship** — Gestor interactivo de campeonatos híbridos de cartas de fútbol.

Crea cartas de jugadores, construye plantillas híbridas de clubes y selecciones, compite en torneos globales de 8 a 32 equipos, y demuestra quién es el mejor manager.

## Stack

- **Next.js 16** (App Router)
- **TypeScript**
- **Tailwind CSS v4**
- **Framer Motion**
- **Zustand** (estado persistente en localStorage)
- **Zod** (validación)
- **Lucide React** (iconos)

## Funcionalidades

### Cartas
- Biblioteca con filtros por nombre, equipo, posición y rareza
- Creación manual de cartas con estadísticas y avatar
- 7 rarezas: BASE, RARE, EPIC, LEGENDARY, GOLDEN, MOMENTUM, ULTRA_RARE
- Avatares procedimentales SVG generados desde cero (sin APIs externas)

### Equipos
- Gestión de selecciones nacionales, clubes y equipos draft
- Constructor visual de plantillas con formación
- Validación automática de reglas por modo de juego
- Índice de fuerza e índice de abuso

### Torneos
- Formatos: 8, 16, 24 y 32 equipos
- Modos: Infantil, Estándar, Avanzado
- Sorteo de grupos automático por bombos
- Fase de grupos con calendario y clasificación
- Eliminatorias con cuadro
- Desempates completos

### Partidos
- Juego interactivo ronda a ronda
- Selección de carta y estadística (ATT/CON/DEF)
- Marcador en vivo
- Timeline de rondas
- Sustituciones

### Administración
- Dashboard con estadísticas
- Exportar/importar backup completo JSON
- Cargar datos de demostración
- Persistencia local en localStorage

## Requisitos

- Node.js 18+
- npm

## Instalación

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000).

## Producción

```bash
npm run build
npm start
```

## Despliegue en Vercel

1. Conecta tu repositorio a [Vercel](https://vercel.com)
2. Framework: Next.js
3. Build command: `npm run build`
4. Output directory: `.next`
5. Vercel detecta la configuración automáticamente

O desde CLI:

```bash
npx vercel --prod
```

## Estructura del proyecto

```
src/
├── app/            # Páginas (App Router)
├── components/     # Componentes React
│   ├── avatar/     # Sistema de avatares SVG
│   ├── cards/      # Trading cards premium
│   ├── layout/     # Navegación, shells
│   ├── match/      # Motor de partido UI
│   ├── team/       # Constructor de equipos
│   └── tournament/ # UI de torneos
├── lib/
│   ├── match/      # Lógica de partidos
│   ├── rules/      # Motor de reglas
│   ├── seed/       # Datos de demostración + avatares
│   ├── storage/    # Capa de persistencia (Repository pattern)
│   └── tournament/ # Lógica de torneos
├── store/          # Zustand store persistente
└── types/          # Tipos TypeScript
```

## Migración a Supabase

El proyecto usa localStorage por defecto pero incluye integración completa con **Supabase** lista para activar.

### Stack de base de datos

| Archivo | Propósito |
|---------|-----------|
| `src/lib/storage/Repository.ts` | Interfaz Repository (async) |
| `src/lib/storage/LocalStorageRepository.ts` | Implementación localStorage |
| `src/lib/storage/SupabaseRepository.ts` | Implementación Supabase |
| `src/lib/storage/RepositoryProvider.tsx` | Provider React con detección automática |
| `src/lib/db/supabase/` | Cliente Supabase |
| `supabase/migrations/` | Migraciones SQL |

### Cómo activar Supabase

1. **Aplica la migración** desde el SQL Editor de Supabase:
   ```sql
   -- Copia el contenido de supabase/migrations/00001_create_tables.sql
   ```

2. **Configura las variables de entorno:**
   ```bash
   cp .env.local.example .env.local
   # Edita .env.local con tus valores de Supabase
   ```

3. **Cambia a Supabase:**
   ```env
   NEXT_PUBLIC_USE_SUPABASE=true
   ```

4. **Reinicia la app:**
   ```bash
   npm run dev
   ```

### Arquitectura

```
┌─────────────────────────────────────────────────┐
│  Zustand Store (caché en memoria)               │
├─────────────────────────────────────────────────┤
│  Repository (interfaz unificada)                │
├────────────────────┬────────────────────────────┤
│ localStorage (sync)│ Supabase (async)           │
│ (por defecto)      │ (cuando NEXT_PUBLIC_USE    │
│                    │  _SUPABASE=true)           │
└────────────────────┴────────────────────────────┘
```

La app funciona 100% offline con localStorage. Cuando activas Supabase, el `RepositoryProvider` sincroniza los datos automáticamente.

## Variables de entorno

| Variable | Descripción | Requerida |
|----------|-------------|-----------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto Supabase | Para Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon key pública | Para Supabase |
| `NEXT_PUBLIC_USE_SUPABASE` | `true` para usar Supabase | No (default: false) |

## Licencia

Uso interno.
