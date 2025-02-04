/*
  # Финальное исправление системы аутентификации

  1. Изменения
    - Пересоздание пользователей с простыми email-ами
    - Добавление индекса для быстрого поиска по full_name
*/

-- Удаляем существующие данные
DELETE FROM clients;
DELETE FROM profiles;
DELETE FROM auth.users;

-- Создаем пользователей заново
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, role)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'owner@example.com', crypt('123', gen_salt('bf')), now(), 'authenticated'),
  ('00000000-0000-0000-0000-000000000002', 'natalia@example.com', crypt('123', gen_salt('bf')), now(), 'authenticated'),
  ('00000000-0000-0000-0000-000000000003', 'roman@example.com', crypt('123', gen_salt('bf')), now(), 'authenticated'),
  ('00000000-0000-0000-0000-000000000004', 'andrey@example.com', crypt('123', gen_salt('bf')), now(), 'authenticated'),
  ('00000000-0000-0000-0000-000000000005', 'alexander@example.com', crypt('123', gen_salt('bf')), now(), 'authenticated');

-- Создаем профили
INSERT INTO profiles (id, full_name, role)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'Александр Широков', 'owner'),
  ('00000000-0000-0000-0000-000000000002', 'Наталья', 'employee'),
  ('00000000-0000-0000-0000-000000000003', 'Роман', 'employee'),
  ('00000000-0000-0000-0000-000000000004', 'Андрей', 'employee'),
  ('00000000-0000-0000-0000-000000000005', 'Александр', 'employee');

-- Добавляем индекс для быстрого поиска по имени
CREATE INDEX IF NOT EXISTS idx_profiles_full_name ON profiles (full_name);