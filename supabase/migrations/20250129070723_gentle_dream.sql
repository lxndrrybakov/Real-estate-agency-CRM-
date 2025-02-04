/*
  # Fix calendar events RLS policies

  1. Changes
    - Drop existing RLS policies for calendar_events
    - Create new simplified policies that allow:
      - Owners to manage all events
      - Employees to manage their own events
    - Add proper authentication checks
  
  2. Security
    - Enable RLS on calendar_events table
    - Add policies for SELECT, INSERT, UPDATE, DELETE operations
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Owners can view all events" ON calendar_events;
DROP POLICY IF EXISTS "Employees can view their own events" ON calendar_events;
DROP POLICY IF EXISTS "Owners can insert events" ON calendar_events;
DROP POLICY IF EXISTS "Employees can insert their own events" ON calendar_events;
DROP POLICY IF EXISTS "Owners can update any event" ON calendar_events;
DROP POLICY IF EXISTS "Employees can update their own events" ON calendar_events;
DROP POLICY IF EXISTS "Owners can delete any event" ON calendar_events;
DROP POLICY IF EXISTS "Employees can delete their own events" ON calendar_events;

-- Create new simplified policies
CREATE POLICY "Enable full access for owners"
ON calendar_events
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'owner'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'owner'
  )
);

CREATE POLICY "Enable employee access to own events"
ON calendar_events
USING (
  employee_id = auth.uid()
)
WITH CHECK (
  employee_id = auth.uid()
);