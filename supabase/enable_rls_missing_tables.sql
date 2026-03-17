-- ============================================================================
-- Script: Habilitar RLS en tablas faltantes
-- Ejecutar en Supabase SQL Editor (https://supabase.com/dashboard → SQL Editor)
-- ============================================================================

-- 1. budget_views (Tracking de vistas de presupuestos)
-- ─────────────────────────────────────────────────────
alter table public.budget_views enable row level security;

-- El diseñador puede ver las vistas de sus propios presupuestos
create policy "Users can view own budget views"
  on budget_views for select
  using (budget_id in (select id from budgets where designer_id = auth.uid()));

-- El diseñador puede insertar vistas (tracking)
create policy "Users can insert own budget views"
  on budget_views for insert
  with check (budget_id in (select id from budgets where designer_id = auth.uid()));

-- Permitir INSERT anónimo para cuando un cliente (sin cuenta) abre el link público
create policy "Public can register a view on any budget"
  on budget_views for insert
  with check (true);


-- 2. budget_events (Eventos del pipeline: enviado, visto, aceptado, etc.)
-- ────────────────────────────────────────────────────────────────────────
alter table public.budget_events enable row level security;

-- El diseñador puede ver los eventos de sus propios presupuestos
create policy "Users can view own budget events"
  on budget_events for select
  using (budget_id in (select id from budgets where designer_id = auth.uid()));

-- El diseñador puede crear eventos en sus propios presupuestos
create policy "Users can insert own budget events"
  on budget_events for insert
  with check (budget_id in (select id from budgets where designer_id = auth.uid()));

-- Permitir INSERT anónimo para eventos como "visto" desde el link público
create policy "Public can insert events on any budget"
  on budget_events for insert
  with check (true);


-- 3. rate_sources (Fuentes de tarifarios, ej. "Tarifario ADG 2026")
-- ──────────────────────────────────────────────────────────────────
alter table public.rate_sources enable row level security;

-- Cualquier usuario autenticado puede ver las fuentes de tarifarios (son datos de referencia)
create policy "Authenticated users can view rate sources"
  on rate_sources for select
  using (auth.role() = 'authenticated');

-- Solo el service_role (admin) puede insertar/actualizar fuentes
-- (no creamos política de INSERT para anon/authenticated, esto queda protegido)


-- 4. rate_reference_items (Items de referencia del tarifario)
-- ──────────────────────────────────────────────────────────
alter table public.rate_reference_items enable row level security;

-- Cualquier usuario autenticado puede consultar valores de referencia
create policy "Authenticated users can view rate reference items"
  on rate_reference_items for select
  using (auth.role() = 'authenticated');


-- 5. rate_equivalences (Mapeo/equivalencias entre servicios y tarifarios)
-- ──────────────────────────────────────────────────────────────────────
alter table public.rate_equivalences enable row level security;

-- Cualquier usuario autenticado puede ver equivalencias
create policy "Authenticated users can view rate equivalences"
  on rate_equivalences for select
  using (auth.role() = 'authenticated');


-- ============================================================================
-- ¡Listo! Después de ejecutar esto, todas las tablas de tu base de datos
-- tendrán RLS habilitado. Verás que el cartel rojo "UNRESTRICTED" desaparece.
-- ============================================================================
