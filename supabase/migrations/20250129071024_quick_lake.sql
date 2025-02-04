-- Drop existing policies
DROP POLICY IF EXISTS "Allow read access for authenticated users" ON calendar_events;
DROP POLICY IF EXISTS "Allow owners to insert any event" ON calendar_events;
DROP POLICY IF EXISTS "Allow employees to insert own events" ON calendar_events;
DROP POLICY IF EXISTS "Allow owners to update any event" ON calendar_events;
DROP POLICY IF EXISTS "Allow employees to update own events" ON calendar_events;
DROP POLICY IF EXISTS "Allow owners to delete any event" ON calendar_events;
DROP POLICY IF EXISTS "Allow employees to delete own events" ON calendar_events;

-- Create a single policy for all operations
CREATE POLICY "calendar_events_policy"
ON calendar_events
FOR ALL
USING (
  -- Allow owners to access all events
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'owner'
  )
  OR
  -- Allow employees to access their own events
  employee_id = auth.uid()
)
WITH CHECK (
  -- Allow owners to modify all events
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'owner'
  )
  OR
  -- Allow employees to modify their own events
  employee_id = auth.uid()
);