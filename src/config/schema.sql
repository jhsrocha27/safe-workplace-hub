-- Criação das tabelas no Supabase

-- Tabela de Funcionários
CREATE TABLE employees (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  department TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Tabela de EPIs
CREATE TABLE ppes (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  ca_number TEXT NOT NULL,
  validity_date TIMESTAMP WITH TIME ZONE NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Tabela de Entregas de EPIs
CREATE TABLE ppe_deliveries (
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

-- Tabela de Acidentes
CREATE TABLE accidents (
  id BIGSERIAL PRIMARY KEY,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  severity TEXT NOT NULL,
  employee_id BIGINT REFERENCES employees(id) ON DELETE SET NULL,
  measures_taken TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Tabela de Treinamentos
CREATE TABLE trainings (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  instructor TEXT NOT NULL,
  duration INTEGER NOT NULL,
  participants BIGINT[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Tabela de Comunicações
CREATE TABLE communications (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  author TEXT NOT NULL,
  recipients TEXT[] NOT NULL,
  type TEXT NOT NULL,
  priority TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Tabela de Documentos de Funcionários
CREATE TABLE employee_documents (
  id BIGSERIAL PRIMARY KEY,
  employee_id BIGINT REFERENCES employees(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  company TEXT NOT NULL,
  sector TEXT NOT NULL,
  expiry_date TIMESTAMP WITH TIME ZONE NOT NULL,
  upload_date TIMESTAMP WITH TIME ZONE NOT NULL,
  file_url TEXT,
  status TEXT NOT NULL CHECK (status IN ('valid', 'expiring', 'expired')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Tabela de Documentos da Empresa
CREATE TABLE company_documents (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  company TEXT NOT NULL,
  sector TEXT NOT NULL,
  expiry_date TIMESTAMP WITH TIME ZONE NOT NULL,
  upload_date TIMESTAMP WITH TIME ZONE NOT NULL,
  file_url TEXT,
  status TEXT NOT NULL CHECK (status IN ('valid', 'expiring', 'expired')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Função para calcular o status do documento
CREATE OR REPLACE FUNCTION calculate_document_status(expiry_date TIMESTAMP WITH TIME ZONE)
RETURNS TEXT AS $$
BEGIN
  IF expiry_date > NOW() + INTERVAL '30 days' THEN
    RETURN 'valid';
  ELSIF expiry_date <= NOW() + INTERVAL '30 days' AND expiry_date > NOW() THEN
    RETURN 'expiring';
  ELSE
    RETURN 'expired';
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Índices para melhorar performance
CREATE INDEX idx_ppe_deliveries_employee_id ON ppe_deliveries(employee_id);
CREATE INDEX idx_ppe_deliveries_ppe_id ON ppe_deliveries(ppe_id);
CREATE INDEX idx_accidents_employee_id ON accidents(employee_id);
CREATE INDEX idx_employee_documents_employee_id ON employee_documents(employee_id);
CREATE INDEX idx_employee_documents_status ON employee_documents(status);
CREATE INDEX idx_company_documents_status ON company_documents(status);

-- Triggers para atualização automática do status dos documentos
CREATE OR REPLACE FUNCTION update_document_status()
RETURNS TRIGGER AS $$
BEGIN
  NEW.status := calculate_document_status(NEW.expiry_date);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER employee_documents_status_trigger
  BEFORE INSERT OR UPDATE OF expiry_date ON employee_documents
  FOR EACH ROW
  EXECUTE FUNCTION update_document_status();

CREATE TRIGGER company_documents_status_trigger
  BEFORE INSERT OR UPDATE OF expiry_date ON company_documents
  FOR EACH ROW
  EXECUTE FUNCTION update_document_status();
CREATE INDEX idx_ppe_deliveries_ppe_id ON ppe_deliveries(ppe_id);
CREATE INDEX idx_accidents_employee_id ON accidents(employee_id);
CREATE INDEX idx_documents_status ON documents(status);