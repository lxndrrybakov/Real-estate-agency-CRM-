/*
  # Создание таблицы клиентов

  1. Новые таблицы
    - `clients`
      - `id` (uuid, primary key)
      - `employee_id` (uuid, foreign key to profiles)
      - `full_name` (text)
      - `birth_date` (date)
      - `phone` (text)
      - `contact_date` (timestamptz)
      - `source` (text)
      - `initial_info` (text)
      - `progress_notes` (text)
      - `next_contact` (timestamptz)
      - `status` (text)
      - `completion_date` (timestamptz)
      - `cancellation_reason` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Изменения
    - Отключение RLS для таблицы clients
*/

-- Создаем таблицу clients
CREATE TABLE IF NOT EXISTS clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid REFERENCES profiles(id) NOT NULL,
  full_name text NOT NULL,
  birth_date date,
  phone text,
  contact_date timestamptz DEFAULT now(),
  source text CHECK (source IN ('youtube', 'telegram', 'vk', 'referral', 'direct')),
  initial_info text,
  progress_notes text,
  next_contact timestamptz,
  status text DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'completed', 'cancelled')),
  completion_date timestamptz,
  cancellation_reason text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Отключаем RLS для таблицы clients
ALTER TABLE clients DISABLE ROW LEVEL SECURITY;

-- Создаем индексы для оптимизации запросов
CREATE INDEX IF NOT EXISTS idx_clients_employee_id ON clients(employee_id);
CREATE INDEX IF NOT EXISTS idx_clients_status ON clients(status);
CREATE INDEX IF NOT EXISTS idx_clients_full_name ON clients(full_name);

-- Создаем триггер для автоматического обновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_clients_updated_at
  BEFORE UPDATE ON clients
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();