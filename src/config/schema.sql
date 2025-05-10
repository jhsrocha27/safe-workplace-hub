

-- Criação das tabelas no Supabase (versão atualizada)

-- Tabela de Funcionários
CREATE TABLE IF NOT EXISTS employees (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  department TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Tabela de EPIs
CREATE TABLE IF NOT EXISTS ppes (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  ca_number TEXT NOT NULL,
  validity_period_months INTEGER NOT NULL,
  description TEXT,
  quantity INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Tabela de Entregas de EPIs
CREATE TABLE IF NOT EXISTS ppe_deliveries (
  id BIGSERIAL PRIMARY KEY,
  employee_id BIGINT REFERENCES employees(id) ON DELETE CASCADE,
  ppe_id BIGINT REFERENCES ppes(id) ON DELETE CASCADE,
  employeeName TEXT NOT NULL,
  ppeName TEXT NOT NULL,
  department TEXT NOT NULL,
  position TEXT NOT NULL,
  delivery_date TIMESTAMP WITH TIME ZONE NOT NULL,
  expiryDate TIMESTAMP WITH TIME ZONE NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL CHECK (status IN ('valid', 'expired', 'expiring')),
  signature BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Criação de índices para melhorar performance
CREATE INDEX IF NOT EXISTS idx_ppe_deliveries_employee_id ON ppe_deliveries(employee_id);
CREATE INDEX IF NOT EXISTS idx_ppe_deliveries_ppe_id ON ppe_deliveries(ppe_id);
CREATE INDEX IF NOT EXISTS idx_ppes_ca ON ppes(ca_number);

-- Função para calcular o status do EPI com base na data de validade
CREATE OR REPLACE FUNCTION calculate_ppe_status(expiry_date TIMESTAMP WITH TIME ZONE)
RETURNS TEXT AS $$
BEGIN
  IF expiry_date <= NOW() THEN
    RETURN 'expired';
  ELSIF expiry_date <= NOW() + INTERVAL '30 days' THEN
    RETURN 'expiring';
  ELSE
    RETURN 'valid';
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar automaticamente o status quando a data de expiração mudar
CREATE OR REPLACE FUNCTION update_ppe_status()
RETURNS TRIGGER AS $$
BEGIN
  NEW.status := calculate_ppe_status(NEW.expiryDate);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER ppe_deliveries_status_trigger
  BEFORE INSERT OR UPDATE OF expiryDate ON ppe_deliveries
  FOR EACH ROW
  EXECUTE FUNCTION update_ppe_status();

