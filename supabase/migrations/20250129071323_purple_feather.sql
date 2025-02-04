/*
  # Отключение RLS для таблицы calendar_events
  
  1. Изменения
    - Отключение RLS для таблицы calendar_events
    - Удаление всех существующих политик безопасности
*/

-- Удаляем все существующие политики
DROP POLICY IF EXISTS "calendar_events_policy" ON calendar_events;

-- Отключаем RLS для таблицы calendar_events
ALTER TABLE calendar_events DISABLE ROW LEVEL SECURITY;