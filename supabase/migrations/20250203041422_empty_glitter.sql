/*
  # Update clients table structure

  1. Changes
    - Update source values and add new constraint
    - Add referral_name column
    - Add performance indexes

  2. Notes
    - Temporarily disables the constraint
    - Updates data safely
    - Re-enables constraint with new values
*/

-- First remove the existing constraint
ALTER TABLE clients 
DROP CONSTRAINT IF EXISTS clients_source_check;

-- Add referral_name column
ALTER TABLE clients 
ADD COLUMN IF NOT EXISTS referral_name text;

-- Update existing data
UPDATE clients 
SET source = CASE 
    WHEN source = 'youtube' THEN 'social'
    WHEN source = 'telegram' THEN 'social'
    WHEN source = 'vk' THEN 'social'
    WHEN source = 'referral' THEN 'referral'
    WHEN source = 'direct' THEN 'personal'
    ELSE 'personal'
END;

-- Now add the new constraint
ALTER TABLE clients 
ADD CONSTRAINT clients_source_check 
CHECK (source IN ('social', 'referral', 'personal'));

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_clients_source 
ON clients(source);

CREATE INDEX IF NOT EXISTS idx_clients_next_contact 
ON clients(next_contact);