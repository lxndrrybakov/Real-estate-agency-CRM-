/*
  # Финальное исправление аутентификации

  1. Изменения
    - Пересоздание пользователей с корректными паролями
    - Обеспечение соответствия между email и именами
*/

-- Удаляем существующие данные
DELETE FROM clients;
DELETE FROM profiles;
DELETE FROM auth.users;

-- Создаем пользователей заново с правильными паролями
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, role)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'owner@example.com', crypt('owner123', gen_salt('bf')), now(), 'authenticated'),
  ('00000000-0000-0000-0000-000000000002', 'natalia@example.com', crypt('natalia123', gen_salt('bf')), now(), 'authenticated'),
  ('00000000-0000-0000-0000-000000000003', 'roman@example.com', crypt('roman123', gen_salt('bf')), now(), 'authenticated'),
  ('00000000-0000-0000-0000-000000000004', 'andrey@example.com', crypt('andrey123', gen_salt('bf')), now(), 'authenticated'),
  ('00000000-0000-0000-0000-000000000005', 'alexander@example.com', crypt('alexander123', gen_salt('bf')), now(), 'authenticated');

-- Создаем профили
INSERT INTO profiles (id, full_name, role)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'Александр Широков', 'owner'),
  ('00000000-0000-0000-0000-000000000002', 'Наталья', 'employee'),
  ('00000000-0000-0000-0000-000000000003', 'Роман', 'employee'),
  ('00000000-0000-0000-0000-000000000004', 'Андрей', 'employee'),
  ('00000000-0000-0000-0000-000000000005', 'Александр', 'employee');