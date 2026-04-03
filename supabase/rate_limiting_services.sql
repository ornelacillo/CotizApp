-- ====================================================================================
-- RATE LIMITING - SERVICE CATALOG
-- Bloquea que un atacante sature la base de datos creando miles de servicios
-- ====================================================================================

CREATE OR REPLACE FUNCTION check_rate_limit_services()
RETURNS trigger AS $$
DECLARE
  recent_count int;
BEGIN
  -- Revisa la cantidad de servicios personalizados creados por este usuario en la última hora
  SELECT count(*)
  INTO recent_count
  FROM service_catalog
  WHERE designer_id = auth.uid()
    AND origen = 'custom'
    AND created_at > (now() - interval '1 hour');

  -- Limite preventivo: 100 servicios personalizados por hora
  IF recent_count >= 100 THEN
    RAISE EXCEPTION 'Límite de seguridad alcanzado: Límite de creación de servicios por hora excedido.' USING ERRCODE = 'P9003';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS tr_rate_limit_services ON service_catalog;

CREATE TRIGGER tr_rate_limit_services
  BEFORE INSERT ON service_catalog
  FOR EACH ROW
  EXECUTE FUNCTION check_rate_limit_services();
