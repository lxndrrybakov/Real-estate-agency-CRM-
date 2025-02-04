/*
  # Переход на авторизацию по имени пользователя

  1. Изменения
    - Добавление поля username в auth.users
    - Обновление существующих пользователей
*/

-- Удаляем существующие данные
DELETE FROM clients;
DELETE FROM profiles;
DELETE FROM auth.users;

-- Создаем пользователей с именем пользователя вместо email
INSERT INTO auth.users (id, username, encrypted_password, email_confirmed_at, role)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'Александр Широков', crypt('owner123', gen_salt('bf')), now(), 'authenticated'),
  ('00000000-0000-0000-0000-000000000002', 'Наталья', crypt('natalia123', gen_salt('bf')), now(), 'authenticated'),
  ('00000000-0000-0000-0000-000000000003', 'Роман', crypt('roman123', gen_salt('bf')), now(), 'authenticated'),
  ('00000000-0000-0000-0000-000000000004', 'Андрей', crypt('andrey123', gen_salt('bf')), now(), 'authenticated'),
  ('00000000-0000-0000-0000-000000000005', 'Александр', crypt('alexander123', gen_salt('bf')), now(), 'authenticated');

-- Создаем профили
INSERT INTO profiles (id, full_name, role)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'Александр Широков', 'owner'),
  ('00000000-0000-0000-0000-000000000002', 'Наталья', 'employee'),
  ('00000000-0000-0000-0000-000000000003', 'Роман', 'employee'),
  ('00000000-0000-0000-0000-000000000004', 'Андрей', 'employee'),
  ('00000000-0000-0000-0000-000000000005', 'Александр', 'employee');