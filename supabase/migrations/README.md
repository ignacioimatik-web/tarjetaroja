# Migraciones Supabase

Las migraciones SQL se aplican mediante `supabase_apply_migration` o directamente desde el SQL Editor de Supabase.

## Orden de migraciones

1. `00001_create_tables.sql` - Tablas principales e índices

## Cómo aplicar

### Opción 1: SQL Editor (recomendado si la DB está en pausa)

1. Abre https://supabase.com/dashboard/project/lgxaenzscrvnaicwrmbj
2. Ve a "SQL Editor"
3. Pega el contenido de `00001_create_tables.sql`
4. Ejecuta

### Opción 2: Migrations API

```bash
# Desde el proyecto, usar el MCP tool:
supabase_apply_migration("create_tables", "<sql content>")
```

## Después de migrar

1. Copia `.env.local.example` a `.env.local`
2. Completa `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Cambia `NEXT_PUBLIC_USE_SUPABASE=true`
4. `supabase_rebase_branch` si usas branch development

## Seed data

La app carga datos semilla automáticamente si la base de datos está vacía.
