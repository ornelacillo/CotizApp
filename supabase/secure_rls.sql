-- ====================================================================================
-- SCRIPT DE SEGURIDAD RLS (Mitigación de Auditoría)
-- Elimina políticas de lectura global (using true) que exponían los presupuestos
-- de forma insegura (Security by Obscurity). Ahora la ruta pública usa Service Role.
-- ====================================================================================

-- 1. Eliminar acceso público irrestricto de Presupuestos
DROP POLICY IF EXISTS "Public can view budget by token" ON public.budgets;

-- 2. Eliminar acceso público irrestricto de Versiones de Presupuestos
DROP POLICY IF EXISTS "Public can view version related to a budget" ON public.budget_versions;

-- 3. Eliminar acceso público irrestricto de Ítems de Presupuestos
DROP POLICY IF EXISTS "Public can view budget items" ON public.budget_items;

-- 4. Re-asegurar que el RLS estándar sea quien gobierne a los usuarios logueados:
-- Las políticas "Users can CRUD own budgets", etc., se mantienen intactas.

-- NOTA IMPORTANTE:
-- Las políticas de lectura de Branding se mantienen públicas 
-- ("Public can view branding for shared budgets") porque es información 
-- visual pública del estudio (logo, color) necesaria para pintar la UI.
-- Las políticas de Eventos/Views ("Public can insert events on any budget") 
-- se mantienen porque están restringidas a INSERT-ONLY, lo cual es inofensivo.
