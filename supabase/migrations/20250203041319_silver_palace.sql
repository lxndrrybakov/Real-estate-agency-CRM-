/*
  # Update calendar events table structure

  1. Changes
    - Add meeting_type column
    - Remove end_time column
    - Add indexes for performance

  2. Security
    - Maintain existing RLS policies
*/

-- Add meeting_type column
ALTER TABLE calendar_events 
ADD COLUMN meeting_type text CHECK (meeting_type IN ('online', 'office', 'online_office')) NOT NULL DEFAULT 'office';

-- Remove end_time column
ALTER TABLE calendar_events 
DROP COLUMN IF EXISTS end_time;

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_calendar_events_start_time 
ON calendar_events(start_time);

CREATE INDEX IF NOT EXISTS idx_calendar_events_meeting_type 
ON calendar_events(meeting_type);