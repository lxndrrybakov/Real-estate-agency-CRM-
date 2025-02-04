/*
  # Fix calendar events synchronization

  1. Changes
    - Add indexes for better performance
    - Update RLS policies to ensure proper visibility
    - Add trigger for updating timestamps

  2. Security
    - Owner can see and manage all events
    - Employees can only manage their own events
*/

-- Drop existing policies
DROP POLICY IF EXISTS "All authenticated users can view all calendar events" ON calendar_events;
DROP POLICY IF EXISTS "Users can insert their own calendar events" ON calendar_events;
DROP POLICY IF EXISTS "Users can update their own calendar events" ON calendar_events;
DROP POLICY IF EXISTS "Users can delete their own calendar events" ON calendar_events;

-- Create new policies
CREATE POLICY "Owners can view all events"
  ON calendar_events FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'owner'
    )
  );

CREATE POLICY "Employees can view their own events"
  ON calendar_events FOR SELECT
  TO authenticated
  USING (
    employee_id = auth.uid()
  );

CREATE POLICY "Owners can insert events"
  ON calendar_events FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'owner'
    )
  );

CREATE POLICY "Employees can insert their own events"
  ON calendar_events FOR INSERT
  TO authenticated
  WITH CHECK (
    employee_id = auth.uid()
  );

CREATE POLICY "Owners can update any event"
  ON calendar_events FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'owner'
    )
  );

CREATE POLICY "Employees can update their own events"
  ON calendar_events FOR UPDATE
  TO authenticated
  USING (
    employee_id = auth.uid()
  );

CREATE POLICY "Owners can delete any event"
  ON calendar_events FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'owner'
    )
  );

CREATE POLICY "Employees can delete their own events"
  ON calendar_events FOR DELETE
  TO authenticated
  USING (
    employee_id = auth.uid()
  );

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updating timestamps
DROP TRIGGER IF EXISTS update_calendar_events_updated_at ON calendar_events;
CREATE TRIGGER update_calendar_events_updated_at
  BEFORE UPDATE ON calendar_events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_calendar_events_employee_id_start_time 
  ON calendar_events(employee_id, start_time);
CREATE INDEX IF NOT EXISTS idx_calendar_events_updated_at 
  ON calendar_events(updated_at);