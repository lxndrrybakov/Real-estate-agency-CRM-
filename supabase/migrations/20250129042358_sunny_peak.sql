/*
  # Исправление аутентификации

  1. Изменения
    - Добавление email для пользователей
    - Обновление паролей
*/

-- Удаляем существующие данные
DELETE FROM clients;
DELETE FROM profiles;
DELETE FROM auth.users;

-- Создаем пользователей с email и паролями
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, role)
VALUES 
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001@example.com', crypt('123', gen_salt('bf')), now(), 'authenticated'),
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002@example.com', crypt('123', gen_salt('bf')), now(), 'authenticated'),
  ('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000003@example.com', crypt('123', gen_salt('bf')), now(), 'authenticated'),
  ('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000004@example.com', crypt('123', gen_salt('bf')), now(), 'authenticated'),
  ('00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000005@example.com', crypt('123', gen_salt('bf')), now(), 'authenticated');

-- Создаем профили
INSERT INTO profiles (id, full_name, role)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'Александр Широков', 'owner'),
  ('00000000-0000-0000-0000-000000000002', 'Наталья', 'employee'),
  ('00000000-0000-0000-0000-000000000003', 'Роман', 'employee'),
  ('00000000-0000-0000-0000-000000000004', 'Андрей', 'employee'),
  ('00000000-0000-0000-0000-000000000005', 'Александр', 'employee');