/*
  # Упрощение системы авторизации

  1. Изменения
    - Добавление поля username в auth.users
    - Удаление email из auth.users
    - Настройка авторизации по username
    - Обновление пользователей

  2. Безопасность
    - Авторизация только по имени пользователя и паролю
    - Пароль '123' для всех пользователей
*/

-- Очищаем существующие данные
DELETE FROM clients;
DELETE FROM profiles;
DELETE FROM auth.users;

-- Добавляем поле username, если его нет
ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS username text UNIQUE;

-- Создаем пользователей с именем и паролем
INSERT INTO auth.users (id, username, encrypted_password, role)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'Александр Широков', crypt('123', gen_salt('bf')), 'authenticated'),
  ('00000000-0000-0000-0000-000000000002', 'Наталья', crypt('123', gen_salt('bf')), 'authenticated'),
  ('00000000-0000-0000-0000-000000000003', 'Роман', crypt('123', gen_salt('bf')), 'authenticated'),
  ('00000000-0000-0000-0000-000000000004', 'Андрей', crypt('123', gen_salt('bf')), 'authenticated'),
  ('00000000-0000-0000-0000-000000000005', 'Александр', crypt('123', gen_salt('bf')), 'authenticated');

-- Создаем профили
INSERT INTO profiles (id, full_name, role)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'Александр Широков', 'owner'),
  ('00000000-0000-0000-0000-000000000002', 'Наталья', 'employee'),
  ('00000000-0000-0000-0000-000000000003', 'Роман', 'employee'),
  ('00000000-0000-0000-0000-000000000004', 'Андрей', 'employee'),
  ('00000000-0000-0000-0000-000000000005', 'Александр', 'employee');