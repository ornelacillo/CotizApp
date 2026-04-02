-- Rate limiting para Presupuestos
CREATE OR REPLACE FUNCTION check_rate_limit_budgets()
RETURNS trigger AS $$
DECLARE
  recent_count int;
BEGIN
  -- Revisa la cantidad de presupuestos creados por este usuario en la última hora
  SELECT count(*)
  INTO recent_count
  FROM budgets
  WHERE designer_id = auth.uid()
    AND created_at > (now() - interval '1 hour');

  IF recent_count >= 15 THEN
    RAISE EXCEPTION 'Has alcanzado el límite de 15 presupuestos por hora.' USING ERRCODE = 'P9001';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS tr_rate_limit_budgets ON budgets;

CREATE TRIGGER tr_rate_limit_budgets
  BEFORE INSERT ON budgets
  FOR EACH ROW
  EXECUTE FUNCTION check_rate_limit_budgets();


-- Rate limiting para Clientes
CREATE OR REPLACE FUNCTION check_rate_limit_clients()
RETURNS trigger AS $$
DECLARE
  recent_count int;
BEGIN
  -- Revisa la cantidad de clientes creados por este usuario en la última hora
  SELECT count(*)
  INTO recent_count
  FROM clients
  WHERE designer_id = auth.uid()
    AND created_at > (now() - interval '1 hour');

  IF recent_count >= 20 THEN
    RAISE EXCEPTION 'Has alcanzado el límite de 20 clientes nuevos por hora.' USING ERRCODE = 'P9002';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS tr_rate_limit_clients ON clients;

CREATE TRIGGER tr_rate_limit_clients
  BEFORE INSERT ON clients
  FOR EACH ROW
  EXECUTE FUNCTION check_rate_limit_clients();
