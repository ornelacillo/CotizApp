-- ====================================================================================
-- AUDIT LOGS SETUP SCRIPT
-- Executes: Table creation, RLS locking, and Trigger injections for CDC (Change Data Capture)
-- ====================================================================================

-- 1. Create the immutable audit_logs table
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    timestamp timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL,
    actor_id uuid, -- User ID holding the session, if possible
    action_type text NOT NULL, -- INSERT, UPDATE, DELETE
    entity_table text NOT NULL, -- The table being modified
    entity_id uuid, -- ID of the modified entity
    old_data jsonb, -- State before the action
    new_data jsonb, -- State after the action
    metadata jsonb -- Request headers or extra data
);

-- 2. Lock down the table (Insert-Only by triggers conceptually, strictly blocked from client API reads)
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
-- By default, enabling RLS and adding NO policies means NO Client (anon/authenticated) can read, update, insert or delete from this table.
-- Only the Service Role or Postgres superadmin can query the audit logs.

-- 3. Create the generic trigger function
CREATE OR REPLACE FUNCTION public.log_audit_event()
RETURNS trigger AS $$
DECLARE
    v_old_data jsonb := null;
    v_new_data jsonb := null;
    v_entity_id uuid := null;
BEGIN
    -- Determinar el tipo de operación y extraer los payloads JSON y el ID de la fila
    IF (TG_OP = 'DELETE') THEN
        v_old_data := row_to_json(OLD)::jsonb;
        v_entity_id := OLD.id;
    ELSIF (TG_OP = 'UPDATE') THEN
        v_old_data := row_to_json(OLD)::jsonb;
        v_new_data := row_to_json(NEW)::jsonb;
        v_entity_id := NEW.id;
    ELSIF (TG_OP = 'INSERT') THEN
        v_new_data := row_to_json(NEW)::jsonb;
        v_entity_id := NEW.id;
    END IF;

    -- Registrar el evento en la tabla de auditoría de forma inmutable
    INSERT INTO public.audit_logs (
        actor_id,
        action_type,
        entity_table,
        entity_id,
        old_data,
        new_data,
        metadata
    ) VALUES (
        auth.uid(), -- Función nativa de Supabase para obtener el UUID del token disparador (si viene de UI)
        TG_OP,
        TG_TABLE_NAME,
        v_entity_id,
        v_old_data,
        v_new_data,
        jsonb_build_object(
            'role', nullif(current_setting('request.jwt.claim.role', true), ''),
            'schema', TG_TABLE_SCHEMA
        )
    );

    -- Continuar con la acción original sin interrumpir el flujo
    IF (TG_OP = 'DELETE') THEN
        RETURN OLD;
    ELSE
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ====================================================================================
-- 4. ATTACH TRIGGERS TO CRITICAL TABLES
-- We wipe existing ones (if any) and inject the function.
-- ====================================================================================

-- Budgets
DROP TRIGGER IF EXISTS tr_audit_budgets ON public.budgets;
CREATE TRIGGER tr_audit_budgets
    AFTER INSERT OR UPDATE OR DELETE ON public.budgets
    FOR EACH ROW EXECUTE FUNCTION public.log_audit_event();

-- Clients
DROP TRIGGER IF EXISTS tr_audit_clients ON public.clients;
CREATE TRIGGER tr_audit_clients
    AFTER INSERT OR UPDATE OR DELETE ON public.clients
    FOR EACH ROW EXECUTE FUNCTION public.log_audit_event();

-- Service Catalog
DROP TRIGGER IF EXISTS tr_audit_service_catalog ON public.service_catalog;
CREATE TRIGGER tr_audit_service_catalog
    AFTER INSERT OR UPDATE OR DELETE ON public.service_catalog
    FOR EACH ROW EXECUTE FUNCTION public.log_audit_event();

-- Designer Profiles
DROP TRIGGER IF EXISTS tr_audit_designer_profiles ON public.designer_profiles;
CREATE TRIGGER tr_audit_designer_profiles
    AFTER INSERT OR UPDATE OR DELETE ON public.designer_profiles
    FOR EACH ROW EXECUTE FUNCTION public.log_audit_event();

-- Designer Branding
DROP TRIGGER IF EXISTS tr_audit_designer_branding ON public.designer_branding;
CREATE TRIGGER tr_audit_designer_branding
    AFTER INSERT OR UPDATE OR DELETE ON public.designer_branding
    FOR EACH ROW EXECUTE FUNCTION public.log_audit_event();

-- Nota: Recordar la eliminación en cascada.
-- Al usar `deleteAccount` y eliminar `auth.users`, se borrarán sus clientes y presupuestos...
-- Postgres desencadenará un borrado en cascada, lo cual DISPARARÁ automáticamente (AFTER DELETE)
-- nuestro log_audit_event() para cada una de las dependencias eliminadas.
-- Todo quedará registrado, incluyendo que fueron borrados debido a esa cascada.
