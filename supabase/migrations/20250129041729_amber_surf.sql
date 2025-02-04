/*
  # Обновление системы аутентификации

  1. Изменения
    - Добавление поля username в таблицу auth.users
    - Обновление существующих пользователей
*/

-- Добавляем поле username в auth.users
ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS username text;

-- Обновляем существующих пользователей
UPDATE auth.users
SET username = p.full_name
FROM profiles p
WHERE auth.users.id = p.id;