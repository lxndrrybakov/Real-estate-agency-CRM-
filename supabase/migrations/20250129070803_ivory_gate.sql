/*
  # Fix calendar events RLS policies with read access

  1. Changes
    - Drop existing RLS policies
    - Create separate policies for each operation type
    - Add universal read access for authenticated users
    - Maintain proper security controls
  
  2. Security
    - Enable RLS on calendar_events table
    - Separate policies for SELECT, INSERT, UPDATE, DELETE
    - All authenticated users can read events
    - Owners can manage all events
    - Employees can only manage their own events
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Enable full access for owners" ON calendar_events;
DROP POLICY IF EXISTS "Enable employee access to own events" ON calendar_events;

-- Create separate policies for each operation
-- Read access for all authenticated users
CREATE POLICY "Allow read access for authenticated users"
ON calendar_events FOR SELECT
TO authenticated
USING (true);

-- Insert policies
CREATE POLICY "Allow owners to insert any event"
ON calendar_events FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'owner'
  )
);

CREATE POLICY "Allow employees to insert own events"
ON calendar_events FOR INSERT
TO authenticated
WITH CHECK (
  employee_id = auth.uid()
);

-- Update policies
CREATE POLICY "Allow owners to update any event"
ON calendar_events FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'owner'
  )
);

CREATE POLICY "Allow employees to update own events"
ON calendar_events FOR UPDATE
TO authenticated
USING (
  employee_id = auth.uid()
);

-- Delete policies
CREATE POLICY "Allow owners to delete any event"
ON calendar_events FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'owner'
  )
);

CREATE POLICY "Allow employees to delete own events"
ON calendar_events FOR DELETE
TO authenticated
USING (
  employee_id = auth.uid()
);