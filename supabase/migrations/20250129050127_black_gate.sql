/*
  # Add calendar events table

  1. New Tables
    - `calendar_events`
      - `id` (uuid, primary key)
      - `employee_id` (uuid, references profiles)
      - `client_id` (uuid, references clients, nullable)
      - `title` (text)
      - `description` (text, nullable)
      - `start_time` (timestamptz)
      - `end_time` (timestamptz)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `calendar_events` table
    - Add policies for authenticated users to:
      - Read all events (employees can see all events)
      - Create/update/delete their own events
*/

CREATE TABLE calendar_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid REFERENCES profiles(id) NOT NULL,
  client_id uuid REFERENCES clients(id),
  title text NOT NULL,
  description text,
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;

-- Calendar events policies
CREATE POLICY "All authenticated users can view all calendar events"
  ON calendar_events FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert their own calendar events"
  ON calendar_events FOR INSERT
  TO authenticated
  WITH CHECK (employee_id = auth.uid());

CREATE POLICY "Users can update their own calendar events"
  ON calendar_events FOR UPDATE
  TO authenticated
  USING (employee_id = auth.uid());

CREATE POLICY "Users can delete their own calendar events"
  ON calendar_events FOR DELETE
  TO authenticated
  USING (employee_id = auth.uid());

-- Add indexes for better performance
CREATE INDEX idx_calendar_events_employee_id ON calendar_events(employee_id);
CREATE INDEX idx_calendar_events_client_id ON calendar_events(client_id);
CREATE INDEX idx_calendar_events_start_time ON calendar_events(start_time);