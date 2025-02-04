/*
  # Add email field to clients table
  
  1. Changes
    - Add email column to clients table
    - Add index for email search optimization
*/

-- Add email column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'clients' AND column_name = 'email'
  ) THEN
    ALTER TABLE clients ADD COLUMN email text;
  END IF;
END $$;

-- Add index for email search
CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);